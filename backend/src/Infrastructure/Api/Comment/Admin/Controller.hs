module Infrastructure.Api.Comment.Admin.Controller
  ( adminCommentRoute
  ) where

import Data.Text (Text)
import Database.Persist.Sql (fromSqlKey)
import Effectful.Error.Static (throwError)
import Servant (NamedRoutes)

import Servant qualified as S
import Servant.Auth.Server qualified as S

import Infrastructure.Entity.Comment.DTO
  ( AdminCommentListResponse (..)
  )
import Infrastructure.Entity.Comment.DTO qualified as DTO
import Infrastructure.Api.Comment.Admin.Type
import Infrastructure.Common.Type.App (App)
import Infrastructure.Common.Util.Guard (guardAdmin)
import Infrastructure.Interpreter.Real.DB.Schema.Schema qualified as DB

import Capability.Database.CommentDB
import Capability.Database.LoggerDB
import Capability.Time
import Domain.Comment qualified as DC
import Domain.User qualified as DU

adminCommentRoute :: S.AuthResult DB.UserId -> S.ServerT (NamedRoutes AdminCommentRoute) App
adminCommentRoute auth =
  AdminCommentRoute
    { getComments = getCommentsHandler auth
    , deleteComment = deleteAdminCommentHandler auth
    }

toDTOAdminCommentResponse :: DC.AdminCommentResponse -> DTO.AdminCommentResponse
toDTOAdminCommentResponse r =
  DTO.AdminCommentResponse
    { DTO.id = r.id.unCommentId
    , DTO.body = r.body
    , DTO.createdAt = r.createdAt
    , DTO.articleSlug = r.articleSlug
    , DTO.authorUsername = r.authorUsername
    }

getCommentsHandler
  :: S.AuthResult DB.UserId
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
  let dtoComments = map toDTOAdminCommentResponse comments
  return $ AdminCommentListResponse dtoComments total
getCommentsHandler _ _ _ _ _ = throwError S.err401

deleteAdminCommentHandler :: S.AuthResult DB.UserId -> Int -> App S.NoContent
deleteAdminCommentHandler (S.Authenticated uid) cidInt = do
  guardAdmin uid
  let cid = DC.CommentId cidInt
  mTarget <- getComment cid
  case mTarget of
    Nothing -> throwError S.err404
    Just target -> do
      now <- getCurrentTime
      deleteComment cid
      let dUid = DU.UserId $ fromIntegral (fromSqlKey uid)
      _ <-
        insertLog
          "INFO"
          ("Deleted comment: " <> target.body)
          "COMMENT"
          now
          (Just dUid)
      return S.NoContent
deleteAdminCommentHandler _ _ = throwError S.err401
