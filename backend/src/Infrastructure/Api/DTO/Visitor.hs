module Infrastructure.Api.DTO.Visitor
  ( VisitorResponse (..)
  , VisitorListResponse (..)
  , TrackVisitorRequest (..)
  , toVisitorResponse
  )
where

import Data.Aeson (FromJSON (..), ToJSON (..))
import Data.OpenApi (ToSchema (..))
import Data.Text (Text)
import Data.Time (UTCTime)
import GHC.Generics (Generic)

import Domain.Type qualified as D
import Infrastructure.Api.DTO.User (AdminUserResponse, toAdminUserResponse)

data VisitorResponse = VisitorResponse
  { id :: Int
  , ip :: Text
  , userAgent :: Text
  , path :: Text
  , timestamp :: UTCTime
  , user :: Maybe AdminUserResponse
  }
  deriving stock (Show, Generic)
  deriving anyclass (ToJSON, ToSchema)

data VisitorListResponse = VisitorListResponse
  { visitors :: [VisitorResponse]
  , totalCount :: Int
  }
  deriving stock (Show, Generic)
  deriving anyclass (ToJSON, ToSchema)

data TrackVisitorRequest = TrackVisitorRequest
  { path :: Text
  }
  deriving stock (Show, Generic)
  deriving anyclass (FromJSON, ToSchema)

-------------------------------
-- Helpers
-------------------------------
toVisitorResponse :: D.Visitor -> Maybe D.User -> VisitorResponse
toVisitorResponse v mUser =
  VisitorResponse
    { id = v.visitorId.unVisitorId
    , ip = v.ip.unVisitorIp
    , userAgent = v.userAgent.unVisitorUserAgent
    , path = v.path.unVisitorPath
    , timestamp = v.timestamp
    , user = fmap toAdminUserResponse mUser
    }

