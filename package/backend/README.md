# Haskell Servant RealWorld Backend

# Architecture

This backend implements a **3-Layer Cake Clean Architecture** powered by the `effectful` library. This architecture guarantees a strict separation of concerns, high testability, and type safety:

- **Layer 3: Core Domain (`src/Domain/`)**: Pure Haskell data records defining domain models (e.g. `User`, `Article`, `Comment`). They have zero dependencies on databases, web frameworks, or effect systems.
- **Layer 2: Capability GADTs (`src/Capability/`)**: Dynamic GADT effect declarations using `effectful`. They serve as interfaces for database operations (e.g. `UserDB`, `ArticleDB`) and system services (e.g. `Crypto`, `Auth`, `Time`).
- **Layer 1: Infrastructure & App Entry (`src/Infrastructure/`)**: Concrete handlers and entry points.
  - **Interpreters (`src/Infrastructure/Postgres/`)**: Concrete handlers translating dynamic capability GADTs into database queries (Postgres/Persistent/Esqueleto) or system actions (Argon2, JWT, IO).
  - **Controllers (`src/Infrastructure/Controllers/`)**: Servant REST routing controllers that orchestrate domain logic by composing and evaluating capability effect stacks.

## Features

- **Servant**: Type-safe API definition and routing.
- **Postgres**: Reliable relational database.
- **Persistent + Esqueleto**: Type-safe ORM and expressive SQL queries.
- **Migration System**: Manual SQL-based migration with Up and Down support.
- **JWT Authentication**: Secure token-based auth (supporting `Token` prefix for compatibility).

## Prerequisites

- [Stack](https://docs.haskellstack.org/) (installs GHC 9.8.4 from the `lts-23.28` resolver in `stack.yaml`)
- PostgreSQL (server + client libraries, e.g. `brew install postgresql`), running locally

## Getting Started

1.  **Clone the repository**.
2.  **Navigate to the backend directory**:
    ```bash
    cd package/backend
    ```
3.  **Build** (the first build compiles all dependencies):
    ```bash
    make build
    ```
4.  **Set up the database**:
    Ensure you have a PostgreSQL database running. You can customize the connection string in your `.envrc`.
5.  **Environment Variables**:
    Copy the sample environment variables:
    ```bash
    cp .envrc.sample .envrc
    # If you use direnv:
    direnv allow
    ```
    Required variables:
    - `DB_CONN`: Postgres connection string (libpq keyword form, e.g. `host=localhost dbname=realworld user=postgres password=postgres port=5432`).
    - `JWT_SECRET`: Secret key for JWT signing.
    - `SHOULD_RUN_MIGRATION_AUTOMATICALLY`: Set to `true` to run migrations on startup (default `false`).
    - `GIT_COMMIT_HASH`: Current commit hash for metadata endpoint.

## Development Commands (Makefile)

A `Makefile` is provided in `package/backend` for common tasks (all use Stack):

- `make build`: Build the project (`stack build --fast`).
- `make watch`: Build and watch for changes (`stack build --fast --file-watch`).
- `make api`: Build and run the API server (`stack exec haskell-servant-realworld-exe`).
- `make api-watch`: Build, watch, and re-run the server after every successful build.
- `make server-fresh`: Reset database, apply migrations, seed data, and start the server.
- `make resetdb`: Reset the database schema.
- `make seed`: Populate the database with seed data.
- `make swagger-web` / `make swagger-admin`: Generate OpenAPI specifications.
- `make migrate-generate NAME=your_name`: Generate a new database migration.
- `make migrate-up`: Apply pending migrations.
- `make migrate-up-one`: Apply a single pending up migration.
- `make migrate-down-one`: Roll back the last migration.
- `make migrate-status`: Check migration status.
- `make lint`: Lint the codebase with `hlint`.
- `make format`: Format code with `fourmolu`.
- `make build-haddock`: Generate Haddock documentation.
- `make test`: Run tests (`stack test --fast`).
- `make compile`: Production build with optimizations (`stack build`).
- `make install`: Install binary to `~/.local/bin`.
- `make exec`: Run the binary via `stack exec`.
- `make run-installed`: Run the installed binary.

## Migration System

This project uses a custom migration system that supports both automatic and manual migration.

### How Automatic Migration Works
By default, automatic migration are **disabled** on server startup to encourage manual review of generated SQL.
- If enabled, the system scans the `migration/` directory for `.up.sql` files.
- It checks the `schema_migration` table in the database to see which migration have already been applied.
- It applies any missing migration in alphabetical/numerical order.

### How to Enable Automatic Migration
If you want the server to run migration automatically on startup (e.g., in a CI environment), set the `SHOULD_RUN_MIGRATION_AUTOMATICALLY` environment variable to `true`:
```bash
SHOULD_RUN_MIGRATION_AUTOMATICALLY=true make api
```

### How to Trigger Migrations Manually
The `migrate-exe` executable runs migrations without starting the web server.

**To trigger all pending "Up" migration:**
```bash
make migrate-up
```

**To trigger a single "Down" migration (roll back the last one):**
```bash
make migrate-down-one
```

### How to Autogenerate Migrations
You don't have to write the SQL by hand! You can use the `migrate generate` command to automatically detect changes in your `DB.hs` entities and generate the necessary `.up.sql` code.

```bash
make migrate-generate NAME=<some_name>
```

- This will create a new pair of files: `migration/NNN_<some_name>.up.sql` and `migration/NNN_<some_name>.down.sql`.
- The `.up.sql` file will contain the SQL generated by `persistent` to match your entities.
- The `.down.sql` file will be empty—you should manually add the rollback SQL if needed.
- **Review the generated SQL** before applying it!

Note: These commands use the `DB_CONN` environment variable to connect to the database.

## Database Backup and Restore

Since this project uses PostgreSQL, you can use the standard `pg_dump` and `psql` utilities.

### How to Backup the Database
To create a backup of your current database state:
```bash
# Replace 'realworld' with your actual database name if different
pg_dump -U postgres -d realworld > backup_$(date +%Y%m%d).sql
```

### How to Restore from Backup
To restore a previously created backup:
```bash
# This will recreate the schema and data from the SQL file
psql -U postgres -d realworld -f backup_20231027.sql
```
*Note: You may need to drop the existing database or use `--clean` with `pg_dump` if you want a fresh restore.*

## API Specification

This server follows the [RealWorld OpenAPI spec](https://github.com/gothinkster/realworld/tree/main/api).

## Code Guidelines

- **Modern Haskell**: Prefer using the latest Haskell language features as much as possible.
- **Extensions**: We heavily use `OverloadedRecordDot`, `DuplicateRecordFields`, and `NoFieldSelectors` for improved ergonomics and safety.
- **ORM**: Use Esqueleto for all complex queries to ensure type safety.
- **Authentication**: JWT authentication should follow the `Token` prefix convention for spec compatibility.
- **3-Layer Cake Clean Architecture**: Clean separation between pure domain logic (Layer 3), capability declarations (Layer 2), and infrastructure interpreters/controllers (Layer 1) using the `effectful` library.

## Project Structure

The project follows a strict 3-Layer Cake layout under `src/`:

- `src/Domain/` (Layer 3: Core Domain): Pure database-free domain models (e.g. `User.hs`, `Article.hs`, `Comment.hs`).
- `src/Capability/` (Layer 2: Capabilities): Abstract GADT dynamic effect declarations (e.g. `Crypto.hs`, `Auth.hs`, `Time.hs`) and dynamic DB action interfaces (e.g. `Database/ArticleDB.hs`).
- `src/Infrastructure/` (Layer 1: Infrastructure):
  - `Controllers/`: Servant REST web and admin controllers.
  - `Api/`: Servant API endpoints/routes and JSON serialization DTOs.
  - `Postgres/`: Database interpreters, Persistent schema definitions, migration runners, and raw Esqueleto queries under `Postgres/Query/`.
  - `Common/`: Configuration parameters, system settings, JWK keys, authentication utilities, and the application monad (`Type/App.hs`).
