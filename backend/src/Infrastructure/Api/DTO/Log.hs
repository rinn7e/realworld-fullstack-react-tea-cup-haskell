module Infrastructure.Api.DTO.Log
  ( LogLevel (..)
  , LogResponse (..)
  , LogListResponse (..)
  , logLevelToText
  , logLevelFromText
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
  , enum_
  , type_
  )
import Data.Text (Text)
import Data.Text qualified as T
import Data.Time (UTCTime)
import GHC.Generics (Generic)
import Web.HttpApiData (FromHttpApiData (..), ToHttpApiData (..))

data LogLevel = LogInfo | LogWarning | LogError | LogFatal
  deriving stock (Show, Eq, Generic)

logLevelToText :: LogLevel -> Text
logLevelToText LogInfo = "INFO"
logLevelToText LogWarning = "WARNING"
logLevelToText LogError = "ERROR"
logLevelToText LogFatal = "FATAL"

logLevelFromText :: Text -> LogLevel
logLevelFromText t = case T.toLower t of
  "info" -> LogInfo
  "warning" -> LogWarning
  "error" -> LogError
  "fatal" -> LogFatal
  _ -> LogInfo

instance ToJSON LogLevel where
  toJSON LogInfo = "info"
  toJSON LogWarning = "warning"
  toJSON LogError = "error"
  toJSON LogFatal = "fatal"

instance FromJSON LogLevel where
  parseJSON = A.withText "LogLevel" $ \case
    "info" -> pure LogInfo
    "warning" -> pure LogWarning
    "error" -> pure LogError
    "fatal" -> pure LogFatal
    t -> fail $ "Unknown log level: " ++ T.unpack t

instance ToSchema LogLevel where
  declareNamedSchema _ = do
    let schema =
          mempty
            & type_ ?~ OpenApiString
            & enum_ ?~ ["info", "warning", "error", "fatal"]
    return $ NamedSchema (Just "LogLevel") schema

instance ToParamSchema LogLevel where
  toParamSchema _ =
    mempty
      & type_ ?~ OpenApiString
      & enum_ ?~ ["info", "warning", "error", "fatal"]

instance ToHttpApiData LogLevel where
  toQueryParam LogInfo = "info"
  toQueryParam LogWarning = "warning"
  toQueryParam LogError = "error"
  toQueryParam LogFatal = "fatal"

instance FromHttpApiData LogLevel where
  parseQueryParam "info" = Right LogInfo
  parseQueryParam "warning" = Right LogWarning
  parseQueryParam "error" = Right LogError
  parseQueryParam "fatal" = Right LogFatal
  parseQueryParam t = Left $ "Unknown log level: " <> t

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
