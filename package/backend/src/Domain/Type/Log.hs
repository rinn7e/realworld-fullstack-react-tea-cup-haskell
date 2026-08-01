module Domain.Type.Log where

import Data.Aeson (FromJSON (..), ToJSON (..))
import Data.String (IsString)
import Data.Text (Text)
import Data.Time (UTCTime)
import Domain.Type.User (UserId (..))
import GHC.Generics (Generic)
import Web.HttpApiData (FromHttpApiData (..), ToHttpApiData)

newtype LogId = LogId {unLogId :: Int}
  deriving stock (Eq, Ord, Show, Generic)
  deriving newtype (Num, ToJSON, FromJSON, ToHttpApiData, FromHttpApiData)

data LogLevel = INFO | WARNING | ERROR | DEBUG
  deriving stock (Show, Read, Eq, Generic)
  deriving anyclass (ToJSON, FromJSON, ToHttpApiData, FromHttpApiData)

newtype LogMessage = LogMessage {unLogMessage :: Text}
  deriving stock (Eq, Show, Generic)
  deriving newtype (ToJSON, FromJSON, ToHttpApiData, FromHttpApiData, IsString)

newtype LogSource = LogSource {unLogSource :: Text}
  deriving stock (Eq, Show, Generic)
  deriving newtype (ToJSON, FromJSON, ToHttpApiData, FromHttpApiData, IsString)

data LogEntry = LogEntry
  { logId :: LogId
  , level :: LogLevel
  , message :: LogMessage
  , source :: LogSource
  , timestamp :: UTCTime
  , userId :: Maybe UserId
  }
  deriving stock (Eq, Show, Generic)
