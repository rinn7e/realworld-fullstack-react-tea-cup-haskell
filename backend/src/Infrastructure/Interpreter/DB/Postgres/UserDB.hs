module Infrastructure.Interpreter.DB.Postgres.UserDB
  ( runUserDBPostgres
  ) where

import Data.Text (Text)
import Database.Persist
  ( Entity (..)
  , Filter
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
import GHC.Generics (Generic)

import Capability.Database.UserDB
import Domain.User (User)
import Domain.User qualified as D
import Infrastructure.Interpreter.DB.Postgres.Query.User
  ( getUserByEmail
  , getUserByUsername
  )
import Infrastructure.Interpreter.DB.Postgres.Schema.Schema qualified as DB

toDomainUser :: Entity DB.User -> User
toDomainUser (Entity uid u) =
  D.User
    { userId = fromIntegral (fromSqlKey uid)
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
  LookupUserById uid -> do
    pool <- ask @ConnectionPool
    liftIO $
      runSqlPool
        ( do
            mUser <- get (toSqlKey (fromIntegral uid))
            return $ fmap (\u -> toDomainUser (Entity (toSqlKey (fromIntegral uid)) u)) mUser
        )
        pool
  LookupUserByEmail email -> do
    pool <- ask @ConnectionPool
    liftIO $
      runSqlPool
        ( do
            mUser <- getUserByEmail email
            return $ fmap toDomainUser mUser
        )
        pool
  LookupUserByUsername username -> do
    pool <- ask @ConnectionPool
    liftIO $
      runSqlPool
        ( do
            mUser <- getUserByUsername username
            return $ fmap toDomainUser mUser
        )
        pool
  InsertUser username email pwdHash -> do
    pool <- ask @ConnectionPool
    liftIO $
      runSqlPool
        ( do
            let u = DB.User username email pwdHash Nothing Nothing "User"
            uid <- insert u
            return $ toDomainUser (Entity uid u)
        )
        pool
  UpdateUser uid dUser -> do
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
            replace (toSqlKey (fromIntegral uid)) dbUser
            return dUser
        )
        pool
  DeleteUser uidInt -> do
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
  ListUsers mLimit mOffset mUsername mEmail -> do
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
  FollowUser follower followed -> do
    pool <- ask @ConnectionPool
    liftIO $
      runSqlPool
        ( do
            let f = DB.Follow (toSqlKey (fromIntegral follower)) (toSqlKey (fromIntegral followed))
            _ <- insert f
            return ()
        )
        pool
  UnfollowUser follower followed -> do
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
  IsFollowing follower followed -> do
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
