module Capability.Database.ArticleDB where

import Data.Map.Append (AppendMap)
import Data.Ord (Down)
import Data.Text (Text)
import Data.Time (UTCTime)
import Domain.Article (Article)
import Effectful
import Effectful.Dispatch.Dynamic
import Infrastructure.Interpreter.Real.DB.Query.Article.Type (ArticleGrouped)
import Infrastructure.Interpreter.Real.DB.Schema.Schema (ArticleId, UserId)

data ArticleDB :: Effect where
  GetArticleBySlug :: Text -> ArticleDB m (Maybe Article)
  GetArticleWithAuthor :: Maybe UserId -> Text -> ArticleDB m (Maybe ArticleGrouped)
  CreateArticle
    :: Text -> Text -> Text -> Text -> UserId -> [Text] -> ArticleDB m Article
  UpdateArticle
    :: ArticleId -> Text -> Text -> Text -> Text -> Maybe [Text] -> ArticleDB m Article
  DeleteArticle :: ArticleId -> ArticleDB m ()
  ListArticles
    :: Maybe UserId
    -> Maybe Text
    -> Maybe Text
    -> Maybe Text
    -> Int
    -> Int
    -> ArticleDB m (AppendMap (Down UTCTime, ArticleId) ArticleGrouped)
  ListFeed
    :: UserId -> Int -> Int -> ArticleDB m (AppendMap (Down UTCTime, ArticleId) ArticleGrouped)
  CountArticles :: Maybe Text -> Maybe Text -> Maybe Text -> ArticleDB m Int
  CountFeed :: UserId -> ArticleDB m Int
  FavoriteArticle :: UserId -> ArticleId -> ArticleDB m ()
  UnfavoriteArticle :: UserId -> ArticleId -> ArticleDB m ()
  ListAdminArticles
    :: Maybe Text
    -> Maybe Text
    -> Maybe Text
    -> Int
    -> Int
    -> ArticleDB m (AppendMap (Down UTCTime, ArticleId) ArticleGrouped)
  CountAdminArticles :: Maybe Text -> Maybe Text -> Maybe Text -> ArticleDB m Int

type instance DispatchOf ArticleDB = 'Dynamic

getArticleBySlug :: (ArticleDB :> es) => Text -> Eff es (Maybe Article)
getArticleBySlug slug = send (GetArticleBySlug slug)

getArticleWithAuthor
  :: (ArticleDB :> es) => Maybe UserId -> Text -> Eff es (Maybe ArticleGrouped)
getArticleWithAuthor mCurrentUserId slug = send (GetArticleWithAuthor mCurrentUserId slug)

createArticle
  :: (ArticleDB :> es) => Text -> Text -> Text -> Text -> UserId -> [Text] -> Eff es Article
createArticle slug title desc body authorId tags = send (CreateArticle slug title desc body authorId tags)

updateArticle
  :: (ArticleDB :> es)
  => ArticleId
  -> Text
  -> Text
  -> Text
  -> Text
  -> Maybe [Text]
  -> Eff es Article
updateArticle aid slug title desc body tags = send (UpdateArticle aid slug title desc body tags)

deleteArticle :: (ArticleDB :> es) => ArticleId -> Eff es ()
deleteArticle aid = send (DeleteArticle aid)

listArticles
  :: (ArticleDB :> es)
  => Maybe UserId
  -> Maybe Text
  -> Maybe Text
  -> Maybe Text
  -> Int
  -> Int
  -> Eff es (AppendMap (Down UTCTime, ArticleId) ArticleGrouped)
listArticles mCurrentUserId mTag mAuthor mFavorited lim off = send (ListArticles mCurrentUserId mTag mAuthor mFavorited lim off)

listFeed
  :: (ArticleDB :> es)
  => UserId
  -> Int
  -> Int
  -> Eff es (AppendMap (Down UTCTime, ArticleId) ArticleGrouped)
listFeed currentUserId lim off = send (ListFeed currentUserId lim off)

countArticles :: (ArticleDB :> es) => Maybe Text -> Maybe Text -> Maybe Text -> Eff es Int
countArticles mTag mAuthor mFavorited = send (CountArticles mTag mAuthor mFavorited)

countFeed :: (ArticleDB :> es) => UserId -> Eff es Int
countFeed currentUserId = send (CountFeed currentUserId)

favoriteArticle :: (ArticleDB :> es) => UserId -> ArticleId -> Eff es ()
favoriteArticle uid aid = send (FavoriteArticle uid aid)

unfavoriteArticle :: (ArticleDB :> es) => UserId -> ArticleId -> Eff es ()
unfavoriteArticle uid aid = send (UnfavoriteArticle uid aid)

listAdminArticles
  :: (ArticleDB :> es)
  => Maybe Text
  -> Maybe Text
  -> Maybe Text
  -> Int
  -> Int
  -> Eff es (AppendMap (Down UTCTime, ArticleId) ArticleGrouped)
listAdminArticles mTag mAuthor mSearch lim off = send (ListAdminArticles mTag mAuthor mSearch lim off)

countAdminArticles
  :: (ArticleDB :> es) => Maybe Text -> Maybe Text -> Maybe Text -> Eff es Int
countAdminArticles mTag mAuthor mSearch = send (CountAdminArticles mTag mAuthor mSearch)
