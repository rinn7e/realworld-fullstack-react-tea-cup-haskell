That is a classic software engineering headache called the **Primitive Obsession** anti-pattern. When you have a string of identical types like `Text -> Text -> Text -> ...`, it is incredibly easy to accidentally swap the log message with the log level, and the compiler won't save you because a `Text` is a `Text`.

In Haskell, the idiomatic way to fix this readability nightmare is to use **strongly-typed wrappers**—specifically, custom data types or `newtype` wrappers.

Here are the two best approaches to make this capability readable and type-safe.

---

### Solution 1: Use `newtype` Wrappers (Recommended)

By wrapping each `Text` in a distinct `newtype`, you force yourself (and the compiler) to explicitly label what each string represents. `newtype` has zero runtime performance cost—it compiles down to just the raw `Text`.

```haskell
-- Define distinct types for each concept
newtype LogLevel = LogLevel Text deriving (Show, Eq)
newtype LogMsg   = LogMsg   Text deriving (Show, Eq)
newtype LogSrc   = LogSrc   Text deriving (Show, Eq)

data LoggerDB :: Effect where
  InsertLog 
    :: LogLevel 
    -> LogMsg 
    -> LogSrc 
    -> UTCTime 
    -> Maybe UserId 
    -> LoggerDB m LogEntry
    
  ListLogs
    :: Maybe Int 
    -> Maybe Int 
    -> Maybe LogLevel -- Cleaned up here too!
    -> Maybe LogSrc 
    -> LoggerDB m ([LogEntry], Int)
    
  CountAllLogs :: LoggerDB m Int

```

**Why this rules:** If you accidentally pass the message where the level should be, the compiler will throw an error immediately. When you call it, it looks beautifully explicit:

```haskell
insertLog (LogLevel "ERROR") (LogMsg "Database connection failed") (LogSrc "DB-Pool") timestamp uid

```

---

### Solution 2: Group them into a "Command" Record

If you find yourself passing these fields around together a lot in your application, you can group them into a single domain record.

```haskell
data NewLog = NewLog
  { logLevel   :: Text
  , logMessage :: Text
  , logSource  :: Text
  } deriving (Show, Eq)

data LoggerDB :: Effect where
  InsertLog :: NewLog -> UTCTime -> Maybe UserId -> LoggerDB m LogEntry
  -- ... rest of the effect

```

**Why this rules:** It utilizes Haskell's named record syntax, which serves as built-in documentation. When constructing the argument, order no longer matters:

```haskell
let myLog = NewLog 
              { logLevel = "INFO"
              , logSource = "AuthService"
              , logMessage = "User logged in successfully" 
              }
in insertLog myLog timestamp uid

```

---

### Summary Checklist

* For `ListLogs`, **Solution 1** is amazing because it updates `Maybe Text` into `Maybe LogLevel`, keeping your entire API descriptive.
* If your team prefers lightweight, standalone parameters, go with **Solution 1**.
* If you want a single, cohesive payload object that might be parsed from JSON or a config file later, go with **Solution 2**.