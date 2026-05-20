module Api.Comment.Web.Handler where

import Data.Text (Text)
import Data.Time (getCurrentTime)
import Database.Persist (delete, get, insert)
import Database.Persist.Sql (Entity (..), toSqlKey)
import Effectful (liftIO)
import Effectful.Error.Static (throwError)
import Effectful.Reader.Static (ask)
import Servant (NamedRoutes)
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Api.Comment.Web.Type
import Common.Type.App (App, AppEnv (..))
import DB.Schema.Type (UserId)
import DB.Schema.Type qualified as DB
import DB.Util (runDB)
import Entity.Article.Query (getArticleBySlug)
import Entity.Comment.Api
  ( CommentListResponse (..)
  , CommentResponse (..)
  , NewCommentRequest (..)
  , toCommentResponse
  )
import Entity.Comment.Query (getCommentsForArticle)

commentRoute :: S.AuthResult UserId -> Text -> S.ServerT (NamedRoutes CommentRoute) App
commentRoute auth slug =
  CommentRoute
    { getCommentList = getCommentListHandler auth slug
    , createComment = createCommentHandler auth slug
    , deleteComment = deleteCommentHandler auth slug
    }

getCommentListHandler :: S.AuthResult UserId -> Text -> App CommentListResponse
getCommentListHandler auth slug = do
  env <- ask @AppEnv
  mArt <- runDB (getArticleBySlug slug)
  case mArt of
    Nothing -> throwError S.err404
    Just (Entity aid _) -> do
      pairs <- runDB (getCommentsForArticle aid)
      let mUid = case auth of
            S.Authenticated uid -> Just uid
            _ -> Nothing
      comments <- runDB (mapM (toCommentResponse env mUid) pairs)
      return $ CommentListResponse comments

createCommentHandler
  :: S.AuthResult UserId -> Text -> NewCommentRequest -> App CommentResponse
createCommentHandler (S.Authenticated uid) slug (NewCommentRequest body) = do
  env <- ask @AppEnv
  mArt <- runDB (getArticleBySlug slug)
  case mArt of
    Nothing -> throwError S.err404
    Just (Entity aid _) -> do
      now <- liftIO getCurrentTime
      let comment = DB.Comment body uid aid now now
      cid <- runDB (insert comment)
      mUser <- runDB (get uid)
      case mUser of
        Nothing -> throwError S.err500
        Just u ->
          CommentResponse
            <$> runDB (toCommentResponse env (Just uid) (Entity cid comment, Entity uid u))
createCommentHandler _ _ _ = throwError S.err401

deleteCommentHandler :: S.AuthResult UserId -> Text -> Int -> App S.NoContent
deleteCommentHandler (S.Authenticated uid) _ cidInt = do
  let cid :: DB.CommentId = toSqlKey (fromIntegral cidInt)
  mComm <- runDB (get cid)
  case mComm of
    Nothing -> throwError S.err404
    Just comm -> do
      if comm.authorId /= uid
        then throwError S.err403
        else do
          runDB (delete cid)
          return S.NoContent
deleteCommentHandler _ _ _ = throwError S.err401
