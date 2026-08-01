module Infrastructure.Api.Route.Article.Admin.Controller
  ( adminArticleRoute
  , getArticlesHandler
  , deleteAdminArticleHandler
  ) where

import Data.Text (Text)
import Database.Persist.Sql (fromSqlKey)
import Effectful
import Effectful.Error.Static (Error, throwError)
import Servant (NamedRoutes)
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Domain.Type qualified as D
import Infrastructure.Api.DTO qualified as Api
import Infrastructure.Api.Route.Article.Admin.Type
import Infrastructure.Common.Util.Guard (guardAdmin)
import Infrastructure.Interpreter.Real.DB.Schema.Schema qualified as DB

import Capability.Database.ArticleDB
import Capability.Database.LoggerDB
import Capability.Database.UserDB
import Capability.Time

adminArticleRoute
  :: ( ArticleDB :> es
     , LoggerDB :> es
     , Time :> es
     , UserDB :> es
     , Error S.ServerError :> es
     )
  => S.AuthResult DB.UserId
  -> S.ServerT (NamedRoutes AdminArticleRoute) (Eff es)
adminArticleRoute auth =
  AdminArticleRoute
    { getArticles = getArticlesHandler auth
    , deleteArticle = deleteAdminArticleHandler auth
    }

getArticlesHandler
  :: ( ArticleDB :> es
     , UserDB :> es
     , Error S.ServerError :> es
     )
  => S.AuthResult DB.UserId
  -> Maybe D.Limit
  -> Maybe D.Offset
  -> Maybe D.TagName
  -> Maybe D.Username
  -> Maybe Text
  -> Maybe D.ArticleSort
  -> Maybe D.Direction
  -> Eff es Api.AdminArticleListResponse
getArticlesHandler (S.Authenticated uid) mLimit mOffset mTag mAuthor mSearch mSort mDir = do
  guardAdmin uid
  let limit = maybe (D.Limit 10) id mLimit
      offset = maybe (D.Offset 0) id mOffset
  articlesDetail <- listAdminArticles mTag mAuthor mSearch mSort mDir limit offset
  totalCount <- countAdminArticles mTag mAuthor mSearch
  let articles = map Api.toAdminArticle articlesDetail
  return $ Api.AdminArticleListResponse articles totalCount
getArticlesHandler _ _ _ _ _ _ _ _ = throwError S.err401

deleteAdminArticleHandler
  :: ( ArticleDB :> es
     , LoggerDB :> es
     , Time :> es
     , UserDB :> es
     , Error S.ServerError :> es
     )
  => S.AuthResult DB.UserId
  -> D.ArticleSlug
  -> Eff es S.NoContent
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
          D.INFO
          (D.LogMessage ("Deleted article: " <> slug.unArticleSlug))
          (D.LogSource "ARTICLE")
          now
          (Just dUid)
      return S.NoContent
deleteAdminArticleHandler _ _ = throwError S.err401
