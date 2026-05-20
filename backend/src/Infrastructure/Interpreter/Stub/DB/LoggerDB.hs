module Infrastructure.Interpreter.Stub.DB.LoggerDB
  ( runLoggerDBStub
  ) where

import Effectful
import Effectful.Dispatch.Dynamic

import Capability.Database.LoggerDB

runLoggerDBStub :: Eff (LoggerDB : es) a -> Eff es a
runLoggerDBStub = interpret $ \_ -> \case
  InsertLog{} -> pure (error "LoggerDBStub: InsertLog")
  ListLogs{} -> pure ([], 0)
  CountAllLogs -> pure 0
