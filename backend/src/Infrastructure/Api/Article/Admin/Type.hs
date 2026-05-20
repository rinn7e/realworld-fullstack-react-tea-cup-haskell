module Infrastructure.Api.Article.Admin.Type where

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

import Infrastructure.Entity.Article.DTO (AdminArticleListResponse (..))
import Infrastructure.Api.TagCombinator (Tag)

data AdminArticleRoute mode = AdminArticleRoute
  { getArticles
      :: mode
        :- "articles"
          :> Summary "Get All Articles"
          :> Description "Retrieve all articles in the system for administrative review"
          :> Tag "Admin Articles"
          :> QueryParam "limit" Int
          :> QueryParam "offset" Int
          :> QueryParam "tag" Text
          :> QueryParam "author" Text
          :> QueryParam "search" Text
          :> Get '[JSON] AdminArticleListResponse
  , deleteArticle
      :: mode
        :- "articles"
          :> Capture "slug" Text
          :> Summary "Delete Article"
          :> Description "Administrative takedown of an offensive article"
          :> Tag "Admin Articles"
          :> Delete '[JSON] S.NoContent
  }
  deriving stock (Generic)
