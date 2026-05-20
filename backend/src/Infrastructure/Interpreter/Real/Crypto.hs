module Infrastructure.Interpreter.Real.Crypto
  ( runCryptoArgon2
  ) where

import Data.Password.Argon2 qualified as Argon2
import Domain.Type.User (Password (..), PasswordHashed (..))
import Effectful
import Effectful.Dispatch.Dynamic

import Capability.Crypto hiding (hashPassword, verifyPassword)

toPasswordHashed :: Argon2.PasswordHash a -> PasswordHashed
toPasswordHashed = PasswordHashed . Argon2.unPasswordHash

fromPasswordHashed :: PasswordHashed -> Argon2.PasswordHash a
fromPasswordHashed hash = Argon2.PasswordHash hash.unPasswordHashed

runCryptoArgon2 :: (IOE :> es) => Eff (Crypto : es) a -> Eff es a
runCryptoArgon2 = interpret $ \_ -> \case
  HashPassword plain -> do
    hashed <- liftIO $ Argon2.hashPassword (Argon2.mkPassword plain.unPassword)
    return (toPasswordHashed hashed)
  VerifyPassword plain hash -> do
    let result = Argon2.checkPassword (Argon2.mkPassword plain.unPassword) (fromPasswordHashed hash)
    case result of
      Argon2.PasswordCheckSuccess -> return True
      Argon2.PasswordCheckFail -> return False
