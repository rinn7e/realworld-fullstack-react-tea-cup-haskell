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

import Domain.Type qualified as D
import Infrastructure.Api.DTO qualified as Api

data ArticleRoute mode = ArticleRoute
  { getArticleFeed
      :: mode
        :- "articles"
          :> "feed"
          :> Summary "Get Feed"
          :> Description "Get a feed of recent articles from followed users"
          :> Tag "Articles"
          :> QueryParam "limit" D.Limit
          :> QueryParam "offset" D.Offset
          :> Get '[JSON] Api.ArticleListResponse
  -- ^ GET /api/articles/feed
  , getArticleList
      :: mode
        :- "articles"
          :> Summary "Get Articles"
          :> Description "Get a list of recent articles"
          :> Tag "Articles"
          :> QueryParam "tag" D.TagName
          :> QueryParam "author" D.Username
          :> QueryParam "favorited" D.Username
          :> QueryParam "limit" D.Limit
          :> QueryParam "offset" D.Offset
          :> Get '[JSON] Api.ArticleListResponse
  -- ^ GET /api/articles
  , createArticle
      :: mode
        :- "articles"
          :> Summary "Create Article"
          :> Description "Create a new article"
          :> Tag "Articles"
          :> ReqBody '[JSON] (Api.ArticleWrapper Api.NewArticleRequest)
          :> PostCreated '[JSON] Api.ArticleResponse
  -- ^ POST /api/articles
  , getArticleOne
      :: mode
        :- "articles"
          :> Capture "slug" D.ArticleSlug
          :> Summary "Get Article"
          :> Description "Get a single article by slug"
          :> Tag "Articles"
          :> Get '[JSON] Api.ArticleResponse
  -- ^ GET /api/articles/:slug
  , updateArticle
      :: mode
        :- "articles"
          :> Capture "slug" D.ArticleSlug
          :> Summary "Update Article"
          :> Description "Update an article by slug"
          :> Tag "Articles"
          :> ReqBody '[JSON] (Api.ArticleWrapper Api.UpdateArticleRequest)
          :> Put '[JSON] Api.ArticleResponse
  -- ^ PUT /api/articles/:slug
  , deleteArticle
      :: mode
        :- "articles"
          :> Capture "slug" D.ArticleSlug
          :> Summary "Delete Article"
          :> Description "Delete an article by slug"
          :> Tag "Articles"
          :> Delete '[JSON] S.NoContent
  -- ^ DELETE /api/articles/:slug
  , favoriteArticle
      :: mode
        :- "articles"
          :> Capture "slug" D.ArticleSlug
          :> "favorite"
          :> Summary "Favorite Article"
          :> Description "Favorite an article by slug"
          :> Tag "Articles"
          :> Post '[JSON] Api.ArticleResponse
  -- ^ POST /api/articles/:slug/favorite
  , unfavoriteArticle
      :: mode
        :- "articles"
          :> Capture "slug" D.ArticleSlug
          :> "favorite"
          :> Summary "Unfavorite Article"
          :> Description "Unfavorite an article by slug"
          :> Tag "Articles"
          :> Delete '[JSON] Api.ArticleResponse
  -- ^ DELETE /api/articles/:slug/favorite
  , comments
      :: mode
        :- "articles" :> Capture "slug" D.ArticleSlug :> "comments" :> NamedRoutes CommentRoute
  -- ^ /api/articles/:slug/comments
  }
  deriving stock (Generic)
