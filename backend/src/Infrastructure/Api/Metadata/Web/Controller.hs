module Infrastructure.Api.Metadata.Web.Controller
  ( webMetadataRoute
  ) where

import Data.Text qualified as T
import Data.Version (showVersion)
import Effectful.Reader.Static (ask)
import Servant (NamedRoutes)
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Infrastructure.Api.Metadata.Web.Type
import Infrastructure.Common.Type.App (App, AppEnv (..))
import Infrastructure.Common.Type.Config (Config (..))
import Infrastructure.Common.Type.Metadata (MetadataResponse (..))
import Infrastructure.Interpreter.Real.DB.Schema.Schema (UserId)
import Paths_haskell_servant_realworld qualified as Paths

import Capability.Database.MetadataDB

webMetadataRoute :: S.AuthResult UserId -> S.ServerT (NamedRoutes MetadataRoute) App
webMetadataRoute _auth =
  MetadataRoute
    { getMetadata = getMetadataHandler
    }

getMetadataHandler :: App MetadataResponse
getMetadataHandler = do
  env <- ask @AppEnv
  lastMigration <- getLastRanMigration
  return $
    MetadataResponse
      { appVersion = T.pack (showVersion Paths.version)
      , lastCommitHash = env.appConfig.gitCommitHash
      , lastRanMigration = lastMigration
      }
