module Infrastructure.Api.Comment.Web.Controller
  ( commentRoute
  ) where

import Data.Text (Text)
import Data.Traversable (for)
import Database.Persist (Entity (..))
import Database.Persist.Sql (fromSqlKey, toSqlKey)
import Effectful.Error.Static (throwError)
import Servant (NamedRoutes)

import Servant qualified as S
import Servant.Auth.Server qualified as S

import Domain.Article (Article (..))
import Infrastructure.Entity.Comment.DTO
  ( Comment (..)
  , CommentListResponse (..)
  , CommentResponse (..)
  , NewCommentRequest (..)
  )
import Infrastructure.Api.Comment.Web.Type
import Infrastructure.Entity.User.DTO (Profile (..))
import Infrastructure.Common.Type.App (App)
import Infrastructure.Interpreter.Real.DB.Schema.Schema (UserId)
import Infrastructure.Interpreter.Real.DB.Schema.Schema qualified as DB

import Capability.Database.ArticleDB
import Capability.Database.CommentDB
import Capability.Database.UserDB

commentRoute :: S.AuthResult UserId -> Text -> S.ServerT (NamedRoutes CommentRoute) App
commentRoute auth slug =
  CommentRoute
    { getCommentList = getCommentListHandler auth slug
    , createComment = createCommentHandler auth slug
    , deleteComment = deleteCommentHandler auth slug
    }

getCommentListHandler :: S.AuthResult UserId -> Text -> App CommentListResponse
getCommentListHandler auth slug = do
  mArt <- getArticleBySlug slug
  case mArt of
    Nothing -> throwError S.err404
    Just Article{articleId = artId} -> do
      let aid = toSqlKey (fromIntegral artId)
      pairs <- getCommentsForArticle aid
      let mUid = case auth of
            S.Authenticated uid -> Just uid
            _ -> Nothing
      comments <- for pairs $ \(Entity cid comm, Entity _ author) -> do
        isFol <- case mUid of
          Just uid -> isFollowing (fromIntegral (fromSqlKey uid)) (fromIntegral (fromSqlKey comm.authorId))
          Nothing -> return False
        let profile = Profile author.username author.bio author.image isFol
        return $
          Comment (fromIntegral (fromSqlKey cid)) comm.createdAt comm.updatedAt comm.body profile
      return $ CommentListResponse comments

createCommentHandler
  :: S.AuthResult UserId -> Text -> NewCommentRequest -> App CommentResponse
createCommentHandler (S.Authenticated uid) slug (NewCommentRequest body) = do
  mArt <- getArticleBySlug slug
  case mArt of
    Nothing -> throwError S.err404
    Just Article{articleId = artId} -> do
      let aid = toSqlKey (fromIntegral artId)
      mPair <- insertComment aid uid body
      case mPair of
        Nothing -> throwError S.err500
        Just (Entity cid comm, Entity _ author) -> do
          let profile = Profile author.username author.bio author.image False
          return $
            CommentResponse $
              Comment (fromIntegral (fromSqlKey cid)) comm.createdAt comm.updatedAt comm.body profile
createCommentHandler _ _ _ = throwError S.err401

deleteCommentHandler :: S.AuthResult UserId -> Text -> Int -> App S.NoContent
deleteCommentHandler (S.Authenticated uid) _ cidInt = do
  let cid = toSqlKey (fromIntegral cidInt)
  mComm <- getComment cid
  case mComm of
    Nothing -> throwError S.err404
    Just comm -> do
      if comm.authorId /= uid
        then throwError S.err403
        else do
          deleteComment cid
          return S.NoContent
deleteCommentHandler _ _ _ = throwError S.err401
