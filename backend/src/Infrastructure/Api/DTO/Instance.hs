module Infrastructure.Api.DTO.Instance where

import Data.OpenApi (ToParamSchema (..), ToSchema (..))
import Domain.Type qualified as D

deriving newtype instance ToSchema D.Password
deriving newtype instance ToSchema D.PasswordHashed
deriving newtype instance ToSchema D.Username
deriving newtype instance ToSchema D.Email
deriving newtype instance ToSchema D.UserBio
deriving newtype instance ToSchema D.UserImage

instance ToParamSchema D.Username
instance ToParamSchema D.Email
