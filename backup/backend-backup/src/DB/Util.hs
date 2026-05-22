module DB.Util where

import Database.Persist.Sql (SqlPersistT, runSqlPool)
import Effectful (liftIO)
import Effectful.Reader.Static (ask)

import Common.Type.App (App, AppEnv (..))

{- | Run a database query in the App monad.
This helper mimics the ChatFusion pattern for convenient DB access.
-}
runDB :: SqlPersistT IO a -> App a
runDB query = do
  env <- ask @AppEnv
  liftIO $ runSqlPool query env.appPool
