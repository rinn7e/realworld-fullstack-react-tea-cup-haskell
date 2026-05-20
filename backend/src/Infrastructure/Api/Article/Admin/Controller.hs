module Infrastructure.Api.Article.Admin.Controller
  ( adminArticleRoute
  ) where

import Data.Map.Append (unAppendMap)
import Data.Map.Strict qualified as Map
import Data.Semigroup (First (..))
import Data.Text (Text)
import Database.Persist.Sql (fromSqlKey)
import Effectful.Error.Static (throwError)
import Servant (NamedRoutes)
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Domain.Article (Article (..), ArticleId (..))
import Domain.Article qualified as D
import Domain.Tag qualified as DT
import Domain.User qualified as DU
import Infrastructure.Entity.Article.DTO
  ( AdminArticle (..)
  , AdminArticleListResponse (..)
  )
import Infrastructure.Api.Article.Admin.Type
import Infrastructure.Entity.User.DTO (AdminUserResponse (..))
import Infrastructure.Common.Type.App (App)
import Infrastructure.Common.Util.Guard (guardAdmin)
import Infrastructure.Interpreter.Real.DB.Schema.Schema qualified as DB

import Capability.Database.ArticleDB
import Capability.Database.LoggerDB
import Capability.Time

adminArticleRoute :: S.AuthResult DB.UserId -> S.ServerT (NamedRoutes AdminArticleRoute) App
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
  groupedArticles <- listAdminArticles mTag mAuthor mSearch limit offset
  totalCount <- countAdminArticles mTag mAuthor mSearch
  let articles = map toAdminArticleResponse $ Map.elems $ unAppendMap groupedArticles
  return $ AdminArticleListResponse articles totalCount
getArticlesHandler _ _ _ _ _ _ = throwError S.err401

toAdminArticleResponse :: D.ArticleGrouped -> AdminArticle
toAdminArticleResponse ag =
  let art = ag.article.getFirst
      author = ag.author.getFirst
      tags = map (\(DT.Tag _ n) -> n) ag.tags
      isFav = ag.isFavorited.getFirst
      favCount = ag.favoritesCount.getFirst
      adminAuthor =
        AdminUserResponse
          { id = author.userId.unUserId
          , username = author.username
          , email = author.email
          , bio = author.bio
          , image = author.image
          , role = author.role
          }
   in AdminArticle
        art.articleId.unArticleId
        art.slug
        art.title
        art.description
        art.body
        tags
        art.createdAt
        art.updatedAt
        isFav
        favCount
        adminAuthor

deleteAdminArticleHandler :: S.AuthResult DB.UserId -> Text -> App S.NoContent
deleteAdminArticleHandler (S.Authenticated uid) slug = do
  guardAdmin uid
  mArt <- getArticleBySlug slug
  case mArt of
    Nothing -> throwError S.err404
    Just art -> do
      now <- getCurrentTime
      deleteArticle art.articleId
      let dUid = DU.UserId $ fromIntegral (fromSqlKey uid)
      _ <-
        insertLog
          "INFO"
          ("Deleted article: " <> slug)
          "ARTICLE"
          now
          (Just dUid)
      return S.NoContent
deleteAdminArticleHandler _ _ = throwError S.err401
