module Infrastructure.Common.Util.Guard where

import Database.Persist (get)
import Effectful.Error.Static (throwError)
import Servant qualified as S

import Infrastructure.Common.Type.App (App)
import Infrastructure.Interpreter.Real.DB.Schema.Schema (User (..), UserId)
import Infrastructure.Interpreter.Real.DB.Util.Util (runDB)

{- | Secure verification guard.
Queries the user database profile and throws 403 Forbidden if their role is not exactly "Admin".
-}
guardAdmin :: UserId -> App ()
guardAdmin uid = do
  mUser <- runDB (get uid)
  case mUser of
    Just u | u.role == "Admin" -> return ()
    _ -> throwError S.err403{S.errBody = "Forbidden: Administrator role required"}
