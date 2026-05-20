module Domain.User where

import Data.Text (Text)
import GHC.Generics (Generic)

data User = User
  { userId :: Int
  , username :: Text
  , email :: Text
  , password :: Text
  , bio :: Maybe Text
  , image :: Maybe Text
  , role :: Text
  }
  deriving stock (Eq, Show, Generic)
