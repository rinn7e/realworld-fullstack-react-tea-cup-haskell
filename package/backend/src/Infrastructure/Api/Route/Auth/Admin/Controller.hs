module Infrastructure.Api.Route.Auth.Admin.Controller
  ( adminAuthRoute
  , loginAdminHandler
  , getCurrentAdminHandler
  ) where

import Database.Persist.Sql (fromSqlKey)
import Effectful
import Effectful.Error.Static (Error, throwError)
import Servant (NamedRoutes)
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Domain.Type qualified as D
import Infrastructure.Api.DTO qualified as Api
import Infrastructure.Api.Route.Auth.Admin.Type
import Infrastructure.Common.Util.Guard (guardAdmin)
import Infrastructure.Interpreter.Real.DB.Schema.Schema qualified as DB

import Capability.Auth
import Capability.Crypto
import Capability.Database.UserDB

adminAuthRoute
  :: ( UserDB :> es
     , Crypto :> es
     , Auth :> es
     , Error S.ServerError :> es
     )
  => S.AuthResult DB.UserId
  -> S.ServerT (NamedRoutes AdminAuthRoute) (Eff es)
adminAuthRoute auth =
  AdminAuthRoute
    { loginAdmin = loginAdminHandler auth
    , getCurrentAdmin = getCurrentAdminHandler auth
    }

loginAdminHandler
  :: ( UserDB :> es
     , Crypto :> es
     , Auth :> es
     , Error S.ServerError :> es
     )
  => S.AuthResult DB.UserId
  -> Api.UserWrapper Api.LoginUserRequest
  -> Eff es Api.UserResponse
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

getCurrentAdminHandler
  :: ( UserDB :> es
     , Auth :> es
     , Error S.ServerError :> es
     )
  => S.AuthResult DB.UserId
  -> Eff es Api.UserResponse
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
