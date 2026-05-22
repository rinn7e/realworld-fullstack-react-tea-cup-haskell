module Type
  ( WebAPI
  , AdminAPI
  , AppApi
  , AppRoute (..)
  , AdminRoute (..)
  , APIWithOpenApi
  , AdminAPIWithOpenApi
  ) where

import GHC.Generics (Generic)
import Servant (GenericMode (type (:-)), NamedRoutes, (:<|>), (:>))
import Servant qualified as S
import Servant.Auth.Server qualified as S
import Servant.Swagger.UI (SwaggerSchemaUI)

import Api.Article.Admin.Type (AdminArticleRoute)
import Api.Article.Web.Type (ArticleRoute)
import Api.Auth.Admin.Type (AdminAuthRoute)
import Api.Auth.Web.Type (AuthRoute)
import Api.Comment.Admin.Type (AdminCommentRoute)
import Api.Dashboard.Admin.Type (AdminDashboardRoute)
import Api.Metadata.Web.Type (MetadataRoute)
import Api.Tag.Web.Type (TagRoute)
import Api.User.Admin.Type (AdminUserRoute)
import Api.User.Web.Type (UserRoute)
import DB.Schema.Type (UserId)

import Api.TagCombinator (Tag)
import Entity.User.Api (UserResponse)

type AppApi auths = S.Auth auths UserId :> NamedRoutes AppRoute

data AppRoute mode = AppRoute
  { metadata :: mode :- NamedRoutes MetadataRoute
  , auth :: mode :- NamedRoutes AuthRoute
  , user :: mode :- NamedRoutes UserRoute
  , articles :: mode :- NamedRoutes ArticleRoute
  , tags :: mode :- NamedRoutes TagRoute
  }
  deriving stock (Generic)

type WebAPI = "api" :> AppApi '[S.JWT]

data AdminRoute mode = AdminRoute
  { auth :: mode :- NamedRoutes AdminAuthRoute
  , dashboard :: mode :- NamedRoutes AdminDashboardRoute
  , articles :: mode :- NamedRoutes AdminArticleRoute
  , users :: mode :- NamedRoutes AdminUserRoute
  , comments :: mode :- NamedRoutes AdminCommentRoute
  }
  deriving stock (Generic)

type AdminAPI = "api" :> "admin" :> S.Auth '[S.JWT] UserId :> NamedRoutes AdminRoute

type APIWithOpenApi = WebAPI :<|> SwaggerSchemaUI "swagger-ui" "swagger.json"

type AdminAPIWithOpenApi =
  AdminAPI :<|> ("admin" :> SwaggerSchemaUI "swagger-ui" "admin-swagger.json")
