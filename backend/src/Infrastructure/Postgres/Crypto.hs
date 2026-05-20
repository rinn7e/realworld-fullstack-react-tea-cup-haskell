module Infrastructure.Postgres.Crypto
  ( runCryptoArgon2
  ) where

import Data.Password.Argon2
  ( PasswordCheck (..)
  , PasswordHash (..)
  , checkPassword
  , hashPassword
  , mkPassword
  , unPasswordHash
  )
import Data.Text (Text)
import Effectful
import Effectful.Dispatch.Dynamic

import Capability.Crypto hiding (hashPassword, verifyPassword)

runCryptoArgon2 :: (IOE :> es) => Eff (Crypto : es) a -> Eff es a
runCryptoArgon2 = interpret $ \_ -> \case
  HashPassword plain -> do
    hashed <- liftIO $ hashPassword (mkPassword plain)
    return (unPasswordHash hashed)
  VerifyPassword plain hash -> do
    let result = checkPassword (mkPassword plain) (PasswordHash hash)
    case result of
      PasswordCheckSuccess -> return True
      PasswordCheckFail -> return False
