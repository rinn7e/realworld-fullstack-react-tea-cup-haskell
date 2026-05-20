module Infrastructure.Api.User.DTO
  ( User (..)
  , UserResponse (..)
  , Profile (..)
  , ProfileResponse (..)
  , LoginUserRequest (..)
  , NewUserRequest (..)
  , UpdateUserRequest (..)
  , UpdateUserRoleRequest (..)
  , AdminUserResponse (..)
  , AdminUserListResponse (..)
  )
where

import Control.Lens ((&), (.~), (?~))
import Data.Aeson (FromJSON (..), ToJSON (..), (.:), (.:?))
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

-------------------------------
-- User
-------------------------------
data User = User
  { email :: Text
  , token :: Text
  , username :: Text
  , bio :: Maybe Text
  , image :: Maybe Text
  }
  deriving (Show, Generic, ToSchema)

instance ToJSON User where
  toJSON = A.genericToJSON A.defaultOptions

-------------------------------
-- UserResponse
-------------------------------
data UserResponse = UserResponse {user :: User} deriving (Show, Generic, ToJSON, ToSchema)

-------------------------------
-- Profile
-------------------------------
data Profile = Profile
  { username :: Text
  , bio :: Maybe Text
  , image :: Maybe Text
  , following :: Bool
  }
  deriving (Show, Generic, ToSchema)

instance ToJSON Profile where
  toJSON = A.genericToJSON A.defaultOptions

-------------------------------
-- ProfileResponse
-------------------------------
data ProfileResponse = ProfileResponse {profile :: Profile}
  deriving (Show, Generic, ToJSON, ToSchema)

-------------------------------
-- LoginUserRequest
-------------------------------
data LoginUserRequest = LoginUserRequest
  { email :: Text
  , password :: Text
  }
  deriving (Show, Generic)

instance FromJSON LoginUserRequest where
  parseJSON = A.withObject "LoginUserRequest" $ \o -> do
    u <- o .: "user"
    LoginUserRequest <$> u .: "email" <*> u .: "password"

instance ToSchema LoginUserRequest where
  declareNamedSchema _ = do
    emailSchema <- declareSchemaRef (Proxy @Text)
    passwordSchema <- declareSchemaRef (Proxy @Text)
    let userSchema =
          mempty
            & type_ ?~ OpenApiObject
            & properties
              .~ InsOrd.fromList
                [ ("email", emailSchema)
                , ("password", passwordSchema)
                ]
            & required .~ ["email", "password"]
    return $
      NamedSchema (Just "LoginUserRequest") $
        mempty
          & type_ ?~ OpenApiObject
          & properties .~ InsOrd.fromList [("user", Inline userSchema)]
          & required .~ ["user"]

-------------------------------
-- NewUserRequest
-------------------------------
data NewUserRequest = NewUserRequest
  { username :: Text
  , email :: Text
  , password :: Text
  }
  deriving (Show, Generic)

instance FromJSON NewUserRequest where
  parseJSON = A.withObject "NewUserRequest" $ \o -> do
    u <- o .: "user"
    NewUserRequest <$> u .: "username" <*> u .: "email" <*> u .: "password"

instance ToSchema NewUserRequest where
  declareNamedSchema _ = do
    usernameSchema <- declareSchemaRef (Proxy @Text)
    emailSchema <- declareSchemaRef (Proxy @Text)
    passwordSchema <- declareSchemaRef (Proxy @Text)
    let userSchema =
          mempty
            & type_ ?~ OpenApiObject
            & properties
              .~ InsOrd.fromList
                [ ("username", usernameSchema)
                , ("email", emailSchema)
                , ("password", passwordSchema)
                ]
            & required .~ ["username", "email", "password"]
    return $
      NamedSchema (Just "NewUserRequest") $
        mempty
          & type_ ?~ OpenApiObject
          & properties .~ InsOrd.fromList [("user", Inline userSchema)]
          & required .~ ["user"]

-------------------------------
-- UpdateUserRequest
-------------------------------
data UpdateUserRequest = UpdateUserRequest
  { email :: Maybe Text
  , username :: Maybe Text
  , password :: Maybe Text
  , bio :: Maybe Text
  , image :: Maybe Text
  }
  deriving (Show, Generic)

instance FromJSON UpdateUserRequest where
  parseJSON = A.withObject "UpdateUserRequest" $ \o -> do
    u <- o .: "user"
    UpdateUserRequest
      <$> u .:? "email"
      <*> u .:? "username"
      <*> u .:? "password"
      <*> u .:? "bio"
      <*> u .:? "image"

instance ToSchema UpdateUserRequest where
  declareNamedSchema _ = do
    emailSchema <- declareSchemaRef (Proxy @(Maybe Text))
    usernameSchema <- declareSchemaRef (Proxy @(Maybe Text))
    passwordSchema <- declareSchemaRef (Proxy @(Maybe Text))
    bioSchema <- declareSchemaRef (Proxy @(Maybe Text))
    imageSchema <- declareSchemaRef (Proxy @(Maybe Text))
    let userSchema =
          mempty
            & type_ ?~ OpenApiObject
            & properties
              .~ InsOrd.fromList
                [ ("email", emailSchema)
                , ("username", usernameSchema)
                , ("password", passwordSchema)
                , ("bio", bioSchema)
                , ("image", imageSchema)
                ]
    return $
      NamedSchema (Just "UpdateUserRequest") $
        mempty
          & type_ ?~ OpenApiObject
          & properties .~ InsOrd.fromList [("user", Inline userSchema)]
          & required .~ ["user"]

-------------------------------
-- Admin User
-------------------------------

data UpdateUserRoleRequest = UpdateUserRoleRequest
  { role :: Text
  }
  deriving stock (Show, Generic)
  deriving anyclass (FromJSON, ToJSON, ToSchema)

data AdminUserResponse = AdminUserResponse
  { id :: Int
  , username :: Text
  , email :: Text
  , bio :: Maybe Text
  , image :: Maybe Text
  , role :: Text
  }
  deriving stock (Show, Generic)
  deriving anyclass (ToJSON, ToSchema)

data AdminUserListResponse = AdminUserListResponse
  { users :: [AdminUserResponse]
  , totalCount :: Int
  }
  deriving stock (Show, Generic)
  deriving anyclass (ToJSON, ToSchema)
