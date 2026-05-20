module Infrastructure.Api.Route.User.Admin.Controller
  ( adminUserRoute
  , getUsersHandler
  , updateUserRoleHandler
  , deleteUserHandler
  ) where

import Data.Text (pack)
import Database.Persist.Sql (fromSqlKey)
import Effectful
import Effectful.Error.Static (Error, throwError)
import Servant (NamedRoutes)
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Infrastructure.Api.DTO qualified as Api
import Infrastructure.Api.Route.User.Admin.Type
import Infrastructure.Common.Util.Guard (guardAdmin)
import Infrastructure.Interpreter.Real.DB.Schema.Schema qualified as DB

import Capability.Database.LoggerDB
import Capability.Database.UserDB
import Capability.Time
import Domain.Type qualified as D

adminUserRoute
  :: ( UserDB :> es
     , LoggerDB :> es
     , Time :> es
     , Error S.ServerError :> es
     )
  => S.AuthResult DB.UserId
  -> S.ServerT (NamedRoutes AdminUserRoute) (Eff es)
adminUserRoute auth =
  AdminUserRoute
    { getUsers = getUsersHandler auth
    , updateUserRole = updateUserRoleHandler auth
    , deleteUser = deleteUserHandler auth
    }

getUsersHandler
  :: ( UserDB :> es
     , Error S.ServerError :> es
     )
  => S.AuthResult DB.UserId
  -> Maybe Int
  -> Maybe Int
  -> Maybe D.Username
  -> Maybe D.Email
  -> Eff es Api.AdminUserListResponse
getUsersHandler (S.Authenticated uid) mLimit mOffset mUsername mEmail = do
  guardAdmin uid
  (users, total) <- listUsers mLimit mOffset mUsername mEmail
  let adminUsers = map Api.toAdminUserResponse users
  return $ Api.AdminUserListResponse adminUsers total
getUsersHandler _ _ _ _ _ = throwError S.err401

updateUserRoleHandler
  :: ( UserDB :> es
     , LoggerDB :> es
     , Time :> es
     , Error S.ServerError :> es
     )
  => S.AuthResult DB.UserId
  -> Int
  -> Api.UpdateUserRoleRequest
  -> Eff es Api.AdminUserResponse
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
      let msg =
            "Updated user role for " <> target.username.unUsername <> " to " <> pack (show req.role)
      let dUid = D.UserId $ fromIntegral (fromSqlKey uid)
      _ <- insertLog D.INFO (D.LogMessage msg) (D.LogSource "AUTH") now (Just dUid)
      return $ Api.toAdminUserResponse updatedUser
updateUserRoleHandler _ _ _ = throwError S.err401

deleteUserHandler
  :: ( UserDB :> es
     , LoggerDB :> es
     , Time :> es
     , Error S.ServerError :> es
     )
  => S.AuthResult DB.UserId
  -> Int
  -> Eff es S.NoContent
deleteUserHandler (S.Authenticated uid) targetUidInt = do
  guardAdmin uid
  let targetUid = D.UserId targetUidInt
  mTarget <- lookupUserById targetUid
  case mTarget of
    Nothing -> throwError S.err404
    Just target -> do
      now <- getCurrentTime
      deleteUser targetUid
      let msg = "Deleted user account: " <> target.username.unUsername
      let dUid = D.UserId $ fromIntegral (fromSqlKey uid)
      _ <- insertLog D.INFO (D.LogMessage msg) (D.LogSource "AUTH") now (Just dUid)
      return S.NoContent
deleteUserHandler _ _ = throwError S.err401
