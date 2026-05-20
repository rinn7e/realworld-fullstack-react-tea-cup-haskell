module Capability.Database.CommentDB where

import Data.Text (Text)
import Domain.Type (ArticleId)
import Domain.Type (AdminCommentResponse, Comment, CommentId)
import Domain.Type (User, UserId)
import Effectful
import Effectful.Dispatch.Dynamic

data CommentDB :: Effect where
  GetCommentsForArticle :: ArticleId -> CommentDB m [(Comment, User)]
  InsertComment
    :: ArticleId -> UserId -> Text -> CommentDB m (Maybe (Comment, User))
  DeleteComment :: CommentId -> CommentDB m ()
  GetComment :: CommentId -> CommentDB m (Maybe Comment)
  ListAdminComments
    :: Maybe Text -> Maybe Text -> Int -> Int -> CommentDB m ([AdminCommentResponse], Int)

type instance DispatchOf CommentDB = 'Dynamic

getCommentsForArticle
  :: (CommentDB :> es) => ArticleId -> Eff es [(Comment, User)]
getCommentsForArticle aid = send (GetCommentsForArticle aid)

insertComment
  :: (CommentDB :> es)
  => ArticleId
  -> UserId
  -> Text
  -> Eff es (Maybe (Comment, User))
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
