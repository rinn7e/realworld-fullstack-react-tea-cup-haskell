module Infrastructure.Api.DTO.Instance where

import Control.Lens ((&), (?~))
import Data.OpenApi
  ( NamedSchema (..)
  , OpenApiType (..)
  , ToParamSchema (..)
  , ToSchema (..)
  , type_
  )
import Domain.Type qualified as D

-- Common instances
deriving newtype instance ToSchema D.Limit
deriving newtype instance ToSchema D.Offset
instance ToParamSchema D.Limit
instance ToParamSchema D.Offset

deriving newtype instance ToSchema D.Sort
instance ToParamSchema D.Sort

instance ToSchema D.Direction where
  declareNamedSchema _ = do
    return $
      NamedSchema (Just "Direction") $
        mempty
          & type_ ?~ OpenApiString

instance ToParamSchema D.Direction where
  toParamSchema _ =
    mempty
      & type_ ?~ OpenApiString

-- User instances
deriving newtype instance ToSchema D.UserId
deriving newtype instance ToSchema D.Password
deriving newtype instance ToSchema D.PasswordHashed
deriving newtype instance ToSchema D.Username
deriving newtype instance ToSchema D.Email
deriving newtype instance ToSchema D.UserBio
deriving newtype instance ToSchema D.UserImage

instance ToParamSchema D.Username
instance ToParamSchema D.Email

-- Tag instances
deriving newtype instance ToSchema D.TagName
instance ToParamSchema D.TagName

-- Article instances
deriving newtype instance ToSchema D.ArticleSlug
deriving newtype instance ToSchema D.ArticleTitle
deriving newtype instance ToSchema D.ArticleDescription
deriving newtype instance ToSchema D.ArticleBody

instance ToParamSchema D.ArticleSlug

-- Comment instances
deriving newtype instance ToSchema D.CommentBody

-- Log instances
deriving newtype instance ToSchema D.LogMessage
deriving newtype instance ToSchema D.LogSource

instance ToSchema D.LogLevel where
  declareNamedSchema _ = do
    return $
      NamedSchema (Just "LogLevel") $
        mempty
          & type_ ?~ OpenApiString

instance ToParamSchema D.LogLevel where
  toParamSchema _ =
    mempty
      & type_ ?~ OpenApiString

-- Visitor instances
deriving newtype instance ToSchema D.VisitorIp
deriving newtype instance ToSchema D.VisitorUserAgent
deriving newtype instance ToSchema D.VisitorPath
