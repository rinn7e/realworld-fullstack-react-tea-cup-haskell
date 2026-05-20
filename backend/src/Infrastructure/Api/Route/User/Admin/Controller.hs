module Infrastructure.Api.Route.User.Admin.Controller
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

import Infrastructure.Api.DTO.User
  ( AdminUserListResponse (..)
  , AdminUserResponse (..)
  , UpdateUserRoleRequest (..)
  )
import Infrastructure.Api.Route.User.Admin.Type
import Infrastructure.Common.Type.App (App)
import Infrastructure.Common.Util.Guard (guardAdmin)
import Infrastructure.Interpreter.Real.DB.Schema.Schema qualified as DB

import Capability.Auth
import Capability.Database.LoggerDB
import Capability.Database.UserDB
import Capability.Time
import Domain.User qualified as D

adminUserRoute :: S.AuthResult DB.UserId -> S.ServerT (NamedRoutes AdminUserRoute) App
adminUserRoute auth =
  AdminUserRoute
    { getUsers = getUsersHandler auth
    , updateUserRole = updateUserRoleHandler auth
    , deleteUser = deleteUserHandler auth
    }

toAdminUserResponse :: D.User -> AdminUserResponse
toAdminUserResponse u =
  AdminUserResponse
    { id = u.userId.unUserId
    , username = u.username
    , email = u.email
    , bio = u.bio
    , image = u.image
    , role = u.role
    }

getUsersHandler
  :: S.AuthResult DB.UserId
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
  :: S.AuthResult DB.UserId -> Int -> UpdateUserRoleRequest -> App AdminUserResponse
updateUserRoleHandler (S.Authenticated uid) targetUidInt req = do
  guardAdmin uid
  let targetUid = D.UserId targetUidInt
  mTarget <- lookupUserById targetUid
  case mTarget of
    Nothing -> throwError S.err404
    Just target -> do
      now <- getCurrentTime
      let updatedUser = target{D.role = req.role}
      _ <- updateUser targetUid updatedUser
      let msg = "Updated user role for " <> target.username <> " to " <> req.role
      let dUid = D.UserId $ fromIntegral (fromSqlKey uid)
      _ <- insertLog "INFO" msg "AUTH" now (Just dUid)
      return $ toAdminUserResponse updatedUser
updateUserRoleHandler _ _ _ = throwError S.err401

deleteUserHandler :: S.AuthResult DB.UserId -> Int -> App S.NoContent
deleteUserHandler (S.Authenticated uid) targetUidInt = do
  guardAdmin uid
  let targetUid = D.UserId targetUidInt
  mTarget <- lookupUserById targetUid
  case mTarget of
    Nothing -> throwError S.err404
    Just target -> do
      now <- getCurrentTime
      deleteUser targetUid
      let msg = "Deleted user account: " <> target.username
      let dUid = D.UserId $ fromIntegral (fromSqlKey uid)
      _ <- insertLog "INFO" msg "AUTH" now (Just dUid)
      return S.NoContent
deleteUserHandler _ _ = throwError S.err401
