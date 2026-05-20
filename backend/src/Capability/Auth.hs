module Capability.Auth where

import Data.Text (Text)
import Effectful
import Effectful.Dispatch.Dynamic
import Infrastructure.Postgres.Schema (UserId)

data Auth :: Effect where
  GenerateToken :: UserId -> Auth m Text

type instance DispatchOf Auth = 'Dynamic

generateToken :: (Auth :> es) => UserId -> Eff es Text
generateToken uid = send (GenerateToken uid)
