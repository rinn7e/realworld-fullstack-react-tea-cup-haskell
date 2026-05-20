module Infrastructure.Interpreter.Stub.DB.MetadataDB
  ( runMetadataDBStub
  ) where

import Effectful
import Effectful.Dispatch.Dynamic
import UnliftIO.IORef

import Capability.Database.MetadataDB
import Infrastructure.Interpreter.Stub.DB.Types (MockDB (..))

runMetadataDBStub :: (IOE :> es) => IORef MockDB -> Eff (MetadataDB : es) a -> Eff es a
runMetadataDBStub ref = interpret $ \_ -> \case
  GetLastRanMigration -> do
    db <- readIORef ref
    pure db.lastRanMigration
