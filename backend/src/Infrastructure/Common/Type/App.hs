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

import Infrastructure.Interpreter.Auth (runAuthJWT)
import Infrastructure.Interpreter.Crypto (runCryptoArgon2)
import Infrastructure.Interpreter.DB.Postgres.ArticleDB (runArticleDBPostgres)
import Infrastructure.Interpreter.DB.Postgres.CommentDB (runCommentDBPostgres)
import Infrastructure.Interpreter.DB.Postgres.LoggerDB (runLoggerDBPostgres)
import Infrastructure.Interpreter.DB.Postgres.MetadataDB (runMetadataDBPostgres)
import Infrastructure.Interpreter.DB.Postgres.TagDB (runTagDBPostgres)
import Infrastructure.Interpreter.DB.Postgres.UserDB (runUserDBPostgres)
import Infrastructure.Interpreter.DB.Postgres.VisitorDB (runVisitorDBPostgres)
import Infrastructure.Interpreter.Time (runTimeIO)

data AppEnv = AppEnv
  { appPool :: ConnectionPool
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
     , Reader ConnectionPool
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
          & runReader env.appPool
          & runReader env.appJwtKey
          & runErrorNoCallStack @S.ServerError
          & runEff
      )
  case res of
    Left err -> S.throwError err
    Right a -> return a
