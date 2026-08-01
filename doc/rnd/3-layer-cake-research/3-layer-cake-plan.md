# Migration Plan: Rebuilding the RealWorld Backend using the Haskell 3-Layer Cake Architecture

* **Author:** Technical Research Group
* **Target Codebase:** RealWorld Conduit Haskell Backend (`/backend`)
* **Strategy:** Reorganizing into a Modern 3-Layer Cake via `haskell/effectful`
* **Date:** May 19, 2026

---

## 1. Objective

This document outlines a concrete migration blueprint to transition the RealWorld backend to a modern, production-grade **3-Layer Cake** architecture.

Traditionally, the 3-Layer Cake is implemented using Final Tagless typeclass constraints (MTL-style). However, in modern Haskell, **Algebraic Effects**—specifically via the **`haskell/effectful`** library—provide a significantly improved approach. It preserves the core conceptual division of the 3-Layer Cake while solving its historic pain points:
1.  **Eliminates the $N \times M$ Boilerplate Instance Problem:** No longer need to write boilerplate instances to propagate capability constraints across monad transformer stacks. GHC automatically traverses type-level lists.
2.  **Solves the Orphan Instance / Single Instance Constraint:** We can easily declare and run multiple different database interpreters (e.g. primary vs. read-only replica) in the same stack.
3.  **Maximum GHC Optimization:** Operates at the exact same native execution speed as raw `ReaderT IO` monads without requiring complex GHC specialization pragmas or specialized compiler plugins.

---

## 2. Target Architectural Layout

The folder directory structure will be reorganized to physically isolate the three tiers:

```
src/
├── Domain/                                 -- LAYER 3: PURE CORE (Entity Records & Mappings)
│   ├── User.hs                             -- Pure User records and total data validations
│   └── Article.hs                          -- Pure Article records
│
├── Capability/                             -- LAYER 2: ABSTRACT CAPABILITIES & INTERACTORS
│   ├── Database/
│   │   └── UserDB.hs                       -- GADT Effect declaration for UserDB
│   ├── Crypto.hs                           -- GADT Effect declaration for password hashing
│   └── User/
│       └── Register.hs                     -- Abstract use-case interactor in Eff es monad
│
└── Infrastructure/                         -- LAYER 1: THE RUNTIME INTERPRETERS (THE DETAILS)
    ├── App.hs                              -- Concrete App base monad type
    ├── Controllers/                        -- Servant REST routing and endpoint handlers
    │   └── User.hs                         -- Weaves interpreters and executes use cases
    └── Postgres/                           -- Concrete Postgres interpreters
        ├── UserDB.hs                       -- runUserDBPostgres (Esqueleto SQL implementation)
        └── Crypto.hs                       -- runCryptoBcrypt (bcrypt hashing implementation)
```

---

## 3. The Modern 3-Layer Cake Mapping (Case Study: User Registration)

Let us map out a complete migration plan for a user registration flow using modern algebraic capabilities.

### Layer 3: The Pure Core (`src/Domain/User.hs`)
This tier contains pure data models and validation functions. It imports absolutely no effect stacks, DB libraries, or web frameworks:

```haskell
module Domain.User where

import Data.Text (Text)

data User = User
  { userId    :: Int
  , username  :: Text
  , email     :: Text
  , bio       :: Maybe Text
  } deriving stock (Eq, Show)

-- Pure validation function
validateEmail :: Text -> Either Text Text
validateEmail e =
  if "@" `elem` (words (map (\c -> if c == '@' then ' ' else c) (show e)))
    then Right e
    else Left "Invalid email format"
```

---

### Layer 2: Business Logic & Capabilities (`src/Capability/`)

First, we define our abstract database capabilities as **Dynamic GADT Effects** inside `src/Capability/Database/UserDB.hs` and `src/Capability/Crypto.hs`. We also expose GHC type-level list smart constructors:

```haskell
{-# LANGUAGE DataKinds #-}
{-# LANGUAGE TypeFamilies #-}
{-# LANGUAGE GADTs #-}

module Capability.Database.UserDB where

import Effectful
import Effectful.Dispatch.Dynamic
import Data.Text (Text)
import Domain.User (User)

-- 1. Declare the GADT Effect
data UserDB :: Effect where
  LookupUserByEmail :: Text -> UserDB (Maybe User)
  InsertUser        :: Text -> Text -> Text -> UserDB User -- username, email, pwdHash

type instance DispatchOf UserDB = 'Dynamic

-- 2. Expose smart constructors for GHC's type-level effect lists (es)
lookupUserByEmail :: (UserDB :> es) => Text -> Eff es (Maybe User)
lookupUserByEmail email = send (LookupUserByEmail email)

insertUser :: (UserDB :> es) => Text -> Text -> Text -> Eff es User
insertUser u e p = send (InsertUser u e p)
```

```haskell
{-# LANGUAGE DataKinds #-}
{-# LANGUAGE TypeFamilies #-}
{-# LANGUAGE GADTs #-}

module Capability.Crypto where

import Effectful
import Effectful.Dispatch.Dynamic
import Data.Text (Text)

data Crypto :: Effect where
  HashPassword :: Text -> Crypto Text

type instance DispatchOf Crypto = 'Dynamic

hashPassword :: (Crypto :> es) => Text -> Eff es Text
hashPassword plain = send (HashPassword plain)
```

Next, we write our Use Case Interactor inside `src/Capability/User/Register.hs`. It coordinates the business rules inside GHC's `Eff es` monad. It specifies what capabilities it requires via the `(:>)` type-level membership operator:

```haskell
module Capability.User.Register where

import Data.Text (Text)
import Capability.Database.UserDB
import Capability.Crypto
import Domain.User
import Effectful

-- Business Logic Interactor: Operates on GHC's Eff es stack
registerUserUseCase :: (UserDB :> es, Crypto :> es)
                    => Text -> Text -> Text 
                    -> Eff es (Either Text User)
registerUserUseCase username email plainPassword = do
  case validateEmail email of
    Left err -> return $ Left err
    Right validatedEmail -> do
      existingUser <- lookupUserByEmail validatedEmail
      case existingUser of
        Just _  -> return $ Left "Email already registered"
        Nothing -> do
          pwdHash <- hashPassword plainPassword
          newUser <- insertUser username validatedEmail pwdHash
          return $ Right newUser
```

---

### Layer 1: The App Monad & Interpreters (`src/Infrastructure/`)

First, in `src/Infrastructure/App.hs`, we define our concrete `App` monad which houses our environment context (`AppEnv`):

```haskell
module Infrastructure.App where

import Database.Persist.Sql (ConnectionPool)
import Effectful
import Effectful.Error.Static
import Servant

data AppEnv = AppEnv
  { dbPool :: ConnectionPool
  }

-- The concrete runtime monad stack
type App = Eff '[Reader AppEnv, Error ServerError, IOE]
```

Next, in `src/Infrastructure/Postgres/UserDB.hs`, we write the concrete **Interpreter** for the abstract `UserDB` GADT effect using Esqueleto/Persistent queries:

```haskell
{-# LANGUAGE TypeOperators #-}

module Infrastructure.Postgres.UserDB where

import Database.Esqueleto.Experimental (runSqlPool)
import Database.Persist.Sql (ConnectionPool)
import Effectful
import Effectful.Dispatch.Dynamic
import Capability.Database.UserDB
import Domain.User
import DB.Util (runDB)

-- Dynamic interpreter that translates UserDB actions into live database calls
runUserDBPostgres :: (IOE :> es, Reader ConnectionPool :> es) 
                  => Eff (UserDB : es) a 
                  -> Eff es a
runUserDBPostgres = interpret $ \_ -> \case
  LookupUserByEmail email -> do
    pool <- ask @ConnectionPool
    -- We run our traditional database query inside the SQL connection pool
    liftIO $ runSqlPool (lookupUserQuery email) pool
    
  InsertUser username email pwdHash -> do
    pool <- ask @ConnectionPool
    liftIO $ runSqlPool (insertUserQuery username email pwdHash) pool
```

Finally, we hook up our Servant Router Controller inside `src/Infrastructure/Controllers/User.hs`. The controller retrieves the live PostgreSQL connection pool from `AppEnv`, weaves the interpreters using standard function application (`&`), and executes the Use Case:

```haskell
module Infrastructure.Controllers.User where

import Servant
import Infrastructure.App (App, AppEnv(..))
import Domain.User (User)
import Capability.User.Register (registerUserUseCase)
import Infrastructure.Postgres.UserDB (runUserDBPostgres)
import Infrastructure.Postgres.Crypto (runCryptoBcrypt) -- Bcrypt runtime interpreter
import Effectful
import Effectful.Reader.Static
import Effectful.Error.Static
import Data.Text (Text)

-- Servant Endpoint Handler
postRegisterUserHandler :: Text -> Text -> Text -> App User
postRegisterUserHandler username email password = do
  env <- ask @AppEnv
  
  -- Weave the abstract Use Case with our concrete Layer 1 interpreters
  result <- registerUserUseCase username email password
    & runUserDBPostgres
    & runCryptoBcrypt
    & runReader env.dbPool -- Supply pool for the Postgres interpreter
    
  case result of
    Left err -> throwError $ err400 { errBody = "Registration failed" }
    Right user -> return user
```

---

## 4. Modern Offline Unit Testing

To verify our business logic (Layer 2) completely offline, we define **Mock Interpreters** inside `test/UserSpec.hs` using `effectful`'s high-performance, in-memory state engine (`State`):

```haskell
module Test.UserSpec where

import Test.Hspec
import Data.Map qualified as Map
import Domain.User
import Capability.Database.UserDB
import Capability.Crypto
import Capability.User.Register
import Effectful
import Effectful.State.Static.Local

-- 1. Pure in-memory state representing database records
data MockDB = MockDB
  { usersTable :: Map.Map Text User -- keyed by email
  }

-- 2. Mock DB Interpreter
runUserDBMock :: (State MockDB :> es) => Eff (UserDB : es) a -> Eff es a
runUserDBMock = interpret $ \_ -> \case
  LookupUserByEmail email -> do
    users <- gets usersTable
    return $ Map.lookup email users
  InsertUser username email pwdHash -> do
    let newUser = User 1 username email Nothing
    modify (\s -> s { usersTable = Map.insert email newUser (usersTable s) })
    return newUser

-- 3. Mock Crypto Interpreter
runCryptoMock :: Eff (Crypto : es) a -> Eff es a
runCryptoMock = interpret $ \_ -> \case
  HashPassword plain -> return $ "hashed_" <> plain

spec :: Spec
spec = describe "User Registration Business Rules" $ do
  it "successfully registers a new user in-memory if validations pass" $ do
    let initialState = MockDB Map.empty
    
    -- Execute registerUserUseCase inside GHC's pure Eff monad
    let (result, finalState) = runEff
          . runState initialState
          . runCryptoMock
          . runUserDBMock
          $ registerUserUseCase "testuser" "test@conduit.com" "password123"
          
    case result of
      Left err -> expectationFailure $ "Expected success, got: " ++ show err
      Right user -> do
        username user `shouldBe` "testuser"
        email user `shouldBe` "test@conduit.com"
        
        -- Verify that our pure in-memory state was correctly mutated
        Map.member "test@conduit.com" (usersTable finalState) `shouldBe` True
```

---

## 5. Phased Migration Schedule

Transitioning our codebase to the modern `effectful` 3-Layer Cake can be safely executed in four incremental phases:

- [ ] **Phase 1: Pure Core Extraction (Layer 3)**
  - Reorganize all basic data records from `DB/Schema/Type.hs` into database-free pure domain records inside `src/Domain/`.
- [ ] **Phase 2: Abstract Effect Declaration (Layer 2)**
  - Define our dynamic GADT capabilities (`UserDB`, `ArticleDB`) under `src/Capability/`.
  - Rewrite core transaction scripts as abstract `Eff es` interactors constrained by GHC's type-level `(:>)` operator.
- [ ] **Phase 3: Postgres Interpreters Implementation (Layer 1)**
  - Relocate existing Esqueleto and Persistent database queries inside `src/Infrastructure/Postgres/` and wrap them as concrete interpreters of the GADT effects (e.g. `runUserDBPostgres`).
- [ ] **Phase 4: Controllers Rewiring**
  - Point Servant routing definitions to the newly refactored handlers in `src/Infrastructure/Controllers/`.
  - Compile the system (`cabal build`) and execute the Playwright/e2e integration tests to ensure 100% API compatibility.

---

## 6. Architectural Comparison Matrix

| Architectural Metric | Traditional Final Tagless / Typeclasses | Modern Algebraic Stack via `haskell/effectful` |
| :--- | :--- | :--- |
| **Monad transformer wrapper boilerplate** | High (must declare instance wrappers for all transformers) | **None** (propagated seamlessly via GHC type-level lists) |
| **Orphan Instance Risks** | High (orphan instances occur frequently in nested stacks) | **None** (interpreters are standard runner functions) |
| **Multiple active interpreters** | Hard (requires introducing separate wrapper types) | **Trivial** (simply nest interpreter runner calls) |
| **GHC Specialization Dependency** | High (requires `@SPECIALIZE` or aggressive compiler flags) | **None** (runs at native `ReaderT Env IO` speed out-of-the-box) |
| **Learning Curve** | High (familiar to MTL veterans, but typeclass interactions can be verbose) | Moderate (requires basic GADT understanding, but cleaner type signatures) |
