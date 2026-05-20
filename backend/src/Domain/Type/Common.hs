module Domain.Type.Common where

import Data.Aeson (FromJSON, ToJSON)
import GHC.Generics (Generic)
import Web.HttpApiData (FromHttpApiData, ToHttpApiData)

newtype Limit = Limit {unLimit :: Int}
  deriving stock (Eq, Ord, Show, Generic)
  deriving newtype (Num, ToJSON, FromJSON, ToHttpApiData, FromHttpApiData)

newtype Offset = Offset {unOffset :: Int}
  deriving stock (Eq, Ord, Show, Generic)
  deriving newtype (Num, ToJSON, FromJSON, ToHttpApiData, FromHttpApiData)
