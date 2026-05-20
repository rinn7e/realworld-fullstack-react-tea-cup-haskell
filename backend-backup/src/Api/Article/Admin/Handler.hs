module Api.Article.Admin.Handler where

import Data.Map.Append (unAppendMap)
import Data.Map.Strict qualified as Map
import Data.Maybe (fromMaybe)
import Data.Semigroup (First (..))
import Data.Text (Text)
import Data.Time (getCurrentTime)
import Database.Persist (delete, deleteWhere, insert, (==.))
import Database.Persist.Sql (Entity (..), fromSqlKey)
import Effectful (liftIO)
import Effectful.Error.Static (throwError)
import Servant (NamedRoutes)
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Api.Article.Admin.Type
import Api.User.Admin.Handler (toAdminUserResponse)
import Entity.User.Api (AdminUserResponse (..))
import Common.Type.App (App)
import Common.Util.Guard (guardAdmin)
import DB.Schema.Type (UserId)
import DB.Schema.Type qualified as DB
import DB.Util (runDB)
import Entity.Article.Api (AdminArticle (..), AdminArticleListResponse (..))
import Entity.Article.Query
import Entity.Article.Type (ArticleGrouped)

adminArticleRoute :: S.AuthResult UserId -> S.ServerT (NamedRoutes AdminArticleRoute) App
adminArticleRoute auth =
  AdminArticleRoute
    { getArticles = getArticlesHandler auth
    , deleteArticle = deleteArticleHandler auth
    }

getArticlesHandler
  :: S.AuthResult UserId
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

  runDB $ do
    groupedArticles <- listAdminArticles mTag mAuthor mSearch limit offset
    totalCount <- countAdminArticles mTag mAuthor mSearch
    let articles = map toAdminArticleResponse $ Map.elems $ unAppendMap groupedArticles
    return $ AdminArticleListResponse articles totalCount
getArticlesHandler _ _ _ _ _ _ = throwError S.err401

toAdminArticleResponse :: ArticleGrouped -> AdminArticle
toAdminArticleResponse
  ( First (Entity aid (art :: DB.Article))
    , First (Entity uid (author :: DB.User))
    , tagsMap
    , (First favCount, First isFav, _)
    ) =
    let tags = map (\(First t) -> t.entityVal.name) $ Map.elems $ unAppendMap tagsMap
        adminAuthor = toAdminUserResponse (Entity uid author)
     in AdminArticle
          (fromIntegral (fromSqlKey aid))
          art.slug
          art.title
          art.description
          art.body
          tags
          art.createdAt
          art.updatedAt
          isFav
          (fromMaybe 0 favCount)
          adminAuthor

deleteArticleHandler :: S.AuthResult UserId -> Text -> App S.NoContent
deleteArticleHandler (S.Authenticated uid) slug = do
  guardAdmin uid
  mArt <- runDB (getArticleBySlug slug)
  case mArt of
    Nothing -> throwError S.err404
    Just (Entity aid _) -> do
      now <- liftIO getCurrentTime
      runDB $ do
        deleteWhere [DB.ArticleTagArticleId ==. aid]
        deleteWhere [DB.CommentArticleId ==. aid]
        deleteWhere [DB.FavoriteArticleId ==. aid]
        delete aid
        -- Audit event log
        _ <- insert $ DB.Log "INFO" ("Deleted article: " <> slug) "ARTICLE" now (Just uid)
        return ()
      return S.NoContent
deleteArticleHandler _ _ = throwError S.err401
