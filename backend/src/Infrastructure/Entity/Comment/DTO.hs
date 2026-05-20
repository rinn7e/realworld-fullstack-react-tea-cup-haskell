module Infrastructure.Entity.Comment.DTO
  ( Comment (..)
  , CommentResponse (..)
  , CommentListResponse (..)
  , NewCommentRequest (..)
  , AdminCommentResponse (..)
  , AdminCommentListResponse (..)
  )
where

import Control.Lens ((&), (.~), (?~))
import Data.Aeson (FromJSON (..), ToJSON (..), (.:), (.=))
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
import Data.Time (UTCTime)
import GHC.Generics (Generic)

import Infrastructure.Entity.User.DTO (Profile (..))

-------------------------------
-- Comment
-------------------------------
data Comment = Comment
  { id :: Int
  , createdAt :: UTCTime
  , updatedAt :: UTCTime
  , body :: Text
  , author :: Profile
  }
  deriving (Show, Generic, ToSchema)

instance ToJSON Comment where
  toJSON = A.genericToJSON A.defaultOptions

-------------------------------
-- CommentResponse
-------------------------------
data CommentResponse = CommentResponse {comment :: Comment}
  deriving (Show, Generic, ToJSON, ToSchema)

-------------------------------
-- CommentListResponse
-------------------------------
data CommentListResponse = CommentListResponse
  { comments :: [Comment]
  }
  deriving (Show, Generic, ToSchema)

instance ToJSON CommentListResponse where
  toJSON (CommentListResponse cs) = A.object ["comments" .= cs]

-------------------------------
-- NewCommentRequest
-------------------------------
data NewCommentRequest = NewCommentRequest
  { body :: Text
  }
  deriving (Show, Generic)

instance FromJSON NewCommentRequest where
  parseJSON = A.withObject "NewCommentRequest" $ \o -> do
    c <- o .: "comment"
    NewCommentRequest <$> c .: "body"

instance ToSchema NewCommentRequest where
  declareNamedSchema _ = do
    bodySchema <- declareSchemaRef (Proxy @Text)
    let commentSchema =
          mempty
            & type_ ?~ OpenApiObject
            & properties .~ InsOrd.fromList [("body", bodySchema)]
            & required .~ ["body"]
    return $
      NamedSchema (Just "NewCommentRequest") $
        mempty
          & type_ ?~ OpenApiObject
          & properties .~ InsOrd.fromList [("comment", Inline commentSchema)]
          & required .~ ["comment"]

-------------------------------
-- Admin Comment
-------------------------------
data AdminCommentResponse = AdminCommentResponse
  { id :: Int
  , body :: Text
  , createdAt :: UTCTime
  , articleSlug :: Text
  , authorUsername :: Text
  }
  deriving stock (Show, Generic)
  deriving anyclass (ToJSON, ToSchema)

data AdminCommentListResponse = AdminCommentListResponse
  { comments :: [AdminCommentResponse]
  , totalCount :: Int
  }
  deriving stock (Show, Generic)
  deriving anyclass (ToJSON, ToSchema)
