module InMemoryDB
  ( MockDB (..)
  , emptyMockDB
  , runUserDBInMemory
  , runCryptoMock
  , runAuthMock
  , runTimeMock
  , runArticleDBStub
  , runCommentDBStub
  , runTagDBStub
  , runVisitorDBStub
  , runLoggerDBStub
  , runMetadataDBStub
  , runAppInMemory
  ) where

import Data.Function ((&))
import Data.List qualified as L
import Data.Map.Strict (Map)
import Data.Map.Strict qualified as Map
import Data.Pool (createPool)
import Data.Text (Text)
import Data.Text qualified as T
import Data.Time (UTCTime)
import Database.Persist.Sql (ConnectionPool, fromSqlKey)
import Effectful
import Effectful.Dispatch.Dynamic
import Effectful.Error.Static
import Effectful.Reader.Static
import GHC.Exts (lazy)
import Infrastructure.Common.Type.Config (Config (..))
import Infrastructure.Common.Type.JWK (makeSecretKey)
import Servant.Auth.Server qualified as S
import Servant.Server qualified as S
import System.IO.Unsafe (unsafePerformIO)
import UnliftIO.IORef

import Capability.Auth (Auth (..))
import Capability.Crypto (Crypto (..))
import Capability.Database.ArticleDB (ArticleDB (..))
import Capability.Database.CommentDB (CommentDB (..))
import Capability.Database.LoggerDB (LoggerDB (..))
import Capability.Database.MetadataDB (MetadataDB (..))
import Capability.Database.TagDB (TagDB (..))
import Capability.Database.UserDB (UserDB (..))
import Capability.Database.VisitorDB (VisitorDB (..))
import Capability.Time (Time (..))

import Crypto.JWT (JWK)
import Domain.User (User (..))
import Infrastructure.Common.Type.App (App, AppEnv (..))

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

runUserDBInMemory :: (IOE :> es) => IORef MockDB -> Eff (UserDB : es) a -> Eff es a
runUserDBInMemory ref = interpret $ \_ -> \case
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

runCryptoMock :: Eff (Crypto : es) a -> Eff es a
runCryptoMock = interpret $ \_ -> \case
  HashPassword plain -> pure $ "mock_hash_" <> plain
  VerifyPassword plain hash -> pure $ hash == "mock_hash_" <> plain

runAuthMock :: Eff (Auth : es) a -> Eff es a
runAuthMock = interpret $ \_ -> \case
  GenerateToken uid -> pure $ "mock_token_" <> T.pack (show (fromSqlKey uid))

runTimeMock :: UTCTime -> Eff (Time : es) a -> Eff es a
runTimeMock fixedTime = interpret $ \_ -> \case
  GetCurrentTime -> pure fixedTime

runArticleDBStub :: Eff (ArticleDB : es) a -> Eff es a
runArticleDBStub = interpret $ \_ -> \case
  GetArticleBySlug _ -> pure Nothing
  GetArticleWithAuthor _ _ -> pure Nothing
  CreateArticle{} -> error "ArticleDBStub: CreateArticle"
  UpdateArticle{} -> error "ArticleDBStub: UpdateArticle"
  DeleteArticle _ -> pure ()
  ListArticles{} -> pure mempty
  ListFeed{} -> pure mempty
  CountArticles{} -> pure 0
  CountFeed _ -> pure 0
  FavoriteArticle _ _ -> pure ()
  UnfavoriteArticle _ _ -> pure ()
  ListAdminArticles{} -> pure mempty
  CountAdminArticles{} -> pure 0

runCommentDBStub :: Eff (CommentDB : es) a -> Eff es a
runCommentDBStub = interpret $ \_ -> \case
  GetCommentsForArticle _ -> pure []
  InsertComment _ _ _ -> pure Nothing
  DeleteComment _ -> pure ()
  GetComment _ -> pure Nothing
  ListAdminComments{} -> pure ([], 0)

runTagDBStub :: Eff (TagDB : es) a -> Eff es a
runTagDBStub = interpret $ \_ -> \case
  GetTags -> pure []

runVisitorDBStub :: Eff (VisitorDB : es) a -> Eff es a
runVisitorDBStub = interpret $ \_ -> \case
  InsertVisitor{} -> pure (error "VisitorDBStub: InsertVisitor")
  ListVisitors{} -> pure ([], 0)
  GetVisitorsSince _ -> pure []
  CountAllVisitors -> pure 0

runLoggerDBStub :: Eff (LoggerDB : es) a -> Eff es a
runLoggerDBStub = interpret $ \_ -> \case
  InsertLog{} -> pure (error "LoggerDBStub: InsertLog")
  ListLogs{} -> pure ([], 0)
  CountAllLogs -> pure 0

runMetadataDBStub :: Eff (MetadataDB : es) a -> Eff es a
runMetadataDBStub = interpret $ \_ -> \case
  GetLastRanMigration -> pure (Just 1)

dummyJWK :: JWK
dummyJWK = makeSecretKey "dummy-secret-key-that-should-be-at-least-32-chars-long-!!"

dummyPool :: ConnectionPool
dummyPool =
  unsafePerformIO $
    createPool (pure (error "SqlBackend should not be evaluated")) (\_ -> pure ()) 1 60 1

dummyConfig :: Config
dummyConfig =
  Config
    { dbConnStr = ""
    , jwtSecret = ""
    , shouldRunMigrationAuto = False
    , gitCommitHash = ""
    , port = 0
    , showSqlLog = False
    , allowCorsEnabled = False
    }

dummyAppEnv :: AppEnv
dummyAppEnv =
  AppEnv
    { appPool = dummyPool
    , appJwtSettings = S.defaultJWTSettings dummyJWK
    , appJwtKey = dummyJWK
    , appConfig = dummyConfig
    }

runAppInMemory :: IORef MockDB -> UTCTime -> App a -> IO a
runAppInMemory dbRef fixedTime action = do
  res <-
    action
      & runCommentDBStub
      & runArticleDBStub
      & runLoggerDBStub
      & runMetadataDBStub
      & runUserDBInMemory dbRef
      & runVisitorDBStub
      & runTagDBStub
      & runTimeMock fixedTime
      & runAuthMock
      & runCryptoMock
      & runReader dummyAppEnv
      & runReader dummyPool
      & runReader dummyJWK
      & runErrorNoCallStack @S.ServerError
      & runEff
  case res of
    Left err -> error $ "App failed in test: " ++ show err
    Right a -> return a
