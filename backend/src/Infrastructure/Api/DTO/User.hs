module Infrastructure.Api.DTO.User
  ( User (..)
  , UserResponse (..)
  , Profile (..)
  , ProfileResponse (..)
  , LoginUserRequest (..)
  , NewUserRequest (..)
  , UpdateUserRequest (..)
  , UpdateUserRoleRequest (..)
  , UserWrapper (..)
  , AdminUserResponse (..)
  , AdminUserListResponse (..)
  , toAdminUserResponse
  )
where

import Control.Lens ((&), (.~), (?~))
import Data.Aeson (FromJSON (..), ToJSON (..), (.:), (.:?), (.=))
import Data.Aeson qualified as A
import Data.HashMap.Strict.InsOrd qualified as InsOrd
import Data.OpenApi
  ( NamedSchema (..)
  , OpenApiType (..)
  , Referenced (..)
  , ToSchema (..)
  , declareSchemaRef
  , properties
  , required
  , type_
  )
import Data.Proxy (Proxy (..))
import Data.Text (Text)
import GHC.Generics (Generic)

import Domain.Type qualified as D
import Infrastructure.Api.DTO.Instance ()

-------------------------------
-- User
-------------------------------
data User = User
  { email :: D.Email
  , token :: Text
  , username :: D.Username
  , bio :: Maybe D.UserBio
  , image :: Maybe D.UserImage
  }
  deriving (Show, Generic, ToSchema)

instance ToJSON User where
  toJSON = A.genericToJSON A.defaultOptions

-------------------------------
-- UserResponse
-------------------------------
data UserResponse = UserResponse {user :: User}
  deriving (Show, Generic, ToJSON, ToSchema)

-------------------------------
-- Profile
-------------------------------
data Profile = Profile
  { username :: D.Username
  , bio :: Maybe D.UserBio
  , image :: Maybe D.UserImage
  , following :: Bool
  }
  deriving stock (Show, Generic)
  deriving anyclass (ToJSON, ToSchema)

-------------------------------
-- ProfileResponse
-------------------------------
data ProfileResponse = ProfileResponse {profile :: Profile}
  deriving stock (Show, Generic)
  deriving anyclass (ToJSON, ToSchema)

data UserWrapper a = UserWrapper
  { user :: a
  }
  deriving (Show, Generic)

instance (FromJSON a) => FromJSON (UserWrapper a)
instance (ToSchema a) => ToSchema (UserWrapper a)

-------------------------------
-- Requests
-- -------------------------------
data LoginUserRequest = LoginUserRequest
  { email :: D.Email
  , password :: D.Password
  }
  deriving stock (Show, Generic)
  deriving anyclass (FromJSON, ToSchema)

data NewUserRequest = NewUserRequest
  { username :: D.Username
  , email :: D.Email
  , password :: D.Password
  }
  deriving stock (Show, Generic)
  deriving anyclass (FromJSON, ToSchema)

data UpdateUserRequest = UpdateUserRequest
  { email :: Maybe D.Email
  , username :: Maybe D.Username
  , password :: Maybe D.Password
  , bio :: Maybe D.UserBio
  , image :: Maybe D.UserImage
  }
  deriving stock (Show, Generic)
  deriving anyclass (FromJSON, ToSchema)

instance ToSchema D.UserRole where
  declareNamedSchema _ = do
    return $
      NamedSchema (Just "UserRole") $
        mempty
          & type_ ?~ OpenApiString

data UpdateUserRoleRequest = UpdateUserRoleRequest
  { role :: D.UserRole
  }
  deriving stock (Show, Generic)
  deriving anyclass (FromJSON, ToSchema)

-------------------------------
-- Admin User
-------------------------------
data AdminUserResponse = AdminUserResponse
  { id :: Int
  , username :: D.Username
  , email :: D.Email
  , bio :: Maybe D.UserBio
  , image :: Maybe D.UserImage
  , role :: D.UserRole
  }
  deriving stock (Show, Generic)
  deriving anyclass (ToJSON, ToSchema)

data AdminUserListResponse = AdminUserListResponse
  { users :: [AdminUserResponse]
  , totalCount :: Int
  }
  deriving stock (Show, Generic)
  deriving anyclass (ToJSON, ToSchema)

-------------------------------
-- Helpers
-------------------------------
toAdminUserResponse :: D.User -> AdminUserResponse
toAdminUserResponse u =
  AdminUserResponse
    { id = u.userId.unUserId
    , username = u.username
    , email = u.email
    , bio = u.bio
    , image = u.image
    , role = u.role
    }
