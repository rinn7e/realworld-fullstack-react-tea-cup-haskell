module Infrastructure.Interpreter.Stub.DB.TagDB
  ( runTagDBStub
  ) where

import Effectful
import Effectful.Dispatch.Dynamic

import Capability.Database.TagDB

runTagDBStub :: Eff (TagDB : es) a -> Eff es a
runTagDBStub = interpret $ \_ -> \case
  GetTags -> pure []
