module Capability.Database.TagDB where

import Domain.Type.Tag (TagName)
import Effectful
import Effectful.Dispatch.Dynamic

data TagDB :: Effect where
  GetTags :: TagDB m [TagName]

type instance DispatchOf TagDB = 'Dynamic

getTags :: (TagDB :> es) => Eff es [TagName]
getTags = send GetTags
