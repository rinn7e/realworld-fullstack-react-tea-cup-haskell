module Infrastructure.Api.Route.Comment.Web.Controller
  ( commentRoute
  ) where

import Data.Text (Text)
import Data.Traversable (for)
import Database.Persist.Sql (fromSqlKey)
import Effectful.Error.Static (throwError)
import Servant (NamedRoutes)

import Servant qualified as S
import Servant.Auth.Server qualified as S

import Domain.Type (Article (..))
import Domain.Type qualified as D
import Infrastructure.Api.DTO qualified as Api
import Infrastructure.Api.Route.Comment.Web.Type
import Infrastructure.Common.Type.App (App)
import Infrastructure.Interpreter.Real.DB.Schema.Schema qualified as DB

import Capability.Database.ArticleDB
import Capability.Database.CommentDB
import Capability.Database.UserDB

commentRoute
  :: S.AuthResult DB.UserId -> D.ArticleSlug -> S.ServerT (NamedRoutes CommentRoute) App
commentRoute auth slug =
  CommentRoute
    { getCommentList = getCommentListHandler auth slug
    , createComment = createCommentHandler auth slug
    , deleteComment = deleteCommentHandler auth slug
    }

getCommentListHandler
  :: S.AuthResult DB.UserId -> D.ArticleSlug -> App Api.CommentListResponse
getCommentListHandler auth slug = do
  mArt <- getArticleBySlug slug
  case mArt of
    Nothing -> throwError S.err404
    Just Article{articleId = aid} -> do
      pairs <- getCommentsForArticle aid
      let mdUid = case auth of
            S.Authenticated uid -> Just $ D.UserId $ fromIntegral (fromSqlKey uid)
            _ -> Nothing
      comments <- for pairs $ \(comm, author) -> do
        isFol <- case mdUid of
          Just dUid -> isFollowing dUid author.userId
          Nothing -> return False
        return $ Api.toCommentDTO comm author isFol
      return $ Api.CommentListResponse comments (length comments)

createCommentHandler
  :: S.AuthResult DB.UserId
  -> D.ArticleSlug
  -> Api.CommentWrapper Api.NewCommentRequest
  -> App Api.CommentResponse
createCommentHandler (S.Authenticated uid) slug (Api.CommentWrapper (Api.NewCommentRequest body)) = do
  mArt <- getArticleBySlug slug
  case mArt of
    Nothing -> throwError S.err404
    Just Article{articleId = aid} -> do
      let dUid = D.UserId $ fromIntegral (fromSqlKey uid)
      mPair <- insertComment aid dUid body
      case mPair of
        Nothing -> throwError S.err500
        Just (comm, author) -> do
          return $ Api.CommentResponse $ Api.toCommentDTO comm author False
createCommentHandler _ _ _ = throwError S.err401

deleteCommentHandler :: S.AuthResult DB.UserId -> D.ArticleSlug -> Int -> App S.NoContent
deleteCommentHandler (S.Authenticated uid) _ cidInt = do
  let dUid = D.UserId $ fromIntegral (fromSqlKey uid)
  let cid = D.CommentId cidInt
  mComm <- getComment cid
  case mComm of
    Nothing -> throwError S.err404
    Just comm -> do
      if comm.authorId /= dUid
        then throwError S.err403
        else do
          deleteComment cid
          return S.NoContent
deleteCommentHandler _ _ _ = throwError S.err401
