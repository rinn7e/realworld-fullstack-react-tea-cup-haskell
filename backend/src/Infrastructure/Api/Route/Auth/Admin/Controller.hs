module Infrastructure.Api.Route.Auth.Admin.Controller
  ( adminAuthRoute
  , loginAdminHandler
  , getCurrentAdminHandler
  ) where

import Database.Persist.Sql (fromSqlKey)
import Effectful.Error.Static (throwError)
import Servant (NamedRoutes)
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Domain.Type qualified as D
import Infrastructure.Api.DTO qualified as Api
import Infrastructure.Api.Route.Auth.Admin.Type
import Infrastructure.Common.Type.App (App)
import Infrastructure.Common.Util.Guard (guardAdmin)
import Infrastructure.Interpreter.Real.DB.Schema.Schema qualified as DB

import Capability.Auth
import Capability.Crypto
import Capability.Database.UserDB

adminAuthRoute :: S.AuthResult DB.UserId -> S.ServerT (NamedRoutes AdminAuthRoute) App
adminAuthRoute auth =
  AdminAuthRoute
    { loginAdmin = loginAdminHandler auth
    , getCurrentAdmin = getCurrentAdminHandler auth
    }

loginAdminHandler
  :: S.AuthResult DB.UserId -> Api.UserWrapper Api.LoginUserRequest -> App Api.UserResponse
loginAdminHandler _ (Api.UserWrapper (Api.LoginUserRequest email pwd)) = do
  mUser <- lookupUserByEmail email
  case mUser of
    Nothing -> throwError S.err401{S.errBody = "Invalid email or password"}
    Just (u :: D.User) -> do
      ok <- verifyPassword pwd u.password
      if not ok
        then throwError S.err401{S.errBody = "Invalid email or password"}
        else do
          if u.role /= D.AdminRole
            then throwError S.err403{S.errBody = "Access Denied: Administrator role required"}
            else do
              token <- generateToken u.userId
              return $ Api.UserResponse $ Api.User u.email token u.username u.bio u.image

getCurrentAdminHandler :: S.AuthResult DB.UserId -> App Api.UserResponse
getCurrentAdminHandler (S.Authenticated uid) = do
  guardAdmin uid
  let dUid = D.UserId $ fromIntegral (fromSqlKey uid)
  mUser <- lookupUserById dUid
  case mUser of
    Nothing -> throwError S.err401
    Just (u :: D.User) -> do
      token <- generateToken dUid
      return $ Api.UserResponse $ Api.User u.email token u.username u.bio u.image
getCurrentAdminHandler _ = throwError S.err401
