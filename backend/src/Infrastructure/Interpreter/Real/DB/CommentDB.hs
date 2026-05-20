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
import Domain.Type qualified as D
import Infrastructure.Interpreter.Real.DB.Query.Comment qualified as Q
import Infrastructure.Interpreter.Real.DB.Schema.Schema qualified as DB
import Infrastructure.Interpreter.Real.DB.UserDB (toDomainUser)

toDomainComment :: Entity DB.Comment -> D.Comment
toDomainComment (Entity cid c) =
  D.Comment
    { D.commentId = D.CommentId $ fromIntegral (fromSqlKey cid)
    , D.body = c.body
    , D.authorId = D.UserId $ fromIntegral (fromSqlKey c.authorId)
    , D.articleId = D.ArticleId $ fromIntegral (fromSqlKey c.articleId)
    , D.createdAt = c.createdAt
    , D.updatedAt = c.updatedAt
    }

runCommentDBPostgres
  :: (IOE :> es, Reader ConnectionPool :> es) => Eff (CommentDB : es) a -> Eff es a
runCommentDBPostgres = interpret $ \_ -> \case
  GetCommentsForArticle (D.ArticleId aidInt) -> do
    pool <- ask @ConnectionPool
    liftIO $
      runSqlPool
        ( do
            let aid = toSqlKey (fromIntegral aidInt)
            res <- Q.getCommentsForArticle aid
            return $ map (\(c, u) -> (toDomainComment c, toDomainUser u)) res
        )
        pool
  InsertComment (D.ArticleId aidInt) (D.UserId uidInt) body -> do
    pool <- ask @ConnectionPool
    liftIO $
      runSqlPool
        ( do
            let aid = toSqlKey (fromIntegral aidInt)
            let uid = toSqlKey (fromIntegral uidInt)
            res <- Q.insertComment aid uid body
            return $ fmap (\(c, u) -> (toDomainComment c, toDomainUser u)) res
        )
        pool
  DeleteComment (D.CommentId cidInt) -> do
    pool <- ask @ConnectionPool
    liftIO $
      runSqlPool
        ( do
            let cid = toSqlKey (fromIntegral cidInt) :: DB.CommentId
            delete cid
        )
        pool
  GetComment (D.CommentId cidInt) -> do
    pool <- ask @ConnectionPool
    liftIO $
      runSqlPool
        ( do
            let cid = toSqlKey (fromIntegral cidInt) :: DB.CommentId
            mComment <- get cid
            return $ fmap (\c -> toDomainComment (Entity cid c)) mComment
        )
        pool
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
                D.CommentDetail
                  { D.id = D.CommentId $ fromIntegral (fromSqlKey cid)
                  , D.body = c.body
                  , D.createdAt = c.createdAt
                  , D.updatedAt = c.updatedAt
                  , D.articleSlug = slug
                  , D.authorUsername = username
                  }
            return (comments, fromIntegral totalCount)
        )
        pool
