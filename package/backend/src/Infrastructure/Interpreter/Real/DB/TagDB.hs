module Infrastructure.Interpreter.Real.DB.TagDB
  ( runTagDBPostgres
  ) where

import Database.Persist.Sql (ConnectionPool, runSqlPool)
import Effectful
import Effectful.Dispatch.Dynamic
import Effectful.Reader.Static
import Infrastructure.Common.Type.DBPools (ReadPool (..))

import Capability.Database.TagDB
import Domain.Type qualified as D
import Infrastructure.Interpreter.Real.DB.Query.Tag qualified as Q

runTagDBPostgres
  :: (IOE :> es, Reader ReadPool :> es) => Eff (TagDB : es) a -> Eff es a
runTagDBPostgres = interpret $ \_ -> \case
  GetTags -> getTagsHandler

getTagsHandler :: (IOE :> es, Reader ReadPool :> es) => Eff es [D.TagName]
getTagsHandler = do
  ReadPool pool <- ask @ReadPool
  liftIO $ runSqlPool Q.getTags pool
