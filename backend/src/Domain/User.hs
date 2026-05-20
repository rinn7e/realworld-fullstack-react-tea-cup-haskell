module Domain.User where

import Data.Aeson (FromJSON, ToJSON)
import Data.Text (Text)
import GHC.Generics (Generic)
import Web.HttpApiData (FromHttpApiData, ToHttpApiData)

newtype UserId = UserId {unUserId :: Int}
  deriving stock (Eq, Ord, Show, Generic)
  deriving newtype (Num, ToJSON, FromJSON, ToHttpApiData, FromHttpApiData)

data User = User
  { userId :: UserId
  , username :: Text
  , email :: Text
  , password :: Text
  , bio :: Maybe Text
  , image :: Maybe Text
  , role :: Text
  }
  deriving stock (Eq, Show, Generic)
