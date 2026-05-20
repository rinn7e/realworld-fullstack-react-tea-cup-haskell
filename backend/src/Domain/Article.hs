module Domain.Article where

import Data.Text (Text)
import Data.Time (UTCTime)
import GHC.Generics (Generic)

data Article = Article
  { articleId :: Int
  , slug :: Text
  , title :: Text
  , description :: Text
  , body :: Text
  , authorId :: Int
  , createdAt :: UTCTime
  , updatedAt :: UTCTime
  }
  deriving stock (Eq, Show, Generic)
