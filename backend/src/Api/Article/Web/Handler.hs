module Api.Article.Web.Handler where

import Data.Map.Append (unAppendMap)
import Data.Map.Strict qualified as Map
import Data.Text (Text)
import Data.Text qualified as T
import Data.Time (getCurrentTime)
import Database.Persist
  ( delete
  , deleteBy
  , deleteWhere
  , get
  , insert
  , insertBy
  , replace
  , (==.)
  )
import Database.Persist.Sql (Entity (..), SqlPersistT)
import Effectful (liftIO)
import Effectful.Error.Static (throwError)
import Servant (NamedRoutes)
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Api.Article.Web.Type
import Api.Comment.Web.Handler qualified as Comm
import Common.Type.App (App)
import DB.Schema.Type (UserId)
import DB.Schema.Type qualified as DB
import DB.Util (runDB)
import Entity.Article.Api
  ( ArticleListResponse (..)
  , ArticleResponse (..)
  , NewArticleRequest (..)
  , UpdateArticleRequest (..)
  , toArticleResponse
  )
import Entity.Article.Query

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

getArticleFeedHandler
  :: S.AuthResult UserId -> Maybe Int -> Maybe Int -> App ArticleListResponse
getArticleFeedHandler (S.Authenticated uid) mLimit mOffset = do
  let limit = maybe 20 id mLimit
  let offset = maybe 0 id mOffset
  groupedArticles <- runDB (listFeed uid limit offset)
  totalCount <- runDB (countFeed uid)
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
  let offset = maybe 0 id mOffset
  let mUid = case auth of
        S.Authenticated uid -> Just uid
        _ -> Nothing
  groupedArticles <- runDB (listArticles mUid mTag mAuthor mFavorited limit offset)
  totalCount <- runDB (countArticles mTag mAuthor mFavorited)
  let articles = map toArticleResponse $ Map.elems $ unAppendMap groupedArticles
  return $ ArticleListResponse articles totalCount

createArticleHandler :: S.AuthResult UserId -> NewArticleRequest -> App ArticleResponse
createArticleHandler (S.Authenticated uid) (NewArticleRequest title desc body mTags) = do
  now <- liftIO getCurrentTime
  let slug = T.intercalate "-" $ T.words $ T.toLower title
  let article = DB.Article slug title desc body uid now now
  aid <- runDB (insert article)

  case mTags of
    Just tags -> runDB (mapM_ (ensureTag aid) tags)
    Nothing -> return ()

  mGrouped <- runDB (getArticleWithAuthor (Just uid) slug)
  case mGrouped of
    Just grouped -> return $ ArticleResponse $ toArticleResponse grouped
    Nothing -> throwError S.err500
createArticleHandler _ _ = throwError S.err401

getArticleOneHandler :: S.AuthResult UserId -> Text -> App ArticleResponse
getArticleOneHandler auth slug = do
  let mUid = case auth of
        S.Authenticated uid -> Just uid
        _ -> Nothing
  mGrouped <- runDB (getArticleWithAuthor mUid slug)
  case mGrouped of
    Nothing -> throwError S.err404
    Just grouped -> return $ ArticleResponse $ toArticleResponse grouped

updateArticleHandler
  :: S.AuthResult UserId -> Text -> UpdateArticleRequest -> App ArticleResponse
updateArticleHandler (S.Authenticated uid) slug (UpdateArticleRequest mTitle mDesc mBody mTags) = do
  mArt <- runDB (getArticleBySlug slug)
  case mArt of
    Nothing -> throwError S.err404
    Just (Entity aid art) -> do
      if art.authorId /= uid
        then throwError S.err403
        else do
          now <- liftIO getCurrentTime
          let newSlug = maybe art.slug (T.intercalate "-" . T.words . T.toLower) mTitle
          let newArt =
                art
                  { DB.title = maybe art.title id mTitle
                  , DB.slug = newSlug
                  , DB.description = maybe art.description id mDesc
                  , DB.body = maybe art.body id mBody
                  , DB.updatedAt = now
                  }
          runDB $ do
            replace aid newArt
            -- Update tags if provided in the request
            case mTags of
              Just tags -> do
                -- Clear existing tags and link new ones
                deleteWhere [DB.ArticleTagArticleId ==. aid]
                mapM_ (ensureTag aid) tags
              Nothing -> return ()

          mGrouped <- runDB (getArticleWithAuthor (Just uid) newSlug)
          case mGrouped of
            Just grouped -> return $ ArticleResponse $ toArticleResponse grouped
            Nothing -> throwError S.err500
updateArticleHandler _ _ _ = throwError S.err401

ensureTag :: DB.ArticleId -> Text -> SqlPersistT IO ()
ensureTag aid tagName = do
  tid <- do
    res <- insertBy (DB.Tag tagName)
    case res of
      Left (Entity tId _) -> return tId
      Right tId -> return tId
  _ <- insertBy (DB.ArticleTag aid tid)
  return ()

deleteArticleHandler :: S.AuthResult UserId -> Text -> App S.NoContent
deleteArticleHandler (S.Authenticated uid) slug = do
  mArt <- runDB (getArticleBySlug slug)
  case mArt of
    Nothing -> throwError S.err404
    Just (Entity aid art) -> do
      if art.authorId /= uid
        then throwError S.err403
        else do
          runDB $ do
            deleteWhere [DB.ArticleTagArticleId ==. aid]
            deleteWhere [DB.CommentArticleId ==. aid]
            deleteWhere [DB.FavoriteArticleId ==. aid]
            delete aid
          return S.NoContent
deleteArticleHandler _ _ = throwError S.err401

favoriteArticleHandler :: S.AuthResult UserId -> Text -> App ArticleResponse
favoriteArticleHandler (S.Authenticated uid) slug = do
  mArt <- runDB (getArticleBySlug slug)
  case mArt of
    Nothing -> throwError S.err404
    Just (Entity aid _) -> do
      _ <- runDB (insertBy (DB.Favorite uid aid))
      mGrouped <- runDB (getArticleWithAuthor (Just uid) slug)
      case mGrouped of
        Just grouped -> return $ ArticleResponse $ toArticleResponse grouped
        Nothing -> throwError S.err500
favoriteArticleHandler _ _ = throwError S.err401

unfavoriteArticleHandler :: S.AuthResult UserId -> Text -> App ArticleResponse
unfavoriteArticleHandler (S.Authenticated uid) slug = do
  mArt <- runDB (getArticleBySlug slug)
  case mArt of
    Nothing -> throwError S.err404
    Just (Entity aid _) -> do
      runDB (deleteBy (DB.UniqueFavorite uid aid))
      mGrouped <- runDB (getArticleWithAuthor (Just uid) slug)
      case mGrouped of
        Just grouped -> return $ ArticleResponse $ toArticleResponse grouped
        Nothing -> throwError S.err500
unfavoriteArticleHandler _ _ = throwError S.err401
