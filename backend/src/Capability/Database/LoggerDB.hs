module Capability.Database.LoggerDB where

import Data.Text (Text)
import Data.Time (UTCTime)
import Domain.Type (LogEntry)
import Domain.Type (UserId)
import Effectful
import Effectful.Dispatch.Dynamic

data LoggerDB :: Effect where
  InsertLog :: Text -> Text -> Text -> UTCTime -> Maybe UserId -> LoggerDB m LogEntry -- level, msg, src, timestamp, mUid
  ListLogs
    :: Maybe Int -> Maybe Int -> Maybe Text -> Maybe Text -> LoggerDB m ([LogEntry], Int)
  CountAllLogs :: LoggerDB m Int

type instance DispatchOf LoggerDB = 'Dynamic

insertLog
  :: (LoggerDB :> es) => Text -> Text -> Text -> UTCTime -> Maybe UserId -> Eff es LogEntry
insertLog level message source timestamp mUid = send (InsertLog level message source timestamp mUid)

listLogs
  :: (LoggerDB :> es)
  => Maybe Int
  -> Maybe Int
  -> Maybe Text
  -> Maybe Text
  -> Eff es ([LogEntry], Int)
listLogs mLimit mOffset mLevel mSource = send (ListLogs mLimit mOffset mLevel mSource)

countAllLogs :: (LoggerDB :> es) => Eff es Int
countAllLogs = send CountAllLogs
