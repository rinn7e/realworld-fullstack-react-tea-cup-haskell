module Infrastructure.Api.Route.Metadata.Web.Type where

import Infrastructure.Api.Route.TagCombinator (Tag)

import GHC.Generics (Generic)
import Servant
  ( Description
  , GenericMode (type (:-))
  , Get
  , JSON
  , Summary
  , (:>)
  )

import Infrastructure.Common.Type.Metadata (MetadataResponse)

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
