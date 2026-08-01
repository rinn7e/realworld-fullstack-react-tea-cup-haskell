module Infrastructure.Interpreter.Stub.DB.ArticleDB
  ( runArticleDBStub
  ) where

import Data.List qualified as L
import Data.Map.Strict qualified as Map
import Data.Text (Text)
import Data.Text qualified as T
import Data.Time (getCurrentTime)
import Effectful
import Effectful.Dispatch.Dynamic
import UnliftIO.IORef

import Capability.Database.ArticleDB
import Domain.Type
import Infrastructure.Interpreter.Stub.DB.Types (MockDB (..), ensureTag)

runArticleDBStub :: (IOE :> es) => IORef MockDB -> Eff (ArticleDB : es) a -> Eff es a
runArticleDBStub ref = interpret $ \_ -> \case
  GetArticleBySlug slug -> do
    db <- readIORef ref
    pure $ L.find (\a -> a.slug == slug) (Map.elems db.articles)
  GetArticleWithAuthor mCurrentUserId slug -> do
    db <- readIORef ref
    case L.find (\a -> a.slug == slug) (Map.elems db.articles) of
      Nothing -> pure Nothing
      Just art -> pure $ Just $ makeArticleDetail db mCurrentUserId art
  CreateArticle slug title desc body authorId tagNames -> do
    now <- liftIO getCurrentTime
    atomicModifyIORef' ref $ \db ->
      let aid = ArticleId db.nextArticleId
          newArt = Article
            { articleId = aid
            , slug = slug
            , title = title
            , description = desc
            , body = body
            , authorId = authorId
            , createdAt = now
            , updatedAt = now
            }
          (dbWithTags, _) = L.foldl' (\(d, acc) tname ->
            let (d', tid) = ensureTag tname d
            in (d', tid : acc)
            ) (db, []) tagNames
          newArticleTags = dbWithTags.articleTags ++ map (\tname -> (aid, tname)) tagNames
          newDb = dbWithTags
            { nextArticleId = dbWithTags.nextArticleId + 1
            , articles = Map.insert aid newArt dbWithTags.articles
            , articleTags = newArticleTags
            }
      in (newDb, newArt)
  UpdateArticle aid slug title desc body mTagNames -> do
    now <- liftIO getCurrentTime
    atomicModifyIORef' ref $ \db ->
      case Map.lookup aid db.articles of
        Nothing -> error "Article not found"
        Just art ->
          let updatedArt = art
                { slug = slug
                , title = title
                , description = desc
                , body = body
                , updatedAt = now
                }
              (dbWithTags, newArticleTags) = case mTagNames of
                Nothing -> (db, db.articleTags)
                Just tagNames ->
                  let (dWithTags, _) = L.foldl' (\(d, acc) tname ->
                        let (d', tid) = ensureTag tname d
                        in (d', tid : acc)
                        ) (db, []) tagNames
                      filteredTags = filter (\(aId, _) -> aId /= aid) dWithTags.articleTags
                      addedTags = filteredTags ++ map (\tname -> (aid, tname)) tagNames
                  in (dWithTags, addedTags)
              newDb = dbWithTags
                { articles = Map.insert aid updatedArt dbWithTags.articles
                , articleTags = newArticleTags
                }
          in (newDb, updatedArt)
  DeleteArticle aid -> do
    atomicModifyIORef' ref $ \db ->
      let newDb = db
            { articles = Map.delete aid db.articles
            , articleTags = filter (\(aId, _) -> aId /= aid) db.articleTags
            , favorites = filter (\(_, aId) -> aId /= aid) db.favorites
            , comments = Map.filter (\c -> c.articleId /= aid) db.comments
            }
      in (newDb, ())
  ListArticles mCurrentUserId mTag mAuthor mFavorited (Limit lim) (Offset off) -> do
    db <- readIORef ref
    let allArts = Map.elems db.articles
        sorted = L.sortBy (\a1 a2 -> compare a2.createdAt a1.createdAt) allArts
        filtered = filter (matchArticleFilters db mTag mAuthor mFavorited Nothing) sorted
        sliced = take lim $ drop off filtered
        details = map (makeArticleDetail db mCurrentUserId) sliced
    pure details
  ListFeed currentUserId (Limit lim) (Offset off) -> do
    db <- readIORef ref
    let followedIds = map snd $ filter (\(follower, _) -> follower == currentUserId) db.follows
        allArts = Map.elems db.articles
        feedArts = filter (\a -> a.authorId `elem` followedIds) allArts
        sorted = L.sortBy (\a1 a2 -> compare a2.createdAt a1.createdAt) feedArts
        sliced = take lim $ drop off sorted
        details = map (makeArticleDetail db (Just currentUserId)) sliced
    pure details
  CountArticles mTag mAuthor mFavorited -> do
    db <- readIORef ref
    let allArts = Map.elems db.articles
        filtered = filter (matchArticleFilters db mTag mAuthor mFavorited Nothing) allArts
    pure $ length filtered
  CountFeed currentUserId -> do
    db <- readIORef ref
    let followedIds = map snd $ filter (\(follower, _) -> follower == currentUserId) db.follows
        allArts = Map.elems db.articles
        feedArts = filter (\a -> a.authorId `elem` followedIds) allArts
    pure $ length feedArts
  FavoriteArticle uid aid -> do
    atomicModifyIORef' ref $ \db ->
      let newFavs = if (uid, aid) `elem` db.favorites
                      then db.favorites
                      else (uid, aid) : db.favorites
          newDb = db { favorites = newFavs }
      in (newDb, ())
  UnfavoriteArticle uid aid -> do
    atomicModifyIORef' ref $ \db ->
      let newFavs = filter (/= (uid, aid)) db.favorites
          newDb = db { favorites = newFavs }
      in (newDb, ())
  ListAdminArticles mTag mAuthor mSearch mSort mDir (Limit lim) (Offset off) -> do
    db <- readIORef ref
    let allArts = Map.elems db.articles
        sorted = sortArticles db mSort mDir allArts
        filtered = filter (matchArticleFilters db mTag mAuthor Nothing mSearch) sorted
        sliced = take lim $ drop off filtered
        details = map (makeArticleDetail db Nothing) sliced
    pure details
  CountAdminArticles mTag mAuthor mSearch -> do
    db <- readIORef ref
    let allArts = Map.elems db.articles
        filtered = filter (matchArticleFilters db mTag mAuthor Nothing mSearch) allArts
    pure $ length filtered

sortArticles :: MockDB -> Maybe ArticleSort -> Maybe Direction -> [Article] -> [Article]
sortArticles db mSort mDir arts =
  let dir = maybe Desc id mDir
      cmp = case mSort of
        Just ArticleSortTitle -> \a1 a2 -> compare a1.title.unArticleTitle a2.title.unArticleTitle
        Just ArticleSortId -> \a1 a2 -> compare a1.articleId.unArticleId a2.articleId.unArticleId
        Just ArticleSortFavoritesCount -> \a1 a2 ->
          let c1 = length $ filter (\(_, aid) -> aid == a1.articleId) db.favorites
              c2 = length $ filter (\(_, aid) -> aid == a2.articleId) db.favorites
          in compare c1 c2
        Just ArticleSortCreatedAt -> \a1 a2 -> compare a1.createdAt a2.createdAt
        Nothing -> \a1 a2 -> compare a1.createdAt a2.createdAt

      sorted = L.sortBy cmp arts
  in case dir of
       Asc -> sorted
       Desc -> L.reverse sorted

makeArticleDetail :: MockDB -> Maybe UserId -> Article -> ArticleDetail
makeArticleDetail db mCurrentUserId art =
  let author = Map.findWithDefault (error "Author not found") art.authorId db.users
      associatedTags = filter (\(aid, _) -> aid == art.articleId) db.articleTags
      tagsList = map (\(_, tname) ->
        let tid = Map.findWithDefault (TagId 0) tname db.tags
        in Tag tid tname
        ) associatedTags
      favCount = length $ filter (\(_, aid) -> aid == art.articleId) db.favorites
      isFav = case mCurrentUserId of
        Nothing -> False
        Just uid -> (uid, art.articleId) `elem` db.favorites
      isFollowing = case mCurrentUserId of
        Nothing -> False
        Just uid -> (uid, art.authorId) `elem` db.follows
  in ArticleDetail
       { article = art
       , author = author
       , tags = tagsList
       , favoritesCount = favCount
       , isFavorited = isFav
       , isFollowingAuthor = isFollowing
       }

matchArticleFilters
  :: MockDB
  -> Maybe TagName
  -> Maybe Username
  -> Maybe Username
  -> Maybe Text
  -> Article
  -> Bool
matchArticleFilters db mTag mAuthor mFavorited mSearch art =
  let author = Map.lookup art.authorId db.users
      authorMatches = case mAuthor of
        Nothing -> True
        Just auth -> maybe False (\u -> u.username == auth) author
      tagMatches = case mTag of
        Nothing -> True
        Just tag -> (art.articleId, tag) `elem` db.articleTags
      favMatches = case mFavorited of
        Nothing -> True
        Just favName ->
          let mFavUser = L.find (\u -> u.username == favName) (Map.elems db.users)
          in case mFavUser of
               Nothing -> False
               Just favUser -> (favUser.userId, art.articleId) `elem` db.favorites
      searchMatches = case mSearch of
        Nothing -> True
        Just q ->
          let query = T.toLower q
              title = T.toLower art.title.unArticleTitle
              desc = T.toLower art.description.unArticleDescription
          in query `T.isInfixOf` title || query `T.isInfixOf` desc
  in authorMatches && tagMatches && favMatches && searchMatches
