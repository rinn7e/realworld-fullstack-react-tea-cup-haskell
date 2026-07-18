# Deployment Guide: Fly.io + Supabase (PostgreSQL)

This guide walks you through deploying the Haskell Servant backend to **Fly.io** using a custom Dockerfile, and connecting it to a free PostgreSQL database hosted on **Supabase**.

---

## Prerequisites

1. A **Supabase** account (Free tier is sufficient).
2. A **Fly.io** account (Hobby/Free tier is sufficient).
3. The **Fly.io CLI** (`flyctl`) installed on your local development machine.
4. Your project code pushed to a Git repository.

---

## Step 1: Set up the Supabase Database

1. Sign in to the [Supabase Dashboard](https://supabase.com/dashboard) and create a **New Project**.
2. Set a secure **Database Password** (write this down, as you will need it later).
3. **Region Selection (Critical)**: Choose a database hosting region close to where you plan to host the backend on Fly.io (e.g., Singapore `ap-southeast-1` or North Virginia `us-east-1`). Keeping them in the same region ensures database latency stays under 2-3ms.
4. Once the database is ready, look at the top navigation bar of your project dashboard:
   - Click the green/gray **"Connect"** button (located in the top right next to your project name).
   - In the modal that opens, select the **"Direct connection"** tab (this connects to port **5432** which is essential for automatic migrations and avoids pooler transaction issues).
   - Copy the connection URI string. It will look like this:
     ```text
     postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
     ```
   - Replace `[YOUR-PASSWORD]` with the database password you chose when creating the project.

*(Note: Alternatively, you can click the gear icon ⚙️ (Settings) at the bottom of the left sidebar, click **Database** under Project Settings, scroll down to the **Connection string** section, and select the **URI** tab).*

---

## Step 2: Install and Log In to Fly.io CLI

Install the Fly.io command-line tool `flyctl` locally:

### macOS
```bash
brew install superfly/tap/flyctl
```

### Linux
```bash
curl -L https://fly.io/install.sh | sh
```

After installation, authenticate your CLI:
```bash
fly auth login
```

---

## Step 3: Configure Fly.io

1. Copy the sample config file [fly.toml.sample](file:///Users/rinn7e/projects/rinn7e-technology/realworld-fullstack-react-tea-cup-haskell/backend/fly.toml.sample) to a active `fly.toml` config:
   ```bash
   cp fly.toml.sample fly.toml
   ```
2. Open `fly.toml` and configure the following parameters:
   - Change `app = "haskell-servant-realworld"` to a unique app name of your choice (e.g., `my-realworld-api`).
   - Change `primary_region = "sin"` to match the region where your Supabase database is located (e.g., `iad` for N. Virginia, `sin` for Singapore, `ams` for Amsterdam).

---

## Step 4: Set Production Secrets (Environment Variables)

Secure environment variables cannot be stored in the plain text `fly.toml`. Set them as secure Fly secrets:

1. **Database Connection**: Set `DB_CONN` to the connection string you retrieved from Supabase:
   ```bash
   fly secrets set DB_CONN="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres"
   ```
2. **JWT Secret Key**: Set a secure secret key for signing user authentication tokens (must be at least 32 characters long):
   ```bash
   fly secrets set JWT_SECRET="your-super-long-secure-random-jwt-signing-secret-key-!!"
   ```

---

## Step 5: Build and Deploy

Run the deployment command inside the `backend/` directory:
```bash
fly deploy
```

### What happens during deployment?
1. Fly.io will read the custom [Dockerfile](file:///Users/rinn7e/projects/rinn7e-technology/realworld-fullstack-react-tea-cup-haskell/backend/Dockerfile).
2. It will build the Haskell application in the cloud. GHC 9.6.6 compiles the source files, and dependencies are cached for future runs.
3. The runner stage copies the binary along with the `resource/` directory (which contains SQL migrations in `resource/migration/`).
4. On startup, the server reads the configuration, sees `SHOULD_RUN_MIGRATION_AUTOMATICALLY = "true"`, scans `resource/migration/`, and automatically runs any missing SQL migrations in your Supabase database.
5. The API starts listening on port `3000`. Fly.io automatically routes public HTTPS requests on port `443` to the backend.

---

## Step 6: Verify and Inspect Logs

To check that your server successfully connected to the database and is running:

```bash
# View live application logs
fly logs

# Check application status
fly status
```

Your API is now publicly accessible! You can test the endpoints using your custom domain (e.g., `https://my-realworld-api.fly.dev/swagger-ui`).

---

## Troubleshooting

### Build Out Of Memory (OOM) Errors
Haskell compilation is resource-heavy. If the build times out or crashes on Fly's builders, you can build the image locally (if you have Docker installed) and push it, or scale up your builder VM resource sizes:
```bash
fly scale count builder=1 --memory 4096
```

### CORS Policies
If your frontend cannot fetch data from your API in production, verify that the `ALLOW_CORS` env variable is set to `"true"` in `fly.toml` (which it is by default in the sample).
