module Infrastructure.Interpreter.Real.DB.LoggerDB
  ( runLoggerDBPostgres
  , toDomainLogEntry
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
  )
import Database.Persist.Sql (ConnectionPool, fromSqlKey, runSqlPool, toSqlKey)
import Effectful
import Effectful.Dispatch.Dynamic
import Effectful.Reader.Static

import Capability.Database.LoggerDB
import Domain.Type (LogEntry)
import Domain.Type qualified as D
import Infrastructure.Interpreter.Real.DB.Schema.Schema qualified as DB

import Domain.Type qualified as DU

toDomainLogEntry :: Entity DB.Log -> LogEntry
toDomainLogEntry (Entity lid l) =
  D.LogEntry
    { logId = D.LogId $ fromIntegral (fromSqlKey lid)
    , level = l.level
    , message = l.message
    , source = l.source
    , timestamp = l.timestamp
    , userId = fmap (DU.UserId . fromIntegral . fromSqlKey) l.userId
    }

runLoggerDBPostgres
  :: (IOE :> es, Reader ConnectionPool :> es) => Eff (LoggerDB : es) a -> Eff es a
runLoggerDBPostgres = interpret $ \_ -> \case
  InsertLog level message source timestamp mUid -> insertLogHandler level message source timestamp mUid
  ListLogs mLimit mOffset mLevel mSource -> listLogsHandler mLimit mOffset mLevel mSource
  CountAllLogs -> countAllLogsHandler

insertLogHandler
  :: (IOE :> es, Reader ConnectionPool :> es)
  => D.LogLevel
  -> D.LogMessage
  -> D.LogSource
  -> UTCTime
  -> Maybe DU.UserId
  -> Eff es LogEntry
insertLogHandler level message source timestamp mUid = do
  pool <- ask @ConnectionPool
  liftIO $
    runSqlPool
      ( do
          let mSqlUid = fmap (toSqlKey . fromIntegral . (.unUserId)) mUid
              l = DB.Log level message source timestamp mSqlUid
          lid <- insert l
          return $ toDomainLogEntry (Entity lid l)
      )
      pool

listLogsHandler
  :: (IOE :> es, Reader ConnectionPool :> es)
  => Maybe Int
  -> Maybe Int
  -> Maybe D.LogLevel
  -> Maybe D.LogSource
  -> Eff es ([LogEntry], Int)
listLogsHandler mLimit mOffset mLevel mSource = do
  pool <- ask @ConnectionPool
  liftIO $
    runSqlPool
      ( do
          let limit = maybe 10 id mLimit
              offset = maybe 0 id mOffset
              filters =
                concat
                  [ maybe [] (\lvl -> [DB.LogLevel ==. lvl]) mLevel
                  , maybe [] (\src -> [DB.LogSource ==. src]) mSource
                  ]
          total <- count filters
          entities <- selectList filters [Desc DB.LogTimestamp, LimitTo limit, OffsetBy offset]
          return (map toDomainLogEntry entities, fromIntegral total)
      )
      pool

countAllLogsHandler :: (IOE :> es, Reader ConnectionPool :> es) => Eff es Int
countAllLogsHandler = do
  pool <- ask @ConnectionPool
  liftIO $
    runSqlPool
      ( do
          c <- count ([] :: [Filter DB.Log])
          return (fromIntegral c)
      )
      pool
