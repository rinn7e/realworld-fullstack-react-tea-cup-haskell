module Infrastructure.Common.Util.Guard where

import Database.Persist.Sql (fromSqlKey)
import Effectful
import Effectful.Error.Static (Error, throwError)
import Servant qualified as S

import Capability.Database.UserDB (UserDB, lookupUserById)
import Domain.Type.User (User (..), UserId (..), UserRole (..))
import Infrastructure.Interpreter.Real.DB.Schema.Schema qualified as DB

{- | Secure verification guard.
Queries the user database profile and throws 403 Forbidden if their role is not AdminRole.
-}
guardAdmin :: (UserDB :> es, Error S.ServerError :> es) => DB.UserId -> Eff es ()
guardAdmin uid = do
  let dUid = UserId $ fromIntegral (fromSqlKey uid)
  mUser <- lookupUserById dUid
  case mUser of
    Just u | u.role == AdminRole -> return ()
    _ -> throwError S.err403{S.errBody = "Forbidden: Administrator role required"}
