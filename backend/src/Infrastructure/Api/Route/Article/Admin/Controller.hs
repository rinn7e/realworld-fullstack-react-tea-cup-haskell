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
import Domain.Type qualified as DT
import Domain.Type qualified as DU
import Infrastructure.Api.DTO.Article
  ( AdminArticle (..)
  , AdminArticleListResponse (..)
  )
import Infrastructure.Api.Route.Article.Admin.Type
import Infrastructure.Api.DTO.User (AdminUserResponse (..))
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
  articlesWithMetadata <- listAdminArticles mTag mAuthor mSearch limit offset
  totalCount <- countAdminArticles mTag mAuthor mSearch
  let articles = map toAdminArticleResponse articlesWithMetadata
  return $ AdminArticleListResponse articles totalCount
getArticlesHandler _ _ _ _ _ _ = throwError S.err401

toAdminArticleResponse :: D.ArticleWithMetadata -> AdminArticle
toAdminArticleResponse am =
  let art = am.article
      author = am.author
      tags = map (\(DT.Tag _ n) -> n) am.tags
      isFav = am.isFavorited
      favCount = am.favoritesCount
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
