module Infrastructure.Api.Route.Tag.Web.Controller
  ( webTagRoute
  ) where

import Effectful
import Servant (NamedRoutes)
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Infrastructure.Api.DTO qualified as Api
import Infrastructure.Api.Route.Tag.Web.Type
import Infrastructure.Interpreter.Real.DB.Schema.Schema (UserId)

import Capability.Database.TagDB

webTagRoute
  :: (TagDB :> es) => S.AuthResult UserId -> S.ServerT (NamedRoutes TagRoute) (Eff es)
webTagRoute _auth =
  TagRoute
    { getTagList = getTagListHandler
    }

getTagListHandler :: (TagDB :> es) => Eff es Api.TagListResponse
getTagListHandler = do
  tags <- getTags
  return $ Api.TagListResponse tags
