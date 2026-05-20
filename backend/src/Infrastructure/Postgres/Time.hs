module Infrastructure.Postgres.Time
  ( runTimeIO
  ) where

import Data.Time (getCurrentTime)
import Effectful
import Effectful.Dispatch.Dynamic

import Capability.Time hiding (getCurrentTime)

runTimeIO :: (IOE :> es) => Eff (Time : es) a -> Eff es a
runTimeIO = interpret $ \_ -> \case
  GetCurrentTime -> liftIO getCurrentTime
