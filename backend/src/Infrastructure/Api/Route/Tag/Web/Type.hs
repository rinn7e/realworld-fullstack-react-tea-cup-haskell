module Infrastructure.Api.Route.Tag.Web.Type where

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

import Infrastructure.Entity.Tag.DTO (TagListResponse)

data TagRoute mode = TagRoute
  { getTagList
      :: mode
        :- "tags"
          :> Summary "Get Tags"
          :> Description "Get a list of all tags"
          :> Tag "Tags"
          :> Get '[JSON] TagListResponse
  -- ^ GET /api/tags
  }
  deriving stock (Generic)
