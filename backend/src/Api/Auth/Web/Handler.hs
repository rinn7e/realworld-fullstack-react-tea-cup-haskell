module Api.Auth.Web.Handler where

import Data.Password.Argon2
  ( PasswordCheck (..)
  , PasswordHash (..)
  , checkPassword
  , hashPassword
  , mkPassword
  , unPasswordHash
  )
import Database.Persist (Entity (..), insert)
import Effectful (liftIO)
import Effectful.Error.Static (throwError)
import Effectful.Reader.Static (ask)
import Servant (NamedRoutes)
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Api.Auth.Web.Type
import Common.Type.App (App, AppEnv (..))
import Common.Type.JWK (generateToken)
import DB.Schema.Type (UserId)
import DB.Schema.Type qualified as DB
import DB.Util (runDB)
import Entity.User.Api
  ( LoginUserRequest (..)
  , NewUserRequest (..)
  , User (..)
  , UserResponse (..)
  )
import Entity.User.Query (getUserByEmail)

webAuthRoute :: S.AuthResult UserId -> S.ServerT (NamedRoutes AuthRoute) App
webAuthRoute auth =
  AuthRoute
    { loginUser = loginUserHandler auth
    , registerUser = registerUserHandler auth
    }

loginUserHandler :: S.AuthResult UserId -> LoginUserRequest -> App UserResponse
loginUserHandler _ (LoginUserRequest email pwd) = do
  AppEnv{appJwtKey = jwtKey} <- ask
  mUser <- runDB (getUserByEmail email)
  case mUser of
    Nothing -> throwError S.err401{S.errBody = "Invalid email or password"}
    Just (Entity uid u) -> do
      case checkPassword (mkPassword pwd) (PasswordHash u.password) of
        PasswordCheckSuccess -> do
          token <- liftIO $ generateToken jwtKey uid
          return $ UserResponse $ User u.email token u.username u.bio u.image
        PasswordCheckFail -> throwError S.err401{S.errBody = "Invalid email or password"}

registerUserHandler :: S.AuthResult UserId -> NewUserRequest -> App UserResponse
registerUserHandler _ (NewUserRequest username email pwd) = do
  AppEnv{appJwtKey = jwtKey} <- ask
  hashedPwd <- liftIO $ hashPassword (mkPassword pwd)
  uid <-
    runDB $ insert $ DB.User username email (unPasswordHash hashedPwd) Nothing Nothing "User"
  token <- liftIO $ generateToken jwtKey uid
  return $ UserResponse $ User email token username Nothing Nothing
