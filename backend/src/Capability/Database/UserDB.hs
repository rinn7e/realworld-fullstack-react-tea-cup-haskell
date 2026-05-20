module Capability.Database.UserDB where

import Domain.Type hiding (Limit, Offset)
import Domain.Type qualified as D
import Effectful
import Effectful.Dispatch.Dynamic

data UserDB :: Effect where
  LookupUserById :: UserId -> UserDB m (Maybe User)
  LookupUserByEmail :: Email -> UserDB m (Maybe User)
  LookupUserByUsername :: Username -> UserDB m (Maybe User)
  InsertUser :: Username -> Email -> PasswordHashed -> UserDB m User -- username, email, pwdHash
  UpdateUser :: UserId -> User -> UserDB m User
  DeleteUser :: UserId -> UserDB m ()
  ListUsers
    :: Maybe D.Limit
    -> Maybe D.Offset
    -> Maybe Username
    -> Maybe Email
    -> Maybe D.UserSort
    -> Maybe D.Direction
    -> UserDB m ([User], Int)
  FollowUser :: UserId -> UserId -> UserDB m () -- followerId, followedId
  UnfollowUser :: UserId -> UserId -> UserDB m () -- followerId, followedId
  IsFollowing :: UserId -> UserId -> UserDB m Bool -- followerId, followedId

type instance DispatchOf UserDB = 'Dynamic

lookupUserById :: (UserDB :> es) => UserId -> Eff es (Maybe User)
lookupUserById uid = send (LookupUserById uid)

lookupUserByEmail :: (UserDB :> es) => Email -> Eff es (Maybe User)
lookupUserByEmail email = send (LookupUserByEmail email)

lookupUserByUsername :: (UserDB :> es) => Username -> Eff es (Maybe User)
lookupUserByUsername username = send (LookupUserByUsername username)

insertUser :: (UserDB :> es) => Username -> Email -> PasswordHashed -> Eff es User
insertUser u e p = send (InsertUser u e p)

updateUser :: (UserDB :> es) => UserId -> User -> Eff es User
updateUser uid u = send (UpdateUser uid u)

deleteUser :: (UserDB :> es) => UserId -> Eff es ()
deleteUser uid = send (DeleteUser uid)

listUsers
  :: (UserDB :> es)
  => Maybe D.Limit
  -> Maybe D.Offset
  -> Maybe Username
  -> Maybe Email
  -> Maybe D.UserSort
  -> Maybe D.Direction
  -> Eff es ([User], Int)
listUsers mLimit mOffset mUsername mEmail mSort mDir = send (ListUsers mLimit mOffset mUsername mEmail mSort mDir)

followUser :: (UserDB :> es) => UserId -> UserId -> Eff es ()
followUser follower followed = send (FollowUser follower followed)

unfollowUser :: (UserDB :> es) => UserId -> UserId -> Eff es ()
unfollowUser follower followed = send (UnfollowUser follower followed)

isFollowing :: (UserDB :> es) => UserId -> UserId -> Eff es Bool
isFollowing follower followed = send (IsFollowing follower followed)
