module Infrastructure.Interpreter.Real.DB.MetadataDB
  ( runMetadataDBPostgres
  ) where

import Database.Persist.Sql (ConnectionPool, runSqlPool)
import Effectful
import Effectful.Dispatch.Dynamic
import Effectful.Reader.Static

import Capability.Database.MetadataDB hiding (getLastRanMigration)
import Infrastructure.Interpreter.Real.DB.Migration.Migration qualified as Migration

runMetadataDBPostgres
  :: (IOE :> es, Reader ConnectionPool :> es) => Eff (MetadataDB : es) a -> Eff es a
runMetadataDBPostgres = interpret $ \_ -> \case
  GetLastRanMigration -> getLastRanMigrationHandler

getLastRanMigrationHandler :: (IOE :> es, Reader ConnectionPool :> es) => Eff es (Maybe Int)
getLastRanMigrationHandler = do
  pool <- ask @ConnectionPool
  liftIO $ runSqlPool Migration.getLastRanMigration pool
