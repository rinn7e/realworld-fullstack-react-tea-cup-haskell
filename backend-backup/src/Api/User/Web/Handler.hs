module Api.User.Web.Handler where

import Data.Password.Argon2 (hashPassword, mkPassword, unPasswordHash)
import Data.Text (Text)
import Database.Persist (deleteBy, get, insertBy, replace)
import Database.Persist.Sql (Entity (..))
import Effectful (liftIO)
import Effectful.Error.Static (throwError)
import Effectful.Reader.Static (ask)
import Servant (NamedRoutes)
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Api.User.Web.Type
import Common.Type.App (App, AppEnv (..))
import Common.Type.JWK (generateToken)
import DB.Schema.Type (UserId)
import DB.Schema.Type qualified as DB
import DB.Util (runDB)
import Entity.Follow.Query (isFollowing)
import Entity.User.Api
  ( Profile (..)
  , ProfileResponse (..)
  , UpdateUserRequest (..)
  , User (..)
  , UserResponse (..)
  )
import Entity.User.Query (getUserByUsername)

webUserRoute :: S.AuthResult UserId -> S.ServerT (NamedRoutes UserRoute) App
webUserRoute auth =
  UserRoute
    { getCurrentUser = getCurrentUserHandler auth
    , updateCurrentUser = updateCurrentUserHandler auth
    , getUserByName = getUserByNameHandler auth
    , followUser = followUserHandler auth
    , unfollowUser = unfollowUserHandler auth
    }

getCurrentUserHandler :: S.AuthResult UserId -> App UserResponse
getCurrentUserHandler (S.Authenticated uid) = do
  AppEnv{appJwtKey = jwtKey} <- ask
  mUser <- runDB (get uid)
  case mUser of
    Nothing -> throwError S.err401
    Just u -> do
      token <- liftIO $ generateToken jwtKey uid
      return $ UserResponse $ User u.email token u.username u.bio u.image
getCurrentUserHandler _ = throwError S.err401

updateCurrentUserHandler
  :: S.AuthResult UserId -> UpdateUserRequest -> App UserResponse
updateCurrentUserHandler (S.Authenticated uid) (UpdateUserRequest mEmail mUsername mPassword mBio mImage) = do
  AppEnv{appJwtKey = jwtKey} <- ask
  mUser <- runDB (get (uid :: UserId))
  case mUser of
    Nothing -> throwError S.err401
    Just u -> do
      newHashedPwd <- case mPassword of
        Just pwd -> liftIO $ unPasswordHash <$> hashPassword (mkPassword pwd)
        Nothing -> return u.password

      let newUser =
            DB.User
              { email = maybe u.email id mEmail
              , username = maybe u.username id mUsername
              , password = newHashedPwd
              , bio = maybe u.bio Just mBio
              , image = maybe u.image Just mImage
              , role = u.role
              }

      runDB (replace uid newUser)
      token <- liftIO $ generateToken jwtKey uid
      return $
        UserResponse $
          User newUser.email token newUser.username newUser.bio newUser.image
updateCurrentUserHandler _ _ = throwError S.err401

getUserByNameHandler :: S.AuthResult UserId -> Text -> App ProfileResponse
getUserByNameHandler auth username = do
  mUser <- runDB (getUserByUsername username)
  case mUser of
    Nothing -> throwError S.err404{S.errBody = "UserResponse not found"}
    Just (Entity uid u) -> do
      isFol <- case auth of
        S.Authenticated currentUid -> runDB (isFollowing currentUid uid)
        _ -> return False
      return $ ProfileResponse $ Profile u.username u.bio u.image isFol

followUserHandler :: S.AuthResult UserId -> Text -> App ProfileResponse
followUserHandler (S.Authenticated currentUid) username = do
  mUser <- runDB (getUserByUsername username)
  case mUser of
    Nothing -> throwError S.err404{S.errBody = "UserResponse not found"}
    Just (Entity uid u) -> do
      _ <- runDB (insertBy (DB.Follow currentUid uid))
      return $ ProfileResponse $ Profile u.username u.bio u.image True
followUserHandler _ _ = throwError S.err401

unfollowUserHandler :: S.AuthResult UserId -> Text -> App ProfileResponse
unfollowUserHandler (S.Authenticated currentUid) username = do
  mUser <- runDB (getUserByUsername username)
  case mUser of
    Nothing -> throwError S.err404{S.errBody = "UserResponse not found"}
    Just (Entity uid u) -> do
      runDB (deleteBy (DB.UniqueFollow currentUid uid))
      return $ ProfileResponse $ Profile u.username u.bio u.image False
unfollowUserHandler _ _ = throwError S.err401
