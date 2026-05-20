module Infrastructure.Interpreter.Stub.Util
  ( dummyJWK
  , dummyPool
  , dummyConfig
  , dummyAppEnv
  ) where

import Crypto.JWT (JWK)
import Database.Persist.Sql (ConnectionPool, runSqlPool)
import Infrastructure.Common.Type.App (AppEnv (..))
import Infrastructure.Common.Type.Config (Config (..))
import Infrastructure.Common.Type.JWK (makeSecretKey)
import Servant.Auth.Server qualified as S
import System.IO.Unsafe (unsafePerformIO)
import Data.Pool (createPool)

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
