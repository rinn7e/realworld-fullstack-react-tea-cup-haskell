module Infrastructure.Api.TagCombinator
  ( Tag
  ) where

import Control.Lens ((&), (.~), (^.))
import Data.HashMap.Strict.InsOrd qualified as InsOrd
import Data.HashSet.InsOrd qualified as InsOrdHashSet
import Data.OpenApi
  ( Operation (..)
  , PathItem (..)
  , paths
  )
import Data.Proxy (Proxy (..))
import Data.Text (Text)
import Data.Text qualified as T
import GHC.TypeLits (KnownSymbol, Symbol, symbolVal)
import Servant (HasServer (..), ServerT, hoistServerWithContext, route, (:>))
import Servant.OpenApi (HasOpenApi (..))

{- | Type-level combinator to tag all endpoints in a Servant API.
  Example: Tag "Articles" :> NamedRoutes ArticleRoute
-}
data Tag (name :: Symbol)

-- | Pass-through HasServer instance since tags only affect documentation.
instance (HasServer api ctx) => HasServer (Tag tag :> api) ctx where
  type ServerT (Tag tag :> api) m = ServerT api m
  route _ ctx = route (Proxy @api) ctx
  hoistServerWithContext _ pc hoist = hoistServerWithContext (Proxy @api) pc hoist

-- | HasOpenApi instance to apply the tag to the OpenAPI spec.
instance (HasOpenApi api, KnownSymbol tag) => HasOpenApi (Tag tag :> api) where
  toOpenApi _ =
    let tagName = T.pack $ symbolVal (Proxy @tag) -- Extract the tag string from the compile-time Symbol.
        subSpec = toOpenApi (Proxy @api) -- Recursively generate spec for the nested API.
        -- Apply the tag to all routes generated within the nested spec.
     in subSpec
          & paths
            .~ InsOrd.mapWithKey (\_ pathItem -> addTagToPathItem tagName pathItem) (subSpec ^. paths)
   where
    -- \| Prepend the tag to all HTTP verbs inside the endpoint.
    addTagToPathItem :: Text -> PathItem -> PathItem
    addTagToPathItem t pi =
      pi
        { _pathItemGet = fmap (setTag t) (_pathItemGet pi)
        , _pathItemPost = fmap (setTag t) (_pathItemPost pi)
        , _pathItemPut = fmap (setTag t) (_pathItemPut pi)
        , _pathItemDelete = fmap (setTag t) (_pathItemDelete pi)
        , _pathItemPatch = fmap (setTag t) (_pathItemPatch pi)
        }

    -- \| Add the tag to the operation's tags list.
    setTag :: Text -> Operation -> Operation
    setTag t op = op{_operationTags = InsOrdHashSet.fromList [t]}
