module Main where

import Control.Monad (forM_, when)
import Control.Monad.IO.Class (liftIO)
import Control.Monad.Logger (runStdoutLoggingT)
import Data.ByteString qualified as BS
import Data.List (isSuffixOf, sort)
import Data.Text qualified as T
import Data.Text.Encoding qualified as TE
import Database.Persist.Postgresql (createPostgresqlPool)
import Database.Persist.Sql
  ( Single (..)
  , SqlPersistT
  , getMigration
  , rawExecute
  , rawSql
  , runSqlPool
  , toPersistValue
  )
import Infrastructure.Common.Type.Config (Config (..), loadConfig)
import Infrastructure.Postgres.Migration
  ( generateMigration
  , getAppliedMigrations
  , getPendingMigrations
  , runMigrationDownOne
  , runMigrationUpOne
  , runMigrationsUp
  )
import Infrastructure.Postgres.Schema (migrateAll)
import System.Directory (listDirectory)
import System.Environment (getArgs)
import System.Exit (exitFailure, exitSuccess)
import System.FilePath (takeExtension, (</>))
import UnliftIO.Exception (SomeException, try)

main :: IO ()
main = do
  args <- getArgs
  config <- loadConfig

  pool <- runStdoutLoggingT $ createPostgresqlPool config.dbConnStr 10

  case args of
    ["up"] -> do
      runSqlPool runMigrationsUp pool
      putStrLn "Migrations completed."
      exitSuccess
    ["up-one"] -> do
      runSqlPool runMigrationUpOne pool
      putStrLn "Migration up-one completed."
      exitSuccess
    ["down-one"] -> do
      runSqlPool runMigrationDownOne pool
      putStrLn "Migration down-one completed."
      exitSuccess
    ["status"] -> do
      runSqlPool
        ( do
            liftIO $ do
              putStrLn "-----------------------------------------------------------------"
              putStrLn "database initialization logs"
              putStrLn "-----------------------------------------------------------------"

            pending <- getPendingMigrations
            applied <- getAppliedMigrations

            liftIO $ do
              putStrLn "-----------------------------------------------------------------"
              putStrLn ""

            allFiles <- liftIO $ listDirectory "resource/migration"
            let allUps = sort [f | f <- allFiles, takeExtension f == ".sql", ".up.sql" `isSuffixOf` f]

            -- 1. Simulate the entire migration chain from scratch in a fresh temp schema
            liftIO $ do
              putStrLn "-----------------------------------------------------------------"
              putStrLn "simulated logs"
              putStrLn "-----------------------------------------------------------------"

            (failedFiles, incorrectApplied, missing) <- simulateAndVerify allUps applied

            liftIO $ do
              putStrLn "-----------------------------------------------------------------"
              putStrLn ""

            let needsUpdate =
                  not (null pending)
                    || not (null missing)
                    || not (null incorrectApplied)

            if not needsUpdate
              then liftIO $ do
                putStrLn "Migration Status:"
                forM_ allUps $ \f -> putStrLn ("  - " ++ f ++ " DONE")
                putStrLn "Database schema is up to date."
              else do
                liftIO $ do
                  putStrLn "****************************************************"
                  putStrLn "WARNING: Database schema mismatch detected!"
                  putStrLn "Migration Status:"
                  forM_ allUps $ \f -> do
                    let version = read (take 3 f) :: Int
                        status =
                          if version `elem` applied
                            then
                              if f `elem` incorrectApplied
                                then "DONE, INCORRECT"
                                else "DONE"
                            else
                              if f `elem` failedFiles
                                then "PENDING, INCORRECT"
                                else "PENDING"
                    putStrLn ("  - " ++ f ++ " " ++ status)
                  when (not $ null missing) $ do
                    putStrLn "  - ??? MISSING (run make migrate-generate to generate it)"

                  if not (null incorrectApplied)
                    then do
                      putStrLn ""
                      putStrLn "WARNING: Already applied migrations are INCORRECT!"
                      putStrLn
                        "One or more applied migration files are missing from the active database schema (marked INCORRECT above)."
                      putStrLn "Please restore the missing database structures or recreate them."
                    else
                      if not (null failedFiles)
                        then do
                          putStrLn ""
                          putStrLn "WARNING: One or more pending migrations are INCORRECT!"
                          putStrLn
                            "A pending migration file failed to execute during simulation (marked INCORRECT above)."
                          putStrLn "Please fix the SQL syntax or constraints in the file before running migrations."
                        else
                          if not (null missing)
                            then do
                              putStrLn ""
                              putStrLn "WARNING: Database schema is out of sync!"
                              putStrLn
                                "All pending migrations executed successfully, but the database schema is still missing some updates."
                              putStrLn
                                "Please run 'make migrate-generate NAME=some_name' to generate a new migration file."
                            else do
                              putStrLn ""
                              putStrLn "WARNING: Database schema has pending migrations!"
                              putStrLn
                                "Please run 'make migrate-up' or 'make migrate-up-one' to apply pending migrations."
                  putStrLn "****************************************************"
                  exitFailure
        )
        pool
      exitSuccess
    ["generate", name] -> do
      runSqlPool (generateMigration name) pool
      exitSuccess
    _ -> do
      putStrLn "Usage: migrate-exe [up|up-one|down|status|generate <name>]"
      exitFailure

getSchemaColumns :: String -> SqlPersistT IO [(T.Text, T.Text)]
getSchemaColumns schemaName = do
  res <-
    rawSql
      "SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = ?"
      [toPersistValue (T.pack schemaName)]
  return [(t, c) | (Single t, Single c) <- res]

getSchemaIndexes :: String -> SqlPersistT IO [T.Text]
getSchemaIndexes schemaName = do
  res <-
    rawSql
      "SELECT indexname FROM pg_indexes WHERE schemaname = ?"
      [toPersistValue (T.pack schemaName)]
  return [idx | Single idx <- res]

simulateAndVerify :: [String] -> [Int] -> SqlPersistT IO ([String], [String], [T.Text])
simulateAndVerify allUps applied = do
  -- 1. Get active columns and indexes from public schema
  activeCols <- getSchemaColumns "public"
  activeIdxs <- getSchemaIndexes "public"

  -- 2. Clean out and recreate the temporary schema temp_migration_sim
  rawExecute "DROP SCHEMA IF EXISTS temp_migration_sim CASCADE" []
  rawExecute "CREATE SCHEMA temp_migration_sim" []
  rawExecute "SET search_path TO temp_migration_sim" []

  let loop [] failedPending incorrectApplied = return (failedPending, incorrectApplied)
      loop (f : fs) failedPending incorrectApplied = do
        let version = read (take 3 f) :: Int
            isPending = version `notElem` applied

        -- Record state before running the migration
        beforeCols <- getSchemaColumns "temp_migration_sim"
        beforeIdxs <- getSchemaIndexes "temp_migration_sim"

        -- Try executing the migration in the simulated schema using a SAVEPOINT
        rawExecute "SAVEPOINT migration_sim_savepoint" []
        res <- try $ do
          content <- liftIO $ BS.readFile ("resource/migration" </> f)
          rawExecute (TE.decodeUtf8 content) []

        case res of
          Left (_ :: SomeException) -> do
            rawExecute "ROLLBACK TO SAVEPOINT migration_sim_savepoint" []
            if isPending
              then loop fs (f : failedPending) incorrectApplied
              else loop fs failedPending (f : incorrectApplied)
          Right () -> do
            rawExecute "RELEASE SAVEPOINT migration_sim_savepoint" []
            -- Record state after running the migration
            afterCols <- getSchemaColumns "temp_migration_sim"
            afterIdxs <- getSchemaIndexes "temp_migration_sim"

            -- Compute the database elements created by this migration
            let newCols = filter (`notElem` beforeCols) afterCols
                newIdxs = filter (`notElem` beforeIdxs) afterIdxs

            -- An applied migration is incorrect if any of its created tables, columns, or indexes are missing from the public schema
            let isIncorrect =
                  not isPending
                    && (any (`notElem` activeCols) newCols || any (`notElem` activeIdxs) newIdxs)

            if isIncorrect
              then loop fs failedPending (f : incorrectApplied)
              else loop fs failedPending incorrectApplied

  (failedPending, incorrectApplied) <- loop allUps [] []

  -- 3. Get genuinely missing changes inside the simulated schema
  missing <- getMigration migrateAll

  -- Restore search path to public and clean up the simulation schema
  rawExecute "SET search_path TO public" []
  rawExecute "DROP SCHEMA IF EXISTS temp_migration_sim CASCADE" []

  return (failedPending, incorrectApplied, missing)
