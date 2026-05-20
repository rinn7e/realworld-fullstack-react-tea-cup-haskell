module Infrastructure.Api.Route.Article.Admin.Type where

import Data.Text (Text)
import GHC.Generics (Generic)
import Servant
  ( Capture
  , Delete
  , Description
  , GenericMode (type (:-))
  , Get
  , JSON
  , QueryParam
  , Summary
  , (:>)
  )
import Servant qualified as S

import Domain.Type qualified as D
import Infrastructure.Api.DTO qualified as Api
import Infrastructure.Api.Route.TagCombinator (Tag)

data AdminArticleRoute mode = AdminArticleRoute
  { getArticles
      :: mode
        :- "articles"
          :> Summary "Get All Articles"
          :> Description "Retrieve all articles in the system for administrative review"
          :> Tag "Admin Articles"
          :> QueryParam "limit" D.Limit
          :> QueryParam "offset" D.Offset
          :> QueryParam "tag" D.TagName
          :> QueryParam "author" D.Username
          :> QueryParam "search" Text
          :> QueryParam "sort" D.ArticleSort
          :> QueryParam "direction" D.Direction
          :> Get '[JSON] Api.AdminArticleListResponse
  , deleteArticle
      :: mode
        :- "articles"
          :> Capture "slug" D.ArticleSlug
          :> Summary "Delete Article"
          :> Description "Administrative takedown of an offensive article"
          :> Tag "Admin Articles"
          :> Delete '[JSON] S.NoContent
  }
  deriving stock (Generic)
