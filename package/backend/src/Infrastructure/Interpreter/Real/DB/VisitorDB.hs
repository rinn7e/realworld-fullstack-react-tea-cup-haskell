module Infrastructure.Interpreter.Real.DB.VisitorDB
  ( runVisitorDBPostgres
  , toDomainVisitor
  ) where

import Data.List (foldl')
import Data.Time (UTCTime, diffUTCTime)
import Database.Esqueleto.Experimental
import Database.Persist qualified as P
import Database.Persist.Sql ()
import Effectful
import Effectful.Dispatch.Dynamic
import Effectful.Reader.Static
import Infrastructure.Common.Type.DBPools (ReadPool (..), WritePool (..))

import Capability.Database.VisitorDB
import Domain.Type qualified as D
import Infrastructure.Interpreter.Real.DB.Schema.Schema qualified as DB
import Infrastructure.Interpreter.Real.DB.UserDB (toDomainUser)

toDomainVisitor :: Entity DB.Visitor -> D.Visitor
toDomainVisitor (Entity vid v) =
  D.Visitor
    { visitorId = D.VisitorId $ fromIntegral (fromSqlKey vid)
    , ip = v.ip
    , userAgent = v.userAgent
    , path = v.path
    , fingerprint = v.fingerprint
    , timestamp = v.timestamp
    , userId = fmap (D.UserId . fromIntegral . fromSqlKey) v.userId
    }

runVisitorDBPostgres
  :: (IOE :> es, Reader ReadPool :> es, Reader WritePool :> es) => Eff (VisitorDB : es) a -> Eff es a
runVisitorDBPostgres = interpret $ \_ -> \case
  UpsertVisitor ip ua path fp t mUid -> upsertVisitorHandler ip ua path fp t mUid
  ListVisitors mLimit mOffset mIp mPath mSort mDir -> listVisitorsHandler mLimit mOffset mIp mPath mSort mDir
  GetVisitorsSince since -> getVisitorsSinceHandler since
  CountAllVisitors -> countAllVisitorsHandler

upsertVisitorHandler
  :: (IOE :> es, Reader WritePool :> es)
  => D.VisitorIp
  -> D.VisitorUserAgent
  -> D.VisitorPath
  -> D.VisitorFp
  -> UTCTime
  -> Maybe D.UserId
  -> Eff es D.Visitor
upsertVisitorHandler ip ua path fp t mUid = do
  WritePool pool <- ask @WritePool
  liftIO $
    runSqlPool
      ( do
          let sqlUid = fmap (toSqlKey . fromIntegral . (\(D.UserId i) -> i)) mUid
              v = DB.Visitor ip ua path t sqlUid fp
          
          -- NOTE on avoiding 'upsertBy' / raw 'ON CONFLICT DO UPDATE':
          -- Under rapid client-side clicks or quick page refreshes, concurrent requests
          -- for the same fingerprint attempt to lock the exact same row in the unique index.
          -- 
          -- Using raw 'upsertBy' acquires an exclusive row-level lock on conflict. If a transaction
          -- is slow or aborted midway by a browser disconnect (leaving the connection 'idle in transaction'):
          -- 1. The exclusive row-level lock is held open.
          -- 2. Subsequent write requests queue up behind it, waiting for the lock.
          -- 3. PgBouncer (which has a strict backend connection pool limit) gets saturated with these blocked threads.
          -- 4. Eventually, PgBouncer is starved of backend connections, blocking all read-only queries too.
          -- 
          -- Why not use 'SET LOCAL lock_timeout' or immediate failure catching?
          -- While we could configure a very short transaction lock timeout (e.g. '10ms') and catch
          -- the aborted transaction exception (SQL state '55P03' - lock_not_available) in Haskell:
          -- 1. It still hits Postgres with a write query/transaction attempt on every request.
          -- 2. Aborting transactions causes rollback overhead in Postgres (CPU/IO/WAL writing).
          -- 3. It floods Supabase/Postgres logs with noisy "canceled due to lock timeout" errors.
          -- 
          -- To prevent this row-lock saturation cleanly, we perform a read-only 'getBy' check first.
          -- If the visitor already visited recently (< 1 second ago), we return the existing record
          -- IMMEDIATELY without initiating any database writes, lock requests, or locking transactions.
          -- If they visited > 1 second ago, we update the existing record.
          mExisting <- P.getBy (DB.UniqueVisitorFingerprint fp)
          case mExisting of
            Just (Entity existingId existingVal) -> do
              let timeDiff = diffUTCTime t existingVal.timestamp
              if timeDiff > 1 -- Only update the DB once per second
                then do
                  P.update existingId
                    [ DB.VisitorIp        P.=. ip
                    , DB.VisitorUserAgent P.=. ua
                    , DB.VisitorPath      P.=. path
                    , DB.VisitorTimestamp P.=. t
                    , DB.VisitorUserId    P.=. sqlUid
                    ]
                  return D.Visitor
                    { visitorId = D.VisitorId $ fromIntegral (fromSqlKey existingId)
                    , ip = ip
                    , userAgent = ua
                    , path = path
                    , fingerprint = fp
                    , timestamp = t
                    , userId = mUid
                    }
                else
                  return $ toDomainVisitor (Entity existingId existingVal)
            Nothing -> do
              result <- P.insertBy v
              case result of
                Left (Entity existingId existingVal) -> 
                  return $ toDomainVisitor (Entity existingId existingVal)
                Right newId -> 
                  return D.Visitor
                    { visitorId = D.VisitorId $ fromIntegral (fromSqlKey newId)
                    , ip = ip
                    , userAgent = ua
                    , path = path
                    , fingerprint = fp
                    , timestamp = t
                    , userId = mUid
                    }
      )
      pool


listVisitorsHandler
  :: (IOE :> es, Reader ReadPool :> es)
  => Maybe D.Limit
  -> Maybe D.Offset
  -> Maybe D.VisitorIp
  -> Maybe D.VisitorPath
  -> Maybe D.VisitorSort
  -> Maybe D.Direction
  -> Eff es ([(D.Visitor, Maybe D.User)], Int)
listVisitorsHandler mLimit mOffset mIp mPath mSort mDir = do
  ReadPool pool <- ask @ReadPool
  liftIO $
    runSqlPool
      ( do
          let lim = maybe 10 D.unLimit mLimit
              offs = maybe 0 D.unOffset mOffset

          total <- P.count filters
          
          entities <- select $ do
            (visitor :& user) <-
              from $ table @DB.Visitor
                `leftJoin` table @DB.User
                `on` (\(v :& u) -> v ^. DB.VisitorUserId ==. u ?. DB.UserId)
            
            where_ $ do
              let conds =
                    [ maybe (val True) (\ip -> visitor ^. DB.VisitorIp ==. val ip) mIp
                    , maybe (val True) (\p -> visitor ^. DB.VisitorPath ==. val p) mPath
                    ]
              foldl' (&&.) (val True) conds

            case (mSort, mDir) of
              (Just D.VisitorSortId, Just D.Asc) -> orderBy [asc (visitor ^. DB.VisitorId)]
              (Just D.VisitorSortId, _) -> orderBy [desc (visitor ^. DB.VisitorId)]
              (Just D.VisitorSortIp, Just D.Asc) -> orderBy [asc (visitor ^. DB.VisitorIp)]
              (Just D.VisitorSortIp, _) -> orderBy [desc (visitor ^. DB.VisitorIp)]
              (Just D.VisitorSortPath, Just D.Asc) -> orderBy [asc (visitor ^. DB.VisitorPath)]
              (Just D.VisitorSortPath, _) -> orderBy [desc (visitor ^. DB.VisitorPath)]
              (Just D.VisitorSortTimestamp, Just D.Asc) -> orderBy [asc (visitor ^. DB.VisitorTimestamp)]
              (Just D.VisitorSortTimestamp, _) -> orderBy [desc (visitor ^. DB.VisitorTimestamp)]
              (_, Just D.Asc) -> orderBy [asc (visitor ^. DB.VisitorTimestamp)]
              (_, _) -> orderBy [desc (visitor ^. DB.VisitorTimestamp)]

            limit (fromIntegral lim)
            offset (fromIntegral offs)
            return (visitor, user)

          let results = map (\(v, mu) -> (toDomainVisitor v, fmap toDomainUser mu)) entities
          return (results, fromIntegral total)
      )
      pool
  where
    filters =
      concat
        [ maybe [] (\ip -> [DB.VisitorIp P.==. ip]) mIp
        , maybe [] (\p -> [DB.VisitorPath P.==. p]) mPath
        ]

getVisitorsSinceHandler
  :: (IOE :> es, Reader ReadPool :> es) => UTCTime -> Eff es [D.Visitor]
getVisitorsSinceHandler since = do
  ReadPool pool <- ask @ReadPool
  liftIO $
    runSqlPool
      ( do
          entities <- P.selectList [DB.VisitorTimestamp P.>=. since] []
          return $ map toDomainVisitor entities
      )
      pool

countAllVisitorsHandler :: (IOE :> es, Reader ReadPool :> es) => Eff es Int
countAllVisitorsHandler = do
  ReadPool pool <- ask @ReadPool
  liftIO $
    runSqlPool
      ( do
          P.count ([] :: [P.Filter DB.Visitor])
      )
      pool
