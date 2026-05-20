module Infrastructure.Interpreter.DB.Postgres.Query.Comment where

import Data.Text (Text)
import Data.Time (getCurrentTime)
import Database.Esqueleto.Experimental
import Database.Persist qualified as P
import UnliftIO (MonadIO (..), MonadUnliftIO)

import Infrastructure.Interpreter.DB.Postgres.Schema.Schema

getCommentsForArticle
  :: (MonadUnliftIO m) => ArticleId -> SqlPersistT m [(Entity Comment, Entity User)]
getCommentsForArticle aid = fmap (map (\(c :& u) -> (c, u))) $ select $ listCommentsSQL aid

listCommentsSQL
  :: ArticleId -> SqlQuery (SqlExpr (Entity Comment) :& SqlExpr (Entity User))
listCommentsSQL aid = do
  (comment :& author) <-
    from $
      table @Comment
        `innerJoin` table @User `on` (\(c :& u) -> c ^. CommentAuthorId ==. u ^. UserId)
  where_ (comment ^. CommentArticleId ==. val aid)
  orderBy [desc (comment ^. CommentCreatedAt)]
  return (comment :& author)

insertComment
  :: (MonadUnliftIO m)
  => ArticleId
  -> UserId
  -> Text
  -> SqlPersistT m (Maybe (Entity Comment, Entity User))
insertComment aid uid body = do
  now <- liftIO getCurrentTime
  cid <- P.insert $ Comment body uid aid now now
  mComment <- P.get cid
  mAuthor <- P.get uid
  case (mComment, mAuthor) of
    (Just c, Just u) -> return $ Just (Entity cid c, Entity uid u)
    _ -> return Nothing
