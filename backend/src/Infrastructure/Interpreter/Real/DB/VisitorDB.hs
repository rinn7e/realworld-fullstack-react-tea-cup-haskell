module Infrastructure.Interpreter.Real.DB.VisitorDB
  ( runVisitorDBPostgres
  , toDomainVisitor
  ) where
import Data.Time (UTCTime)
import Database.Persist
  ( Entity (..)
  , SelectOpt (..)
  , count
  , delete
  , deleteWhere
  , get
  , insert
  , replace
  , selectList
  , (==.)
  , Filter
  , (>=.)
  )
import Database.Persist.Sql (ConnectionPool, fromSqlKey, runSqlPool, toSqlKey)
import Effectful
import Effectful.Dispatch.Dynamic
import Effectful.Reader.Static

import Capability.Database.VisitorDB
import Domain.Type qualified as D
import Infrastructure.Interpreter.Real.DB.Schema.Schema qualified as DB

toDomainVisitor :: Entity DB.Visitor -> D.Visitor
toDomainVisitor (Entity vid v) =
  D.Visitor
    { visitorId = D.VisitorId $ fromIntegral (fromSqlKey vid)
    , ip = v.ip
    , userAgent = v.userAgent
    , path = v.path
    , timestamp = v.timestamp
    }


runVisitorDBPostgres
  :: (IOE :> es, Reader ConnectionPool :> es) => Eff (VisitorDB : es) a -> Eff es a
runVisitorDBPostgres = interpret $ \_ -> \case
  InsertVisitor ip ua path t -> insertVisitorHandler ip ua path t
  ListVisitors mLimit mOffset mIp mPath mSort mDir -> listVisitorsHandler mLimit mOffset mIp mPath mSort mDir
  GetVisitorsSince since -> getVisitorsSinceHandler since
  CountAllVisitors -> countAllVisitorsHandler

insertVisitorHandler
  :: (IOE :> es, Reader ConnectionPool :> es)
  => D.VisitorIp
  -> D.VisitorUserAgent
  -> D.VisitorPath
  -> UTCTime
  -> Eff es D.Visitor
insertVisitorHandler ip ua path t = do
  pool <- ask @ConnectionPool
  liftIO $
    runSqlPool
      ( do
          let v = DB.Visitor ip ua path t
          vid <- insert v
          return $ toDomainVisitor (Entity vid v)
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
  -> Eff es ([D.Visitor], Int)
listVisitorsHandler mLimit mOffset mIp mPath mSort mDir = do
  pool <- ask @ConnectionPool
  liftIO $
    runSqlPool
      ( do
          let limit = maybe 10 D.unLimit mLimit
              offset = maybe 0 D.unOffset mOffset
              filters =
                concat
                  [ maybe [] (\ip -> [DB.VisitorIp ==. ip]) mIp
                  , maybe [] (\p -> [DB.VisitorPath ==. p]) mPath
                  ]
              
              sortOpt = case (mSort, mDir) of
                (Just D.VisitorSortId, Just D.Asc) -> Asc DB.VisitorId
                (Just D.VisitorSortId, _) -> Desc DB.VisitorId
                (Just D.VisitorSortIp, Just D.Asc) -> Asc DB.VisitorIp
                (Just D.VisitorSortIp, _) -> Desc DB.VisitorIp
                (Just D.VisitorSortPath, Just D.Asc) -> Asc DB.VisitorPath
                (Just D.VisitorSortPath, _) -> Desc DB.VisitorPath
                (Just D.VisitorSortTimestamp, Just D.Asc) -> Asc DB.VisitorTimestamp
                (Just D.VisitorSortTimestamp, _) -> Desc DB.VisitorTimestamp
                (_, Just D.Asc) -> Asc DB.VisitorTimestamp
                (_, _) -> Desc DB.VisitorTimestamp

          
          total <- count filters
          entities <- selectList filters [sortOpt, LimitTo limit, OffsetBy offset]
          return (map toDomainVisitor entities, fromIntegral total)
      )
      pool

getVisitorsSinceHandler
  :: (IOE :> es, Reader ConnectionPool :> es) => UTCTime -> Eff es [D.Visitor]
getVisitorsSinceHandler since = do
  pool <- ask @ConnectionPool
  liftIO $
    runSqlPool
      ( do
          entities <- selectList [DB.VisitorTimestamp >=. since] []
          return $ map toDomainVisitor entities
      )
      pool

countAllVisitorsHandler :: (IOE :> es, Reader ConnectionPool :> es) => Eff es Int
countAllVisitorsHandler = do
  pool <- ask @ConnectionPool
  liftIO $
    runSqlPool
      ( do
          count ([] :: [Filter DB.Visitor])
      )
      pool
