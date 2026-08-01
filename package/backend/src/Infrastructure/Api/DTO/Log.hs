module Infrastructure.Api.DTO.Log
  ( LogLevel (..)
  , LogResponse (..)
  , LogListResponse (..)
  , toLogResponse
  )
where

import Control.Lens ((&), (?~))
import Data.Aeson (FromJSON (..), ToJSON (..))
import Data.Aeson qualified as A
import Data.OpenApi
  ( NamedSchema (..)
  , OpenApiType (..)
  , ToParamSchema (..)
  , ToSchema (..)
  , type_
  )
import Data.Text (Text)
import Data.Time (UTCTime)
import GHC.Generics (Generic)
import Web.HttpApiData (FromHttpApiData (..))

import Domain.Type (LogLevel (..))
import Domain.Type qualified as D
import Infrastructure.Api.DTO.Instance ()

data LogResponse = LogResponse
  { id :: Int
  , level :: D.LogLevel
  , message :: D.LogMessage
  , source :: D.LogSource
  , timestamp :: UTCTime
  , userId :: Maybe D.UserId
  }
  deriving stock (Show, Generic)
  deriving anyclass (ToJSON, ToSchema)

data LogListResponse = LogListResponse
  { logs :: [LogResponse]
  , totalCount :: Int
  }
  deriving stock (Show, Generic)
  deriving anyclass (ToJSON, ToSchema)

-------------------------------
-- Helpers
-------------------------------
toLogResponse :: D.LogEntry -> LogResponse
toLogResponse l =
  LogResponse
    { id = l.logId.unLogId
    , level = l.level
    , message = l.message
    , source = l.source
    , timestamp = l.timestamp
    , userId = l.userId
    }
