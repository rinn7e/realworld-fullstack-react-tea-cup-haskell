{-# LANGUAGE OverloadedRecordDot #-}

module Main where

import Control.Monad (forM_, when)
import System.Exit (die)
import Control.Monad.IO.Class (liftIO)
import Control.Monad.Logger (runNoLoggingT, runStdoutLoggingT)
import Data.ByteString qualified as BS
import Data.ByteString.Char8 qualified as BSC
import Data.List (isPrefixOf)
import Data.Proxy (Proxy (..))
import Database.Persist.Postgresql (createPostgresqlPool)
import Database.Persist.Sql (getMigration, runSqlPool)
import Network.Wai (Middleware, Request (..))
import Network.Wai.Handler.Warp (run)
import Network.Wai.Middleware.Cors
  ( CorsResourcePolicy (..)
  , cors
  )
import Network.Wai.Middleware.RequestLogger (logStdoutDev)
import Servant (Context (..))
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Infrastructure.Common.Type.Config (Config (..), loadConfig)
import Infrastructure.Common.Type.JWK (makeSecretKey)
import Infrastructure.Interpreter.Real.DB.Migration.Migration
  ( getPendingMigrations
  , runMigrationsUp
  )
import Infrastructure.Interpreter.Real.DB.Schema.Schema (migrateAll)
import RunServer (AppEnv (..), FullAPI, runServer)
import Text.RawString.QQ (r)

main :: IO ()
main = do
  config <- loadConfig

  pool <-
    if config.showSqlLog
      then runStdoutLoggingT $ createPostgresqlPool config.dbConnStr 3
      else runNoLoggingT $ createPostgresqlPool config.dbConnStr 3

  -- Check for schema mismatches
  runSqlPool
    ( do
        pending <- getPendingMigrations
        missing <- getMigration migrateAll

        let needsUpdate = not (null pending) || not (null missing)

        if not needsUpdate
          then liftIO $ putStrLn "Database schema is up to date."
          else
            if config.shouldRunMigrationAuto
              then do
                liftIO $ putStrLn "Applying automatic migrations..."
                runMigrationsUp
              -- Note: we don't automatically apply Persistent's migrateAll,
              -- we just use it for checking. Only SQL files are applied.
              else liftIO $ do
                putStrLn "****************************************************"
                putStrLn "ERROR: Database schema mismatch detected!"
                when (not $ null pending) $ do
                  putStrLn "Pending SQL migrations:"
                  mapM_ (putStrLn . ("  - " ++)) pending
                when (not $ null missing) $ do
                  putStrLn "Persistent schema changes needed:"
                  forM_ missing print
                putStrLn "Run 'make migrate-up' or set SHOULD_RUN_MIGRATION_AUTOMATICALLY=true"
                putStrLn "****************************************************"
                die "Aborting: database schema is out of date."
    )
    pool

  let jwtKey = makeSecretKey config.jwtSecret
      jwtSettings = S.defaultJWTSettings jwtKey
      cfg = jwtSettings :. S.defaultCookieSettings :. EmptyContext
      port = config.port

  let corsMiddleware = if config.allowCorsEnabled then allowCors else id

  putStrLn
    [r|====================================================================
                         __              __
                        /\ \          __/\ \__
  ___    ___     ___    \_\ \  __  __/\_\ \ ,_\
 /'___\ / __`\ /' _ `\  /'_` \/\ \/\ \/\ \ \ \/
/\ \__//\ \L\ \/\ \/\ \/\ \L\ \ \ \_\ \ \ \ \ \_
\ \____\ \____/\ \_\ \_\ \___,_\ \____/\ \_\ \__\
 \/____/\/___/  \/_/\/_/\/__,_ /\/___/  \/_/\/__/
 __                        __              ___    ___
/\ \                      /\ \            /\_ \  /\_ \
\ \ \___      __      ____\ \ \/'\      __\//\ \ \//\ \
 \ \  _ `\  /'__`\   /',__\\ \ , <    /'__`\\ \ \  \ \ \
  \ \ \ \ \/\ \L\.\_/\__, `\\ \ \\`\ /\  __/ \_\ \_ \_\ \_
   \ \_\ \_\ \__/.\_\/\____/ \ \_\ \_\ \____\/\____\/\____\
    \/_/\/_/\/__/\/_/\/___/   \/_/\/_/\/____/\/____/\/____/
====================================================================|]
  putStrLn $ "Hey! Starting server on port " ++ show port
  putStrLn $ "Swagger Web UI is at http://localhost:" ++ show port ++ "/swagger-ui"
  putStrLn $ "Swagger Admin UI is at http://localhost:" ++ show port ++ "/admin/swagger-ui"
  putStrLn $ "===================================================================="
  run port $
    logStdoutDev $
      corsMiddleware $
        authMiddleware $
          S.serveWithContext api cfg (runServer (AppEnv pool jwtSettings jwtKey config))

api :: Proxy FullAPI
api = Proxy

authMiddleware :: Middleware
authMiddleware app req sendResponse =
  let headers = requestHeaders req
      newHeaders = case lookup "Authorization" headers of
        Just auth
          | "Token " `BS.isPrefixOf` auth ->
              ("Authorization", "Bearer " <> BS.drop 6 auth)
                : filter ((/= "Authorization") . fst) headers
        _ -> headers
   in app req{requestHeaders = newHeaders} sendResponse

appCorsResourcePolicy :: CorsResourcePolicy
appCorsResourcePolicy =
  CorsResourcePolicy
    { corsOrigins = Nothing -- Overridden dynamically in allowCors
    , corsMethods = ["OPTIONS", "GET", "PUT", "POST", "DELETE"]
    , corsRequestHeaders = ["Authorization", "Content-Type"]
    , corsExposedHeaders = Nothing
    , corsMaxAge = Nothing
    , corsVaryOrigin = False
    , corsRequireOrigin = False
    , corsIgnoreFailures = False
    }

-- Middleware to enforce CORS policy constraints
allowCors :: Middleware
allowCors = cors corsPolicy
  where
    -- Dynamically generate the CORS resource policy based on the request's origin
    corsPolicy :: Request -> Maybe CorsResourcePolicy
    corsPolicy req =
      let originHeader = lookup "Origin" (requestHeaders req)
      in case originHeader of
           Nothing -> Just appCorsResourcePolicy -- If no Origin header, allow default parameters
           Just origin ->
             -- If the origin matches our allowed list, dynamically permit it
             if isAllowedOrigin req origin
                then Just (appCorsResourcePolicy { corsOrigins = Just ([origin], True) })
                else Nothing -- Otherwise block the CORS request

    -- Check if the request's origin is allowed (localhost/127.0.0.1 or dynamic same-origin)
    isAllowedOrigin :: Request -> BS.ByteString -> Bool
    isAllowedOrigin req origin =
      let originStr = BSC.unpack origin
          hostHeader = lookup "Host" (requestHeaders req)
          -- Reconstruct same-origin address dynamically from the Host header (no hardcoding fly.dev)
          sameOriginStr = case hostHeader of
                            Nothing -> ""
                            Just host -> "https://" ++ BSC.unpack host
      in "http://localhost:" `isPrefixOf` originStr
          || "http://localhost" == originStr
          || "http://127.0.0.1:" `isPrefixOf` originStr
          || "http://127.0.0.1" == originStr
          || "https://localhost:" `isPrefixOf` originStr
          || "https://127.0.0.1:" `isPrefixOf` originStr
          -- Allow the Elm frontend deployment domain
          || "https://rinn7e-elm-realworld.fly.dev" == originStr
          || "https://rinn7e-elm-realworld.fly.dev/" == originStr
          -- Verify if origin matches current host same-origin scheme
          || (not (null sameOriginStr) && sameOriginStr == originStr)
