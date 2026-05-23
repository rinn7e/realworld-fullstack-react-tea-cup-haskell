module RunServer
  ( AppEnv (..)
  , runWebServer
  , runAdminServer
  , runServer
  , APIWithOpenApi
  , AdminAPIWithOpenApi
  , FullAPI
  ) where

import Data.Proxy (Proxy (..))
import Servant (NamedRoutes, (:<|>) (..))
import Servant qualified as S
import Servant.Swagger.UI qualified as SUI

import Infrastructure.Api.Route.Article.Admin.Type (AdminArticleRoute)
import Infrastructure.Api.Route.Article.Web.Type (ArticleRoute)
import Infrastructure.Api.Route.Auth.Admin.Type (AdminAuthRoute)
import Infrastructure.Api.Route.Auth.Web.Type (AuthRoute)
import Infrastructure.Api.Route.Comment.Admin.Type (AdminCommentRoute)
import Infrastructure.Api.Route.Dashboard.Admin.Type (AdminDashboardRoute)
import Infrastructure.Api.Route.Metadata.Web.Type (MetadataRoute)
import Infrastructure.Api.Route.OpenApi (adminOpenApiSpec, openApiSpec)
import Infrastructure.Api.Route.Tag.Web.Type (TagRoute)
import Infrastructure.Api.Route.User.Admin.Type (AdminUserRoute)
import Infrastructure.Api.Route.User.Web.Type (UserRoute)
import Infrastructure.Api.Route.Visitor.Web.Type (VisitorWebRoute)

import Infrastructure.Api.Route.Article.Admin.Controller (adminArticleRoute)
import Infrastructure.Api.Route.Article.Web.Controller (webArticleRoute)
import Infrastructure.Api.Route.Auth.Admin.Controller (adminAuthRoute)
import Infrastructure.Api.Route.Auth.Web.Controller (webAuthRoute)
import Infrastructure.Api.Route.Comment.Admin.Controller (adminCommentRoute)
import Infrastructure.Api.Route.Dashboard.Admin.Controller (adminDashboardRoute)
import Infrastructure.Api.Route.Metadata.Web.Controller (webMetadataRoute)
import Infrastructure.Api.Route.Tag.Web.Controller (webTagRoute)
import Infrastructure.Api.Route.User.Admin.Controller (adminUserRoute)
import Infrastructure.Api.Route.User.Web.Controller (webUserRoute)
import Infrastructure.Api.Route.Visitor.Web.Controller (webVisitorRoute)

import Infrastructure.Common.Type.App (AppEnv (..), runApp)
import Type

type FullAPI = APIWithOpenApi :<|> AdminAPIWithOpenApi

runWebServer :: AppEnv -> S.Server WebAPI
runWebServer env auth =
  AppRoute
    { metadata =
        S.hoistServer (Proxy @(NamedRoutes MetadataRoute)) (runApp env) (webMetadataRoute auth)
    , auth = S.hoistServer (Proxy @(NamedRoutes AuthRoute)) (runApp env) (webAuthRoute auth)
    , user = S.hoistServer (Proxy @(NamedRoutes UserRoute)) (runApp env) (webUserRoute auth)
    , articles =
        S.hoistServer (Proxy @(NamedRoutes ArticleRoute)) (runApp env) (webArticleRoute auth)
    , tags = S.hoistServer (Proxy @(NamedRoutes TagRoute)) (runApp env) (webTagRoute auth)
    , visitors = S.hoistServer (Proxy @(NamedRoutes VisitorWebRoute)) (runApp env) (webVisitorRoute auth)
    }

runAdminServer :: AppEnv -> S.Server AdminAPI
runAdminServer env auth =
  AdminRoute
    { auth =
        S.hoistServer
          (Proxy @(NamedRoutes AdminAuthRoute))
          (runApp env)
          (adminAuthRoute auth)
    , dashboard =
        S.hoistServer
          (Proxy @(NamedRoutes AdminDashboardRoute))
          (runApp env)
          (adminDashboardRoute auth)
    , articles =
        S.hoistServer
          (Proxy @(NamedRoutes AdminArticleRoute))
          (runApp env)
          (adminArticleRoute auth)
    , users =
        S.hoistServer (Proxy @(NamedRoutes AdminUserRoute)) (runApp env) (adminUserRoute auth)
    , comments =
        S.hoistServer
          (Proxy @(NamedRoutes AdminCommentRoute))
          (runApp env)
          (adminCommentRoute auth)
    }

runServer :: AppEnv -> S.Server FullAPI
runServer env =
  (runWebServer env :<|> SUI.swaggerSchemaUIServer openApiSpec)
    :<|> (runAdminServer env :<|> SUI.swaggerSchemaUIServer adminOpenApiSpec)
