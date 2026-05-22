module Entity.Follow.Query where

import Database.Esqueleto.Experimental
import UnliftIO (MonadUnliftIO)

import DB.Schema.Type

isFollowing :: (MonadUnliftIO m) => UserId -> UserId -> SqlPersistT m Bool
isFollowing followerId followedId = maybe False (const True) <$> selectOne (isFollowingSQL followerId followedId)

isFollowingSQL :: UserId -> UserId -> SqlQuery (SqlExpr (Value FollowId))
isFollowingSQL followerId followedId = do
  follow <- from $ table @Follow
  where_ (follow ^. FollowFollowerId ==. val followerId)
  where_ (follow ^. FollowFollowedId ==. val followedId)
  return (follow ^. FollowId)
