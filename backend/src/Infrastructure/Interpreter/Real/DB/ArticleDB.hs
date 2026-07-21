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
import Infrastructure.Common.Type.DBPools (ReadPool (..), WritePool (..))

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

toDomainArticleDetail :: ArticleGrouped -> D.ArticleDetail
toDomainArticleDetail (First art, First auth, tagsMap, (First favCount, First isFav, First isFol)) =
  D.ArticleDetail
    { D.article = toDomainArticle art
    , D.author = toDomainUser auth
    , D.tags = map (toDomainTag . getFirst) $ Map.elems $ unAppendMap tagsMap
    , D.favoritesCount = maybe 0 id favCount
    , D.isFavorited = isFav
    , D.isFollowingAuthor = isFol
    }

ensureTag :: DB.ArticleId -> D.TagName -> SqlPersistT IO ()
ensureTag aid tagName = do
  tid <- do
    res <- insertBy (DB.Tag tagName)
    case res of
      Left (Entity tId _) -> return tId
      Right tId -> return tId
  _ <- insertBy (DB.ArticleTag aid tid)
  return ()

runArticleDBPostgres
  :: (IOE :> es, Reader ReadPool :> es, Reader WritePool :> es) => Eff (ArticleDB : es) a -> Eff es a
runArticleDBPostgres = interpret $ \_ -> \case
  GetArticleBySlug slug -> getArticleBySlugHandler slug
  GetArticleWithAuthor mCurrentUserId slug -> getArticleWithAuthorHandler mCurrentUserId slug
  CreateArticle slug title desc body authorId tags -> createArticleHandler slug title desc body authorId tags
  UpdateArticle aid newSlug newTitle newDesc newBody mTags -> updateArticleHandler aid newSlug newTitle newDesc newBody mTags
  DeleteArticle aid -> deleteArticleHandler aid
  ListArticles mCurrentUserId mTag mAuthor mFavorited lim off -> listArticlesHandler mCurrentUserId mTag mAuthor mFavorited lim off
  ListFeed currentUserId lim off -> listFeedHandler currentUserId lim off
  CountArticles mTag mAuthor mFavorited -> countArticlesHandler mTag mAuthor mFavorited
  CountFeed currentUserId -> countFeedHandler currentUserId
  FavoriteArticle uid aid -> favoriteArticleHandler uid aid
  UnfavoriteArticle uid aid -> unfavoriteArticleHandler uid aid
  ListAdminArticles mTag mAuthor mSearch mSort mDir lim off -> listAdminArticlesHandler mTag mAuthor mSearch mSort mDir lim off
  CountAdminArticles mTag mAuthor mSearch -> countAdminArticlesHandler mTag mAuthor mSearch

getArticleBySlugHandler
  :: (IOE :> es, Reader ReadPool :> es) => D.ArticleSlug -> Eff es (Maybe D.Article)
getArticleBySlugHandler slug = do
  ReadPool pool <- ask @ReadPool
  liftIO $
    runSqlPool
      ( do
          mArt <- Q.getArticleBySlug slug
          return $ fmap toDomainArticle mArt
      )
      pool

getArticleWithAuthorHandler
  :: (IOE :> es, Reader ReadPool :> es)
  => Maybe D.UserId
  -> D.ArticleSlug
  -> Eff es (Maybe D.ArticleDetail)
getArticleWithAuthorHandler mCurrentUserId slug = do
  ReadPool pool <- ask @ReadPool
  liftIO $
    runSqlPool
      ( do
          mArtGrp <- Q.getArticleWithAuthor mCurrentUserId slug
          return $ fmap toDomainArticleDetail mArtGrp
      )
      pool

createArticleHandler
  :: (IOE :> es, Reader WritePool :> es)
  => D.ArticleSlug
  -> D.ArticleTitle
  -> D.ArticleDescription
  -> D.ArticleBody
  -> D.UserId
  -> [D.TagName]
  -> Eff es D.Article
createArticleHandler slug title desc body (D.UserId authorIdInt) tags = do
  WritePool pool <- ask @WritePool
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

updateArticleHandler
  :: (IOE :> es, Reader WritePool :> es)
  => D.ArticleId
  -> D.ArticleSlug
  -> D.ArticleTitle
  -> D.ArticleDescription
  -> D.ArticleBody
  -> Maybe [D.TagName]
  -> Eff es D.Article
updateArticleHandler (D.ArticleId aidInt) newSlug newTitle newDesc newBody mTags = do
  WritePool pool <- ask @WritePool
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

deleteArticleHandler
  :: (IOE :> es, Reader WritePool :> es) => D.ArticleId -> Eff es ()
deleteArticleHandler (D.ArticleId aidInt) = do
  WritePool pool <- ask @WritePool
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

listArticlesHandler
  :: (IOE :> es, Reader ReadPool :> es)
  => Maybe D.UserId
  -> Maybe D.TagName
  -> Maybe D.Username
  -> Maybe D.Username
  -> D.Limit
  -> D.Offset
  -> Eff es [D.ArticleDetail]
listArticlesHandler mCurrentUserId mTag mAuthor mFavorited lim off = do
  ReadPool pool <- ask @ReadPool
  liftIO $
    runSqlPool
      ( do
          res <- Q.listArticles mCurrentUserId mTag mAuthor mFavorited lim off
          return $ map toDomainArticleDetail $ Map.elems $ unAppendMap res
      )
      pool

listFeedHandler
  :: (IOE :> es, Reader ReadPool :> es)
  => D.UserId
  -> D.Limit
  -> D.Offset
  -> Eff es [D.ArticleDetail]
listFeedHandler currentUserId lim off = do
  ReadPool pool <- ask @ReadPool
  liftIO $
    runSqlPool
      ( do
          res <- Q.listFeed currentUserId lim off
          return $ map toDomainArticleDetail $ Map.elems $ unAppendMap res
      )
      pool

countArticlesHandler
  :: (IOE :> es, Reader ReadPool :> es)
  => Maybe D.TagName
  -> Maybe D.Username
  -> Maybe D.Username
  -> Eff es Int
countArticlesHandler mTag mAuthor mFavorited = do
  ReadPool pool <- ask @ReadPool
  liftIO $ runSqlPool (Q.countArticles mTag mAuthor mFavorited) pool

countFeedHandler :: (IOE :> es, Reader ReadPool :> es) => D.UserId -> Eff es Int
countFeedHandler currentUserId = do
  ReadPool pool <- ask @ReadPool
  liftIO $
    runSqlPool
      ( do
          Q.countFeed currentUserId
      )
      pool

favoriteArticleHandler
  :: (IOE :> es, Reader WritePool :> es) => D.UserId -> D.ArticleId -> Eff es ()
favoriteArticleHandler (D.UserId uidInt) (D.ArticleId aidInt) = do
  WritePool pool <- ask @WritePool
  liftIO $
    runSqlPool
      ( do
          let sqlUid = toSqlKey (fromIntegral uidInt)
          let sqlAid = toSqlKey (fromIntegral aidInt)
          _ <- insertBy (DB.Favorite sqlUid sqlAid)
          return ()
      )
      pool

unfavoriteArticleHandler
  :: (IOE :> es, Reader WritePool :> es) => D.UserId -> D.ArticleId -> Eff es ()
unfavoriteArticleHandler (D.UserId uidInt) (D.ArticleId aidInt) = do
  WritePool pool <- ask @WritePool
  liftIO $
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

listAdminArticlesHandler
  :: (IOE :> es, Reader ReadPool :> es)
  => Maybe D.TagName
  -> Maybe D.Username
  -> Maybe Text
  -> Maybe D.ArticleSort
  -> Maybe D.Direction
  -> D.Limit
  -> D.Offset
  -> Eff es [D.ArticleDetail]
listAdminArticlesHandler mTag mAuthor mSearch mSort mDir lim off = do
  ReadPool pool <- ask @ReadPool
  liftIO $
    runSqlPool
      ( do
          res <- Q.listAdminArticles mTag mAuthor mSearch mSort mDir lim off
          return $ map toDomainArticleDetail $ Map.elems $ unAppendMap res
      )
      pool

countAdminArticlesHandler
  :: (IOE :> es, Reader ReadPool :> es)
  => Maybe D.TagName
  -> Maybe D.Username
  -> Maybe Text
  -> Eff es Int
countAdminArticlesHandler mTag mAuthor mSearch = do
  ReadPool pool <- ask @ReadPool
  liftIO $ runSqlPool (Q.countAdminArticles mTag mAuthor mSearch) pool
