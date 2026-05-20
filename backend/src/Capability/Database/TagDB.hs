module Capability.Database.TagDB where

import Data.Text (Text)
import Effectful
import Effectful.Dispatch.Dynamic

data TagDB :: Effect where
  GetTags :: TagDB m [Text]

type instance DispatchOf TagDB = 'Dynamic

getTags :: (TagDB :> es) => Eff es [Text]
getTags = send GetTags
