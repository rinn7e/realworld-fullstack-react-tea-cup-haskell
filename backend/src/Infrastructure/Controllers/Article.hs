module Infrastructure.Controllers.Article
  ( webArticleRoute
  , adminArticleRoute
  ) where

import Data.Map.Append (unAppendMap)
import Data.Map.Strict qualified as Map
import Data.Maybe (fromMaybe)
import Data.Semigroup (First (..))
import Data.Text (Text)
import Data.Text qualified as T
import Database.Persist (Entity (..))
import Database.Persist.Sql (fromSqlKey, toSqlKey)
import Effectful
import Effectful.Error.Static (throwError)
import Servant (NamedRoutes)
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Domain.Article (Article (..))
import Infrastructure.Api.Article.Admin.Type
import Infrastructure.Api.Article.Admin.DTO
  ( AdminArticle (..)
  , AdminArticleListResponse (..)
  )
import Infrastructure.Api.Article.Web.DTO
  ( ArticleListResponse (..)
  , ArticleResponse (..)
  , NewArticleRequest (..)
  , UpdateArticleRequest (..)
  , toArticleResponse
  )
import Infrastructure.Api.Article.Web.Type
import Infrastructure.Api.User.Admin.DTO (AdminUserResponse (..))
import Infrastructure.Common.Type.App (App)
import Infrastructure.Common.Util.Guard (guardAdmin)
import Infrastructure.Interpreter.DB.Postgres.Query.ArticleType (ArticleGrouped)
import Infrastructure.Interpreter.DB.Postgres.Schema.Schema (UserId)
import Infrastructure.Interpreter.DB.Postgres.Schema.Schema qualified as DB

import Capability.Database.ArticleDB
import Capability.Database.LoggerDB
import Capability.Time
import Infrastructure.Controllers.Comment qualified as Comm

webArticleRoute :: S.AuthResult UserId -> S.ServerT (NamedRoutes ArticleRoute) App
webArticleRoute auth =
  ArticleRoute
    { getArticleFeed = getArticleFeedHandler auth
    , getArticleList = getArticleListHandler auth
    , createArticle = createArticleHandler auth
    , getArticleOne = getArticleOneHandler auth
    , updateArticle = updateArticleHandler auth
    , deleteArticle = deleteArticleHandler auth
    , favoriteArticle = favoriteArticleHandler auth
    , unfavoriteArticle = unfavoriteArticleHandler auth
    , comments = Comm.commentRoute auth
    }

adminArticleRoute :: S.AuthResult UserId -> S.ServerT (NamedRoutes AdminArticleRoute) App
adminArticleRoute auth =
  AdminArticleRoute
    { getArticles = getArticlesHandler auth
    , deleteArticle = deleteAdminArticleHandler auth
    }

getArticleFeedHandler
  :: S.AuthResult UserId -> Maybe Int -> Maybe Int -> App ArticleListResponse
getArticleFeedHandler (S.Authenticated uid) mLimit mOffset = do
  let limit = maybe 20 id mLimit
      offset = maybe 0 id mOffset
  groupedArticles <- listFeed uid limit offset
  totalCount <- countFeed uid
  let articles = map toArticleResponse $ Map.elems $ unAppendMap groupedArticles
  return $ ArticleListResponse articles totalCount
getArticleFeedHandler _ _ _ = throwError S.err401

getArticleListHandler
  :: S.AuthResult UserId
  -> Maybe Text
  -> Maybe Text
  -> Maybe Text
  -> Maybe Int
  -> Maybe Int
  -> App ArticleListResponse
getArticleListHandler auth mTag mAuthor mFavorited mLimit mOffset = do
  let limit = maybe 20 id mLimit
      offset = maybe 0 id mOffset
      mUid = case auth of
        S.Authenticated uid -> Just uid
        _ -> Nothing
  groupedArticles <- listArticles mUid mTag mAuthor mFavorited limit offset
  totalCount <- countArticles mTag mAuthor mFavorited
  let articles = map toArticleResponse $ Map.elems $ unAppendMap groupedArticles
  return $ ArticleListResponse articles totalCount

createArticleHandler :: S.AuthResult UserId -> NewArticleRequest -> App ArticleResponse
createArticleHandler (S.Authenticated uid) (NewArticleRequest title desc body mTags) = do
  let slug = T.intercalate "-" $ T.words $ T.toLower title
      tags = fromMaybe [] mTags
  _ <- createArticle slug title desc body uid tags
  mGrouped <- getArticleWithAuthor (Just uid) slug
  case mGrouped of
    Just grouped -> return $ ArticleResponse $ toArticleResponse grouped
    Nothing -> throwError S.err500
createArticleHandler _ _ = throwError S.err401

getArticleOneHandler :: S.AuthResult UserId -> Text -> App ArticleResponse
getArticleOneHandler auth slug = do
  let mUid = case auth of
        S.Authenticated uid -> Just uid
        _ -> Nothing
  mGrouped <- getArticleWithAuthor mUid slug
  case mGrouped of
    Nothing -> throwError S.err404
    Just grouped -> return $ ArticleResponse $ toArticleResponse grouped

updateArticleHandler
  :: S.AuthResult UserId -> Text -> UpdateArticleRequest -> App ArticleResponse
updateArticleHandler (S.Authenticated uid) slug (UpdateArticleRequest mTitle mDesc mBody mTags) = do
  mArt <- getArticleBySlug slug
  case mArt of
    Nothing -> throwError S.err404
    Just art -> do
      let artAuthorId = toSqlKey (fromIntegral art.authorId)
      if artAuthorId /= uid
        then throwError S.err403
        else do
          let newSlug = maybe art.slug (T.intercalate "-" . T.words . T.toLower) mTitle
              newTitle = maybe art.title id mTitle
              newDesc = maybe art.description id mDesc
              newBody = maybe art.body id mBody
              aid = toSqlKey (fromIntegral art.articleId)
          _ <- updateArticle aid newSlug newTitle newDesc newBody mTags
          mGrouped <- getArticleWithAuthor (Just uid) newSlug
          case mGrouped of
            Just grouped -> return $ ArticleResponse $ toArticleResponse grouped
            Nothing -> throwError S.err500
updateArticleHandler _ _ _ = throwError S.err401

deleteArticleHandler :: S.AuthResult UserId -> Text -> App S.NoContent
deleteArticleHandler (S.Authenticated uid) slug = do
  mArt <- getArticleBySlug slug
  case mArt of
    Nothing -> throwError S.err404
    Just art -> do
      let artAuthorId = toSqlKey (fromIntegral art.authorId)
      if artAuthorId /= uid
        then throwError S.err403
        else do
          let aid = toSqlKey (fromIntegral art.articleId)
          deleteArticle aid
          return S.NoContent
deleteArticleHandler _ _ = throwError S.err401

favoriteArticleHandler :: S.AuthResult UserId -> Text -> App ArticleResponse
favoriteArticleHandler (S.Authenticated uid) slug = do
  mArt <- getArticleBySlug slug
  case mArt of
    Nothing -> throwError S.err404
    Just art -> do
      let aid = toSqlKey (fromIntegral art.articleId)
      favoriteArticle uid aid
      mGrouped <- getArticleWithAuthor (Just uid) slug
      case mGrouped of
        Just grouped -> return $ ArticleResponse $ toArticleResponse grouped
        Nothing -> throwError S.err500
favoriteArticleHandler _ _ = throwError S.err401

unfavoriteArticleHandler :: S.AuthResult UserId -> Text -> App ArticleResponse
unfavoriteArticleHandler (S.Authenticated uid) slug = do
  mArt <- getArticleBySlug slug
  case mArt of
    Nothing -> throwError S.err404
    Just art -> do
      let aid = toSqlKey (fromIntegral art.articleId)
      unfavoriteArticle uid aid
      mGrouped <- getArticleWithAuthor (Just uid) slug
      case mGrouped of
        Just grouped -> return $ ArticleResponse $ toArticleResponse grouped
        Nothing -> throwError S.err500
unfavoriteArticleHandler _ _ = throwError S.err401

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
