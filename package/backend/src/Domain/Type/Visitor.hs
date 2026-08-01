module Domain.Type.Visitor where

import Data.Aeson (FromJSON, ToJSON)
import Data.String (IsString)
import Data.Text (Text)
import Data.Time (UTCTime)
import GHC.Generics (Generic)
import Domain.Type.User (UserId)
import Web.HttpApiData (FromHttpApiData (..), ToHttpApiData (..))

newtype VisitorId = VisitorId {unVisitorId :: Int}
  deriving stock (Eq, Ord, Show, Generic)
  deriving newtype (Num, ToJSON, FromJSON, ToHttpApiData, FromHttpApiData)

data VisitorSort = VisitorSortId | VisitorSortIp | VisitorSortPath | VisitorSortTimestamp
  deriving stock (Eq, Ord, Show, Generic)
  deriving anyclass (ToJSON, FromJSON)

instance FromHttpApiData VisitorSort where
  parseQueryParam t = case t of
    "id" -> Right VisitorSortId
    "ip" -> Right VisitorSortIp
    "path" -> Right VisitorSortPath
    "timestamp" -> Right VisitorSortTimestamp
    _ -> Left "Invalid sort field"

instance ToHttpApiData VisitorSort where
  toQueryParam VisitorSortId = "id"
  toQueryParam VisitorSortIp = "ip"
  toQueryParam VisitorSortPath = "path"
  toQueryParam VisitorSortTimestamp = "timestamp"

newtype VisitorIp = VisitorIp {unVisitorIp :: Text}
  deriving stock (Eq, Ord, Show, Generic)
  deriving newtype (ToJSON, FromJSON, ToHttpApiData, FromHttpApiData, IsString)

newtype VisitorUserAgent = VisitorUserAgent {unVisitorUserAgent :: Text}
  deriving stock (Eq, Ord, Show, Generic)
  deriving newtype (ToJSON, FromJSON, ToHttpApiData, FromHttpApiData, IsString)

newtype VisitorPath = VisitorPath {unVisitorPath :: Text}
  deriving stock (Eq, Ord, Show, Generic)
  deriving newtype (ToJSON, FromJSON, ToHttpApiData, FromHttpApiData, IsString)

newtype VisitorFp = VisitorFp {unVisitorFp :: Text}
  deriving stock (Eq, Ord, Show, Generic)
  deriving newtype (ToJSON, FromJSON, ToHttpApiData, FromHttpApiData, IsString)

data Visitor = Visitor
  { visitorId :: VisitorId
  , ip :: VisitorIp
  , userAgent :: VisitorUserAgent
  , path :: VisitorPath
  , fingerprint :: VisitorFp
  , timestamp :: UTCTime
  , userId :: Maybe UserId
  }
  deriving stock (Eq, Ord, Show, Generic)


