module Capability.Crypto where

import Data.Text (Text)
import Effectful
import Effectful.Dispatch.Dynamic

data Crypto :: Effect where
  HashPassword :: Text -> Crypto m Text
  VerifyPassword :: Text -> Text -> Crypto m Bool -- plain, hash

type instance DispatchOf Crypto = 'Dynamic

hashPassword :: (Crypto :> es) => Text -> Eff es Text
hashPassword plain = send (HashPassword plain)

verifyPassword :: (Crypto :> es) => Text -> Text -> Eff es Bool
verifyPassword plain hash = send (VerifyPassword plain hash)
