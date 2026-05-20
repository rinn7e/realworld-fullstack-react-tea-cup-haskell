module Domain.Comment where

import Data.Aeson (FromJSON, ToJSON)
import Data.Text (Text)
import Data.Time (UTCTime)
import Domain.Article (ArticleId)
import Domain.User (UserId)
import GHC.Generics (Generic)
import Web.HttpApiData (FromHttpApiData, ToHttpApiData)

newtype CommentId = CommentId {unCommentId :: Int}
  deriving stock (Eq, Ord, Show, Generic)
  deriving newtype (Num, ToJSON, FromJSON, ToHttpApiData, FromHttpApiData)

data Comment = Comment
  { commentId :: CommentId
  , body :: Text
  , authorId :: UserId
  , articleId :: ArticleId
  , createdAt :: UTCTime
  , updatedAt :: UTCTime
  }
  deriving stock (Eq, Show, Generic)

data AdminCommentResponse = AdminCommentResponse
  { id :: CommentId
  , body :: Text
  , createdAt :: UTCTime
  , articleSlug :: Text
  , authorUsername :: Text
  }
  deriving stock (Eq, Show, Generic)
