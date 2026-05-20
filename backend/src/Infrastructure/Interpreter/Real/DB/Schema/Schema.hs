module Infrastructure.Interpreter.Real.DB.Schema.Schema where

import Data.Text (Text)
import Data.Time (UTCTime)
import Database.Persist.TH
import GHC.Generics (Generic)
import Servant.Auth.Server (FromJWT, ToJWT)

import Domain.Type.User (UserRole(..), PasswordHashed(..), Username(..), Email(..))
import Domain.Type.User qualified as D

import Infrastructure.Interpreter.Real.DB.Util.Internal (stripEntityPrefix)
import Infrastructure.Interpreter.Real.DB.Schema.Instance ()

derivePersistField "UserRole"

type UserBio = D.UserBio
type UserImage = D.UserImage

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
    username Username
    email Email
    password PasswordHashed
    bio UserBio Maybe
    image UserImage Maybe
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
