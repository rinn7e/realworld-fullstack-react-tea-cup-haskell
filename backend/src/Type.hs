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

import Infrastructure.Api.Article.Admin.Type (AdminArticleRoute)
import Infrastructure.Api.Article.Web.Type (ArticleRoute)
import Infrastructure.Api.Auth.Admin.Type (AdminAuthRoute)
import Infrastructure.Api.Auth.Web.Type (AuthRoute)
import Infrastructure.Api.Comment.Admin.Type (AdminCommentRoute)
import Infrastructure.Api.Dashboard.Admin.Type (AdminDashboardRoute)
import Infrastructure.Api.Metadata.Web.Type (MetadataRoute)
import Infrastructure.Api.Tag.Web.Type (TagRoute)
import Infrastructure.Api.User.Admin.Type (AdminUserRoute)
import Infrastructure.Api.User.Web.Type (UserRoute)
import Infrastructure.Interpreter.DB.Postgres.Schema.Schema (UserId)

import Infrastructure.Api.TagCombinator (Tag)
import Infrastructure.Entity.User.DTO (UserResponse)

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
