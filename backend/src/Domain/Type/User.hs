module Domain.Type.User where

import Data.Aeson (FromJSON, ToJSON)
import Data.String (IsString)
import Data.Text (Text)
import GHC.Generics (Generic)
import Web.HttpApiData (FromHttpApiData, ToHttpApiData)

newtype UserId = UserId {unUserId :: Int}
  deriving stock (Eq, Ord, Show, Generic)
  deriving newtype (Num, ToJSON, FromJSON, ToHttpApiData, FromHttpApiData)

data UserRole = AdminRole | RegularRole
  deriving stock (Eq, Show, Read, Generic)
  deriving anyclass (ToJSON, FromJSON)

newtype Password = Password {unPassword :: Text}
  deriving stock (Eq, Show, Generic)
  deriving newtype (ToJSON, FromJSON, ToHttpApiData, FromHttpApiData, IsString)

newtype PasswordHashed = PasswordHashed {unPasswordHashed :: Text}
  deriving stock (Eq, Show, Generic)
  deriving newtype (ToJSON, FromJSON, ToHttpApiData, FromHttpApiData, IsString)

newtype Username = Username {unUsername :: Text}
  deriving stock (Eq, Ord, Show, Generic)
  deriving newtype (ToJSON, FromJSON, ToHttpApiData, FromHttpApiData, IsString)

newtype Email = Email {unEmail :: Text}
  deriving stock (Eq, Ord, Show, Generic)
  deriving newtype (ToJSON, FromJSON, ToHttpApiData, FromHttpApiData, IsString)

newtype UserBio = UserBio {unUserBio :: Text}
  deriving stock (Eq, Show, Generic)
  deriving newtype (ToJSON, FromJSON, ToHttpApiData, FromHttpApiData, IsString)

newtype UserImage = UserImage {unUserImage :: Text}
  deriving stock (Eq, Show, Generic)
  deriving newtype (ToJSON, FromJSON, ToHttpApiData, FromHttpApiData, IsString)

data User = User
  { userId :: UserId
  , username :: Username
  , email :: Email
  , password :: PasswordHashed
  , bio :: Maybe UserBio
  , image :: Maybe UserImage
  , role :: UserRole
  }
  deriving stock (Eq, Show, Generic)
