module Infrastructure.Api.Route.Metadata.Web.Controller
  ( webMetadataRoute
  ) where

import Data.Text qualified as T
import Data.Version (showVersion)
import Effectful
import Effectful.Reader.Static (Reader, ask)
import Servant (NamedRoutes)
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Infrastructure.Api.Route.Metadata.Web.Type
import Infrastructure.Common.Type.App (AppEnv (..))
import Infrastructure.Common.Type.Config (Config (..))
import Infrastructure.Common.Type.Metadata (MetadataResponse (..))
import Infrastructure.Interpreter.Real.DB.Schema.Schema (UserId)
import Paths_haskell_servant_realworld qualified as Paths

import Capability.Database.MetadataDB

webMetadataRoute
  :: (MetadataDB :> es, Reader AppEnv :> es)
  => S.AuthResult UserId
  -> S.ServerT (NamedRoutes MetadataRoute) (Eff es)
webMetadataRoute _auth =
  MetadataRoute
    { getMetadata = getMetadataHandler
    }

getMetadataHandler :: (MetadataDB :> es, Reader AppEnv :> es) => Eff es MetadataResponse
getMetadataHandler = do
  env <- ask @AppEnv
  lastMigration <- getLastRanMigration
  return $
    MetadataResponse
      { appVersion = T.pack (showVersion Paths.version)
      , lastCommitHash = env.appConfig.gitCommitHash
      , lastRanMigration = lastMigration
      }
