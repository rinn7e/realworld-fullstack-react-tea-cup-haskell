module Capability.Database.MetadataDB where

import Effectful
import Effectful.Dispatch.Dynamic

data MetadataDB :: Effect where
  GetLastRanMigration :: MetadataDB m (Maybe Int)

type instance DispatchOf MetadataDB = 'Dynamic

getLastRanMigration :: (MetadataDB :> es) => Eff es (Maybe Int)
getLastRanMigration = send GetLastRanMigration
