module Capability.Database.UserDB where

import Data.Text (Text)
import Domain.Type (User, UserId)
import Effectful
import Effectful.Dispatch.Dynamic

data UserDB :: Effect where
  LookupUserById :: UserId -> UserDB m (Maybe User)
  LookupUserByEmail :: Text -> UserDB m (Maybe User)
  LookupUserByUsername :: Text -> UserDB m (Maybe User)
  InsertUser :: Text -> Text -> Text -> UserDB m User -- username, email, pwdHash
  UpdateUser :: UserId -> User -> UserDB m User
  DeleteUser :: UserId -> UserDB m ()
  ListUsers
    :: Maybe Int -> Maybe Int -> Maybe Text -> Maybe Text -> UserDB m ([User], Int)
  FollowUser :: UserId -> UserId -> UserDB m () -- followerId, followedId
  UnfollowUser :: UserId -> UserId -> UserDB m () -- followerId, followedId
  IsFollowing :: UserId -> UserId -> UserDB m Bool -- followerId, followedId

type instance DispatchOf UserDB = 'Dynamic

lookupUserById :: (UserDB :> es) => UserId -> Eff es (Maybe User)
lookupUserById uid = send (LookupUserById uid)

lookupUserByEmail :: (UserDB :> es) => Text -> Eff es (Maybe User)
lookupUserByEmail email = send (LookupUserByEmail email)

lookupUserByUsername :: (UserDB :> es) => Text -> Eff es (Maybe User)
lookupUserByUsername username = send (LookupUserByUsername username)

insertUser :: (UserDB :> es) => Text -> Text -> Text -> Eff es User
insertUser u e p = send (InsertUser u e p)

updateUser :: (UserDB :> es) => UserId -> User -> Eff es User
updateUser uid u = send (UpdateUser uid u)

deleteUser :: (UserDB :> es) => UserId -> Eff es ()
deleteUser uid = send (DeleteUser uid)

listUsers
  :: (UserDB :> es)
  => Maybe Int
  -> Maybe Int
  -> Maybe Text
  -> Maybe Text
  -> Eff es ([User], Int)
listUsers mLimit mOffset mUsername mEmail = send (ListUsers mLimit mOffset mUsername mEmail)

followUser :: (UserDB :> es) => UserId -> UserId -> Eff es ()
followUser follower followed = send (FollowUser follower followed)

unfollowUser :: (UserDB :> es) => UserId -> UserId -> Eff es ()
unfollowUser follower followed = send (UnfollowUser follower followed)

isFollowing :: (UserDB :> es) => UserId -> UserId -> Eff es Bool
isFollowing follower followed = send (IsFollowing follower followed)
