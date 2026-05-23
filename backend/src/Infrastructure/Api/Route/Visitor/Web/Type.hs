module Infrastructure.Api.Route.Visitor.Web.Type where

import Data.Text (Text)
import GHC.Generics (Generic)
import Servant
  ( Description
  , GenericMode (type (:-))
  , Header
  , JSON
  , Post
  , ReqBody
  , Summary
  , (:>)
  )

import Infrastructure.Api.DTO qualified as Api
import Infrastructure.Api.Route.TagCombinator (Tag)

data VisitorWebRoute mode = VisitorWebRoute
  { trackVisitor
      :: mode
        :- "visitors"
          :> Summary "Track Visitor Page View"
          :> Description "Log a page view event with client info (IP, UA) and optional userId"
          :> Tag "Visitors"
          :> ReqBody '[JSON] Api.TrackVisitorRequest
          :> Header "User-Agent" Text
          :> Header "X-Forwarded-For" Text
          :> Header "X-Real-IP" Text
          :> Post '[JSON] Api.VisitorResponse
  }
  deriving stock (Generic)
