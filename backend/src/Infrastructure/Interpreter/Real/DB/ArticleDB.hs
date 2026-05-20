module Infrastructure.Interpreter.Real.DB.ArticleDB
  ( runArticleDBPostgres
  , toDomainArticle
  ) where

import Data.Map.Append (unAppendMap)
import Data.Map.Strict qualified as Map
import Data.Semigroup (First (..))
import Data.Text (Text)
import Data.Time (getCurrentTime)
import Database.Esqueleto.Experimental (Entity (..), runSqlPool)
import Database.Persist
  ( delete
  , deleteWhere
  , get
  , insert
  , insertBy
  , replace
  , (==.)
  )
import Database.Persist.Sql (ConnectionPool, SqlPersistT, fromSqlKey, toSqlKey)
import Effectful
import Effectful.Dispatch.Dynamic
import Effectful.Reader.Static

import Capability.Database.ArticleDB
import Domain.Type qualified as D
import Infrastructure.Interpreter.Real.DB.Query.Article qualified as Q
import Infrastructure.Interpreter.Real.DB.Query.Article.Type (ArticleGrouped)
import Infrastructure.Interpreter.Real.DB.Schema.Schema qualified as DB
import Infrastructure.Interpreter.Real.DB.UserDB (toDomainUser)

toDomainArticle :: Entity DB.Article -> D.Article
toDomainArticle (Entity aid a) =
  D.Article
    { D.articleId = D.ArticleId $ fromIntegral (fromSqlKey aid)
    , D.slug = a.slug
    , D.title = a.title
    , D.description = a.description
    , D.body = a.body
    , D.authorId = D.UserId $ fromIntegral (fromSqlKey a.authorId)
    , D.createdAt = a.createdAt
    , D.updatedAt = a.updatedAt
    }

toDomainTag :: Entity DB.Tag -> D.Tag
toDomainTag (Entity tid t) =
  D.Tag
    { D.tagId = D.TagId $ fromIntegral (fromSqlKey tid)
    , D.name = t.name
    }

toDomainArticleWithMetadata :: ArticleGrouped -> D.ArticleWithMetadata
toDomainArticleWithMetadata (First art, First auth, tagsMap, (First favCount, First isFav, First isFol)) =
  D.ArticleWithMetadata
    { D.article = toDomainArticle art
    , D.author = toDomainUser auth
    , D.tags = map (toDomainTag . getFirst) $ Map.elems $ unAppendMap tagsMap
    , D.favoritesCount = maybe 0 id favCount
    , D.isFavorited = isFav
    , D.isFollowingAuthor = isFol
    }

ensureTag :: DB.ArticleId -> Text -> SqlPersistT IO ()
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
    liftIO $
      runSqlPool
        ( do
            let sqlUserId = fmap (\(D.UserId i) -> toSqlKey (fromIntegral i)) mCurrentUserId
            mArtGrp <- Q.getArticleWithAuthor sqlUserId slug
            return $ fmap toDomainArticleWithMetadata mArtGrp
        )
        pool
  CreateArticle slug title desc body (D.UserId authorIdInt) tags -> do
    pool <- ask @ConnectionPool
    liftIO $
      runSqlPool
        ( do
            now <- liftIO getCurrentTime
            let sqlAuthorId = toSqlKey (fromIntegral authorIdInt)
            let art = DB.Article slug title desc body sqlAuthorId now now
            aid <- insert art
            mapM_ (ensureTag aid) tags
            return $ toDomainArticle (Entity aid art)
        )
        pool
  UpdateArticle (D.ArticleId aidInt) newSlug newTitle newDesc newBody mTags -> do
    pool <- ask @ConnectionPool
    liftIO $
      runSqlPool
        ( do
            let aid = toSqlKey (fromIntegral aidInt)
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
  DeleteArticle (D.ArticleId aidInt) -> do
    pool <- ask @ConnectionPool
    liftIO $
      runSqlPool
        ( do
            let aid = toSqlKey (fromIntegral aidInt)
            deleteWhere [DB.ArticleTagArticleId ==. aid]
            deleteWhere [DB.CommentArticleId ==. aid]
            deleteWhere [DB.FavoriteArticleId ==. aid]
            delete aid
        )
        pool
  ListArticles mCurrentUserId mTag mAuthor mFavorited lim off -> do
    pool <- ask @ConnectionPool
    liftIO $
      runSqlPool
        ( do
            let sqlUserId = fmap (\(D.UserId i) -> toSqlKey (fromIntegral i)) mCurrentUserId
            res <- Q.listArticles sqlUserId mTag mAuthor mFavorited lim off
            return $ map toDomainArticleWithMetadata $ Map.elems $ unAppendMap res
        )
        pool
  ListFeed (D.UserId currentUserIdInt) lim off -> do
    pool <- ask @ConnectionPool
    liftIO $
      runSqlPool
        ( do
            let sqlUserId = toSqlKey (fromIntegral currentUserIdInt)
            res <- Q.listFeed sqlUserId lim off
            return $ map toDomainArticleWithMetadata $ Map.elems $ unAppendMap res
        )
        pool
  CountArticles mTag mAuthor mFavorited -> do
    pool <- ask @ConnectionPool
    liftIO $ runSqlPool (Q.countArticles mTag mAuthor mFavorited) pool
  CountFeed (D.UserId currentUserIdInt) -> do
    pool <- ask @ConnectionPool
    liftIO $
      runSqlPool
        ( do
            let sqlUserId = toSqlKey (fromIntegral currentUserIdInt)
            Q.countFeed sqlUserId
        )
        pool
  FavoriteArticle (D.UserId uidInt) (D.ArticleId aidInt) -> do
    ask @ConnectionPool >>= \pool -> liftIO $
      runSqlPool
        ( do
            let sqlUid = toSqlKey (fromIntegral uidInt)
            let sqlAid = toSqlKey (fromIntegral aidInt)
            _ <- insertBy (DB.Favorite sqlUid sqlAid)
            return ()
        )
        pool
  UnfavoriteArticle (D.UserId uidInt) (D.ArticleId aidInt) -> do
    ask @ConnectionPool >>= \pool -> liftIO $
      runSqlPool
        ( do
            let sqlUid = toSqlKey (fromIntegral uidInt)
            let sqlAid = toSqlKey (fromIntegral aidInt)
            deleteWhere
              [ DB.FavoriteUserId ==. sqlUid
              , DB.FavoriteArticleId ==. sqlAid
              ]
        )
        pool
  ListAdminArticles mTag mAuthor mSearch lim off -> do
    pool <- ask @ConnectionPool
    liftIO $
      runSqlPool
        ( do
            res <- Q.listAdminArticles mTag mAuthor mSearch lim off
            return $ map toDomainArticleWithMetadata $ Map.elems $ unAppendMap res
        )
        pool
  CountAdminArticles mTag mAuthor mSearch -> do
    pool <- ask @ConnectionPool
    liftIO $ runSqlPool (Q.countAdminArticles mTag mAuthor mSearch) pool
