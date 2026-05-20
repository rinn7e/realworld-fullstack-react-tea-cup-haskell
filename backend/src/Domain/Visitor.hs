module Domain.Visitor where

import Data.Aeson (FromJSON, ToJSON)
import Data.Text (Text)
import Data.Time (UTCTime)
import GHC.Generics (Generic)
import Web.HttpApiData (FromHttpApiData, ToHttpApiData)

newtype VisitorId = VisitorId {unVisitorId :: Int}
  deriving stock (Eq, Ord, Show, Generic)
  deriving newtype (Num, ToJSON, FromJSON, ToHttpApiData, FromHttpApiData)

data Visitor = Visitor
  { visitorId :: VisitorId
  , ip :: Text
  , userAgent :: Text
  , path :: Text
  , timestamp :: UTCTime
  }
  deriving stock (Eq, Show, Generic)
