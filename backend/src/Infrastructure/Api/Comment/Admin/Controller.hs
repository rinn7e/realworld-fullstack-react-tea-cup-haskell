module Infrastructure.Api.Comment.Admin.Controller
  ( adminCommentRoute
  ) where

import Data.Text (Text)
import Database.Persist.Sql (fromSqlKey, toSqlKey)
import Effectful
import Effectful.Error.Static (throwError)
import Servant (NamedRoutes)
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Infrastructure.Entity.Comment.DTO
  ( AdminCommentListResponse (..)
  )
import Infrastructure.Api.Comment.Admin.Type
import Infrastructure.Common.Type.App (App)
import Infrastructure.Common.Util.Guard (guardAdmin)
import Infrastructure.Interpreter.DB.Postgres.Schema.Schema (Comment (..), UserId)

import Capability.Database.CommentDB
import Capability.Database.LoggerDB
import Capability.Time

adminCommentRoute :: S.AuthResult UserId -> S.ServerT (NamedRoutes AdminCommentRoute) App
adminCommentRoute auth =
  AdminCommentRoute
    { getComments = getCommentsHandler auth
    , deleteComment = deleteAdminCommentHandler auth
    }

getCommentsHandler
  :: S.AuthResult UserId
  -> Maybe Int
  -> Maybe Int
  -> Maybe Text
  -> Maybe Text
  -> App AdminCommentListResponse
getCommentsHandler (S.Authenticated uid) mLimit mOffset mAuthor mArticleSlug = do
  guardAdmin uid
  let limit = maybe 10 id mLimit
      offset = maybe 0 id mOffset
  (comments, total) <- listAdminComments mAuthor mArticleSlug limit offset
  return $ AdminCommentListResponse comments total
getCommentsHandler _ _ _ _ _ = throwError S.err401

deleteAdminCommentHandler :: S.AuthResult UserId -> Int -> App S.NoContent
deleteAdminCommentHandler (S.Authenticated uid) cidInt = do
  guardAdmin uid
  let cid = toSqlKey (fromIntegral cidInt)
  mTarget <- getComment cid
  case mTarget of
    Nothing -> throwError S.err404
    Just target -> do
      now <- getCurrentTime
      deleteComment cid
      _ <-
        insertLog
          "INFO"
          ("Deleted comment: " <> target.body)
          "COMMENT"
          now
          (Just (fromIntegral (fromSqlKey uid)))
      return S.NoContent
deleteAdminCommentHandler _ _ = throwError S.err401
