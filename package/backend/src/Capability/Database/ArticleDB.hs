module Capability.Database.ArticleDB where

import Data.Text (Text)
import Domain.Type hiding (Limit, Offset)
import Domain.Type qualified as D
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
    -> D.Limit
    -> D.Offset
    -> ArticleDB m [ArticleDetail]
  ListFeed
    :: UserId -> D.Limit -> D.Offset -> ArticleDB m [ArticleDetail]
  CountArticles :: Maybe TagName -> Maybe Username -> Maybe Username -> ArticleDB m Int
  CountFeed :: UserId -> ArticleDB m Int
  FavoriteArticle :: UserId -> ArticleId -> ArticleDB m ()
  UnfavoriteArticle :: UserId -> ArticleId -> ArticleDB m ()
  ListAdminArticles
    :: Maybe TagName
    -> Maybe Username
    -> Maybe Text
    -> Maybe ArticleSort
    -> Maybe Direction
    -> D.Limit
    -> D.Offset
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
  -> D.Limit
  -> D.Offset
  -> Eff es [ArticleDetail]
listArticles mCurrentUserId mTag mAuthor mFavorited lim off = send (ListArticles mCurrentUserId mTag mAuthor mFavorited lim off)

listFeed
  :: (ArticleDB :> es)
  => UserId
  -> D.Limit
  -> D.Offset
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
  -> Maybe ArticleSort
  -> Maybe Direction
  -> D.Limit
  -> D.Offset
  -> Eff es [ArticleDetail]
listAdminArticles mTag mAuthor mSearch mSort mDir lim off = send (ListAdminArticles mTag mAuthor mSearch mSort mDir lim off)

countAdminArticles
  :: (ArticleDB :> es) => Maybe TagName -> Maybe Username -> Maybe Text -> Eff es Int
countAdminArticles mTag mAuthor mSearch = send (CountAdminArticles mTag mAuthor mSearch)
