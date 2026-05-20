module Infrastructure.Interpreter.Stub.Auth
  ( runAuthStub
  ) where

import Data.Text qualified as T
import Database.Persist.Sql (fromSqlKey)
import Domain.User (UserId (..))
import Effectful
import Effectful.Dispatch.Dynamic

import Capability.Auth

runAuthStub :: Eff (Auth : es) a -> Eff es a
runAuthStub = interpret $ \_ -> \case
  GenerateToken (UserId uidInt) -> pure $ "mock_token_" <> T.pack (show uidInt)
