module Infrastructure.Interpreter.Real.DB.Query.Follow where

import Database.Esqueleto.Experimental
import UnliftIO (MonadUnliftIO)

import Infrastructure.Interpreter.Real.DB.Schema.Schema

isFollowing :: (MonadUnliftIO m) => UserId -> UserId -> SqlPersistT m Bool
isFollowing followerId followedId = maybe False (const True) <$> selectOne (isFollowingSQL followerId followedId)

isFollowingSQL :: UserId -> UserId -> SqlQuery (SqlExpr (Value FollowId))
isFollowingSQL followerId followedId = do
  follow <- from $ table @Follow
  where_ (follow ^. FollowFollowerId ==. val followerId)
  where_ (follow ^. FollowFollowedId ==. val followedId)
  return (follow ^. FollowId)
