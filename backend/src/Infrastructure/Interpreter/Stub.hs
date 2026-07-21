module Infrastructure.Interpreter.Stub
  ( runAppInMemory
  , runAppInMemoryEither
  ) where

import Data.Function ((&))
import Data.Time (UTCTime)
import Effectful
import Effectful.Error.Static
import Effectful.Reader.Static
import Servant.Server qualified as S
import UnliftIO.IORef

import Infrastructure.Common.Type.App (App)
import Infrastructure.Interpreter.Stub.Auth (runAuthStub)
import Infrastructure.Interpreter.Stub.Crypto (runCryptoStub)
import Infrastructure.Interpreter.Stub.DB.ArticleDB (runArticleDBStub)
import Infrastructure.Interpreter.Stub.DB.CommentDB (runCommentDBStub)
import Infrastructure.Interpreter.Stub.DB.LoggerDB (runLoggerDBStub)
import Infrastructure.Interpreter.Stub.DB.MetadataDB (runMetadataDBStub)
import Infrastructure.Interpreter.Stub.DB.TagDB (runTagDBStub)
import Infrastructure.Interpreter.Stub.DB.UserDB (MockDB, runUserDBStub)
import Infrastructure.Interpreter.Stub.DB.VisitorDB (runVisitorDBStub)
import Infrastructure.Interpreter.Stub.Time (runTimeStub)
import Infrastructure.Interpreter.Stub.Util (dummyAppEnv, dummyJWK, dummyPool)
import Infrastructure.Common.Type.DBPools (ReadPool (..), WritePool (..))

runAppInMemory :: IORef MockDB -> UTCTime -> App a -> IO a
runAppInMemory dbRef fixedTime action = do
  res <- runAppInMemoryEither dbRef fixedTime action
  case res of
    Left err -> error $ "App failed in test: " ++ show err
    Right a -> return a

runAppInMemoryEither :: IORef MockDB -> UTCTime -> App a -> IO (Either S.ServerError a)
runAppInMemoryEither dbRef fixedTime action = do
  action
    & runCommentDBStub dbRef
    & runArticleDBStub dbRef
    & runLoggerDBStub dbRef
    & runMetadataDBStub dbRef
    & runUserDBStub dbRef
    & runVisitorDBStub dbRef
    & runTagDBStub dbRef
    & runTimeStub fixedTime
    & runAuthStub
    & runCryptoStub
    & runReader dummyAppEnv
    & runReader (ReadPool dummyPool)
    & runReader (WritePool dummyPool)
    & runReader dummyJWK
    & runErrorNoCallStack @S.ServerError
    & runEff
