module Infrastructure.Interpreter.Real.DB.VisitorDB
  ( runVisitorDBPostgres
  , toDomainVisitor
  ) where

import Data.List (foldl')
import Data.Time (UTCTime)
import Database.Esqueleto.Experimental
import Database.Persist qualified as P
import Database.Persist.Sql (ConnectionPool, fromSqlKey, runSqlPool, toSqlKey)
import Effectful
import Effectful.Dispatch.Dynamic
import Effectful.Reader.Static

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
  :: (IOE :> es, Reader ConnectionPool :> es) => Eff (VisitorDB : es) a -> Eff es a
runVisitorDBPostgres = interpret $ \_ -> \case
  UpsertVisitor ip ua path fp t mUid -> upsertVisitorHandler ip ua path fp t mUid
  ListVisitors mLimit mOffset mIp mPath mSort mDir -> listVisitorsHandler mLimit mOffset mIp mPath mSort mDir
  GetVisitorsSince since -> getVisitorsSinceHandler since
  CountAllVisitors -> countAllVisitorsHandler

upsertVisitorHandler
  :: (IOE :> es, Reader ConnectionPool :> es)
  => D.VisitorIp
  -> D.VisitorUserAgent
  -> D.VisitorPath
  -> D.VisitorFp
  -> UTCTime
  -> Maybe D.UserId
  -> Eff es D.Visitor
upsertVisitorHandler ip ua path fp t mUid = do
  pool <- ask @ConnectionPool
  liftIO $
    runSqlPool
      ( do
          let sqlUid = fmap (toSqlKey . fromIntegral . (\(D.UserId i) -> i)) mUid
              v = DB.Visitor ip ua path t sqlUid fp
          entity <- P.upsertBy (DB.UniqueVisitorFingerprint fp) v
            [ DB.VisitorIp        P.=. ip
            , DB.VisitorUserAgent P.=. ua
            , DB.VisitorPath      P.=. path
            , DB.VisitorTimestamp P.=. t
            , DB.VisitorUserId    P.=. sqlUid
            ]
          return $ toDomainVisitor entity
      )
      pool


listVisitorsHandler
  :: (IOE :> es, Reader ConnectionPool :> es)
  => Maybe D.Limit
  -> Maybe D.Offset
  -> Maybe D.VisitorIp
  -> Maybe D.VisitorPath
  -> Maybe D.VisitorSort
  -> Maybe D.Direction
  -> Eff es ([(D.Visitor, Maybe D.User)], Int)
listVisitorsHandler mLimit mOffset mIp mPath mSort mDir = do
  pool <- ask @ConnectionPool
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
  :: (IOE :> es, Reader ConnectionPool :> es) => UTCTime -> Eff es [D.Visitor]
getVisitorsSinceHandler since = do
  pool <- ask @ConnectionPool
  liftIO $
    runSqlPool
      ( do
          entities <- P.selectList [DB.VisitorTimestamp P.>=. since] []
          return $ map toDomainVisitor entities
      )
      pool

countAllVisitorsHandler :: (IOE :> es, Reader ConnectionPool :> es) => Eff es Int
countAllVisitorsHandler = do
  pool <- ask @ConnectionPool
  liftIO $
    runSqlPool
      ( do
          P.count ([] :: [P.Filter DB.Visitor])
      )
      pool
