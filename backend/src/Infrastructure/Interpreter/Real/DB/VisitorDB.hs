module Infrastructure.Interpreter.Real.DB.VisitorDB
  ( runVisitorDBPostgres
  ) where

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
import Domain.Visitor (Visitor)
import Domain.Visitor qualified as D
import Infrastructure.Interpreter.Real.DB.Schema.Schema qualified as DB

toDomainVisitor :: Entity DB.Visitor -> Visitor
toDomainVisitor (Entity vid v) =
  D.Visitor
    { visitorId = fromIntegral (fromSqlKey vid)
    , ip = v.ip
    , userAgent = v.userAgent
    , path = v.path
    , timestamp = v.timestamp
    }

runVisitorDBPostgres
  :: (IOE :> es, Reader ConnectionPool :> es) => Eff (VisitorDB : es) a -> Eff es a
runVisitorDBPostgres = interpret $ \_ -> \case
  InsertVisitor ip ua path t -> do
    pool <- ask @ConnectionPool
    liftIO $
      runSqlPool
        ( do
            let v = DB.Visitor ip ua path t
            vid <- insert v
            return $ toDomainVisitor (Entity vid v)
        )
        pool
  ListVisitors mLimit mOffset mIp mPath -> do
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
  GetVisitorsSince since -> do
    pool <- ask @ConnectionPool
    liftIO $
      runSqlPool
        ( do
            entities <- selectList [DB.VisitorTimestamp >=. since] []
            return $ map toDomainVisitor entities
        )
        pool
  CountAllVisitors -> do
    pool <- ask @ConnectionPool
    liftIO $
      runSqlPool
        ( do
            c <- count ([] :: [Filter DB.Visitor])
            return (fromIntegral c)
        )
        pool
