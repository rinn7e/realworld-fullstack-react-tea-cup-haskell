module Infrastructure.Interpreter.Real.DB.Query.Tag where

import Data.Text (Text)
import Database.Esqueleto.Experimental
import UnliftIO (MonadUnliftIO)

import Infrastructure.Interpreter.Real.DB.Schema.Schema

getTags :: (MonadUnliftIO m) => SqlPersistT m [Text]
getTags = map unValue <$> select getTagsSQL

getTagsSQL :: SqlQuery (SqlExpr (Value Text))
getTagsSQL = do
  tag <- from $ table @Tag
  return (tag ^. TagName)
