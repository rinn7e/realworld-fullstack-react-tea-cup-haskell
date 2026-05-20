module Infrastructure.Api.DTO.Visitor
  ( VisitorResponse (..)
  , VisitorListResponse (..)
  , toVisitorResponse
  )
where

import Data.Aeson (ToJSON (..))
import Data.OpenApi (ToSchema (..))
import Data.Text (Text)
import Data.Time (UTCTime)
import GHC.Generics (Generic)

import Domain.Type qualified as D

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

-------------------------------
-- Helpers
-------------------------------
toVisitorResponse :: D.Visitor -> VisitorResponse
toVisitorResponse v =
  VisitorResponse
    { id = v.visitorId.unVisitorId
    , ip = v.ip.unVisitorIp
    , userAgent = v.userAgent.unVisitorUserAgent
    , path = v.path.unVisitorPath
    , timestamp = v.timestamp
    }
