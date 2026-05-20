module Capability.Database.ArticleDB where

import Data.Text (Text)
import Domain.Type
import Effectful
import Effectful.Dispatch.Dynamic

data ArticleDB :: Effect where
  GetArticleBySlug :: ArticleSlug -> ArticleDB m (Maybe Article)
  GetArticleWithAuthor :: Maybe UserId -> ArticleSlug -> ArticleDB m (Maybe ArticleDetail)
  CreateArticle
    :: ArticleSlug
    -> ArticleTitle
    -> ArticleDescription
    -> ArticleBody
    -> UserId
    -> [TagName]
    -> ArticleDB m Article
  UpdateArticle
    :: ArticleId
    -> ArticleSlug
    -> ArticleTitle
    -> ArticleDescription
    -> ArticleBody
    -> Maybe [TagName]
    -> ArticleDB m Article
  DeleteArticle :: ArticleId -> ArticleDB m ()
  ListArticles
    :: Maybe UserId
    -> Maybe TagName
    -> Maybe Username
    -> Maybe Username
    -> Int
    -> Int
    -> ArticleDB m [ArticleDetail]
  ListFeed
    :: UserId -> Int -> Int -> ArticleDB m [ArticleDetail]
  CountArticles :: Maybe TagName -> Maybe Username -> Maybe Username -> ArticleDB m Int
  CountFeed :: UserId -> ArticleDB m Int
  FavoriteArticle :: UserId -> ArticleId -> ArticleDB m ()
  UnfavoriteArticle :: UserId -> ArticleId -> ArticleDB m ()
  ListAdminArticles
    :: Maybe TagName
    -> Maybe Username
    -> Maybe Text
    -> Int
    -> Int
    -> ArticleDB m [ArticleDetail]
  CountAdminArticles :: Maybe TagName -> Maybe Username -> Maybe Text -> ArticleDB m Int

type instance DispatchOf ArticleDB = 'Dynamic

getArticleBySlug :: (ArticleDB :> es) => ArticleSlug -> Eff es (Maybe Article)
getArticleBySlug slug = send (GetArticleBySlug slug)

getArticleWithAuthor
  :: (ArticleDB :> es) => Maybe UserId -> ArticleSlug -> Eff es (Maybe ArticleDetail)
getArticleWithAuthor mCurrentUserId slug = send (GetArticleWithAuthor mCurrentUserId slug)

createArticle
  :: (ArticleDB :> es)
  => ArticleSlug
  -> ArticleTitle
  -> ArticleDescription
  -> ArticleBody
  -> UserId
  -> [TagName]
  -> Eff es Article
createArticle slug title desc body authorId tags = send (CreateArticle slug title desc body authorId tags)

updateArticle
  :: (ArticleDB :> es)
  => ArticleId
  -> ArticleSlug
  -> ArticleTitle
  -> ArticleDescription
  -> ArticleBody
  -> Maybe [TagName]
  -> Eff es Article
updateArticle aid slug title desc body tags = send (UpdateArticle aid slug title desc body tags)

deleteArticle :: (ArticleDB :> es) => ArticleId -> Eff es ()
deleteArticle aid = send (DeleteArticle aid)

listArticles
  :: (ArticleDB :> es)
  => Maybe UserId
  -> Maybe TagName
  -> Maybe Username
  -> Maybe Username
  -> Int
  -> Int
  -> Eff es [ArticleDetail]
listArticles mCurrentUserId mTag mAuthor mFavorited lim off = send (ListArticles mCurrentUserId mTag mAuthor mFavorited lim off)

listFeed
  :: (ArticleDB :> es)
  => UserId
  -> Int
  -> Int
  -> Eff es [ArticleDetail]
listFeed currentUserId lim off = send (ListFeed currentUserId lim off)

countArticles
  :: (ArticleDB :> es) => Maybe TagName -> Maybe Username -> Maybe Username -> Eff es Int
countArticles mTag mAuthor mFavorited = send (CountArticles mTag mAuthor mFavorited)

countFeed :: (ArticleDB :> es) => UserId -> Eff es Int
countFeed currentUserId = send (CountFeed currentUserId)

favoriteArticle :: (ArticleDB :> es) => UserId -> ArticleId -> Eff es ()
favoriteArticle uid aid = send (FavoriteArticle uid aid)

unfavoriteArticle :: (ArticleDB :> es) => UserId -> ArticleId -> Eff es ()
unfavoriteArticle uid aid = send (UnfavoriteArticle uid aid)

listAdminArticles
  :: (ArticleDB :> es)
  => Maybe TagName
  -> Maybe Username
  -> Maybe Text
  -> Int
  -> Int
  -> Eff es [ArticleDetail]
listAdminArticles mTag mAuthor mSearch lim off = send (ListAdminArticles mTag mAuthor mSearch lim off)

countAdminArticles
  :: (ArticleDB :> es) => Maybe TagName -> Maybe Username -> Maybe Text -> Eff es Int
countAdminArticles mTag mAuthor mSearch = send (CountAdminArticles mTag mAuthor mSearch)
