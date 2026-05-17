module Entity.Visitor.Api where

import Data.Aeson (ToJSON (..))
import Data.Aeson qualified as A
import Data.OpenApi (ToSchema (..))
import Data.Text (Text)
import Data.Time (UTCTime)
import GHC.Generics (Generic)

data VisitorResponse = VisitorResponse
  { id :: Int
  , ip :: Text
  , userAgent :: Text
  , path :: Text
  , timestamp :: UTCTime
  }
  deriving stock (Show, Generic)
  deriving anyclass (ToJSON, ToSchema)

data VisitorListResponse = VisitorListResponse
  { visitors :: [VisitorResponse]
  , totalCount :: Int
  }
  deriving stock (Show, Generic)
  deriving anyclass (ToJSON, ToSchema)
