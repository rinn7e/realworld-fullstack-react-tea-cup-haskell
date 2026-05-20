module Infrastructure.Postgres.Query.User where

import Data.Text (Text)
import Database.Esqueleto.Experimental
import UnliftIO (MonadUnliftIO)

import Infrastructure.Postgres.Schema

getUserByEmail :: (MonadUnliftIO m) => Text -> SqlPersistT m (Maybe (Entity User))
getUserByEmail email = selectOne $ getUserByEmailSQL email

getUserByEmailSQL :: Text -> SqlQuery (SqlExpr (Entity User))
getUserByEmailSQL email = do
  user <- from $ table @User
  where_ (user ^. UserEmail ==. val email)
  return user

getUserByUsername :: (MonadUnliftIO m) => Text -> SqlPersistT m (Maybe (Entity User))
getUserByUsername username = selectOne $ getUserByUsernameSQL username

getUserByUsernameSQL :: Text -> SqlQuery (SqlExpr (Entity User))
getUserByUsernameSQL username = do
  user <- from $ table @User
  where_ (user ^. UserUsername ==. val username)
  return user
