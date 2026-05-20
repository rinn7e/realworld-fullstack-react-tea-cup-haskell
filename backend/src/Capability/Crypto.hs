module Capability.Crypto where

import Data.Text (Text)
import Domain.Type.User (Password (..), PasswordHashed (..))
import Effectful
import Effectful.Dispatch.Dynamic

data Crypto :: Effect where
  HashPassword :: Password -> Crypto m PasswordHashed
  VerifyPassword :: Password -> PasswordHashed -> Crypto m Bool

type instance DispatchOf Crypto = 'Dynamic

hashPassword :: (Crypto :> es) => Password -> Eff es PasswordHashed
hashPassword plain = send (HashPassword plain)

verifyPassword :: (Crypto :> es) => Password -> PasswordHashed -> Eff es Bool
verifyPassword plain hash = send (VerifyPassword plain hash)
