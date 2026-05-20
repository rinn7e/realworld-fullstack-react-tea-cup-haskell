module Domain.Article where

import Data.Aeson (FromJSON, ToJSON)
import Data.Text (Text)
import Data.Time (UTCTime)
import Domain.Tag (Tag)
import Domain.User (User, UserId)
import GHC.Generics (Generic)
import Web.HttpApiData (FromHttpApiData, ToHttpApiData)

newtype ArticleId = ArticleId {unArticleId :: Int}
  deriving stock (Eq, Ord, Show, Generic)
  deriving newtype (Num, ToJSON, FromJSON, ToHttpApiData, FromHttpApiData)

data Article = Article
  { articleId :: ArticleId
  , slug :: Text
  , title :: Text
  , description :: Text
  , body :: Text
  , authorId :: UserId
  , createdAt :: UTCTime
  , updatedAt :: UTCTime
  }
  deriving stock (Eq, Show, Generic)

data ArticleWithMetadata = ArticleWithMetadata
  { article :: Article
  , author :: User
  , tags :: [Tag]
  , favoritesCount :: Int
  , isFavorited :: Bool
  , isFollowingAuthor :: Bool
  }
  deriving stock (Eq, Show, Generic)
