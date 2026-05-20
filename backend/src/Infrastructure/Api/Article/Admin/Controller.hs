module Infrastructure.Api.Article.Admin.Controller
  ( adminArticleRoute
  ) where

import Data.Map.Append (unAppendMap)
import Data.Map.Strict qualified as Map
import Data.Maybe (fromMaybe)
import Data.Semigroup (First (..))
import Data.Text (Text)
import Database.Persist (Entity (..))
import Database.Persist.Sql (fromSqlKey, toSqlKey)
import Effectful.Error.Static (throwError)
import Servant (NamedRoutes)
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Domain.Article (Article (..))
import Infrastructure.Entity.Article.DTO
  ( AdminArticle (..)
  , AdminArticleListResponse (..)
  )
import Infrastructure.Api.Article.Admin.Type
import Infrastructure.Entity.User.DTO (AdminUserResponse (..))
import Infrastructure.Common.Type.App (App)
import Infrastructure.Common.Util.Guard (guardAdmin)
import Infrastructure.Interpreter.Real.DB.Query.Article.Type (ArticleGrouped)
import Infrastructure.Interpreter.Real.DB.Schema.Schema (UserId)
import Infrastructure.Interpreter.Real.DB.Schema.Schema qualified as DB

import Capability.Database.ArticleDB
import Capability.Database.LoggerDB
import Capability.Time

adminArticleRoute :: S.AuthResult UserId -> S.ServerT (NamedRoutes AdminArticleRoute) App
adminArticleRoute auth =
  AdminArticleRoute
    { getArticles = getArticlesHandler auth
    , deleteArticle = deleteAdminArticleHandler auth
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
        adminAuthor =
          AdminUserResponse
            { id = fromIntegral (fromSqlKey uid)
            , username = author.username
            , email = author.email
            , bio = author.bio
            , image = author.image
            , role = author.role
            }
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

deleteAdminArticleHandler :: S.AuthResult UserId -> Text -> App S.NoContent
deleteAdminArticleHandler (S.Authenticated uid) slug = do
  guardAdmin uid
  mArt <- getArticleBySlug slug
  case mArt of
    Nothing -> throwError S.err404
    Just art -> do
      now <- getCurrentTime
      let aid = toSqlKey (fromIntegral art.articleId)
      deleteArticle aid
      _ <-
        insertLog
          "INFO"
          ("Deleted article: " <> slug)
          "ARTICLE"
          now
          (Just (fromIntegral (fromSqlKey uid)))
      return S.NoContent
deleteAdminArticleHandler _ _ = throwError S.err401
