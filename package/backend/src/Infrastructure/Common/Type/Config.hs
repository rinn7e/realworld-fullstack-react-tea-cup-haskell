module Infrastructure.Common.Type.Config where

import Data.ByteString (ByteString)
import Data.ByteString.Char8 qualified as BSC
import Data.ByteString.Lazy qualified as BSL
import Data.Text (Text)
import Data.Text qualified as T
import Data.Text.Encoding qualified as TE
import System.Environment (lookupEnv)

data Config = Config
  { dbConnStr :: ByteString
  , jwtSecret :: BSL.ByteString
  , shouldRunMigrationAuto :: Bool
  , gitCommitHash :: Text
  , port :: Int
  , showSqlLog :: Bool
  , allowCorsEnabled :: Bool
  , frontendWebDir :: Maybe FilePath
  , frontendAdminDir :: Maybe FilePath
  }

loadConfig :: IO Config
loadConfig = do
  dbConn <- lookupEnv "DB_CONN"
  jwtSec <- lookupEnv "JWT_SECRET"
  runMig <- lookupEnv "SHOULD_RUN_MIGRATION_AUTOMATICALLY"
  sqlLog <- lookupEnv "SHOW_SQL_LOG"
  commit <- lookupEnv "GIT_COMMIT_HASH"
  portStr <- lookupEnv "PORT"
  allowCorsStr <- lookupEnv "ALLOW_CORS"
  feWeb <- lookupEnv "FRONTEND_WEB_DIR"
  feAdmin <- lookupEnv "FRONTEND_ADMIN_DIR"

  return
    Config
      { dbConnStr = maybe defaultConnStr BSC.pack dbConn
      , jwtSecret =
          maybe (BSL.fromStrict defaultJwtSecret) (BSL.fromStrict . TE.encodeUtf8 . T.pack) jwtSec
      , shouldRunMigrationAuto = runMig == Just "true"
      , gitCommitHash = T.pack (maybe "unknown" id commit)
      , port = maybe 3000 read (portStr >>= \s -> if null s then Nothing else Just s)
      , showSqlLog = sqlLog == Just "true"
      , allowCorsEnabled = allowCorsStr == Just "true"
      , frontendWebDir = feWeb
      , frontendAdminDir = feAdmin
      }
 where
  defaultConnStr = "host=localhost dbname=realworld user=postgres password=postgres port=5432"
  defaultJwtSecret = "your-secret-key-that-should-be-at-least-32-chars-long-!!"
