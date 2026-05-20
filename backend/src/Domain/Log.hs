module Domain.Log where

import Data.Aeson (FromJSON, ToJSON)
import Data.Text (Text)
import Data.Time (UTCTime)
import Domain.User (UserId)
import GHC.Generics (Generic)
import Web.HttpApiData (FromHttpApiData, ToHttpApiData)

newtype LogId = LogId {unLogId :: Int}
  deriving stock (Eq, Ord, Show, Generic)
  deriving newtype (Num, ToJSON, FromJSON, ToHttpApiData, FromHttpApiData)

data LogEntry = LogEntry
  { logId :: LogId
  , level :: Text
  , message :: Text
  , source :: Text
  , timestamp :: UTCTime
  , userId :: Maybe UserId
  }
  deriving stock (Eq, Show, Generic)
