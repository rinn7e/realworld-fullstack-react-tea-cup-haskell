module Infrastructure.Interpreter.Real.Auth
  ( runAuthJWT
  ) where

import Crypto.JWT (JWK)
import Domain.Type (UserId (..))
import Effectful
import Effectful.Dispatch.Dynamic
import Effectful.Reader.Static

import Capability.Auth hiding (generateToken)
import Infrastructure.Common.Type.JWK qualified as JWK

import Database.Persist.Sql (toSqlKey)

runAuthJWT :: (IOE :> es, Reader JWK :> es) => Eff (Auth : es) a -> Eff es a
runAuthJWT = interpret $ \_ -> \case
  GenerateToken (UserId uidInt) -> do
    jwtKey <- ask @JWK
    let uid = toSqlKey (fromIntegral uidInt)
    liftIO $ JWK.generateToken jwtKey uid
