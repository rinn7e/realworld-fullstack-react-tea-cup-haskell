# Migration Tool Specification

High-density specification for a hybrid, sandbox-verified, SQL-first migration engine.

### Stack Constraints
* **Language**: Haskell
* **ORM**: Persistent (`persistent-postgresql`)
* **Database**: PostgreSQL (requires transactional schema blocks and nested SAVEPOINT recovery)

---

## 1. Core Architecture

The system resolves the conflict between risky runtime DDL generation and manual SQL entry:
* **SQL-First**: Database schemas are defined, reviewed, and versioned in `.up.sql` and `.down.sql` scripts.
* **Sandbox Verification**: A dry-run local transaction validates migrations against active compile-time Persistent Haskell entities (`migrateAll`) before live execution.

---

## 2. CLI Reference

### `up`
Applies all unapplied versioned SQL migrations.
1. Simulates all pending migrations in an isolated dry-run transaction.
2. Aborts immediately on any syntax or constraint error.
3. Applies migrations live, appending applied versions to `schema_migrations`.

**Sample Output:**
```text
Applying migration: 003_admin.up.sql
Migrations completed.
```

### `up-one`
Applies exactly the next pending migration.
1. Identifies the lowest unapplied migration number.
2. Sandbox-simulates the target file in a dry-run transaction.
3. Applies live if validated.

**Sample Output:**
```text
Applying migration: 003_admin.up.sql
Migration up-one completed.
```

### `down-one`
Rolls back the last applied migration.
1. Aborts with `exitFailure` if no migrations have been applied.
2. Checks target `.down.sql` file. **Safety Check**: strips SQL comments (`--`) and whitespace. If resulting statement list is empty, aborts with `exitFailure` to prevent empty query PostgreSQL execution errors.
3. Executes rollback live and deletes the version row from `schema_migrations`.

**Sample Output:**
```text
Rolling back migration: 003_admin.down.sql
Migration down-one completed.
```

### `status`
Verifies database sync status without modifying active tables.
1. Creates local isolated schema `temp_migration_sim` and executes `SET search_path TO temp_migration_sim`.
2. Runs all migration scripts sequentially using `SAVEPOINT migration_sim_savepoint`. Transaction recovers cleanly via `ROLLBACK TO SAVEPOINT` if any file fails, preventing PostgreSQL `25P02` (aborted transaction) state.
3. Runs Persistent's `getMigration migrateAll` **within** the simulated schema to detect any discrepancies after all migration files have simulated execution.
4. Drops sandbox schema and restores search path.
5. Returns exit code `0` if in-sync. Exits with code `1` and details mismatch categories:
   * `PENDING`: Migration files not yet applied live.
   * `INCORRECT`: Applied migration files that do not match the database state, or pending migrations that failed simulation.
   * `??? MISSING`: Structural mismatch between migration files and active Haskell types (requires running `generate`).

**Sample Output (In Sync):**
```text
Migration Status:
  - 001_init.up.sql DONE
  - 002_add_indexes.up.sql DONE
  - 003_admin.up.sql DONE
Database schema is up to date.
```

**Sample Output (Pending / Mismatch):**
```text
****************************************************
WARNING: Database schema mismatch detected!
Migration Status:
  - 001_init.up.sql DONE
  - 002_add_indexes.up.sql DONE
  - 003_admin.up.sql PENDING

WARNING: Database schema has pending migrations!
Please run 'make migrate-up' or 'make migrate-up-one' to apply pending migrations.
****************************************************
```

**Sample Output (Incorrect Migration File):**
```text
****************************************************
WARNING: Database schema mismatch detected!
Migration Status:
  - 001_init.up.sql DONE
  - 002_add_indexes.up.sql INCORRECT (failed to run in simulation)
  - 003_admin.up.sql PENDING

WARNING: Database schema has pending migrations!
****************************************************
```

**Sample Output (Missing Schema DDL):**
```text
****************************************************
WARNING: Database schema mismatch detected!
Migration Status:
  - 001_init.up.sql DONE
  - 002_add_indexes.up.sql DONE
  - 003_admin.up.sql DONE
  - ??? MISSING

WARNING: Database schema is out of sync with Haskell Persistent definitions!
Please run 'stack exec migrate-exe -- generate <name>' to generate new migrations.
****************************************************
```

### `generate <name>`
Drafts a new migration file pair.
1. Sandbox-simulates all current migrations in a dry-run transaction.
2. Calls `getMigration migrateAll` to compute missing database diff.
3. Writes auto-generated missing DDL to `XXX_name.up.sql` and empty template to `XXX_name.down.sql`.

**Sample Output:**
```text
Generating: resource/migration/004_add_user_bio.up.sql
Generating: resource/migration/004_add_user_bio.down.sql (empty)
Generation complete. Please review the SQL files.
```

---

## 3. Library Abstraction Blueprint

To extract this into a standalone Haskell package (e.g., `persistent-migration-pg`):

### 3.1 Configuration Data Structure
```haskell
data MigrationConfig = MigrationConfig
  { migrationDirectory :: FilePath
  , metadataTableName  :: String
  , tempSchemaName     :: String
  , loggingEnabled     :: Bool
  }
```

### 3.2 Programmatic Interface
```haskell
module Database.Persist.Postgresql.SandboxMigration
  ( runAutoMigration
  , runVerificationSandbox
  , MigrationConfig(..)
  , MigrationStatusReport(..)
  ) where

runVerificationSandbox 
  :: MigrationConfig 
  -> SqlBackend 
  -> Migration 
  -> IO (Either SandboxError MigrationStatusReport)
```
