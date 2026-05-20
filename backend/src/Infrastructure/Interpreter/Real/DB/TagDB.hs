module Infrastructure.Interpreter.Real.DB.TagDB
  ( runTagDBPostgres
  ) where

import Database.Persist.Sql (ConnectionPool, runSqlPool)
import Effectful
import Effectful.Dispatch.Dynamic
import Effectful.Reader.Static

import Capability.Database.TagDB
import Domain.Type qualified as D
import Infrastructure.Interpreter.Real.DB.Query.Tag qualified as Q

runTagDBPostgres
  :: (IOE :> es, Reader ConnectionPool :> es) => Eff (TagDB : es) a -> Eff es a
runTagDBPostgres = interpret $ \_ -> \case
  GetTags -> getTagsHandler

getTagsHandler :: (IOE :> es, Reader ConnectionPool :> es) => Eff es [D.TagName]
getTagsHandler = do
  pool <- ask @ConnectionPool
  liftIO $ runSqlPool Q.getTags pool
