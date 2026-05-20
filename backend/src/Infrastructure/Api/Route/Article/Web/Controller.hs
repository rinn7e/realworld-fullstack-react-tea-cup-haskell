module Infrastructure.Api.Route.Article.Web.Controller
  ( webArticleRoute
  ) where

import Data.Maybe (fromMaybe)
import Data.Text (Text)
import Data.Text qualified as T
import Database.Persist.Sql (fromSqlKey)
import Effectful.Error.Static (throwError)
import Servant (NamedRoutes)
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Domain.Article (Article (..), ArticleId (..))
import Domain.User qualified as DU
import Infrastructure.Entity.Article.DTO
  ( ArticleListResponse (..)
  , ArticleResponse (..)
  , NewArticleRequest (..)
  , UpdateArticleRequest (..)
  , toArticleResponse
  )
import Infrastructure.Api.Route.Article.Web.Type
import Infrastructure.Common.Type.App (App)
import Infrastructure.Interpreter.Real.DB.Schema.Schema qualified as DB

import Capability.Database.ArticleDB
import Infrastructure.Api.Route.Comment.Web.Controller qualified as Comm

webArticleRoute :: S.AuthResult DB.UserId -> S.ServerT (NamedRoutes ArticleRoute) App
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

getArticleFeedHandler
  :: S.AuthResult DB.UserId -> Maybe Int -> Maybe Int -> App ArticleListResponse
getArticleFeedHandler (S.Authenticated uid) mLimit mOffset = do
  let limit = maybe 20 id mLimit
      offset = maybe 0 id mOffset
      dUid = DU.UserId $ fromIntegral (fromSqlKey uid)
  articlesWithMetadata <- listFeed dUid limit offset
  totalCount <- countFeed dUid
  let articles = map toArticleResponse articlesWithMetadata
  return $ ArticleListResponse articles totalCount
getArticleFeedHandler _ _ _ = throwError S.err401

getArticleListHandler
  :: S.AuthResult DB.UserId
  -> Maybe Text
  -> Maybe Text
  -> Maybe Text
  -> Maybe Int
  -> Maybe Int
  -> App ArticleListResponse
getArticleListHandler auth mTag mAuthor mFavorited mLimit mOffset = do
  let limit = maybe 20 id mLimit
      offset = maybe 0 id mOffset
      mdUid = case auth of
        S.Authenticated uid -> Just $ DU.UserId $ fromIntegral (fromSqlKey uid)
        _ -> Nothing
  articlesWithMetadata <- listArticles mdUid mTag mAuthor mFavorited limit offset
  totalCount <- countArticles mTag mAuthor mFavorited
  let articles = map toArticleResponse articlesWithMetadata
  return $ ArticleListResponse articles totalCount

createArticleHandler :: S.AuthResult DB.UserId -> NewArticleRequest -> App ArticleResponse
createArticleHandler (S.Authenticated uid) (NewArticleRequest title desc body mTags) = do
  let slug = T.intercalate "-" $ T.words $ T.toLower title
      tags = fromMaybe [] mTags
      dUid = DU.UserId $ fromIntegral (fromSqlKey uid)
  _ <- createArticle slug title desc body dUid tags
  mArticleWithMetadata <- getArticleWithAuthor (Just dUid) slug
  case mArticleWithMetadata of
    Just grouped -> return $ ArticleResponse $ toArticleResponse grouped
    Nothing -> throwError S.err500
createArticleHandler _ _ = throwError S.err401

getArticleOneHandler :: S.AuthResult DB.UserId -> Text -> App ArticleResponse
getArticleOneHandler auth slug = do
  let mdUid = case auth of
        S.Authenticated uid -> Just $ DU.UserId $ fromIntegral (fromSqlKey uid)
        _ -> Nothing
  mArticleWithMetadata <- getArticleWithAuthor mdUid slug
  case mArticleWithMetadata of
    Nothing -> throwError S.err404
    Just grouped -> return $ ArticleResponse $ toArticleResponse grouped

updateArticleHandler
  :: S.AuthResult DB.UserId -> Text -> UpdateArticleRequest -> App ArticleResponse
updateArticleHandler (S.Authenticated uid) slug (UpdateArticleRequest mTitle mDesc mBody mTags) = do
  mArt <- getArticleBySlug slug
  case mArt of
    Nothing -> throwError S.err404
    Just art -> do
      let dUid = DU.UserId $ fromIntegral (fromSqlKey uid)
      if art.authorId /= dUid
        then throwError S.err403
        else do
          let newSlug = maybe art.slug (T.intercalate "-" . T.words . T.toLower) mTitle
              newTitle = maybe art.title id mTitle
              newDesc = maybe art.description id mDesc
              newBody = maybe art.body id mBody
          _ <- updateArticle art.articleId newSlug newTitle newDesc newBody mTags
          mArticleWithMetadata <- getArticleWithAuthor (Just dUid) newSlug
          case mArticleWithMetadata of
            Just grouped -> return $ ArticleResponse $ toArticleResponse grouped
            Nothing -> throwError S.err500
updateArticleHandler _ _ _ = throwError S.err401

deleteArticleHandler :: S.AuthResult DB.UserId -> Text -> App S.NoContent
deleteArticleHandler (S.Authenticated uid) slug = do
  mArt <- getArticleBySlug slug
  case mArt of
    Nothing -> throwError S.err404
    Just art -> do
      let dUid = DU.UserId $ fromIntegral (fromSqlKey uid)
      if art.authorId /= dUid
        then throwError S.err403
        else do
          deleteArticle art.articleId
          return S.NoContent
deleteArticleHandler _ _ = throwError S.err401

favoriteArticleHandler :: S.AuthResult DB.UserId -> Text -> App ArticleResponse
favoriteArticleHandler (S.Authenticated uid) slug = do
  mArt <- getArticleBySlug slug
  case mArt of
    Nothing -> throwError S.err404
    Just art -> do
      let dUid = DU.UserId $ fromIntegral (fromSqlKey uid)
      favoriteArticle dUid art.articleId
      mArticleWithMetadata <- getArticleWithAuthor (Just dUid) slug
      case mArticleWithMetadata of
        Just grouped -> return $ ArticleResponse $ toArticleResponse grouped
        Nothing -> throwError S.err500
favoriteArticleHandler _ _ = throwError S.err401

unfavoriteArticleHandler :: S.AuthResult DB.UserId -> Text -> App ArticleResponse
unfavoriteArticleHandler (S.Authenticated uid) slug = do
  mArt <- getArticleBySlug slug
  case mArt of
    Nothing -> throwError S.err404
    Just art -> do
      let dUid = DU.UserId $ fromIntegral (fromSqlKey uid)
      unfavoriteArticle dUid art.articleId
      mArticleWithMetadata <- getArticleWithAuthor (Just dUid) slug
      case mArticleWithMetadata of
        Just grouped -> return $ ArticleResponse $ toArticleResponse grouped
        Nothing -> throwError S.err500
unfavoriteArticleHandler _ _ = throwError S.err401
