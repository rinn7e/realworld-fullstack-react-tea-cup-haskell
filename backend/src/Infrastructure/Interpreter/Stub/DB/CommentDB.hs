module Infrastructure.Interpreter.Stub.DB.CommentDB
  ( runCommentDBStub
  ) where

import Effectful
import Effectful.Dispatch.Dynamic

import Capability.Database.CommentDB

runCommentDBStub :: Eff (CommentDB : es) a -> Eff es a
runCommentDBStub = interpret $ \_ -> \case
  GetCommentsForArticle _ -> pure []
  InsertComment _ _ _ -> pure Nothing
  DeleteComment _ -> pure ()
  GetComment _ -> pure Nothing
  ListAdminComments{} -> pure ([], 0)
