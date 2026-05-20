module Domain.Type.Tag where

import Data.Aeson (FromJSON, ToJSON)
import Data.Text (Text)
import GHC.Generics (Generic)
import Web.HttpApiData (FromHttpApiData, ToHttpApiData)

newtype TagId = TagId {unTagId :: Int}
  deriving stock (Eq, Ord, Show, Generic)
  deriving newtype (Num, ToJSON, FromJSON, ToHttpApiData, FromHttpApiData)

data Tag = Tag
  { tagId :: TagId
  , name :: Text
  }
  deriving stock (Eq, Show, Generic)
