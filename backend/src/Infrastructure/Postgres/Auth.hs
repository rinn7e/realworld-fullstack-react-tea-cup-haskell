module Infrastructure.Postgres.Auth
  ( runAuthJWT
  ) where

import Crypto.JWT (JWK)
import Data.Text (Text)
import Effectful
import Effectful.Dispatch.Dynamic
import Effectful.Reader.Static

import Capability.Auth hiding (generateToken)
import Infrastructure.Common.Type.JWK qualified as JWK

runAuthJWT :: (IOE :> es, Reader JWK :> es) => Eff (Auth : es) a -> Eff es a
runAuthJWT = interpret $ \_ -> \case
  GenerateToken uid -> do
    jwtKey <- ask @JWK
    liftIO $ JWK.generateToken jwtKey uid
