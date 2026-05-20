module Infrastructure.Api.User.Admin.Controller
  ( adminUserRoute
  , getUsersHandler
  , updateUserRoleHandler
  , deleteUserHandler
  ) where

import Data.Text (Text)
import Database.Persist.Sql (fromSqlKey)
import Effectful.Error.Static (throwError)
import Servant (NamedRoutes)
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Infrastructure.Entity.User.DTO
  ( AdminUserListResponse (..)
  , AdminUserResponse (..)
  , UpdateUserRoleRequest (..)
  )
import Infrastructure.Api.User.Admin.Type
import Infrastructure.Common.Type.App (App)
import Infrastructure.Common.Util.Guard (guardAdmin)
import Infrastructure.Interpreter.Real.DB.Schema.Schema (UserId)

import Capability.Database.LoggerDB
import Capability.Database.UserDB
import Capability.Time
import Domain.User qualified as D

adminUserRoute :: S.AuthResult UserId -> S.ServerT (NamedRoutes AdminUserRoute) App
adminUserRoute auth =
  AdminUserRoute
    { getUsers = getUsersHandler auth
    , updateUserRole = updateUserRoleHandler auth
    , deleteUser = deleteUserHandler auth
    }

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
