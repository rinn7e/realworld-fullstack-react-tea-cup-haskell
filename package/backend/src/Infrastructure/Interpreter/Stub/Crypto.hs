module Infrastructure.Interpreter.Stub.Crypto
  ( runCryptoStub
  ) where

import Domain.Type.User (Password (..), PasswordHashed (..))
import Effectful
import Effectful.Dispatch.Dynamic

import Capability.Crypto

runCryptoStub :: Eff (Crypto : es) a -> Eff es a
runCryptoStub = interpret $ \_ -> \case
  HashPassword plain -> pure $ PasswordHashed ("mock_hash_" <> plain.unPassword)
  VerifyPassword plain hash -> pure $ hash.unPasswordHashed == "mock_hash_" <> plain.unPassword
