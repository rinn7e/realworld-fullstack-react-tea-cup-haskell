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
import Servant.Auth.Server qualified as S
import Servant.Swagger.UI (SwaggerSchemaUI)

import Infrastructure.Api.Route.Article.Admin.Type (AdminArticleRoute)
import Infrastructure.Api.Route.Article.Web.Type (ArticleRoute)
import Infrastructure.Api.Route.Auth.Admin.Type (AdminAuthRoute)
import Infrastructure.Api.Route.Auth.Web.Type (AuthRoute)
import Infrastructure.Api.Route.Comment.Admin.Type (AdminCommentRoute)
import Infrastructure.Api.Route.Dashboard.Admin.Type (AdminDashboardRoute)
import Infrastructure.Api.Route.Metadata.Web.Type (MetadataRoute)
import Infrastructure.Api.Route.Tag.Web.Type (TagRoute)
import Infrastructure.Api.Route.User.Admin.Type (AdminUserRoute)
import Infrastructure.Api.Route.User.Web.Type (UserRoute)
import Infrastructure.Api.Route.Visitor.Web.Type (VisitorWebRoute)
import Infrastructure.Interpreter.Real.DB.Schema.Schema (UserId)

type AppApi auths = S.Auth auths UserId :> NamedRoutes AppRoute

data AppRoute mode = AppRoute
  { metadata :: mode :- NamedRoutes MetadataRoute
  , auth :: mode :- NamedRoutes AuthRoute
  , user :: mode :- NamedRoutes UserRoute
  , articles :: mode :- NamedRoutes ArticleRoute
  , tags :: mode :- NamedRoutes TagRoute
  , visitors :: mode :- NamedRoutes VisitorWebRoute
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
