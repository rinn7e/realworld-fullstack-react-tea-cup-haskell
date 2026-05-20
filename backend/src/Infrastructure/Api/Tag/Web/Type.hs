module Infrastructure.Api.Tag.Web.Type where

import Infrastructure.Api.TagCombinator (Tag)

import GHC.Generics (Generic)
import Servant
  ( Description
  , GenericMode (type (:-))
  , Get
  , JSON
  , Summary
  , (:>)
  )

import Infrastructure.Api.Tag.Web.DTO (TagListResponse)

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
