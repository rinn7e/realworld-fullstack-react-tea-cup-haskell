module Infrastructure.Interpreter.Stub.DB.CommentDB
  ( runCommentDBStub
  ) where

import Data.List qualified as L
import Data.Map.Strict qualified as Map
import Data.Time (getCurrentTime)
import Effectful
import Effectful.Dispatch.Dynamic
import UnliftIO.IORef

import Capability.Database.CommentDB
import Domain.Type
import Infrastructure.Interpreter.Stub.DB.Types (MockDB (..))

runCommentDBStub :: (IOE :> es) => IORef MockDB -> Eff (CommentDB : es) a -> Eff es a
runCommentDBStub ref = interpret $ \_ -> \case
  GetCommentsForArticle aid -> do
    db <- readIORef ref
    let articleComments = filter (\c -> c.articleId == aid) (Map.elems db.comments)
        sorted = L.sortBy (\c1 c2 -> compare c2.createdAt c1.createdAt) articleComments
        res = map (\c -> (c, Map.findWithDefault (error "User not found") c.authorId db.users)) sorted
    pure res
  InsertComment aid uid body -> do
    now <- liftIO getCurrentTime
    atomicModifyIORef' ref $ \db ->
      case Map.lookup uid db.users of
        Nothing -> (db, Nothing)
        Just user ->
          let cid = CommentId db.nextCommentId
              newComment = Comment
                { commentId = cid
                , body = body
                , authorId = uid
                , articleId = aid
                , createdAt = now
                , updatedAt = now
                }
              newDb = db
                { nextCommentId = db.nextCommentId + 1
                , comments = Map.insert cid newComment db.comments
                }
          in (newDb, Just (newComment, user))
  DeleteComment cid -> do
    atomicModifyIORef' ref $ \db ->
      let newDb = db { comments = Map.delete cid db.comments }
      in (newDb, ())
  GetComment cid -> do
    db <- readIORef ref
    pure $ Map.lookup cid db.comments
  ListAdminComments mAuthor mArticleSlug (Limit lim) (Offset off) -> do
    db <- readIORef ref
    let allComments = Map.elems db.comments
        sorted = L.sortBy (\c1 c2 -> compare c2.createdAt c1.createdAt) allComments
        matches v =
          let author = Map.lookup v.authorId db.users
              article = Map.lookup v.articleId db.articles
              authorMatch = case mAuthor of
                Nothing -> True
                Just auth -> maybe False (\u -> u.username == auth) author
              articleMatch = case mArticleSlug of
                Nothing -> True
                Just slug -> maybe False (\a -> a.slug == slug) article
          in authorMatch && articleMatch
        filtered = filter matches sorted
        total = length filtered
        sliced = take lim $ drop off filtered
        details = map (\c ->
          let author = Map.findWithDefault (error "User not found") c.authorId db.users
              article = Map.findWithDefault (error "Article not found") c.articleId db.articles
          in CommentDetail
            { id = c.commentId
            , body = c.body
            , createdAt = c.createdAt
            , updatedAt = c.updatedAt
            , articleSlug = article.slug
            , authorUsername = author.username
            }
          ) sliced
    pure (details, total)
