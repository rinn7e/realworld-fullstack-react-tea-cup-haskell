module Infrastructure.Api.DTO.Comment
  ( Comment (..)
  , CommentResponse (..)
  , CommentListResponse (..)
  , NewCommentRequest (..)
  , toCommentDTO
  , toCommentDTOFromDetail
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

import Domain.Type qualified as D
import Infrastructure.Api.DTO.User (Profile (..))

-------------------------------
-- Comment
-------------------------------
data Comment = Comment
  { id :: Int
  , createdAt :: UTCTime
  , updatedAt :: UTCTime
  , body :: Text
  , author :: Profile
  , articleSlug :: Maybe Text
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
  , totalCount :: Int
  }
  deriving (Show, Generic, ToSchema)

instance ToJSON CommentListResponse where
  toJSON (CommentListResponse cs tc) =
    A.object
      [ "comments" .= cs
      , "totalCount" .= tc
      ]

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
-- Helpers
-------------------------------
toCommentDTO :: D.Comment -> D.User -> Bool -> Comment
toCommentDTO c u isFol =
  Comment
    { id = c.commentId.unCommentId
    , createdAt = c.createdAt
    , updatedAt = c.updatedAt
    , body = c.body
    , author = Profile u.username u.bio u.image isFol
    , articleSlug = Nothing
    }

toCommentDTOFromDetail :: D.CommentDetail -> Comment
toCommentDTOFromDetail r =
  Comment
    { id = r.id.unCommentId
    , body = r.body
    , createdAt = r.createdAt
    , updatedAt = r.updatedAt
    , author = Profile r.authorUsername Nothing Nothing False -- Basic profile
    , articleSlug = Just r.articleSlug
    }
