module Infrastructure.Api.DTO.Log
  ( LogLevel (..)
  , LogResponse (..)
  , LogListResponse (..)
  , logLevelToText
  , logLevelFromText
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

import Domain.Type qualified as D

data LogLevel = INFO | WARNING | ERROR | DEBUG
  deriving stock (Show, Eq, Generic)

logLevelToText :: LogLevel -> Text
logLevelToText INFO = "INFO"
logLevelToText WARNING = "WARNING"
logLevelToText ERROR = "ERROR"
logLevelToText DEBUG = "DEBUG"

logLevelFromText :: Text -> LogLevel
logLevelFromText "INFO" = INFO
logLevelFromText "WARNING" = WARNING
logLevelFromText "ERROR" = ERROR
logLevelFromText "DEBUG" = DEBUG
logLevelFromText _ = INFO

instance ToJSON LogLevel where
  toJSON = A.String . logLevelToText

instance FromJSON LogLevel where
  parseJSON = A.withText "LogLevel" $ \t -> return $ logLevelFromText t

instance ToSchema LogLevel where
  declareNamedSchema _ = do
    return $
      NamedSchema (Just "LogLevel") $
        mempty
          & type_ ?~ OpenApiString

instance ToParamSchema LogLevel where
  toParamSchema _ =
    mempty
      & type_ ?~ OpenApiString

instance FromHttpApiData LogLevel where
  parseQueryParam t = Right $ logLevelFromText t

data LogResponse = LogResponse
  { id :: Int
  , level :: LogLevel
  , message :: Text
  , source :: Text
  , timestamp :: UTCTime
  , userId :: Maybe Int
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
    , level = logLevelFromText l.level
    , message = l.message
    , source = l.source
    , timestamp = l.timestamp
    , userId = fmap (\(D.UserId i) -> i) l.userId
    }
