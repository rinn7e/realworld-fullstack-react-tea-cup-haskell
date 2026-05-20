module Infrastructure.Interpreter.Real.DB.Query.Article
  ( getArticleBySlug
  , getArticleBySlugSQL
  , getArticleWithAuthor
  , getArticleWithAuthorSQL
  , listArticles
  , listArticlesSQL
  , listFeed
  , listFeedSQL
  , applyArticleFilters
  , filterArticlesIdsSQL
  , countArticles
  , countFeed
  , feedArticlesIdsSQL
  , countFavoritesExpr
  , isFavoritedByExpr
  , isFollowingUserExpr
  , getArticleTags
  , getArticleTagsSQL
  , listAdminArticles
  , countAdminArticles
  )
where

import Control.Monad (when)
import Data.Foldable (for_)
import Data.Map.Append (AppendMap (..), unAppendMap)
import Data.Map.Strict qualified as Map
import Data.Ord (Down)
import Data.Text (Text)
import Data.Text qualified as T
import Data.Time (UTCTime)
import Database.Esqueleto.Experimental
import Database.Persist.Sql (toSqlKey)
import Debug.Trace (traceM)
import UnliftIO (MonadUnliftIO)

import Domain.Type qualified as D
import Infrastructure.Interpreter.Real.DB.Query.Article.Type
import Infrastructure.Interpreter.Real.DB.Schema.Schema

toDBUserKey :: D.UserId -> UserId
toDBUserKey (D.UserId uid) = toSqlKey (fromIntegral uid)

getArticleBySlug
  :: (MonadUnliftIO m) => D.ArticleSlug -> SqlPersistT m (Maybe (Entity Article))
getArticleBySlug slug = selectOne $ getArticleBySlugSQL slug

-- | Fetch a single article entity by its slug
getArticleBySlugSQL :: D.ArticleSlug -> SqlQuery (SqlExpr (Entity Article))
getArticleBySlugSQL slug = do
  article <- from $ table @Article
  where_ (article ^. ArticleSlug ==. val slug)
  return article

getArticleWithAuthor
  :: (MonadUnliftIO m)
  => Maybe D.UserId
  -> D.ArticleSlug
  -> SqlPersistT m (Maybe ArticleGrouped)
getArticleWithAuthor mCurrentUserId slug = do
  result <- select $ getArticleWithAuthorSQL mCurrentUserId slug
  traceM $ "getArticleWithAuthor result length: " ++ show (length result)
  return $ headMay $ Map.elems $ unAppendMap $ mconcat $ map mkArticleGrouped result
 where
  headMay (x : _) = Just x
  headMay [] = Nothing

-- | Main query to fetch an article with its author, tags, and metadata
getArticleWithAuthorSQL
  :: Maybe D.UserId
  -> D.ArticleSlug
  -> SqlQuery ArticleExpr
getArticleWithAuthorSQL mCurrentUserId slug = do
  (((article :& author) :& _) :& tag) <-
    from $
      table @Article
        `innerJoin` table @User `on` (\(art :& auth) -> art ^. ArticleAuthorId ==. auth ^. UserId)
        `leftJoin` table @ArticleTag
          `on` (\(art :& _ :& at) -> just (art ^. ArticleId) ==. at ?. ArticleTagArticleId)
        `leftJoin` table @Tag `on` (\(_ :& _ :& at :& t) -> at ?. ArticleTagTagId ==. t ?. TagId)
  where_ (article ^. ArticleSlug ==. val slug)

  return
    ( article
    , author
    , tag
    , countFavoritesExpr (article ^. ArticleId)
    , case mCurrentUserId of
        Just uid -> isFavoritedByExpr (article ^. ArticleId) (val (toDBUserKey uid))
        Nothing -> val False
    , case mCurrentUserId of
        Just uid -> isFollowingUserExpr (author ^. UserId) (val (toDBUserKey uid))
        Nothing -> val False
    )

listArticles
  :: Maybe D.UserId
  -> Maybe D.TagName
  -> Maybe D.Username
  -> Maybe D.Username
  -> D.Limit
  -> D.Offset
  -> SqlPersistT IO (AppendMap (Down UTCTime, ArticleId) ArticleGrouped)
listArticles mCurrentUserId mTag mAuthor mFavorited lim off = do
  result <- select $ listArticlesSQL mCurrentUserId mTag mAuthor mFavorited lim off
  let result2 = mconcat $ map mkArticleGrouped result
  pure result2

-- | Main query to list articles with filtering and pagination
listArticlesSQL
  :: Maybe D.UserId
  -> Maybe D.TagName
  -> Maybe D.Username
  -> Maybe D.Username
  -> D.Limit
  -> D.Offset
  -> SqlQuery ArticleExpr
listArticlesSQL mCurrentUserId mTag mAuthor mFavorited lim off = do
  (((article :& author) :& _) :& tag) <-
    from $
      table @Article
        `innerJoin` table @User `on` (\(art :& auth) -> art ^. ArticleAuthorId ==. auth ^. UserId)
        `leftJoin` table @ArticleTag
          `on` (\(art :& _ :& at) -> just (art ^. ArticleId) ==. at ?. ArticleTagArticleId)
        `leftJoin` table @Tag `on` (\(_ :& _ :& at :& t) -> at ?. ArticleTagTagId ==. t ?. TagId)

  where_
    ( article
        ^. ArticleId
        `in_` subList_select (filterArticlesIdsSQL mTag mAuthor mFavorited lim off)
    )

  return
    ( article
    , author
    , tag
    , countFavoritesExpr (article ^. ArticleId)
    , case mCurrentUserId of
        Just uid -> isFavoritedByExpr (article ^. ArticleId) (val (toDBUserKey uid))
        Nothing -> val False
    , case mCurrentUserId of
        Just uid -> isFollowingUserExpr (author ^. UserId) (val (toDBUserKey uid))
        Nothing -> val False
    )

listFeed
  :: (MonadUnliftIO m)
  => D.UserId
  -> D.Limit
  -> D.Offset
  -> SqlPersistT m (AppendMap (Down UTCTime, ArticleId) ArticleGrouped)
listFeed currentUserId lim off = do
  result <- select $ listFeedSQL currentUserId lim off
  traceM $ "listFeed result length: " ++ show (length result)
  return $ mconcat $ map mkArticleGrouped result

-- | Main query to fetch the article feed for a user
listFeedSQL
  :: D.UserId
  -> D.Limit
  -> D.Offset
  -> SqlQuery ArticleExpr
listFeedSQL currentUserId lim off = do
  (((article :& author) :& _) :& tag) <-
    from $
      table @Article
        `innerJoin` table @User `on` (\(art :& auth) -> art ^. ArticleAuthorId ==. auth ^. UserId)
        `leftJoin` table @ArticleTag
          `on` (\(art :& _ :& at) -> just (art ^. ArticleId) ==. at ?. ArticleTagArticleId)
        `leftJoin` table @Tag `on` (\(_ :& _ :& at :& t) -> at ?. ArticleTagTagId ==. t ?. TagId)

  where_
    (article ^. ArticleId `in_` subList_select (feedArticlesIdsSQL currentUserId lim off))

  return
    ( article
    , author
    , tag
    , countFavoritesExpr (article ^. ArticleId)
    , isFavoritedByExpr (article ^. ArticleId) (val (toDBUserKey currentUserId))
    , isFollowingUserExpr (author ^. UserId) (val (toDBUserKey currentUserId))
    )

{- | Helper to apply article filters (by author, tag, and favorited user) to a query.
Extracted from filterArticlesIdsSQL to be reused by countArticles.
-}
applyArticleFilters
  :: Maybe D.TagName
  -> Maybe D.Username
  -> Maybe D.Username
  -> SqlExpr (Entity Article)
  -> SqlQuery ()
applyArticleFilters mTag mAuthor mFavorited article = do
  for_ mAuthor \authName -> do
    author <- from $ table @User
    where_ (article ^. ArticleAuthorId ==. author ^. UserId)
    where_ (author ^. UserUsername ==. val authName)

  for_ mTag \tag -> where_ $ exists $ do
    (at :& t) <-
      from $
        table @ArticleTag
          `innerJoin` table @Tag `on` (\(at :& t) -> at ^. ArticleTagTagId ==. t ^. TagId)
    where_ (at ^. ArticleTagArticleId ==. article ^. ArticleId)
    where_ (t ^. TagName ==. val tag)

  for_ mFavorited \favName -> where_ $ exists $ do
    (fav :& uFav) <-
      from $
        table @Favorite
          `innerJoin` table @User `on` (\(fav :& u) -> fav ^. FavoriteUserId ==. u ^. UserId)
    where_ (fav ^. FavoriteArticleId ==. article ^. ArticleId)
    where_ (uFav ^. UserUsername ==. val favName)

-- | Subquery to filter article IDs by tags, author, and favorites
filterArticlesIdsSQL
  :: Maybe D.TagName
  -> Maybe D.Username
  -> Maybe D.Username
  -> D.Limit
  -> D.Offset
  -> SqlQuery (SqlExpr (Value ArticleId))
filterArticlesIdsSQL mTag mAuthor mFavorited (D.Limit limInt) (D.Offset offInt) = do
  article <- from $ table @Article
  applyArticleFilters mTag mAuthor mFavorited article
  orderBy [desc (article ^. ArticleCreatedAt)]
  when (limInt > 0) $ limit (fromIntegral limInt)
  when (offInt > 0) $ offset (fromIntegral offInt)
  return (article ^. ArticleId)

{- | Count total articles matching filters, ignoring pagination limits.
Used to return the total count in the API response.
-}
countArticles
  :: (MonadUnliftIO m)
  => Maybe D.TagName
  -> Maybe D.Username
  -> Maybe D.Username
  -> SqlPersistT m Int
countArticles mTag mAuthor mFavorited = do
  res <- select $ do
    article <- from $ table @Article
    applyArticleFilters mTag mAuthor mFavorited article
    return countRows
  return $ maybe 0 unValue (headMay res)
 where
  headMay (x : _) = Just x
  headMay [] = Nothing

-- | Count total articles in a user's feed, ignoring pagination limits.
countFeed :: (MonadUnliftIO m) => D.UserId -> SqlPersistT m Int
countFeed currentUserId = do
  res <- select $ do
    ((_ :& _) :& follow) <-
      from $
        table @Article
          `innerJoin` table @User `on` (\(art :& auth) -> art ^. ArticleAuthorId ==. auth ^. UserId)
          `innerJoin` table @Follow `on` (\(_ :& auth :& f) -> f ^. FollowFollowedId ==. auth ^. UserId)
    where_ (follow ^. FollowFollowerId ==. val (toDBUserKey currentUserId))
    return countRows
  return $ maybe 0 unValue (headMay res)
 where
  headMay (x : _) = Just x
  headMay [] = Nothing

-- | Subquery to fetch article IDs from followed authors for the feed
feedArticlesIdsSQL
  :: D.UserId
  -> D.Limit
  -> D.Offset
  -> SqlQuery (SqlExpr (Value ArticleId))
feedArticlesIdsSQL currentUserId (D.Limit limInt) (D.Offset offInt) = do
  ((article :& _) :& follow) <-
    from $
      table @Article
        `innerJoin` table @User `on` (\(art :& auth) -> art ^. ArticleAuthorId ==. auth ^. UserId)
        `innerJoin` table @Follow `on` (\(_ :& auth :& f) -> f ^. FollowFollowedId ==. auth ^. UserId)
  where_ (follow ^. FollowFollowerId ==. val (toDBUserKey currentUserId))
  orderBy [desc (article ^. ArticleCreatedAt)]
  when (limInt > 0) $ limit (fromIntegral limInt)
  when (offInt > 0) $ offset (fromIntegral offInt)
  return (article ^. ArticleId)

-- | Expression to count favorites for an article
countFavoritesExpr :: SqlExpr (Value ArticleId) -> SqlExpr (Value (Maybe Int))
countFavoritesExpr aid = subSelect $ do
  fav <- from $ table @Favorite
  where_ (fav ^. FavoriteArticleId ==. aid)
  pure countRows

-- | Expression to check if a user has favorited an article
isFavoritedByExpr
  :: SqlExpr (Value ArticleId) -> SqlExpr (Value UserId) -> SqlExpr (Value Bool)
isFavoritedByExpr aid uid = exists $ do
  fav <- from $ table @Favorite
  where_ (fav ^. FavoriteArticleId ==. aid)
  where_ (fav ^. FavoriteUserId ==. uid)

-- | Expression to check if a follower is following an author
isFollowingUserExpr
  :: SqlExpr (Value UserId) -> SqlExpr (Value UserId) -> SqlExpr (Value Bool)
isFollowingUserExpr authorId followerId = exists $ do
  fol <- from $ table @Follow
  where_ (fol ^. FollowFollowedId ==. authorId)
  where_ (fol ^. FollowFollowerId ==. followerId)

getArticleTags :: (MonadUnliftIO m) => ArticleId -> SqlPersistT m [D.TagName]
getArticleTags aid = map unValue <$> select (getArticleTagsSQL aid)

-- | Query to fetch all tag names for a specific article
getArticleTagsSQL :: ArticleId -> SqlQuery (SqlExpr (Value D.TagName))
getArticleTagsSQL aid = do
  (at :& t) <-
    from $
      table @ArticleTag
        `innerJoin` table @Tag `on` (\(at :& t) -> at ^. ArticleTagTagId ==. t ^. TagId)
  where_ (at ^. ArticleTagArticleId ==. val aid)
  return (t ^. TagName)

applyAdminArticleFilters
  :: Maybe D.TagName
  -> Maybe D.Username
  -> Maybe Text
  -> SqlExpr (Entity Article)
  -> SqlQuery ()
applyAdminArticleFilters mTag mAuthor mSearch article = do
  applyArticleFilters mTag mAuthor Nothing article
  for_ mSearch \query -> do
    let keywordTitle = D.ArticleTitle ("%" <> T.toLower query <> "%")
        keywordDesc = D.ArticleDescription ("%" <> T.toLower query <> "%")
    where_
      ( (lower_ (article ^. ArticleTitle) `like` val keywordTitle)
          ||. (lower_ (article ^. ArticleDescription) `like` val keywordDesc)
      )

listAdminArticles
  :: Maybe D.TagName
  -> Maybe D.Username
  -> Maybe Text
  -> D.Limit
  -> D.Offset
  -> SqlPersistT IO (AppendMap (Down UTCTime, ArticleId) ArticleGrouped)
listAdminArticles mTag mAuthor mSearch lim off = do
  result <- select $ do
    (((article :& author) :& _) :& tag) <-
      from $
        table @Article
          `innerJoin` table @User `on` (\(art :& auth) -> art ^. ArticleAuthorId ==. auth ^. UserId)
          `leftJoin` table @ArticleTag
            `on` (\(art :& _ :& at) -> just (art ^. ArticleId) ==. at ?. ArticleTagArticleId)
          `leftJoin` table @Tag `on` (\(_ :& _ :& at :& t) -> at ?. ArticleTagTagId ==. t ?. TagId)

    where_
      ( article
          ^. ArticleId
          `in_` subList_select (filterAdminArticlesIdsSQL mTag mAuthor mSearch lim off)
      )

    return
      ( article
      , author
      , tag
      , countFavoritesExpr (article ^. ArticleId)
      , val False
      , val False
      )
  let result2 = mconcat $ map mkArticleGrouped result
  pure result2

filterAdminArticlesIdsSQL
  :: Maybe D.TagName
  -> Maybe D.Username
  -> Maybe Text
  -> D.Limit
  -> D.Offset
  -> SqlQuery (SqlExpr (Value ArticleId))
filterAdminArticlesIdsSQL mTag mAuthor mSearch (D.Limit limInt) (D.Offset offInt) = do
  article <- from $ table @Article
  applyAdminArticleFilters mTag mAuthor mSearch article
  orderBy [desc (article ^. ArticleCreatedAt)]
  when (limInt > 0) $ limit (fromIntegral limInt)
  when (offInt > 0) $ offset (fromIntegral offInt)
  return (article ^. ArticleId)

countAdminArticles
  :: (MonadUnliftIO m)
  => Maybe D.TagName
  -> Maybe D.Username
  -> Maybe Text
  -> SqlPersistT m Int
countAdminArticles mTag mAuthor mSearch = do
  res <- select $ do
    article <- from $ table @Article
    applyAdminArticleFilters mTag mAuthor mSearch article
    return countRows
  return $ maybe 0 unValue (headMay res)
 where
  headMay (x : _) = Just x
  headMay [] = Nothing
