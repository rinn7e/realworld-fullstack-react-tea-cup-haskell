module Infrastructure.Api.Route.Auth.Web.Controller
  ( webAuthRoute
  , loginUserHandler
  , registerUserHandler
  ) where

import Effectful
import Effectful.Error.Static (Error, throwError)
import Servant (NamedRoutes)
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Domain.Type qualified as D
import Infrastructure.Api.DTO qualified as Api
import Infrastructure.Api.Route.Auth.Web.Type
import Infrastructure.Interpreter.Real.DB.Schema.Schema qualified as DB

import Capability.Auth
import Capability.Crypto
import Capability.Database.UserDB

webAuthRoute
  :: ( UserDB :> es
     , Crypto :> es
     , Auth :> es
     , Error S.ServerError :> es
     )
  => S.AuthResult DB.UserId
  -> S.ServerT (NamedRoutes AuthRoute) (Eff es)
webAuthRoute auth =
  AuthRoute
    { loginUser = loginUserHandler auth
    , registerUser = registerUserHandler auth
    }

loginUserHandler
  :: ( UserDB :> es
     , Crypto :> es
     , Auth :> es
     , Error S.ServerError :> es
     )
  => S.AuthResult DB.UserId
  -> Api.UserWrapper Api.LoginUserRequest
  -> Eff es Api.UserResponse
loginUserHandler _ (Api.UserWrapper (Api.LoginUserRequest email pwd)) = do
  mUser <- lookupUserByEmail email
  case mUser of
    Nothing -> throwError S.err401{S.errBody = "Invalid email or password"}
    Just (u :: D.User) -> do
      ok <- verifyPassword pwd u.password
      if not ok
        then throwError S.err401{S.errBody = "Invalid email or password"}
        else do
          token <- generateToken u.userId
          return $ Api.UserResponse $ Api.User u.email token u.username u.bio u.image

registerUserHandler
  :: ( UserDB :> es
     , Crypto :> es
     , Auth :> es
     , Error S.ServerError :> es
     )
  => S.AuthResult DB.UserId
  -> Api.UserWrapper Api.NewUserRequest
  -> Eff es Api.UserResponse
registerUserHandler _ (Api.UserWrapper (Api.NewUserRequest username email pwd)) = do
  hashedPwd <- hashPassword pwd
  (newUser :: D.User) <- insertUser username email hashedPwd
  token <- generateToken newUser.userId
  return $ Api.UserResponse $ Api.User email token username Nothing Nothing
