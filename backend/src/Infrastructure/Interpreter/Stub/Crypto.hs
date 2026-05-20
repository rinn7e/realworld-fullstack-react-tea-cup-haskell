module Infrastructure.Interpreter.Stub.Crypto
  ( runCryptoStub
  ) where

import Effectful
import Effectful.Dispatch.Dynamic

import Capability.Crypto

runCryptoStub :: Eff (Crypto : es) a -> Eff es a
runCryptoStub = interpret $ \_ -> \case
  HashPassword plain -> pure $ "mock_hash_" <> plain
  VerifyPassword plain hash -> pure $ hash == "mock_hash_" <> plain
