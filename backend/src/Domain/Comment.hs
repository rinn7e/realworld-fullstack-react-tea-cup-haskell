module Domain.Comment where

import Data.Text (Text)
import Data.Time (UTCTime)
import GHC.Generics (Generic)

data Comment = Comment
  { commentId :: Int
  , body :: Text
  , authorId :: Int
  , articleId :: Int
  , createdAt :: UTCTime
  , updatedAt :: UTCTime
  }
  deriving stock (Eq, Show, Generic)
