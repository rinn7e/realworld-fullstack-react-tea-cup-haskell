module Capability.Time where

import Data.Time (UTCTime)
import Effectful
import Effectful.Dispatch.Dynamic

data Time :: Effect where
  GetCurrentTime :: Time m UTCTime

type instance DispatchOf Time = 'Dynamic

getCurrentTime :: (Time :> es) => Eff es UTCTime
getCurrentTime = send GetCurrentTime
