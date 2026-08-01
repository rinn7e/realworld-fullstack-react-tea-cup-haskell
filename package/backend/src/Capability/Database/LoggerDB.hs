module Capability.Database.LoggerDB where

import Data.Time (UTCTime)
import Domain.Type
import Effectful
import Effectful.Dispatch.Dynamic

data LoggerDB :: Effect where
  InsertLog
    :: LogLevel -> LogMessage -> LogSource -> UTCTime -> Maybe UserId -> LoggerDB m LogEntry
  ListLogs
    :: Maybe Int
    -> Maybe Int
    -> Maybe LogLevel
    -> Maybe LogSource
    -> LoggerDB m ([LogEntry], Int)
  CountAllLogs :: LoggerDB m Int

type instance DispatchOf LoggerDB = 'Dynamic

insertLog
  :: (LoggerDB :> es)
  => LogLevel
  -> LogMessage
  -> LogSource
  -> UTCTime
  -> Maybe UserId
  -> Eff es LogEntry
insertLog level message source timestamp mUid = send (InsertLog level message source timestamp mUid)

listLogs
  :: (LoggerDB :> es)
  => Maybe Int
  -> Maybe Int
  -> Maybe LogLevel
  -> Maybe LogSource
  -> Eff es ([LogEntry], Int)
listLogs mLimit mOffset mLevel mSource = send (ListLogs mLimit mOffset mLevel mSource)

countAllLogs :: (LoggerDB :> es) => Eff es Int
countAllLogs = send CountAllLogs
