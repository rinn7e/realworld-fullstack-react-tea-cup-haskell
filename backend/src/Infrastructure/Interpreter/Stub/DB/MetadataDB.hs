module Infrastructure.Interpreter.Stub.DB.MetadataDB
  ( runMetadataDBStub
  ) where

import Effectful
import Effectful.Dispatch.Dynamic

import Capability.Database.MetadataDB

runMetadataDBStub :: Eff (MetadataDB : es) a -> Eff es a
runMetadataDBStub = interpret $ \_ -> \case
  GetLastRanMigration -> pure (Just 1)
