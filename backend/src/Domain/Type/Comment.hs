module Domain.Type.Comment where

import Data.Aeson (FromJSON, ToJSON)
import Data.String (IsString)
import Data.Text (Text)
import Data.Time (UTCTime)
import Domain.Type.Article (ArticleId, ArticleSlug (..))
import Domain.Type.User (UserId, Username)
import GHC.Generics (Generic)
import Web.HttpApiData (FromHttpApiData, ToHttpApiData)

newtype CommentId = CommentId {unCommentId :: Int}
  deriving stock (Eq, Ord, Show, Generic)
  deriving newtype (Num, ToJSON, FromJSON, ToHttpApiData, FromHttpApiData)

newtype CommentBody = CommentBody {unCommentBody :: Text}
  deriving stock (Eq, Show, Generic)
  deriving newtype (ToJSON, FromJSON, ToHttpApiData, FromHttpApiData, IsString)

data Comment = Comment
  { commentId :: CommentId
  , body :: CommentBody
  , authorId :: UserId
  , articleId :: ArticleId
  , createdAt :: UTCTime
  , updatedAt :: UTCTime
  }
  deriving stock (Eq, Show, Generic)

data CommentDetail = CommentDetail
  { id :: CommentId
  , body :: CommentBody
  , createdAt :: UTCTime
  , updatedAt :: UTCTime
  , articleSlug :: ArticleSlug
  , authorUsername :: Username
  }
  deriving stock (Eq, Show, Generic)
