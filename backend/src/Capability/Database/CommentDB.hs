module Capability.Database.CommentDB where

import Data.Text (Text)
import Database.Persist.Sql (Entity)
import Effectful
import Effectful.Dispatch.Dynamic
import Infrastructure.Entity.Comment.DTO (AdminCommentResponse)
import Infrastructure.Interpreter.DB.Postgres.Schema.Schema
  ( ArticleId
  , Comment
  , CommentId
  , User
  , UserId
  )

data CommentDB :: Effect where
  GetCommentsForArticle :: ArticleId -> CommentDB m [(Entity Comment, Entity User)]
  InsertComment
    :: ArticleId -> UserId -> Text -> CommentDB m (Maybe (Entity Comment, Entity User))
  DeleteComment :: CommentId -> CommentDB m ()
  GetComment :: CommentId -> CommentDB m (Maybe Comment)
  ListAdminComments
    :: Maybe Text -> Maybe Text -> Int -> Int -> CommentDB m ([AdminCommentResponse], Int)

type instance DispatchOf CommentDB = 'Dynamic

getCommentsForArticle
  :: (CommentDB :> es) => ArticleId -> Eff es [(Entity Comment, Entity User)]
getCommentsForArticle aid = send (GetCommentsForArticle aid)

insertComment
  :: (CommentDB :> es)
  => ArticleId
  -> UserId
  -> Text
  -> Eff es (Maybe (Entity Comment, Entity User))
insertComment aid uid body = send (InsertComment aid uid body)

deleteComment :: (CommentDB :> es) => CommentId -> Eff es ()
deleteComment cid = send (DeleteComment cid)

getComment :: (CommentDB :> es) => CommentId -> Eff es (Maybe Comment)
getComment cid = send (GetComment cid)

listAdminComments
  :: (CommentDB :> es)
  => Maybe Text
  -> Maybe Text
  -> Int
  -> Int
  -> Eff es ([AdminCommentResponse], Int)
listAdminComments mAuthor mArticleSlug lim off = send (ListAdminComments mAuthor mArticleSlug lim off)
