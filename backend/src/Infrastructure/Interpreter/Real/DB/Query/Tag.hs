module Infrastructure.Interpreter.Real.DB.Query.Tag where

import Database.Esqueleto.Experimental
import Domain.Type qualified as D
import UnliftIO (MonadUnliftIO)

import Infrastructure.Interpreter.Real.DB.Schema.Schema

getTags :: (MonadUnliftIO m) => SqlPersistT m [D.TagName]
getTags = map unValue <$> select getTagsSQL

getTagsSQL :: SqlQuery (SqlExpr (Value D.TagName))
getTagsSQL = do
  tag <- from $ table @Tag
  return (tag ^. TagName)
