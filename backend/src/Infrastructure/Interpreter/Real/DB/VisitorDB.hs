module Infrastructure.Interpreter.Real.DB.VisitorDB
  ( runVisitorDBPostgres
  ) where

import Data.Time (UTCTime)
import Database.Persist
  ( Entity (..)
  , Filter
  , SelectOpt (..)
  , count
  , insert
  , selectList
  , (==.)
  , (>=.)
  )
import Database.Persist.Sql (ConnectionPool, fromSqlKey, runSqlPool)
import Effectful
import Effectful.Dispatch.Dynamic
import Effectful.Reader.Static

import Capability.Database.VisitorDB
import Domain.Type (Visitor)
import Domain.Type qualified as D
import Infrastructure.Interpreter.Real.DB.Schema.Schema qualified as DB

toDomainVisitor :: Entity DB.Visitor -> Visitor
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
  ListVisitors mLimit mOffset mIp mPath -> listVisitorsHandler mLimit mOffset mIp mPath
  GetVisitorsSince since -> getVisitorsSinceHandler since
  CountAllVisitors -> countAllVisitorsHandler

insertVisitorHandler
  :: (IOE :> es, Reader ConnectionPool :> es)
  => D.VisitorIp
  -> D.VisitorUserAgent
  -> D.VisitorPath
  -> UTCTime
  -> Eff es Visitor
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
  => Maybe Int
  -> Maybe Int
  -> Maybe D.VisitorIp
  -> Maybe D.VisitorPath
  -> Eff es ([Visitor], Int)
listVisitorsHandler mLimit mOffset mIp mPath = do
  pool <- ask @ConnectionPool
  liftIO $
    runSqlPool
      ( do
          let limit = maybe 10 id mLimit
              offset = maybe 0 id mOffset
              filters =
                concat
                  [ maybe [] (\ip -> [DB.VisitorIp ==. ip]) mIp
                  , maybe [] (\p -> [DB.VisitorPath ==. p]) mPath
                  ]
          total <- count filters
          entities <- selectList filters [Desc DB.VisitorTimestamp, LimitTo limit, OffsetBy offset]
          return (map toDomainVisitor entities, fromIntegral total)
      )
      pool

getVisitorsSinceHandler :: (IOE :> es, Reader ConnectionPool :> es) => UTCTime -> Eff es [Visitor]
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
          c <- count ([] :: [Filter DB.Visitor])
          return (fromIntegral c)
      )
      pool
