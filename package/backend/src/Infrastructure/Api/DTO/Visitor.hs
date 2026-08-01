module Infrastructure.Api.DTO.Visitor
  ( AdminVisitorResponse (..)
  , VisitorListResponse (..)
  , TrackVisitorRequest (..)
  , toAdminVisitorResponse
  )
where

import Data.Aeson (FromJSON (..), ToJSON (..))
import Data.OpenApi (ToSchema (..))
import Data.Text (Text)
import Data.Time (UTCTime)
import GHC.Generics (Generic)

import Domain.Type qualified as D
import Infrastructure.Api.DTO.User (AdminUserResponse, toAdminUserResponse)

data AdminVisitorResponse = AdminVisitorResponse
  { id :: Int
  , ip :: Text
  , userAgent :: Text
  , path :: Text
  , fingerprint :: Text
  , timestamp :: UTCTime
  , user :: Maybe AdminUserResponse
  }
  deriving stock (Show, Generic)
  deriving anyclass (ToJSON, ToSchema)

data VisitorListResponse = VisitorListResponse
  { visitors :: [AdminVisitorResponse]
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
toAdminVisitorResponse :: D.Visitor -> Maybe D.User -> AdminVisitorResponse
toAdminVisitorResponse v mUser =
  AdminVisitorResponse
    { id = v.visitorId.unVisitorId
    , ip = v.ip.unVisitorIp
    , userAgent = v.userAgent.unVisitorUserAgent
    , path = v.path.unVisitorPath
    , fingerprint = v.fingerprint.unVisitorFp
    , timestamp = v.timestamp
    , user = fmap toAdminUserResponse mUser
    }

