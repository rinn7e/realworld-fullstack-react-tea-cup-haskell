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

import Domain.Article (Article (..), ArticleId (..))
import Domain.Comment (CommentId (..))
import Domain.Comment qualified as DC
import Domain.User qualified as DU
import Infrastructure.Entity.Comment.DTO
  ( Comment (..)
  , CommentListResponse (..)
  , CommentResponse (..)
  , NewCommentRequest (..)
  )
import Infrastructure.Api.Route.Comment.Web.Type
import Infrastructure.Entity.User.DTO (Profile (..))
import Infrastructure.Common.Type.App (App)
import Infrastructure.Interpreter.Real.DB.Schema.Schema qualified as DB

import Capability.Database.ArticleDB
import Capability.Database.CommentDB
import Capability.Database.UserDB

commentRoute :: S.AuthResult DB.UserId -> Text -> S.ServerT (NamedRoutes CommentRoute) App
commentRoute auth slug =
  CommentRoute
    { getCommentList = getCommentListHandler auth slug
    , createComment = createCommentHandler auth slug
    , deleteComment = deleteCommentHandler auth slug
    }

getCommentListHandler :: S.AuthResult DB.UserId -> Text -> App CommentListResponse
getCommentListHandler auth slug = do
  mArt <- getArticleBySlug slug
  case mArt of
    Nothing -> throwError S.err404
    Just Article{articleId = aid} -> do
      pairs <- getCommentsForArticle aid
      let mdUid = case auth of
            S.Authenticated uid -> Just $ DU.UserId $ fromIntegral (fromSqlKey uid)
            _ -> Nothing
      comments <- for pairs $ \(comm, author) -> do
        isFol <- case mdUid of
          Just dUid -> isFollowing dUid author.userId
          Nothing -> return False
        let profile = Profile author.username author.bio author.image isFol
        return $
          Comment (comm.commentId.unCommentId) comm.createdAt comm.updatedAt comm.body profile
      return $ CommentListResponse comments

createCommentHandler
  :: S.AuthResult DB.UserId -> Text -> NewCommentRequest -> App CommentResponse
createCommentHandler (S.Authenticated uid) slug (NewCommentRequest body) = do
  mArt <- getArticleBySlug slug
  case mArt of
    Nothing -> throwError S.err404
    Just Article{articleId = aid} -> do
      let dUid = DU.UserId $ fromIntegral (fromSqlKey uid)
      mPair <- insertComment aid dUid body
      case mPair of
        Nothing -> throwError S.err500
        Just (comm, author) -> do
          let profile = Profile author.username author.bio author.image False
          return $
            CommentResponse $
              Comment (comm.commentId.unCommentId) comm.createdAt comm.updatedAt comm.body profile
createCommentHandler _ _ _ = throwError S.err401

deleteCommentHandler :: S.AuthResult DB.UserId -> Text -> Int -> App S.NoContent
deleteCommentHandler (S.Authenticated uid) _ cidInt = do
  let dUid = DU.UserId $ fromIntegral (fromSqlKey uid)
  let cid = CommentId cidInt
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
