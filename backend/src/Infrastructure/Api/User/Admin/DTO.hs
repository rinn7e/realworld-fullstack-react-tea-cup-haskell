module Infrastructure.Api.User.Admin.DTO
  ( UpdateUserRoleRequest (..)
  , AdminUserResponse (..)
  , AdminUserListResponse (..)
  )
where

import Data.Aeson (FromJSON (..), ToJSON (..))
import Data.OpenApi (ToSchema (..))
import Data.Text (Text)
import GHC.Generics (Generic)

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
