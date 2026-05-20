module Infrastructure.Interpreter.Stub.DB.LoggerDB
  ( runLoggerDBStub
  ) where

import Data.List qualified as L
import Data.Map.Strict qualified as Map
import Effectful
import Effectful.Dispatch.Dynamic
import UnliftIO.IORef

import Capability.Database.LoggerDB
import Domain.Type
import Infrastructure.Interpreter.Stub.DB.Types (MockDB (..))

runLoggerDBStub :: (IOE :> es) => IORef MockDB -> Eff (LoggerDB : es) a -> Eff es a
runLoggerDBStub ref = interpret $ \_ -> \case
  InsertLog lvl msg src t mUid -> do
    atomicModifyIORef' ref $ \db ->
      let lid = LogId db.nextLogId
          newLog = LogEntry lid lvl msg src t mUid
          newDb = db
            { nextLogId = db.nextLogId + 1
            , logs = Map.insert lid newLog db.logs
            }
      in (newDb, newLog)
  ListLogs mLimit mOffset mLvl mSrc -> do
    db <- readIORef ref
    let allLogs = Map.elems db.logs
        sorted = L.sortBy (\l1 l2 -> compare l2.timestamp l1.timestamp) allLogs
        filtered = filter (\l ->
          maybe True (== l.level) mLvl &&
          maybe True (== l.source) mSrc
          ) sorted
        total = length filtered
        limit = maybe 10 id mLimit
        offset = maybe 0 id mOffset
        sliced = take limit $ drop offset filtered
    pure (sliced, total)
  CountAllLogs -> do
    db <- readIORef ref
    pure $ Map.size db.logs
