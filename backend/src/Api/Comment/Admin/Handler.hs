module Api.Comment.Admin.Handler where

import Data.Text (Text)
import Data.Time (getCurrentTime)
import Database.Persist
  ( Filter
  , SelectOpt (..)
  , count
  , delete
  , get
  , insert
  , selectList
  , (==.)
  )
import Database.Persist.Sql (Entity (..), fromSqlKey, toSqlKey)
import Effectful (liftIO)
import Effectful.Error.Static (throwError)
import Servant (NamedRoutes)
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Api.Comment.Admin.Type
import Entity.Comment.Api (AdminCommentResponse (..), AdminCommentListResponse (..))
import Common.Type.App (App)
import Common.Util.Guard (guardAdmin)
import DB.Schema.Type (UserId)
import DB.Schema.Type qualified as DB
import DB.Util (runDB)

adminCommentRoute :: S.AuthResult UserId -> S.ServerT (NamedRoutes AdminCommentRoute) App
adminCommentRoute auth =
  AdminCommentRoute
    { getComments = getCommentsHandler auth
    , deleteComment = deleteCommentHandler auth
    }

getCommentsHandler
  :: S.AuthResult UserId
  -> Maybe Int
  -> Maybe Int
  -> Maybe Text
  -> Maybe Text
  -> App AdminCommentListResponse
getCommentsHandler (S.Authenticated uid) mLimit mOffset mAuthor mArticleSlug = do
  guardAdmin uid
  let limit = maybe 10 id mLimit
      offset = maybe 0 id mOffset

  runDB $ do
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
    totalCount <- fromIntegral <$> count filters
    entities <- selectList filters [Desc DB.CommentCreatedAt, LimitTo limit, OffsetBy offset]
    comments <- forM entities $ \(Entity cid c) -> do
      mArt <- get c.articleId
      mUser <- get c.authorId
      let slug = maybe "" (\art -> art.slug) mArt
          username = maybe "" (\u -> u.username) mUser
      return
        AdminCommentResponse
          { id = fromIntegral (fromSqlKey cid)
          , body = c.body
          , createdAt = c.createdAt
          , articleSlug = slug
          , authorUsername = username
          }
    return
      AdminCommentListResponse
        { comments = comments
        , totalCount = totalCount
        }
 where
  forM = flip mapM
getCommentsHandler _ _ _ _ _ = throwError S.err401

deleteCommentHandler :: S.AuthResult UserId -> Int -> App S.NoContent
deleteCommentHandler (S.Authenticated uid) cidInt = do
  guardAdmin uid
  let cid :: DB.CommentId = toSqlKey (fromIntegral cidInt)
  mTarget <- runDB (get cid)
  case mTarget of
    Nothing -> throwError S.err404
    Just target -> do
      now <- liftIO getCurrentTime
      runDB $ do
        delete cid
        _ <- insert $ DB.Log "INFO" ("Deleted comment: " <> target.body) "COMMENT" now (Just uid)
        return ()
      return S.NoContent
deleteCommentHandler _ _ = throwError S.err401
