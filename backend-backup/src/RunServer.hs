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

import Api.Article.Admin.Handler (adminArticleRoute)
import Api.Article.Admin.Type (AdminArticleRoute)
import Api.Article.Web.Handler (webArticleRoute)
import Api.Article.Web.Type (ArticleRoute)
import Api.Auth.Admin.Handler (adminAuthRoute)
import Api.Auth.Admin.Type (AdminAuthRoute)
import Api.Auth.Web.Handler (webAuthRoute)
import Api.Auth.Web.Type (AuthRoute)
import Api.Comment.Admin.Handler (adminCommentRoute)
import Api.Comment.Admin.Type (AdminCommentRoute)
import Api.Dashboard.Admin.Handler (adminDashboardRoute)
import Api.Dashboard.Admin.Type (AdminDashboardRoute)
import Api.Metadata.Web.Handler (webMetadataRoute)
import Api.Metadata.Web.Type (MetadataRoute)
import Api.OpenApi (adminOpenApiSpec, openApiSpec)
import Api.Tag.Web.Handler (webTagRoute)
import Api.Tag.Web.Type (TagRoute)
import Api.User.Admin.Handler (adminUserRoute)
import Api.User.Admin.Type (AdminUserRoute)
import Api.User.Web.Handler (webUserRoute)
import Api.User.Web.Type (UserRoute)
import Common.Type.App (AppEnv (..), runApp)
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
