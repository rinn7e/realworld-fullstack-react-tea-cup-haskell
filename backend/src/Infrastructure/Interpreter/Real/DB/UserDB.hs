module Infrastructure.Interpreter.Real.DB.UserDB
  ( runUserDBPostgres
  , toDomainUser
  ) where

import Database.Persist
  ( Entity (..)
  , SelectOpt (..)
  , count
  , delete
  , deleteWhere
  , get
  , insert
  , replace
  , selectList
  , (==.)
  )
import Database.Persist.Sql (ConnectionPool, fromSqlKey, runSqlPool, toSqlKey)
import Effectful
import Effectful.Dispatch.Dynamic
import Effectful.Reader.Static

import Capability.Database.UserDB
import Domain.Type (User)
import Domain.Type qualified as D
import Infrastructure.Interpreter.Real.DB.Query.User
  ( getUserByEmail
  , getUserByUsername
  )
import Infrastructure.Interpreter.Real.DB.Schema.Schema qualified as DB

toDomainUser :: Entity DB.User -> User
toDomainUser (Entity uid u) =
  D.User
    { userId = D.UserId $ fromIntegral (fromSqlKey uid)
    , username = u.username
    , email = u.email
    , password = u.password
    , bio = u.bio
    , image = u.image
    , role = u.role
    }

runUserDBPostgres
  :: (IOE :> es, Reader ConnectionPool :> es) => Eff (UserDB : es) a -> Eff es a
runUserDBPostgres = interpret $ \_ -> \case
  LookupUserById uid -> lookupUserByIdHandler uid
  LookupUserByEmail email -> lookupUserByEmailHandler email
  LookupUserByUsername username -> lookupUserByUsernameHandler username
  InsertUser username email pwdHash -> insertUserHandler username email pwdHash
  UpdateUser uid dUser -> updateUserHandler uid dUser
  DeleteUser uid -> deleteUserHandler uid
  ListUsers mLimit mOffset mUsername mEmail -> listUsersHandler mLimit mOffset mUsername mEmail
  FollowUser follower followed -> followUserHandler follower followed
  UnfollowUser follower followed -> unfollowUserHandler follower followed
  IsFollowing follower followed -> isFollowingHandler follower followed

lookupUserByIdHandler
  :: (IOE :> es, Reader ConnectionPool :> es) => D.UserId -> Eff es (Maybe D.User)
lookupUserByIdHandler (D.UserId uidInt) = do
  pool <- ask @ConnectionPool
  liftIO $
    runSqlPool
      ( do
          let sqlKey = toSqlKey (fromIntegral uidInt)
          mUser <- get sqlKey
          return $ fmap (\u -> toDomainUser (Entity sqlKey u)) mUser
      )
      pool

lookupUserByEmailHandler
  :: (IOE :> es, Reader ConnectionPool :> es) => D.Email -> Eff es (Maybe D.User)
lookupUserByEmailHandler email = do
  pool <- ask @ConnectionPool
  liftIO $
    runSqlPool
      ( do
          mUser <- getUserByEmail email
          return $ fmap toDomainUser mUser
      )
      pool

lookupUserByUsernameHandler
  :: (IOE :> es, Reader ConnectionPool :> es) => D.Username -> Eff es (Maybe D.User)
lookupUserByUsernameHandler username = do
  pool <- ask @ConnectionPool
  liftIO $
    runSqlPool
      ( do
          mUser <- getUserByUsername username
          return $ fmap toDomainUser mUser
      )
      pool

insertUserHandler
  :: (IOE :> es, Reader ConnectionPool :> es)
  => D.Username
  -> D.Email
  -> D.PasswordHashed
  -> Eff es D.User
insertUserHandler username email pwdHash = do
  pool <- ask @ConnectionPool
  liftIO $
    runSqlPool
      ( do
          let u = DB.User username email pwdHash Nothing Nothing D.RegularRole
          uid <- insert u
          return $ toDomainUser (Entity uid u)
      )
      pool

updateUserHandler
  :: (IOE :> es, Reader ConnectionPool :> es) => D.UserId -> D.User -> Eff es D.User
updateUserHandler (D.UserId uidInt) dUser = do
  pool <- ask @ConnectionPool
  liftIO $
    runSqlPool
      ( do
          let dbUser =
                DB.User
                  { username = dUser.username
                  , email = dUser.email
                  , password = dUser.password
                  , bio = dUser.bio
                  , image = dUser.image
                  , role = dUser.role
                  }
          replace (toSqlKey (fromIntegral uidInt)) dbUser
          return dUser
      )
      pool

deleteUserHandler :: (IOE :> es, Reader ConnectionPool :> es) => D.UserId -> Eff es ()
deleteUserHandler (D.UserId uidInt) = do
  pool <- ask @ConnectionPool
  liftIO $
    runSqlPool
      ( do
          let uid = toSqlKey (fromIntegral uidInt)
          -- Clean up articles authored by this user
          articles <- selectList [DB.ArticleAuthorId ==. uid] []
          let forM_ = flip mapM_
          forM_ articles $ \(Entity aid _) -> do
            deleteWhere [DB.ArticleTagArticleId ==. aid]
            deleteWhere [DB.CommentArticleId ==. aid]
            deleteWhere [DB.FavoriteArticleId ==. aid]
          deleteWhere [DB.ArticleAuthorId ==. uid]

          -- Clean up comments, favorites, follows
          deleteWhere [DB.CommentAuthorId ==. uid]
          deleteWhere [DB.FavoriteUserId ==. uid]
          deleteWhere [DB.FollowFollowerId ==. uid]
          deleteWhere [DB.FollowFollowedId ==. uid]

          -- Delete the actual user record
          delete uid
      )
      pool

listUsersHandler
  :: (IOE :> es, Reader ConnectionPool :> es)
  => Maybe Int
  -> Maybe Int
  -> Maybe D.Username
  -> Maybe D.Email
  -> Eff es ([D.User], Int)
listUsersHandler mLimit mOffset mUsername mEmail = do
  pool <- ask @ConnectionPool
  liftIO $
    runSqlPool
      ( do
          let limit = maybe 10 id mLimit
              offset = maybe 0 id mOffset
              filters =
                concat
                  [ maybe [] (\u -> [DB.UserUsername ==. u]) mUsername
                  , maybe [] (\e -> [DB.UserEmail ==. e]) mEmail
                  ]
          total <- count filters
          entities <- selectList filters [Asc DB.UserUsername, LimitTo limit, OffsetBy offset]
          return (map toDomainUser entities, fromIntegral total)
      )
      pool

followUserHandler
  :: (IOE :> es, Reader ConnectionPool :> es) => D.UserId -> D.UserId -> Eff es ()
followUserHandler (D.UserId follower) (D.UserId followed) = do
  pool <- ask @ConnectionPool
  liftIO $
    runSqlPool
      ( do
          let f = DB.Follow (toSqlKey (fromIntegral follower)) (toSqlKey (fromIntegral followed))
          _ <- insert f
          return ()
      )
      pool

unfollowUserHandler
  :: (IOE :> es, Reader ConnectionPool :> es) => D.UserId -> D.UserId -> Eff es ()
unfollowUserHandler (D.UserId follower) (D.UserId followed) = do
  pool <- ask @ConnectionPool
  liftIO $
    runSqlPool
      ( do
          deleteWhere
            [ DB.FollowFollowerId ==. toSqlKey (fromIntegral follower)
            , DB.FollowFollowedId ==. toSqlKey (fromIntegral followed)
            ]
      )
      pool

isFollowingHandler
  :: (IOE :> es, Reader ConnectionPool :> es) => D.UserId -> D.UserId -> Eff es Bool
isFollowingHandler (D.UserId follower) (D.UserId followed) = do
  pool <- ask @ConnectionPool
  liftIO $
    runSqlPool
      ( do
          c <-
            count
              [ DB.FollowFollowerId ==. toSqlKey (fromIntegral follower)
              , DB.FollowFollowedId ==. toSqlKey (fromIntegral followed)
              ]
          return (c > 0)
      )
      pool
