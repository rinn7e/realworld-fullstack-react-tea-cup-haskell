module Infrastructure.Api.Auth.Admin.Controller
  ( adminAuthRoute
  , loginAdminHandler
  , getCurrentAdminHandler
  ) where

import Database.Persist.Sql (fromSqlKey)
import Effectful.Error.Static (throwError)
import Servant (NamedRoutes)
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Domain.User qualified as D
import Infrastructure.Api.Auth.Admin.Type
import Infrastructure.Entity.User.DTO
  ( LoginUserRequest (..)
  , User (..)
  , UserResponse (..)
  )
import Infrastructure.Common.Type.App (App)
import Infrastructure.Common.Util.Guard (guardAdmin)
import Infrastructure.Interpreter.Real.DB.Schema.Schema qualified as DB

import Capability.Auth
import Capability.Crypto
import Capability.Database.UserDB

adminAuthRoute :: S.AuthResult DB.UserId -> S.ServerT (NamedRoutes AdminAuthRoute) App
adminAuthRoute auth =
  AdminAuthRoute
    { loginAdmin = loginAdminHandler auth
    , getCurrentAdmin = getCurrentAdminHandler auth
    }

loginAdminHandler :: S.AuthResult DB.UserId -> LoginUserRequest -> App UserResponse
loginAdminHandler _ (LoginUserRequest email pwd) = do
  mUser <- lookupUserByEmail email
  case mUser of
    Nothing -> throwError S.err401{S.errBody = "Invalid email or password"}
    Just (u :: D.User) -> do
      ok <- verifyPassword pwd u.password
      if not ok
        then throwError S.err401{S.errBody = "Invalid email or password"}
        else do
          if u.role /= "Admin"
            then throwError S.err403{S.errBody = "Access Denied: Administrator role required"}
            else do
              token <- generateToken u.userId
              return $ UserResponse $ User u.email token u.username u.bio u.image

getCurrentAdminHandler :: S.AuthResult DB.UserId -> App UserResponse
getCurrentAdminHandler (S.Authenticated uid) = do
  guardAdmin uid
  let dUid = D.UserId $ fromIntegral (fromSqlKey uid)
  mUser <- lookupUserById dUid
  case mUser of
    Nothing -> throwError S.err401
    Just (u :: D.User) -> do
      token <- generateToken dUid
      return $ UserResponse $ User u.email token u.username u.bio u.image
getCurrentAdminHandler _ = throwError S.err401
