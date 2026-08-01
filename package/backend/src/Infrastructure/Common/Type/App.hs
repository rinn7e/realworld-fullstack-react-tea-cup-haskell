module Infrastructure.Common.Type.App where

import Crypto.JWT (JWK)
import Data.Function ((&))
import Database.Persist.Sql (ConnectionPool)
import Effectful
import Effectful.Error.Static
import Effectful.Reader.Static
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Infrastructure.Common.Type.Config (Config)
import Infrastructure.Common.Type.DBPools (ReadPool (..), WritePool (..))

-- Capabilities
import Capability.Auth (Auth)
import Capability.Crypto (Crypto)
import Capability.Database.ArticleDB (ArticleDB)
import Capability.Database.CommentDB (CommentDB)
import Capability.Database.LoggerDB (LoggerDB)
import Capability.Database.MetadataDB (MetadataDB)
import Capability.Database.TagDB (TagDB)
import Capability.Database.UserDB (UserDB)
import Capability.Database.VisitorDB (VisitorDB)
import Capability.Time (Time)

-- Interpreters

import Infrastructure.Interpreter.Real.Auth (runAuthJWT)
import Infrastructure.Interpreter.Real.Crypto (runCryptoArgon2)
import Infrastructure.Interpreter.Real.DB.ArticleDB (runArticleDBPostgres)
import Infrastructure.Interpreter.Real.DB.CommentDB (runCommentDBPostgres)
import Infrastructure.Interpreter.Real.DB.LoggerDB (runLoggerDBPostgres)
import Infrastructure.Interpreter.Real.DB.MetadataDB (runMetadataDBPostgres)
import Infrastructure.Interpreter.Real.DB.TagDB (runTagDBPostgres)
import Infrastructure.Interpreter.Real.DB.UserDB (runUserDBPostgres)
import Infrastructure.Interpreter.Real.DB.VisitorDB (runVisitorDBPostgres)
import Infrastructure.Interpreter.Real.Time (runTimeIO)

data AppEnv = AppEnv
  { appReadPool :: ConnectionPool
  , appWritePool :: ConnectionPool
  , appJwtSettings :: S.JWTSettings
  , appJwtKey :: JWK
  , appConfig :: Config
  }

-- 'App' of the server with all dynamic capabilities globally integrated
type App =
  Eff
    '[ CommentDB
     , ArticleDB
     , LoggerDB
     , MetadataDB
     , UserDB
     , VisitorDB
     , TagDB
     , Time
     , Auth
     , Crypto
     , Reader AppEnv
     , Reader ReadPool
     , Reader WritePool
     , Reader JWK
     , Error S.ServerError
     , IOE
     ]

runApp :: AppEnv -> App a -> S.Handler a
runApp env action = do
  res <-
    liftIO
      ( action
          & runCommentDBPostgres
          & runArticleDBPostgres
          & runLoggerDBPostgres
          & runMetadataDBPostgres
          & runUserDBPostgres
          & runVisitorDBPostgres
          & runTagDBPostgres
          & runTimeIO
          & runAuthJWT
          & runCryptoArgon2
          & runReader env
          & runReader (ReadPool env.appReadPool)
          & runReader (WritePool env.appWritePool)
          & runReader env.appJwtKey
          & runErrorNoCallStack @S.ServerError
          & runEff
      )
  case res of
    Left err -> S.throwError err
    Right a -> return a
