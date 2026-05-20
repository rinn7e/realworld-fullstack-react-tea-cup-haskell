module Infrastructure.Common.Type.Metadata where

import Data.Aeson (ToJSON (..))
import Data.Aeson qualified as A
import Data.OpenApi (ToSchema)
import Data.Text (Text)
import GHC.Generics (Generic)

-------------------------------
-- MetadataResponse
-------------------------------
data MetadataResponse = MetadataResponse
  { appVersion :: Text
  , lastCommitHash :: Text
  , lastRanMigration :: Maybe Int
  }
  deriving (Show, Generic, ToSchema)

instance ToJSON MetadataResponse where
  toJSON = A.genericToJSON A.defaultOptions
