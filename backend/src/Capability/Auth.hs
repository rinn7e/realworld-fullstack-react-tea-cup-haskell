module Capability.Auth where

import Data.Text (Text)
import Domain.User (UserId)
import Effectful
import Effectful.Dispatch.Dynamic

data Auth :: Effect where
  GenerateToken :: UserId -> Auth m Text

type instance DispatchOf Auth = 'Dynamic

generateToken :: (Auth :> es) => UserId -> Eff es Text
generateToken uid = send (GenerateToken uid)
