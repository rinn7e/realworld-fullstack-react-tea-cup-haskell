module Infrastructure.Interpreter.Real.DB.ArticleDB
  ( runArticleDBPostgres
  , toDomainArticle
  ) where

import Data.Text (Text)
import Data.Time (getCurrentTime)
import Database.Esqueleto.Experimental (runSqlPool)
import Database.Persist
  ( Entity (..)
  , delete
  , deleteWhere
  , get
  , insert
  , insertBy
  , replace
  , (==.)
  )
import Database.Persist.Sql (ConnectionPool, SqlPersistT, fromSqlKey)
import Effectful
import Effectful.Dispatch.Dynamic
import Effectful.Reader.Static

import Capability.Database.ArticleDB
import Domain.Article (Article)
import Domain.Article qualified as D
import Infrastructure.Interpreter.Real.DB.Query.Article qualified as Q
import Infrastructure.Interpreter.Real.DB.Schema.Schema (ArticleId)
import Infrastructure.Interpreter.Real.DB.Schema.Schema qualified as DB

toDomainArticle :: Entity DB.Article -> Article
toDomainArticle (Entity aid a) =
  D.Article
    { articleId = fromIntegral (fromSqlKey aid)
    , slug = a.slug
    , title = a.title
    , description = a.description
    , body = a.body
    , authorId = fromIntegral (fromSqlKey a.authorId)
    , createdAt = a.createdAt
    , updatedAt = a.updatedAt
    }

ensureTag :: ArticleId -> Text -> SqlPersistT IO ()
ensureTag aid tagName = do
  tid <- do
    res <- insertBy (DB.Tag tagName)
    case res of
      Left (Entity tId _) -> return tId
      Right tId -> return tId
  _ <- insertBy (DB.ArticleTag aid tid)
  return ()

runArticleDBPostgres
  :: (IOE :> es, Reader ConnectionPool :> es) => Eff (ArticleDB : es) a -> Eff es a
runArticleDBPostgres = interpret $ \_ -> \case
  GetArticleBySlug slug -> do
    pool <- ask @ConnectionPool
    liftIO $
      runSqlPool
        ( do
            mArt <- Q.getArticleBySlug slug
            return $ fmap toDomainArticle mArt
        )
        pool
  GetArticleWithAuthor mCurrentUserId slug -> do
    pool <- ask @ConnectionPool
    liftIO $ runSqlPool (Q.getArticleWithAuthor mCurrentUserId slug) pool
  CreateArticle slug title desc body authorId tags -> do
    pool <- ask @ConnectionPool
    liftIO $
      runSqlPool
        ( do
            now <- liftIO getCurrentTime
            let art = DB.Article slug title desc body authorId now now
            aid <- insert art
            mapM_ (ensureTag aid) tags
            return $ toDomainArticle (Entity aid art)
        )
        pool
  UpdateArticle aid newSlug newTitle newDesc newBody mTags -> do
    pool <- ask @ConnectionPool
    liftIO $
      runSqlPool
        ( do
            mArt <- get aid
            case mArt of
              Nothing -> error "Article not found"
              Just art -> do
                now <- liftIO getCurrentTime
                let updatedArt =
                      art
                        { DB.slug = newSlug
                        , DB.title = newTitle
                        , DB.description = newDesc
                        , DB.body = newBody
                        , DB.updatedAt = now
                        }
                replace aid updatedArt
                case mTags of
                  Just tags -> do
                    deleteWhere [DB.ArticleTagArticleId ==. aid]
                    mapM_ (ensureTag aid) tags
                  Nothing -> return ()
                return $ toDomainArticle (Entity aid updatedArt)
        )
        pool
  DeleteArticle aid -> do
    pool <- ask @ConnectionPool
    liftIO $
      runSqlPool
        ( do
            deleteWhere [DB.ArticleTagArticleId ==. aid]
            deleteWhere [DB.CommentArticleId ==. aid]
            deleteWhere [DB.FavoriteArticleId ==. aid]
            delete aid
        )
        pool
  ListArticles mCurrentUserId mTag mAuthor mFavorited lim off -> do
    pool <- ask @ConnectionPool
    liftIO $ runSqlPool (Q.listArticles mCurrentUserId mTag mAuthor mFavorited lim off) pool
  ListFeed currentUserId lim off -> do
    pool <- ask @ConnectionPool
    liftIO $ runSqlPool (Q.listFeed currentUserId lim off) pool
  CountArticles mTag mAuthor mFavorited -> do
    pool <- ask @ConnectionPool
    liftIO $ runSqlPool (Q.countArticles mTag mAuthor mFavorited) pool
  CountFeed currentUserId -> do
    pool <- ask @ConnectionPool
    liftIO $ runSqlPool (Q.countFeed currentUserId) pool
  FavoriteArticle uid aid -> do
    pool <- ask @ConnectionPool
    liftIO $
      runSqlPool
        ( do
            _ <- insertBy (DB.Favorite uid aid)
            return ()
        )
        pool
  UnfavoriteArticle uid aid -> do
    pool <- ask @ConnectionPool
    liftIO $
      runSqlPool
        ( do
            deleteWhere
              [ DB.FavoriteUserId ==. uid
              , DB.FavoriteArticleId ==. aid
              ]
        )
        pool
  ListAdminArticles mTag mAuthor mSearch lim off -> do
    pool <- ask @ConnectionPool
    liftIO $ runSqlPool (Q.listAdminArticles mTag mAuthor mSearch lim off) pool
  CountAdminArticles mTag mAuthor mSearch -> do
    pool <- ask @ConnectionPool
    liftIO $ runSqlPool (Q.countAdminArticles mTag mAuthor mSearch) pool
