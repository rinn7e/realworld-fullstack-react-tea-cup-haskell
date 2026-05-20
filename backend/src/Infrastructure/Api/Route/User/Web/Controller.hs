module Infrastructure.Api.Route.User.Web.Controller
  ( webUserRoute
  , getCurrentUserHandler
  , updateCurrentUserHandler
  , getUserByNameHandler
  , followUserHandler
  , unfollowUserHandler
  ) where
import Database.Persist.Sql (fromSqlKey)
import Effectful.Error.Static (throwError)
import Servant (NamedRoutes)
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Infrastructure.Api.DTO qualified as Api
import Infrastructure.Api.Route.User.Web.Type
import Infrastructure.Common.Type.App (App)
import Infrastructure.Interpreter.Real.DB.Schema.Schema qualified as DB

import Capability.Auth
import Capability.Crypto
import Capability.Database.UserDB
import Domain.Type qualified as D

webUserRoute :: S.AuthResult DB.UserId -> S.ServerT (NamedRoutes UserRoute) App
webUserRoute auth =
  UserRoute
    { getCurrentUser = getCurrentUserHandler auth
    , updateCurrentUser = updateCurrentUserHandler auth
    , getUserByName = getUserByNameHandler auth
    , followUser = followUserHandler auth
    , unfollowUser = unfollowUserHandler auth
    }

getCurrentUserHandler :: S.AuthResult DB.UserId -> App Api.UserResponse
getCurrentUserHandler (S.Authenticated uid) = do
  let dUid = D.UserId $ fromIntegral (fromSqlKey uid)
  mUser <- lookupUserById dUid
  case mUser of
    Nothing -> throwError S.err401
    Just u -> do
      token <- generateToken dUid
      return $ Api.UserResponse $ Api.User u.email token u.username u.bio u.image
getCurrentUserHandler _ = throwError S.err401

updateCurrentUserHandler
  :: S.AuthResult DB.UserId -> Api.UpdateUserRequest -> App Api.UserResponse
updateCurrentUserHandler (S.Authenticated uid) (Api.UpdateUserRequest mEmail mUsername mPassword mBio mImage) = do
  let dUid = D.UserId $ fromIntegral (fromSqlKey uid)
  mUser <- lookupUserById dUid
  case mUser of
    Nothing -> throwError S.err401
    Just u -> do
      newHashedPwd <- case mPassword of
        Just pwd -> hashPassword pwd
        Nothing -> return u.password
      let newUser =
            u
              { D.email = maybe u.email id mEmail
              , D.username = maybe u.username id mUsername
              , D.password = newHashedPwd
              , D.bio = maybe u.bio Just mBio
              , D.image = maybe u.image Just mImage
              }
      _ <- updateUser dUid newUser
      token <- generateToken dUid
      return $
        Api.UserResponse $
          Api.User newUser.email token newUser.username newUser.bio newUser.image
updateCurrentUserHandler _ _ = throwError S.err401

getUserByNameHandler :: S.AuthResult DB.UserId -> D.Username -> App Api.ProfileResponse
getUserByNameHandler auth username = do
  mUser <- lookupUserByUsername username
  case mUser of
    Nothing -> throwError S.err404{S.errBody = "User not found"}
    Just u -> do
      isFol <- case auth of
        S.Authenticated currentUid -> do
          let dCurrentUid = D.UserId $ fromIntegral (fromSqlKey currentUid)
          isFollowing dCurrentUid u.userId
        _ -> return False
      return $ Api.ProfileResponse $ Api.Profile u.username u.bio u.image isFol

followUserHandler :: S.AuthResult DB.UserId -> D.Username -> App Api.ProfileResponse
followUserHandler (S.Authenticated currentUid) username = do
  mUser <- lookupUserByUsername username
  case mUser of
    Nothing -> throwError S.err404{S.errBody = "User not found"}
    Just u -> do
      let dCurrentUid = D.UserId $ fromIntegral (fromSqlKey currentUid)
      followUser dCurrentUid u.userId
      return $ Api.ProfileResponse $ Api.Profile u.username u.bio u.image True
followUserHandler _ _ = throwError S.err401

unfollowUserHandler :: S.AuthResult DB.UserId -> D.Username -> App Api.ProfileResponse
unfollowUserHandler (S.Authenticated currentUid) username = do
  mUser <- lookupUserByUsername username
  case mUser of
    Nothing -> throwError S.err404{S.errBody = "User not found"}
    Just u -> do
      let dCurrentUid = D.UserId $ fromIntegral (fromSqlKey currentUid)
      unfollowUser dCurrentUid u.userId
      return $ Api.ProfileResponse $ Api.Profile u.username u.bio u.image False
unfollowUserHandler _ _ = throwError S.err401
