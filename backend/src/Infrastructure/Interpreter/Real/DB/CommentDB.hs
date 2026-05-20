module Infrastructure.Interpreter.Real.DB.CommentDB
  ( runCommentDBPostgres
  ) where

import Data.Traversable (for)
import Database.Persist
  ( Entity (..)
  , SelectOpt (..)
  , count
  , delete
  , get
  , selectList
  , (==.)
  )
import Database.Persist.Sql (ConnectionPool, fromSqlKey, runSqlPool, toSqlKey)
import Effectful
import Effectful.Dispatch.Dynamic
import Effectful.Reader.Static

import Capability.Database.CommentDB
import Infrastructure.Entity.Comment.DTO (AdminCommentResponse (..))
import Infrastructure.Interpreter.Real.DB.Query.Comment qualified as Q
import Infrastructure.Interpreter.Real.DB.Schema.Schema qualified as DB

runCommentDBPostgres
  :: (IOE :> es, Reader ConnectionPool :> es) => Eff (CommentDB : es) a -> Eff es a
runCommentDBPostgres = interpret $ \_ -> \case
  GetCommentsForArticle aid -> do
    pool <- ask @ConnectionPool
    liftIO $ runSqlPool (Q.getCommentsForArticle aid) pool
  InsertComment aid uid body -> do
    pool <- ask @ConnectionPool
    liftIO $ runSqlPool (Q.insertComment aid uid body) pool
  DeleteComment cid -> do
    pool <- ask @ConnectionPool
    liftIO $ runSqlPool (delete cid) pool
  GetComment cid -> do
    pool <- ask @ConnectionPool
    liftIO $ runSqlPool (get cid) pool
  ListAdminComments mAuthor mArticleSlug lim off -> do
    pool <- ask @ConnectionPool
    liftIO $
      runSqlPool
        ( do
            mAuthorId <- case mAuthor of
              Nothing -> pure Nothing
              Just authName -> do
                res <- selectList [DB.UserUsername ==. authName] [LimitTo 1]
                case res of
                  [Entity uidAuthor _] -> pure (Just uidAuthor)
                  _ -> pure (Just $ toSqlKey (-1))
            mArtId <- case mArticleSlug of
              Nothing -> pure Nothing
              Just slug -> do
                res <- selectList [DB.ArticleSlug ==. slug] [LimitTo 1]
                case res of
                  [Entity aid _] -> pure (Just aid)
                  _ -> pure (Just $ toSqlKey (-1))
            let filters =
                  concat
                    [ maybe [] (\authId -> [DB.CommentAuthorId ==. authId]) mAuthorId
                    , maybe [] (\artId -> [DB.CommentArticleId ==. artId]) mArtId
                    ]
            totalCount <- count filters
            entities <- selectList filters [Desc DB.CommentCreatedAt, LimitTo lim, OffsetBy off]
            comments <- for entities $ \(Entity cid c) -> do
              mArt <- get c.articleId
              mUser <- get c.authorId
              let slug = maybe "" (\art -> art.slug) mArt
                  username = maybe "" (\u -> u.username) mUser
              return
                AdminCommentResponse
                  { id = fromIntegral (fromSqlKey cid)
                  , body = c.body
                  , createdAt = c.createdAt
                  , articleSlug = slug
                  , authorUsername = username
                  }
            return (comments, fromIntegral totalCount)
        )
        pool
