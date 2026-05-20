module Infrastructure.Interpreter.Stub.DB.ArticleDB
  ( runArticleDBStub
  ) where

import Effectful
import Effectful.Dispatch.Dynamic

import Capability.Database.ArticleDB

runArticleDBStub :: Eff (ArticleDB : es) a -> Eff es a
runArticleDBStub = interpret $ \_ -> \case
  GetArticleBySlug _ -> pure Nothing
  GetArticleWithAuthor _ _ -> pure Nothing
  CreateArticle{} -> error "ArticleDBStub: CreateArticle"
  UpdateArticle{} -> error "ArticleDBStub: UpdateArticle"
  DeleteArticle _ -> pure ()
  ListArticles{} -> pure []
  ListFeed{} -> pure []
  CountArticles{} -> pure 0
  CountFeed _ -> pure 0
  FavoriteArticle _ _ -> pure ()
  UnfavoriteArticle _ _ -> pure ()
  ListAdminArticles{} -> pure []
  CountAdminArticles{} -> pure 0
