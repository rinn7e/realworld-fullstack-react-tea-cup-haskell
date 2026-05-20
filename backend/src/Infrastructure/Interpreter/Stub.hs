module Infrastructure.Interpreter.Stub
  ( runAppInMemory
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

runAppInMemory :: IORef MockDB -> UTCTime -> App a -> IO a
runAppInMemory dbRef fixedTime action = do
  res <-
    action
      & runCommentDBStub
      & runArticleDBStub
      & runLoggerDBStub
      & runMetadataDBStub
      & runUserDBStub dbRef
      & runVisitorDBStub
      & runTagDBStub
      & runTimeStub fixedTime
      & runAuthStub
      & runCryptoStub
      & runReader dummyAppEnv
      & runReader dummyPool
      & runReader dummyJWK
      & runErrorNoCallStack @S.ServerError
      & runEff
  case res of
    Left err -> error $ "App failed in test: " ++ show err
    Right a -> return a
