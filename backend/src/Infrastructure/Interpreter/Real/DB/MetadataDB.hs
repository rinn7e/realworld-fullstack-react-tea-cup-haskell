module Infrastructure.Interpreter.Real.DB.MetadataDB
  ( runMetadataDBPostgres
  ) where

import Database.Persist.Sql (ConnectionPool, runSqlPool)
import Effectful
import Effectful.Dispatch.Dynamic
import Effectful.Reader.Static
import Infrastructure.Common.Type.DBPools (ReadPool (..))

import Capability.Database.MetadataDB hiding (getLastRanMigration)
import Infrastructure.Interpreter.Real.DB.Migration.Migration qualified as Migration

runMetadataDBPostgres
  :: (IOE :> es, Reader ReadPool :> es) => Eff (MetadataDB : es) a -> Eff es a
runMetadataDBPostgres = interpret $ \_ -> \case
  GetLastRanMigration -> getLastRanMigrationHandler

getLastRanMigrationHandler
  :: (IOE :> es, Reader ReadPool :> es) => Eff es (Maybe Int)
getLastRanMigrationHandler = do
  ReadPool pool <- ask @ReadPool
  liftIO $ runSqlPool Migration.getLastRanMigration pool
