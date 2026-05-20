module Domain.Visitor where

import Data.Text (Text)
import Data.Time (UTCTime)
import GHC.Generics (Generic)

data Visitor = Visitor
  { visitorId :: Int
  , ip :: Text
  , userAgent :: Text
  , path :: Text
  , timestamp :: UTCTime
  }
  deriving stock (Eq, Show, Generic)
