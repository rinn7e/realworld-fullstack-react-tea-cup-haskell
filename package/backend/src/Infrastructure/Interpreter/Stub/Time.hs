module Infrastructure.Interpreter.Stub.Time
  ( runTimeStub
  ) where

import Data.Time (UTCTime)
import Effectful
import Effectful.Dispatch.Dynamic

import Capability.Time

runTimeStub :: UTCTime -> Eff (Time : es) a -> Eff es a
runTimeStub fixedTime = interpret $ \_ -> \case
  GetCurrentTime -> pure fixedTime
