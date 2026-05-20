module Infrastructure.Api.Route.Article.Web.Controller
  ( webArticleRoute
  , getArticleFeedHandler
  , getArticleListHandler
  , createArticleHandler
  , getArticleOneHandler
  , updateArticleHandler
  , deleteArticleHandler
  , favoriteArticleHandler
  , unfavoriteArticleHandler
  ) where

import Data.Maybe (fromMaybe)
import Data.Text (Text)
import Data.Text qualified as T
import Database.Persist.Sql (fromSqlKey)
import Effectful
import Effectful.Error.Static (Error, throwError)
import Servant (NamedRoutes)
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Domain.Type qualified as D
import Infrastructure.Api.DTO qualified as Api
import Infrastructure.Api.Route.Article.Web.Type
import Infrastructure.Interpreter.Real.DB.Schema.Schema qualified as DB

import Capability.Database.ArticleDB
import Capability.Database.CommentDB
import Capability.Database.UserDB
import Infrastructure.Api.Route.Comment.Web.Controller qualified as Comm

webArticleRoute
  :: ( ArticleDB :> es
     , CommentDB :> es
     , UserDB :> es
     , Error S.ServerError :> es
     )
  => S.AuthResult DB.UserId
  -> S.ServerT (NamedRoutes ArticleRoute) (Eff es)
webArticleRoute auth =
  ArticleRoute
    { getArticleFeed = getArticleFeedHandler auth
    , getArticleList = getArticleListHandler auth
    , createArticle = createArticleHandler auth
    , getArticleOne = getArticleOneHandler auth
    , updateArticle = updateArticleHandler auth
    , deleteArticle = deleteArticleHandler auth
    , favoriteArticle = favoriteArticleHandler auth
    , unfavoriteArticle = unfavoriteArticleHandler auth
    , comments = Comm.commentRoute auth
    }

getArticleFeedHandler
  :: ( ArticleDB :> es
     , Error S.ServerError :> es
     )
  => S.AuthResult DB.UserId
  -> Maybe D.Limit
  -> Maybe D.Offset
  -> Eff es Api.ArticleListResponse
getArticleFeedHandler (S.Authenticated uid) mLimit mOffset = do
  let limit = maybe (D.Limit 20) id mLimit
      offset = maybe (D.Offset 0) id mOffset
      dUid = D.UserId $ fromIntegral (fromSqlKey uid)
  articlesDetail <- listFeed dUid limit offset
  totalCount <- countFeed dUid
  let articles = map Api.toArticleResponse articlesDetail
  return $ Api.ArticleListResponse articles totalCount
getArticleFeedHandler _ _ _ = throwError S.err401

getArticleListHandler
  :: ( ArticleDB :> es
     , Error S.ServerError :> es
     )
  => S.AuthResult DB.UserId
  -> Maybe D.TagName
  -> Maybe D.Username
  -> Maybe D.Username
  -> Maybe D.Limit
  -> Maybe D.Offset
  -> Eff es Api.ArticleListResponse
getArticleListHandler auth mTag mAuthor mFavorited mLimit mOffset = do
  let limit = maybe (D.Limit 20) id mLimit
      offset = maybe (D.Offset 0) id mOffset
      mdUid = case auth of
        S.Authenticated uid -> Just $ D.UserId $ fromIntegral (fromSqlKey uid)
        _ -> Nothing
  articlesDetail <- listArticles mdUid mTag mAuthor mFavorited limit offset
  totalCount <- countArticles mTag mAuthor mFavorited
  let articles = map Api.toArticleResponse articlesDetail
  return $ Api.ArticleListResponse articles totalCount

createArticleHandler
  :: ( ArticleDB :> es
     , Error S.ServerError :> es
     )
  => S.AuthResult DB.UserId
  -> Api.ArticleWrapper Api.NewArticleRequest
  -> Eff es Api.ArticleResponse
createArticleHandler (S.Authenticated uid) (Api.ArticleWrapper (Api.NewArticleRequest title desc body mTags)) = do
  let slugText = T.intercalate "-" $ T.words $ T.toLower title.unArticleTitle
      slug = D.ArticleSlug slugText
      tags = fromMaybe [] mTags
      dUid = D.UserId $ fromIntegral (fromSqlKey uid)
  _ <- createArticle slug title desc body dUid tags
  mArticleDetail <- getArticleWithAuthor (Just dUid) slug
  case mArticleDetail of
    Just grouped -> return $ Api.ArticleResponse $ Api.toArticleResponse grouped
    Nothing -> throwError S.err500
createArticleHandler _ _ = throwError S.err401

getArticleOneHandler
  :: ( ArticleDB :> es
     , Error S.ServerError :> es
     )
  => S.AuthResult DB.UserId
  -> D.ArticleSlug
  -> Eff es Api.ArticleResponse
getArticleOneHandler auth slug = do
  let mdUid = case auth of
        S.Authenticated uid -> Just $ D.UserId $ fromIntegral (fromSqlKey uid)
        _ -> Nothing
  mArticleDetail <- getArticleWithAuthor mdUid slug
  case mArticleDetail of
    Nothing -> throwError S.err404
    Just grouped -> return $ Api.ArticleResponse $ Api.toArticleResponse grouped

updateArticleHandler
  :: ( ArticleDB :> es
     , Error S.ServerError :> es
     )
  => S.AuthResult DB.UserId
  -> D.ArticleSlug
  -> Api.ArticleWrapper Api.UpdateArticleRequest
  -> Eff es Api.ArticleResponse
updateArticleHandler (S.Authenticated uid) slug (Api.ArticleWrapper (Api.UpdateArticleRequest mTitle mDesc mBody mTags)) = do
  mArt <- getArticleBySlug slug
  case mArt of
    Nothing -> throwError S.err404
    Just art -> do
      let dUid = D.UserId $ fromIntegral (fromSqlKey uid)
      if art.authorId /= dUid
        then throwError S.err403
        else do
          let newSlug =
                maybe
                  art.slug
                  (\t -> D.ArticleSlug (T.intercalate "-" . T.words . T.toLower $ t.unArticleTitle))
                  mTitle
              newTitle = maybe art.title id mTitle
              newDesc = maybe art.description id mDesc
              newBody = maybe art.body id mBody
          _ <- updateArticle art.articleId newSlug newTitle newDesc newBody mTags
          mArticleDetail <- getArticleWithAuthor (Just dUid) newSlug
          case mArticleDetail of
            Just grouped -> return $ Api.ArticleResponse $ Api.toArticleResponse grouped
            Nothing -> throwError S.err500
updateArticleHandler _ _ _ = throwError S.err401

deleteArticleHandler
  :: ( ArticleDB :> es
     , Error S.ServerError :> es
     )
  => S.AuthResult DB.UserId
  -> D.ArticleSlug
  -> Eff es S.NoContent
deleteArticleHandler (S.Authenticated uid) slug = do
  mArt <- getArticleBySlug slug
  case mArt of
    Nothing -> throwError S.err404
    Just art -> do
      let dUid = D.UserId $ fromIntegral (fromSqlKey uid)
      if art.authorId /= dUid
        then throwError S.err403
        else do
          deleteArticle art.articleId
          return S.NoContent
deleteArticleHandler _ _ = throwError S.err401

favoriteArticleHandler
  :: ( ArticleDB :> es
     , Error S.ServerError :> es
     )
  => S.AuthResult DB.UserId
  -> D.ArticleSlug
  -> Eff es Api.ArticleResponse
favoriteArticleHandler (S.Authenticated uid) slug = do
  mArt <- getArticleBySlug slug
  case mArt of
    Nothing -> throwError S.err404
    Just art -> do
      let dUid = D.UserId $ fromIntegral (fromSqlKey uid)
      favoriteArticle dUid art.articleId
      mArticleDetail <- getArticleWithAuthor (Just dUid) slug
      case mArticleDetail of
        Just grouped -> return $ Api.ArticleResponse $ Api.toArticleResponse grouped
        Nothing -> throwError S.err500
favoriteArticleHandler _ _ = throwError S.err401

unfavoriteArticleHandler
  :: ( ArticleDB :> es
     , Error S.ServerError :> es
     )
  => S.AuthResult DB.UserId
  -> D.ArticleSlug
  -> Eff es Api.ArticleResponse
unfavoriteArticleHandler (S.Authenticated uid) slug = do
  mArt <- getArticleBySlug slug
  case mArt of
    Nothing -> throwError S.err404
    Just art -> do
      let dUid = D.UserId $ fromIntegral (fromSqlKey uid)
      unfavoriteArticle dUid art.articleId
      mArticleDetail <- getArticleWithAuthor (Just dUid) slug
      case mArticleDetail of
        Just grouped -> return $ Api.ArticleResponse $ Api.toArticleResponse grouped
        Nothing -> throwError S.err500
unfavoriteArticleHandler _ _ = throwError S.err401
