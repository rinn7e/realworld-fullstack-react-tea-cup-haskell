module Infrastructure.Interpreter.Real.DB.Schema.Schema where

import Data.Text (Text)
import Data.Time (UTCTime)
import Database.Persist.TH
import GHC.Generics (Generic)
import Servant.Auth.Server (FromJWT, ToJWT)

import Domain.Type
  ( ArticleBody
  , ArticleDescription
  , ArticleSlug
  , ArticleTitle
  , CommentBody
  , Email (..)
  , LogLevel (..)
  , LogMessage
  , LogSource
  , PasswordHashed (..)
  , TagName
  , UserBio
  , UserImage
  , UserRole (..)
  , Username (..)
  , VisitorIp
  , VisitorPath
  , VisitorUserAgent
  )

import Infrastructure.Interpreter.Real.DB.Schema.Instance ()
import Infrastructure.Interpreter.Real.DB.Util.Internal (stripEntityPrefix)

derivePersistField "UserRole"
derivePersistField "LogLevel"

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
    ip VisitorIp
    userAgent VisitorUserAgent
    path VisitorPath
    timestamp UTCTime
    userId UserId Maybe OnDeleteSetNull
    deriving Show Generic

Log
    level LogLevel
    message LogMessage
    source LogSource
    timestamp UTCTime
    userId UserId Maybe
    deriving Show Generic

Article
    slug ArticleSlug
    title ArticleTitle
    description ArticleDescription
    body ArticleBody
    authorId UserId
    createdAt UTCTime
    updatedAt UTCTime
    UniqueSlug slug
    deriving Show Generic

Tag
    name TagName
    UniqueTagName name
    deriving Show Generic

ArticleTag
    articleId ArticleId
    tagId TagId
    UniqueArticleTag articleId tagId
    deriving Show Generic

Comment
    body CommentBody
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
