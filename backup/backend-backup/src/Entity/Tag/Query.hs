module Entity.Tag.Query where

import Data.Text (Text)
import Database.Esqueleto.Experimental
import UnliftIO (MonadUnliftIO)

import DB.Schema.Type

getTags :: (MonadUnliftIO m) => SqlPersistT m [Text]
getTags = map unValue <$> select getTagsSQL

getTagsSQL :: SqlQuery (SqlExpr (Value Text))
getTagsSQL = do
  tag <- from $ table @Tag
  return (tag ^. TagName)
