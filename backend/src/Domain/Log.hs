module Domain.Log where

import Data.Text (Text)
import Data.Time (UTCTime)
import GHC.Generics (Generic)

data LogEntry = LogEntry
  { logId :: Int
  , level :: Text
  , message :: Text
  , source :: Text
  , timestamp :: UTCTime
  , userId :: Maybe Int
  }
  deriving stock (Eq, Show, Generic)
