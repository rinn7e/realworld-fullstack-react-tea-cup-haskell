module Infrastructure.Controllers.User
  ( webUserRoute
  , adminUserRoute
  , getCurrentUserHandler
  , updateCurrentUserHandler
  , getUserByNameHandler
  , followUserHandler
  , unfollowUserHandler
  , getUsersHandler
  , updateUserRoleHandler
  , deleteUserHandler
  ) where

import Data.Text (Text)
import Database.Persist.Sql (fromSqlKey)
import Effectful
import Effectful.Error.Static (throwError)
import Effectful.Reader.Static (ask)
import Servant (NamedRoutes)
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Infrastructure.Api.User.Admin.Type
import Infrastructure.Api.User.DTO
  ( AdminUserListResponse (..)
  , AdminUserResponse (..)
  , Profile (..)
  , ProfileResponse (..)
  , UpdateUserRequest (..)
  , UpdateUserRoleRequest (..)
  , User (..)
  , UserResponse (..)
  )
import Infrastructure.Api.User.Web.Type
import Infrastructure.Common.Type.App (App, AppEnv (..))
import Infrastructure.Common.Util.Guard (guardAdmin)
import Infrastructure.Interpreter.DB.Postgres.Schema.Schema (UserId)

import Capability.Auth
import Capability.Crypto
import Capability.Database.LoggerDB
import Capability.Database.UserDB
import Capability.Time
import Domain.User qualified as D

webUserRoute :: S.AuthResult UserId -> S.ServerT (NamedRoutes UserRoute) App
webUserRoute auth =
  UserRoute
    { getCurrentUser = getCurrentUserHandler auth
    , updateCurrentUser = updateCurrentUserHandler auth
    , getUserByName = getUserByNameHandler auth
    , followUser = followUserHandler auth
    , unfollowUser = unfollowUserHandler auth
    }

adminUserRoute :: S.AuthResult UserId -> S.ServerT (NamedRoutes AdminUserRoute) App
adminUserRoute auth =
  AdminUserRoute
    { getUsers = getUsersHandler auth
    , updateUserRole = updateUserRoleHandler auth
    , deleteUser = deleteUserHandler auth
    }

getCurrentUserHandler :: S.AuthResult UserId -> App UserResponse
getCurrentUserHandler (S.Authenticated uid) = do
  let uidInt = fromIntegral (fromSqlKey uid)
  mUser <- lookupUserById uidInt
  case mUser of
    Nothing -> throwError S.err401
    Just u -> do
      token <- generateToken uid
      return $ UserResponse $ User u.email token u.username u.bio u.image
getCurrentUserHandler _ = throwError S.err401

updateCurrentUserHandler :: S.AuthResult UserId -> UpdateUserRequest -> App UserResponse
updateCurrentUserHandler (S.Authenticated uid) (UpdateUserRequest mEmail mUsername mPassword mBio mImage) = do
  let uidInt = fromIntegral (fromSqlKey uid)
  mUser <- lookupUserById uidInt
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
      _ <- updateUser uidInt newUser
      token <- generateToken uid
      return $
        UserResponse $
          User newUser.email token newUser.username newUser.bio newUser.image
updateCurrentUserHandler _ _ = throwError S.err401

getUserByNameHandler :: S.AuthResult UserId -> Text -> App ProfileResponse
getUserByNameHandler auth username = do
  mUser <- lookupUserByUsername username
  case mUser of
    Nothing -> throwError S.err404{S.errBody = "User not found"}
    Just u -> do
      isFol <- case auth of
        S.Authenticated currentUid -> do
          let currentUidInt = fromIntegral (fromSqlKey currentUid)
          isFollowing currentUidInt u.userId
        _ -> return False
      return $ ProfileResponse $ Profile u.username u.bio u.image isFol

followUserHandler :: S.AuthResult UserId -> Text -> App ProfileResponse
followUserHandler (S.Authenticated currentUid) username = do
  mUser <- lookupUserByUsername username
  case mUser of
    Nothing -> throwError S.err404{S.errBody = "User not found"}
    Just u -> do
      let currentUidInt = fromIntegral (fromSqlKey currentUid)
      followUser currentUidInt u.userId
      return $ ProfileResponse $ Profile u.username u.bio u.image True
followUserHandler _ _ = throwError S.err401

unfollowUserHandler :: S.AuthResult UserId -> Text -> App ProfileResponse
unfollowUserHandler (S.Authenticated currentUid) username = do
  mUser <- lookupUserByUsername username
  case mUser of
    Nothing -> throwError S.err404{S.errBody = "User not found"}
    Just u -> do
      let currentUidInt = fromIntegral (fromSqlKey currentUid)
      unfollowUser currentUidInt u.userId
      return $ ProfileResponse $ Profile u.username u.bio u.image False
unfollowUserHandler _ _ = throwError S.err401

toAdminUserResponse :: D.User -> AdminUserResponse
toAdminUserResponse u =
  AdminUserResponse
    { id = u.userId
    , username = u.username
    , email = u.email
    , bio = u.bio
    , image = u.image
    , role = u.role
    }

getUsersHandler
  :: S.AuthResult UserId
  -> Maybe Int
  -> Maybe Int
  -> Maybe Text
  -> Maybe Text
  -> App AdminUserListResponse
getUsersHandler (S.Authenticated uid) mLimit mOffset mUsername mEmail = do
  guardAdmin uid
  (users, total) <- listUsers mLimit mOffset mUsername mEmail
  let adminUsers = map toAdminUserResponse users
  return $ AdminUserListResponse adminUsers total
getUsersHandler _ _ _ _ _ = throwError S.err401

updateUserRoleHandler
  :: S.AuthResult UserId -> Int -> UpdateUserRoleRequest -> App AdminUserResponse
updateUserRoleHandler (S.Authenticated uid) targetUidInt req = do
  guardAdmin uid
  mTarget <- lookupUserById targetUidInt
  case mTarget of
    Nothing -> throwError S.err404
    Just target -> do
      now <- getCurrentTime
      let updatedUser = target{D.role = req.role}
      _ <- updateUser targetUidInt updatedUser
      let msg = "Updated user role for " <> target.username <> " to " <> req.role
      _ <- insertLog "INFO" msg "AUTH" now (Just (fromIntegral (fromSqlKey uid)))
      return $ toAdminUserResponse updatedUser
updateUserRoleHandler _ _ _ = throwError S.err401

deleteUserHandler :: S.AuthResult UserId -> Int -> App S.NoContent
deleteUserHandler (S.Authenticated uid) targetUidInt = do
  guardAdmin uid
  mTarget <- lookupUserById targetUidInt
  case mTarget of
    Nothing -> throwError S.err404
    Just target -> do
      now <- getCurrentTime
      deleteUser targetUidInt
      let msg = "Deleted user account: " <> target.username
      _ <- insertLog "INFO" msg "AUTH" now (Just (fromIntegral (fromSqlKey uid)))
      return S.NoContent
deleteUserHandler _ _ = throwError S.err401
