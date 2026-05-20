module Capability.Database.CommentDB where

import Domain.Type qualified as D
import Domain.Type hiding (Limit, Offset)
import Effectful
import Effectful.Dispatch.Dynamic

data CommentDB :: Effect where
  GetCommentsForArticle :: ArticleId -> CommentDB m [(Comment, User)]
  InsertComment
    :: ArticleId -> UserId -> CommentBody -> CommentDB m (Maybe (Comment, User))
  DeleteComment :: CommentId -> CommentDB m ()
  GetComment :: CommentId -> CommentDB m (Maybe Comment)
  ListAdminComments
    :: Maybe Username -> Maybe ArticleSlug -> D.Limit -> D.Offset -> CommentDB m ([CommentDetail], Int)

type instance DispatchOf CommentDB = 'Dynamic

getCommentsForArticle
  :: (CommentDB :> es) => ArticleId -> Eff es [(Comment, User)]
getCommentsForArticle aid = send (GetCommentsForArticle aid)

insertComment
  :: (CommentDB :> es)
  => ArticleId
  -> UserId
  -> CommentBody
  -> Eff es (Maybe (Comment, User))
insertComment aid uid body = send (InsertComment aid uid body)

deleteComment :: (CommentDB :> es) => CommentId -> Eff es ()
deleteComment cid = send (DeleteComment cid)

getComment :: (CommentDB :> es) => CommentId -> Eff es (Maybe Comment)
getComment cid = send (GetComment cid)

listAdminComments
  :: (CommentDB :> es)
  => Maybe Username
  -> Maybe ArticleSlug
  -> D.Limit
  -> D.Offset
  -> Eff es ([CommentDetail], Int)
listAdminComments mAuthor mArticleSlug lim off = send (ListAdminComments mAuthor mArticleSlug lim off)
