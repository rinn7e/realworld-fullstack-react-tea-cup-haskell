module Infrastructure.Api.DTO.Article
  ( Article (..)
  , ArticleResponse (..)
  , ArticleListResponse (..)
  , NewArticleRequest (..)
  , UpdateArticleRequest (..)
  , toArticleResponse
  , AdminArticle (..)
  , AdminArticleListResponse (..)
  )
where

import Control.Lens ((&), (.~), (?~))
import Data.Aeson (FromJSON (..), ToJSON (..), (.:), (.:?), (.=))
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
import Infrastructure.Api.DTO.User (AdminUserResponse (..), Profile (..))

-------------------------------
-- Article
-------------------------------
data Article = Article
  { slug :: Text
  , title :: Text
  , description :: Text
  , body :: Text
  , tagList :: [Text]
  , createdAt :: UTCTime
  , updatedAt :: UTCTime
  , favorited :: Bool
  , favoritesCount :: Int
  , author :: Profile
  }
  deriving (Show, Generic, ToSchema)

instance ToJSON Article where
  toJSON = A.genericToJSON A.defaultOptions

-------------------------------
-- ArticleResponse
-------------------------------
data ArticleResponse = ArticleResponse {article :: Article}
  deriving (Show, Generic, ToJSON, ToSchema)

-------------------------------
-- ArticleListResponse
-------------------------------
data ArticleListResponse = ArticleListResponse
  { articles :: [Article]
  , articlesCount :: Int
  }
  deriving (Show, Generic, ToSchema)

instance ToJSON ArticleListResponse where
  toJSON (ArticleListResponse as c) =
    A.object
      [ "articles" .= as
      , "articlesCount" .= c
      ]

-------------------------------
-- NewArticleRequest
-------------------------------
data NewArticleRequest = NewArticleRequest
  { title :: Text
  , description :: Text
  , body :: Text
  , tagList :: Maybe [Text]
  }
  deriving (Show, Generic)

instance FromJSON NewArticleRequest where
  parseJSON = A.withObject "NewArticleRequest" $ \o -> do
    a <- o .: "article"
    NewArticleRequest
      <$> a .: "title"
      <*> a .: "description"
      <*> a .: "body"
      <*> a .:? "tagList"

instance ToSchema NewArticleRequest where
  declareNamedSchema _ = do
    titleSchema <- declareSchemaRef (Proxy @Text)
    descriptionSchema <- declareSchemaRef (Proxy @Text)
    bodySchema <- declareSchemaRef (Proxy @Text)
    tagListSchema <- declareSchemaRef (Proxy @(Maybe [Text]))
    let articleSchema =
          mempty
            & type_ ?~ OpenApiObject
            & properties
              .~ InsOrd.fromList
                [ ("title", titleSchema)
                , ("description", descriptionSchema)
                , ("body", bodySchema)
                , ("tagList", tagListSchema)
                ]
            & required .~ ["title", "description", "body"]
    return $
      NamedSchema (Just "NewArticleRequest") $
        mempty
          & type_ ?~ OpenApiObject
          & properties .~ InsOrd.fromList [("article", Inline articleSchema)]
          & required .~ ["article"]

-------------------------------
-- UpdateArticleRequest
-------------------------------
data UpdateArticleRequest = UpdateArticleRequest
  { title :: Maybe Text
  , description :: Maybe Text
  , body :: Maybe Text
  , tagList :: Maybe [Text]
  }
  deriving (Show, Generic)

instance FromJSON UpdateArticleRequest where
  parseJSON = A.withObject "UpdateArticleRequest" $ \o -> do
    a <- o .: "article"
    UpdateArticleRequest
      <$> a .:? "title"
      <*> a .:? "description"
      <*> a .:? "body"
      <*> a .:? "tagList"

instance ToSchema UpdateArticleRequest where
  declareNamedSchema _ = do
    titleSchema <- declareSchemaRef (Proxy @(Maybe Text))
    descriptionSchema <- declareSchemaRef (Proxy @(Maybe Text))
    bodySchema <- declareSchemaRef (Proxy @(Maybe Text))
    tagListSchema <- declareSchemaRef (Proxy @(Maybe [Text]))
    let articleSchema =
          mempty
            & type_ ?~ OpenApiObject
            & properties
              .~ InsOrd.fromList
                [ ("title", titleSchema)
                , ("description", descriptionSchema)
                , ("body", bodySchema)
                , ("tagList", tagListSchema)
                ]
    return $
      NamedSchema (Just "UpdateArticleRequest") $
        mempty
          & type_ ?~ OpenApiObject
          & properties .~ InsOrd.fromList [("article", Inline articleSchema)]
          & required .~ ["article"]

-------------------------------
-- Admin Article
-------------------------------
data AdminArticle = AdminArticle
  { id :: Int
  , slug :: Text
  , title :: Text
  , description :: Text
  , body :: Text
  , tagList :: [Text]
  , createdAt :: UTCTime
  , updatedAt :: UTCTime
  , favorited :: Bool
  , favoritesCount :: Int
  , author :: AdminUserResponse
  }
  deriving stock (Show, Generic)
  deriving anyclass (ToJSON, ToSchema)

data AdminArticleListResponse = AdminArticleListResponse
  { articles :: [AdminArticle]
  , articlesCount :: Int
  }
  deriving stock (Show, Generic)
  deriving anyclass (ToJSON, ToSchema)

-------------------------------
-- Helpers
-------------------------------
toArticleResponse :: D.ArticleWithMetadata -> Article
toArticleResponse am =
  let art = am.article
      author = am.author
      tags = map (\t -> t.name) am.tags
      isFol = am.isFollowingAuthor
      isFav = am.isFavorited
      favCount = am.favoritesCount
      profile = Profile author.username author.bio author.image isFol
   in Article
        art.slug
        art.title
        art.description
        art.body
        tags
        art.createdAt
        art.updatedAt
        isFav
        favCount
        profile
