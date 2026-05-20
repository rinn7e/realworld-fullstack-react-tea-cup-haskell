module Infrastructure.Interpreter.Real.DB.Query.User where

import Database.Esqueleto.Experimental
import UnliftIO (MonadUnliftIO)

import Domain.Type.User (Email, Username)
import Infrastructure.Interpreter.Real.DB.Schema.Schema

getUserByEmail :: (MonadUnliftIO m) => Email -> SqlPersistT m (Maybe (Entity User))
getUserByEmail email = selectOne $ getUserByEmailSQL email

getUserByEmailSQL :: Email -> SqlQuery (SqlExpr (Entity User))
getUserByEmailSQL email = do
  user <- from $ table @User
  where_ (user ^. UserEmail ==. val email)
  return user

getUserByUsername :: (MonadUnliftIO m) => Username -> SqlPersistT m (Maybe (Entity User))
getUserByUsername username = selectOne $ getUserByUsernameSQL username

getUserByUsernameSQL :: Username -> SqlQuery (SqlExpr (Entity User))
getUserByUsernameSQL username = do
  user <- from $ table @User
  where_ (user ^. UserUsername ==. val username)
  return user
