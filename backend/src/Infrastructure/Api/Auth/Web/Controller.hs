module Infrastructure.Api.Auth.Web.Controller
  ( webAuthRoute
  , loginUserHandler
  , registerUserHandler
  ) where

import Effectful.Error.Static (throwError)
import Servant (NamedRoutes)
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Domain.User qualified as D
import Infrastructure.Api.Auth.Web.Type
import Infrastructure.Entity.User.DTO
  ( LoginUserRequest (..)
  , NewUserRequest (..)
  , User (..)
  , UserResponse (..)
  )
import Infrastructure.Common.Type.App (App)
import Infrastructure.Interpreter.Real.DB.Schema.Schema qualified as DB

import Capability.Auth
import Capability.Crypto
import Capability.Database.UserDB

webAuthRoute :: S.AuthResult DB.UserId -> S.ServerT (NamedRoutes AuthRoute) App
webAuthRoute auth =
  AuthRoute
    { loginUser = loginUserHandler auth
    , registerUser = registerUserHandler auth
    }

loginUserHandler :: S.AuthResult DB.UserId -> LoginUserRequest -> App UserResponse
loginUserHandler _ (LoginUserRequest email pwd) = do
  mUser <- lookupUserByEmail email
  case mUser of
    Nothing -> throwError S.err401{S.errBody = "Invalid email or password"}
    Just (u :: D.User) -> do
      ok <- verifyPassword pwd u.password
      if not ok
        then throwError S.err401{S.errBody = "Invalid email or password"}
        else do
          token <- generateToken u.userId
          return $ UserResponse $ User u.email token u.username u.bio u.image

registerUserHandler :: S.AuthResult DB.UserId -> NewUserRequest -> App UserResponse
registerUserHandler _ (NewUserRequest username email pwd) = do
  hashedPwd <- hashPassword pwd
  (newUser :: D.User) <- insertUser username email hashedPwd
  token <- generateToken newUser.userId
  return $ UserResponse $ User email token username Nothing Nothing
