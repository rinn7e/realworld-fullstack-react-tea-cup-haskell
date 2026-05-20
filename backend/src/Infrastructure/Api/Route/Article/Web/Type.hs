module Infrastructure.Api.Route.Article.Web.Type where

import Data.Text (Text)
import GHC.Generics (Generic)
import Servant
  ( Capture
  , Delete
  , Description
  , GenericMode (type (:-))
  , Get
  , JSON
  , NamedRoutes
  , Post
  , PostCreated
  , Put
  , QueryParam
  , ReqBody
  , Summary
  , (:>)
  )
import Servant qualified as S

import Infrastructure.Api.Route.Comment.Web.Type (CommentRoute)
import Infrastructure.Api.Route.TagCombinator (Tag)

import Infrastructure.Api.DTO.Article
  ( ArticleListResponse
  , ArticleResponse
  , NewArticleRequest
  , UpdateArticleRequest
  )

data ArticleRoute mode = ArticleRoute
  { getArticleFeed
      :: mode
        :- "articles"
          :> "feed"
          :> Summary "Get Feed"
          :> Description "Get a feed of recent articles from followed users"
          :> Tag "Articles"
          :> QueryParam "limit" Int
          :> QueryParam "offset" Int
          :> Get '[JSON] ArticleListResponse
  -- ^ GET /api/articles/feed
  , getArticleList
      :: mode
        :- "articles"
          :> Summary "Get Articles"
          :> Description "Get a list of recent articles"
          :> Tag "Articles"
          :> QueryParam "tag" Text
          :> QueryParam "author" Text
          :> QueryParam "favorited" Text
          :> QueryParam "limit" Int
          :> QueryParam "offset" Int
          :> Get '[JSON] ArticleListResponse
  -- ^ GET /api/articles
  , createArticle
      :: mode
        :- "articles"
          :> Summary "Create Article"
          :> Description "Create a new article"
          :> Tag "Articles"
          :> ReqBody '[JSON] NewArticleRequest
          :> PostCreated '[JSON] ArticleResponse
  -- ^ POST /api/articles
  , getArticleOne
      :: mode
        :- "articles"
          :> Capture "slug" Text
          :> Summary "Get Article"
          :> Description "Get a single article by slug"
          :> Tag "Articles"
          :> Get '[JSON] ArticleResponse
  -- ^ GET /api/articles/:slug
  , updateArticle
      :: mode
        :- "articles"
          :> Capture "slug" Text
          :> Summary "Update Article"
          :> Description "Update an article by slug"
          :> Tag "Articles"
          :> ReqBody '[JSON] UpdateArticleRequest
          :> Put '[JSON] ArticleResponse
  -- ^ PUT /api/articles/:slug
  , deleteArticle
      :: mode
        :- "articles"
          :> Capture "slug" Text
          :> Summary "Delete Article"
          :> Description "Delete an article by slug"
          :> Tag "Articles"
          :> Delete '[JSON] S.NoContent
  -- ^ DELETE /api/articles/:slug
  , favoriteArticle
      :: mode
        :- "articles"
          :> Capture "slug" Text
          :> "favorite"
          :> Summary "Favorite Article"
          :> Description "Favorite an article by slug"
          :> Tag "Articles"
          :> Post '[JSON] ArticleResponse
  -- ^ POST /api/articles/:slug/favorite
  , unfavoriteArticle
      :: mode
        :- "articles"
          :> Capture "slug" Text
          :> "favorite"
          :> Summary "Unfavorite Article"
          :> Description "Unfavorite an article by slug"
          :> Tag "Articles"
          :> Delete '[JSON] ArticleResponse
  -- ^ DELETE /api/articles/:slug/favorite
  , comments
      :: mode :- "articles" :> Capture "slug" Text :> "comments" :> NamedRoutes CommentRoute
  -- ^ /api/articles/:slug/comments
  }
  deriving stock (Generic)
