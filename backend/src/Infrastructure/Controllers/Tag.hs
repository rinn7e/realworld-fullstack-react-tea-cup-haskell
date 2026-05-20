module Infrastructure.Controllers.Tag
  ( webTagRoute
  ) where

import Effectful
import Effectful.Reader.Static (ask)
import Servant (NamedRoutes)
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Infrastructure.Api.Tag.Web.DTO (TagListResponse (..))
import Infrastructure.Api.Tag.Web.Type
import Infrastructure.Common.Type.App (App, AppEnv (..))
import Infrastructure.Interpreter.DB.Postgres.Schema.Schema (UserId)

import Capability.Database.TagDB

webTagRoute :: S.AuthResult UserId -> S.ServerT (NamedRoutes TagRoute) App
webTagRoute _auth =
  TagRoute
    { getTagList = getTagListHandler
    }

getTagListHandler :: App TagListResponse
getTagListHandler = do
  tags <- getTags
  return $ TagListResponse tags
