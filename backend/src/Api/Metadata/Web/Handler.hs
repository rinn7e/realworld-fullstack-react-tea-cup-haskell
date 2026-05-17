module Api.Metadata.Web.Handler where

import Data.Text qualified as T
import Data.Version (showVersion)
import Database.Persist.Sql (SqlPersistT)
import Effectful.Reader.Static (ask)
import Servant (NamedRoutes)
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Api.Metadata.Web.Type
import Common.Type.App (App, AppEnv (..))
import Common.Type.Config (Config (..))
import Common.Type.Metadata (MetadataResponse (..))
import DB.Migration (getLastRanMigration)
import DB.Schema.Type (UserId)
import DB.Util (runDB)
import Paths_haskell_servant_realworld qualified as Paths

webMetadataRoute :: S.AuthResult UserId -> S.ServerT (NamedRoutes MetadataRoute) App
webMetadataRoute _auth =
  MetadataRoute
    { getMetadata = getMetadataHandler
    }

getMetadataHandler :: App MetadataResponse
getMetadataHandler = do
  AppEnv{appConfig = config} <- ask
  lastMigration <- runDB getLastRanMigration
  return $
    MetadataResponse
      { appVersion = T.pack (showVersion Paths.version)
      , lastCommitHash = config.gitCommitHash
      , lastRanMigration = lastMigration
      }
