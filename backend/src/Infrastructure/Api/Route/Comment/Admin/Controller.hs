module Infrastructure.Api.Route.Comment.Admin.Controller
  ( adminCommentRoute
  ) where

import Data.Text (Text)
import Database.Persist.Sql (fromSqlKey)
import Effectful.Error.Static (throwError)
import Servant (NamedRoutes)

import Servant qualified as S
import Servant.Auth.Server qualified as S

import Infrastructure.Api.DTO qualified as Api
import Infrastructure.Api.Route.Comment.Admin.Type
import Infrastructure.Common.Type.App (App)
import Infrastructure.Common.Util.Guard (guardAdmin)
import Infrastructure.Interpreter.Real.DB.Schema.Schema qualified as DB

import Capability.Database.CommentDB
import Capability.Database.LoggerDB
import Capability.Time
import Domain.Type qualified as D

adminCommentRoute
  :: S.AuthResult DB.UserId -> S.ServerT (NamedRoutes AdminCommentRoute) App
adminCommentRoute auth =
  AdminCommentRoute
    { getComments = getCommentsHandler auth
    , deleteComment = deleteAdminCommentHandler auth
    }

getCommentsHandler
  :: S.AuthResult DB.UserId
  -> Maybe Int
  -> Maybe Int
  -> Maybe D.Username
  -> Maybe D.ArticleSlug
  -> App Api.CommentListResponse
getCommentsHandler (S.Authenticated uid) mLimit mOffset mAuthor mArticleSlug = do
  guardAdmin uid
  let limit = maybe 10 id mLimit
      offset = maybe 0 id mOffset
  (comments, total) <- listAdminComments mAuthor mArticleSlug limit offset
  let dtoComments = map Api.toCommentDTOFromDetail comments
  return $ Api.CommentListResponse dtoComments total
getCommentsHandler _ _ _ _ _ = throwError S.err401

deleteAdminCommentHandler :: S.AuthResult DB.UserId -> Int -> App S.NoContent
deleteAdminCommentHandler (S.Authenticated uid) cidInt = do
  guardAdmin uid
  let cid = D.CommentId cidInt
  mTarget <- getComment cid
  case mTarget of
    Nothing -> throwError S.err404
    Just target -> do
      now <- getCurrentTime
      deleteComment cid
      let dUid = D.UserId $ fromIntegral (fromSqlKey uid)
      _ <-
        insertLog
          D.INFO
          (D.LogMessage ("Deleted comment: " <> target.body.unCommentBody))
          (D.LogSource "COMMENT")
          now
          (Just dUid)
      return S.NoContent
deleteAdminCommentHandler _ _ = throwError S.err401
