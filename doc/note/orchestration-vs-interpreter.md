The application logic is like this

```
getMetadataHandler :: (MetadataDB :> es, Reader AppEnv :> es) => Eff es MetadataResponse
getMetadataHandler = do
  env <- ask @AppEnv
  lastMigration <- getLastRanMigration
  return $
    MetadataResponse
      { appVersion = T.pack (showVersion Paths.version)
      , lastCommitHash = env.appConfig.gitCommitHash
      , lastRanMigration = lastMigration
      }
```

we then can run the app logic, via `runApp` which provide the correct capability


but since we're doing a webserver, we can:

- define the api interface
```

data MetadataRoute mode = MetadataRoute
  { getMetadata
      :: mode
        :- "metadata"
          :> Summary "Get Metadata"
          :> Description "Get backend system metadata"
          :> Tag "Profile"
          :> Get '[JSON] MetadataResponse
  -- ^ GET /api/metadata
  }
  deriving stock (Generic)

```

This api interface, create a config func, that we can plug our app func in:
```
webMetadataRoute
  :: (MetadataDB :> es, Reader AppEnv :> es) => S.AuthResult UserId -> S.ServerT (NamedRoutes MetadataRoute) (Eff es)
webMetadataRoute _auth =
  MetadataRoute
    { getMetadata = getMetadataHandler
    }
```

Give such logic, one we can also define CLI interface (just like servant).

Then we can just plug the application logic into that CLI interface (without having to manually parse the CLI command)
- actually `optparse-applicative` is exactly that CLI interface for haskell