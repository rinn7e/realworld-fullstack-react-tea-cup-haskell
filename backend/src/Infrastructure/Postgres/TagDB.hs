module Infrastructure.Postgres.TagDB
  ( runTagDBPostgres
  ) where

import Database.Persist.Sql (ConnectionPool, runSqlPool)
import Effectful
import Effectful.Dispatch.Dynamic
import Effectful.Reader.Static

import Capability.Database.TagDB
import Infrastructure.Postgres.Query.Tag qualified as Q

runTagDBPostgres
  :: (IOE :> es, Reader ConnectionPool :> es) => Eff (TagDB : es) a -> Eff es a
runTagDBPostgres = interpret $ \_ -> \case
  GetTags -> do
    pool <- ask @ConnectionPool
    liftIO $ runSqlPool Q.getTags pool
