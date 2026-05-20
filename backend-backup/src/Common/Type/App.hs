module Common.Type.App where

import Crypto.JWT (JWK)
import Database.Persist.Sql (ConnectionPool)
import Effectful
import Effectful.Error.Static
import Effectful.Reader.Static
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Common.Type.Config (Config)

data AppEnv = AppEnv
  { appPool :: ConnectionPool
  , appJwtSettings :: S.JWTSettings
  , appJwtKey :: JWK
  , appConfig :: Config
  }

-- 'App' of the server
type App = Eff '[Reader AppEnv, Error S.ServerError, IOE]

runApp :: AppEnv -> App a -> S.Handler a
runApp env action = do
  res <- liftIO $ runEff $ runErrorNoCallStack @S.ServerError $ runReader env action
  case res of
    Left err -> S.throwError err
    Right a -> return a
