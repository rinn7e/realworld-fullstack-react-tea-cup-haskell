module Infrastructure.Interpreter.Real.DB.Schema.Schema where

import Data.Text (Text)
import Data.Time (UTCTime)
import Database.Persist.TH
import GHC.Generics (Generic)
import Servant.Auth.Server (FromJWT, ToJWT)

import Domain.Type.User (UserRole(..))

import Infrastructure.Interpreter.Real.DB.Util.Internal (stripEntityPrefix)

derivePersistField "UserRole"

share
  [ mkPersist
      sqlSettings
        { mpsPrefixFields = True
        , mpsFieldLabelModifier = stripEntityPrefix
        }
  , mkMigrate "migrateAll"
  ]
  [persistLowerCase|
User
    username Text
    email Text
    password Text
    bio Text Maybe
    image Text Maybe
    role UserRole default='RegularRole'
    UniqueUsername username
    UniqueEmail email
    deriving Show Generic

Visitor
    ip Text
    userAgent Text
    path Text
    timestamp UTCTime
    deriving Show Generic

Log
    level Text
    message Text
    source Text
    timestamp UTCTime
    userId UserId Maybe
    deriving Show Generic

Article
    slug Text
    title Text
    description Text
    body Text
    authorId UserId
    createdAt UTCTime
    updatedAt UTCTime
    UniqueSlug slug
    deriving Show Generic

Tag
    name Text
    UniqueTagName name
    deriving Show Generic

ArticleTag
    articleId ArticleId
    tagId TagId
    UniqueArticleTag articleId tagId
    deriving Show Generic

Comment
    body Text
    authorId UserId
    articleId ArticleId
    createdAt UTCTime
    updatedAt UTCTime
    deriving Show Generic

Follow
    followerId UserId
    followedId UserId
    UniqueFollow followerId followedId
    deriving Show Generic

Favorite
    userId UserId
    articleId ArticleId
    UniqueFavorite userId articleId
    deriving Show Generic

|]

instance ToJWT UserId

instance FromJWT UserId
