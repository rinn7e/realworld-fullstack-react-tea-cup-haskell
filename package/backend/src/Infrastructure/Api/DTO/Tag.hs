module Infrastructure.Api.DTO.Tag where

import Data.Aeson (ToJSON (..), (.=))
import Data.Aeson qualified as A
import Data.OpenApi (ToSchema)
import Domain.Type qualified as D
import GHC.Generics (Generic)
import Infrastructure.Api.DTO.Instance ()

-------------------------------
-- TagListResponse
-------------------------------
data TagListResponse = TagListResponse
  { tags :: [D.TagName]
  }
  deriving (Show, Generic, ToSchema)

instance ToJSON TagListResponse where
  toJSON (TagListResponse ts) = A.object ["tags" .= ts]
