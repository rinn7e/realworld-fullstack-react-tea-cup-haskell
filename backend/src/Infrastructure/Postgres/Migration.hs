module Infrastructure.Postgres.Migration
  ( runMigrationsUp
  , runMigrationUpOne
  , runMigrationDownOne
  , ensureMigrationsTable
  , getAppliedMigrations
  , getLastRanMigration
  , generateMigration
  , getPendingMigrations
  ) where

import Control.Monad (forM_, when)
import Control.Monad.IO.Class (liftIO)
import Data.ByteString qualified as BS
import Data.List (sort)
import Data.Text qualified as T
import Data.Text.Encoding qualified as TE
import Data.Text.IO qualified as TIO
import Database.Persist (toPersistValue)
import Database.Persist.Sql
  ( Single (..)
  , SqlPersistT
  , getMigration
  , rawExecute
  , rawSql
  , transactionUndo
  )
import System.Directory (createDirectoryIfMissing, listDirectory)
import System.Exit (exitFailure)
import System.FilePath (takeExtension, (</>))
import Text.Printf (printf)
import UnliftIO.Exception (SomeException, try)

import Infrastructure.Postgres.Schema (migrateAll)

getPendingMigrations :: SqlPersistT IO [String]
getPendingMigrations = do
  ensureMigrationsTable
  applied <- getAppliedMigrations
  files <- liftIO $ listDirectory "resource/migration"
  let ups = sort [f | f <- files, takeExtension f == ".sql", ".up.sql" `isSuffixOf` f]
  return [f | f <- ups, read (take 3 f) `notElem` applied]

runMigrationsUp :: SqlPersistT IO ()
runMigrationsUp = do
  ensureMigrationsTable
  pending <- getPendingMigrations

  -- Sandbox simulation first
  let runSim = do
        let simLoop [] failed = return failed
            simLoop (f : fs) failed = do
              res <- try $ do
                content <- liftIO $ BS.readFile ("resource/migration" </> f)
                rawExecute (TE.decodeUtf8 content) []
              case res of
                Left (_ :: SomeException) -> return (f : failed)
                Right () -> simLoop fs failed
        simLoop pending []

  failedFiles <- do
    res <- try runSim
    transactionUndo
    case res of
      Left (_ :: SomeException) -> return pending
      Right failed -> return failed

  if not (null failedFiles)
    then liftIO $ do
      putStrLn "****************************************************"
      putStrLn "ERROR: Cannot apply migrations!"
      putStrLn "One or more pending migration files are INCORRECT."
      putStrLn "Please run 'make migrate-status' to see details."
      putStrLn "****************************************************"
      exitFailure
    else do
      -- Re-ensure schema_migrations table in case it was rolled back by transactionUndo
      ensureMigrationsTable
      -- Apply them live
      applied <- getAppliedMigrations
      files <- liftIO $ listDirectory "resource/migration"
      let ups = sort [f | f <- files, takeExtension f == ".sql", ".up.sql" `isSuffixOf` f]

      forM_ ups $ \f -> do
        let version = read (take 3 f) :: Int
        when (version `notElem` applied) $ do
          liftIO $ putStrLn $ "Applying migration: " ++ f
          content <- liftIO $ BS.readFile ("resource/migration" </> f)
          rawExecute (TE.decodeUtf8 content) []
          rawExecute "INSERT INTO schema_migrations (version) VALUES (?)" [toPersistValue version]

runMigrationUpOne :: SqlPersistT IO ()
runMigrationUpOne = do
  ensureMigrationsTable
  applied <- getAppliedMigrations
  files <- liftIO $ listDirectory "resource/migration"
  let ups = sort [f | f <- files, takeExtension f == ".sql", ".up.sql" `isSuffixOf` f]

  let pending = [f | f <- ups, read (take 3 f) `notElem` applied]
  case pending of
    [] -> liftIO $ putStrLn "No pending migrations to apply."
    (f : _) -> do
      -- Sandbox simulate exactly this next single pending migration
      let runSim = do
            content <- liftIO $ BS.readFile ("resource/migration" </> f)
            rawExecute (TE.decodeUtf8 content) []

      res <- try runSim
      transactionUndo
      case res of
        Left (_ :: SomeException) -> liftIO $ do
          putStrLn "****************************************************"
          putStrLn $ "ERROR: Cannot apply migration: " ++ f
          putStrLn "The next pending migration is INCORRECT."
          putStrLn "Please run 'make migrate-status' to see details."
          putStrLn "****************************************************"
          exitFailure
        Right () -> do
          -- Re-ensure schema_migrations table in case it was rolled back by transactionUndo
          ensureMigrationsTable
          -- Apply it live
          let version = read (take 3 f) :: Int
          liftIO $ putStrLn $ "Applying migration: " ++ f
          content <- liftIO $ BS.readFile ("resource/migration" </> f)
          rawExecute (TE.decodeUtf8 content) []
          rawExecute "INSERT INTO schema_migrations (version) VALUES (?)" [toPersistValue version]

runMigrationDownOne :: SqlPersistT IO ()
runMigrationDownOne = do
  ensureMigrationsTable
  applied <- getAppliedMigrations
  case reverse applied of
    [] -> liftIO $ do
      putStrLn "****************************************************"
      putStrLn "ERROR: Cannot roll back!"
      putStrLn "No migrations have been applied to roll back."
      putStrLn "****************************************************"
      exitFailure
    (v : _) -> do
      files <- liftIO $ listDirectory "resource/migration"
      let downFile = case [file | file <- files, take 3 file == printf "%03d" v, ".down.sql" `isSuffixOf` file] of
            (f : _) -> f
            [] -> error $ "Down migration not found for version " ++ show v
      liftIO $ putStrLn $ "Rolling back migration: " ++ downFile
      content <- liftIO $ BS.readFile ("resource/migration" </> downFile)
      let sqlText = TE.decodeUtf8 content
      if isSqlEmpty sqlText
        then liftIO $ do
          putStrLn "****************************************************"
          putStrLn "ERROR: Cannot roll back!"
          putStrLn $
            "Down migration file '" ++ downFile ++ "' is empty or contains no SQL statements."
          putStrLn "****************************************************"
          exitFailure
        else do
          rawExecute sqlText []
          rawExecute "DELETE FROM schema_migrations WHERE version = ?" [toPersistValue v]

ensureMigrationsTable :: SqlPersistT IO ()
ensureMigrationsTable = do
  rawExecute
    "CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY, applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)"
    []

getAppliedMigrations :: SqlPersistT IO [Int]
getAppliedMigrations = do
  res <- rawSql "SELECT version FROM schema_migrations ORDER BY version ASC" []
  return $ map unSingle res

getLastRanMigration :: SqlPersistT IO (Maybe Int)
getLastRanMigration = do
  ensureMigrationsTable
  res <- rawSql "SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1" []
  case res of
    (Single v : _) -> return (Just v)
    _ -> return Nothing

generateMigration :: String -> SqlPersistT IO ()
generateMigration name = do
  pending <- getPendingMigrations
  let runSim = do
        let simLoop [] = return ()
            simLoop (f : fs) = do
              content <- liftIO $ BS.readFile ("resource/migration" </> f)
              rawExecute (TE.decodeUtf8 content) []
              simLoop fs
        simLoop pending
        getMigration migrateAll

  statements <- do
    res <- try runSim
    transactionUndo
    case res of
      Left (e :: SomeException) -> error $ "Failed to simulate pending migrations: " ++ show e
      Right stmts -> return stmts

  if null statements
    then liftIO $ putStrLn "No changes detected in schema."
    else do
      liftIO $ createDirectoryIfMissing True "resource/migration"
      files <- liftIO $ listDirectory "resource/migration"
      let versions = [read (take 3 f) :: Int | f <- files, takeExtension f == ".sql"]
      let nextVersion = if null versions then 1 else maximum versions + 1
      let baseName = printf "%03d_%s" nextVersion name

      let upFile = "resource/migration" </> baseName ++ ".up.sql"
      let downFile = "resource/migration" </> baseName ++ ".down.sql"

      liftIO $ do
        putStrLn $ "Generating: " ++ upFile
        TIO.writeFile upFile (T.unlines $ map (<> ";") statements)
        putStrLn $ "Generating: " ++ downFile ++ " (empty)"
        TIO.writeFile downFile "-- Write your rollback SQL here\n"
        putStrLn "Generation complete. Please review the SQL files."

isSuffixOf :: (Eq a) => [a] -> [a] -> Bool
isSuffixOf suffix list = suffix == drop (length list - length suffix) list

isSqlEmpty :: T.Text -> Bool
isSqlEmpty sql =
  let sqlLines = T.lines sql
      cleanLine line =
        let trimmed = T.strip line
         in if T.null trimmed || "--" `T.isPrefixOf` trimmed
              then ""
              else trimmed
      nonEmpty = filter (not . T.null) (map cleanLine sqlLines)
   in null nonEmpty
