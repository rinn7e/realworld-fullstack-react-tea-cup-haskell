module Infrastructure.Interpreter.Stub.DB.UserDB
  ( MockDB (..)
  , emptyMockDB
  , runUserDBStub
  ) where

import Data.List qualified as L
import Data.Map.Strict (Map)
import Data.Map.Strict qualified as Map
import Effectful
import Effectful.Dispatch.Dynamic
import UnliftIO.IORef

import Capability.Database.UserDB
import Domain.User (User (..))

data MockDB = MockDB
  { nextUserId :: Int
  , users :: Map Int User
  , follows :: [(Int, Int)] -- (followerId, followedId)
  }
  deriving (Show)

emptyMockDB :: MockDB
emptyMockDB =
  MockDB
    { nextUserId = 1
    , users = Map.empty
    , follows = []
    }

runUserDBStub :: (IOE :> es) => IORef MockDB -> Eff (UserDB : es) a -> Eff es a
runUserDBStub ref = interpret $ \_ -> \case
  LookupUserById uid -> do
    db <- readIORef ref
    pure $ Map.lookup uid db.users
  LookupUserByEmail email -> do
    db <- readIORef ref
    pure $ L.find (\u -> u.email == email) (Map.elems db.users)
  LookupUserByUsername username -> do
    db <- readIORef ref
    pure $ L.find (\u -> u.username == username) (Map.elems db.users)
  InsertUser username email pwdHash -> do
    atomicModifyIORef' ref $ \db ->
      let uid = db.nextUserId
          newUser =
            User
              { userId = uid
              , username = username
              , email = email
              , password = pwdHash
              , bio = Nothing
              , image = Nothing
              , role = "User"
              }
          newDb =
            db
              { nextUserId = uid + 1
              , users = Map.insert uid newUser db.users
              }
       in (newDb, newUser)
  UpdateUser uid updatedUser -> do
    atomicModifyIORef' ref $ \db ->
      let newDb = db{users = Map.insert uid updatedUser db.users}
       in (newDb, updatedUser)
  DeleteUser uid -> do
    atomicModifyIORef' ref $ \db ->
      let newDb = db{users = Map.delete uid db.users}
       in (newDb, ())
  ListUsers mLimit mOffset mUsername mEmail -> do
    db <- readIORef ref
    let allUsers = Map.elems db.users
        filtered =
          filter
            ( \u ->
                maybe True (\uname -> uname == u.username) mUsername
                  && maybe True (\uemail -> uemail == u.email) mEmail
            )
            allUsers
        sliced = take (maybe 10 id mLimit) $ drop (maybe 0 id mOffset) filtered
    pure (sliced, length filtered)
  FollowUser follower followed -> do
    atomicModifyIORef' ref $ \db ->
      let newFollows =
            if (follower, followed) `elem` db.follows
              then db.follows
              else (follower, followed) : db.follows
          newDb = db{follows = newFollows}
       in (newDb, ())
  UnfollowUser follower followed -> do
    atomicModifyIORef' ref $ \db ->
      let newFollows = filter (/= (follower, followed)) db.follows
          newDb = db{follows = newFollows}
       in (newDb, ())
  IsFollowing follower followed -> do
    db <- readIORef ref
    pure $ (follower, followed) `elem` db.follows
