module Infrastructure.Api.Route.Article.Admin.Controller
  ( adminArticleRoute
  ) where

import Data.Text (Text)
import Database.Persist.Sql (fromSqlKey)
import Effectful.Error.Static (throwError)
import Servant (NamedRoutes)
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Domain.Type (Article (..), ArticleId (..))
import Domain.Type qualified as D
import Infrastructure.Api.DTO.Article
  ( AdminArticle (..)
  , AdminArticleListResponse (..)
  , toAdminArticle
  )
import Infrastructure.Api.Route.Article.Admin.Type
import Infrastructure.Common.Type.App (App)
import Infrastructure.Common.Util.Guard (guardAdmin)
import Infrastructure.Interpreter.Real.DB.Schema.Schema qualified as DB

import Capability.Database.ArticleDB
import Capability.Database.LoggerDB
import Capability.Time

adminArticleRoute
  :: S.AuthResult DB.UserId -> S.ServerT (NamedRoutes AdminArticleRoute) App
adminArticleRoute auth =
  AdminArticleRoute
    { getArticles = getArticlesHandler auth
    , deleteArticle = deleteAdminArticleHandler auth
    }

getArticlesHandler
  :: S.AuthResult DB.UserId
  -> Maybe Int
  -> Maybe Int
  -> Maybe Text
  -> Maybe Text
  -> Maybe Text
  -> App AdminArticleListResponse
getArticlesHandler (S.Authenticated uid) mLimit mOffset mTag mAuthor mSearch = do
  guardAdmin uid
  let limit = maybe 10 id mLimit
      offset = maybe 0 id mOffset
  articlesDetail <- listAdminArticles mTag mAuthor mSearch limit offset
  totalCount <- countAdminArticles mTag mAuthor mSearch
  let articles = map toAdminArticle articlesDetail
  return $ AdminArticleListResponse articles totalCount
getArticlesHandler _ _ _ _ _ _ = throwError S.err401

deleteAdminArticleHandler :: S.AuthResult DB.UserId -> Text -> App S.NoContent
deleteAdminArticleHandler (S.Authenticated uid) slug = do
  guardAdmin uid
  mArt <- getArticleBySlug slug
  case mArt of
    Nothing -> throwError S.err404
    Just art -> do
      now <- getCurrentTime
      deleteArticle art.articleId
      let dUid = D.UserId $ fromIntegral (fromSqlKey uid)
      _ <-
        insertLog
          "INFO"
          ("Deleted article: " <> slug)
          "ARTICLE"
          now
          (Just dUid)
      return S.NoContent
deleteAdminArticleHandler _ _ = throwError S.err401
