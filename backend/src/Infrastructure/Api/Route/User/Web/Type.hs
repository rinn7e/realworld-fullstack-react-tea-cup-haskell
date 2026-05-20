module Infrastructure.Api.Route.User.Web.Type where

import Data.Text (Text)
import GHC.Generics (Generic)
import Servant
  ( Capture
  , Delete
  , Description
  , GenericMode (type (:-))
  , Get
  , JSON
  , Post
  , Put
  , ReqBody
  , Summary
  , (:>)
  )

import Infrastructure.Api.Route.TagCombinator (Tag)
import Infrastructure.Api.DTO.User (ProfileResponse, UpdateUserRequest, UserResponse)

data UserRoute mode = UserRoute
  { getCurrentUser
      :: mode
        :- "user"
          :> Summary "Get Current User"
          :> Description "Get the currently logged-in user details"
          :> Tag "User"
          :> Get '[JSON] UserResponse
  -- ^ GET /api/user
  , updateCurrentUser
      :: mode
        :- "user"
          :> Summary "Update Current User"
          :> Description "Update the currently logged-in user details"
          :> Tag "User"
          :> ReqBody '[JSON] UpdateUserRequest
          :> Put '[JSON] UserResponse
  -- ^ PUT /api/user
  , getUserByName
      :: mode
        :- "profiles"
          :> Capture "username" Text
          :> Summary "Get Profile"
          :> Description "Get a user profile by username"
          :> Tag "Profile"
          :> Get '[JSON] ProfileResponse
  -- ^ GET /api/profiles/:username
  , followUser
      :: mode
        :- "profiles"
          :> Capture "username" Text
          :> "follow"
          :> Summary "Follow User"
          :> Description "Follow a user by username"
          :> Tag "Profile"
          :> Post '[JSON] ProfileResponse
  -- ^ POST /api/profiles/:username/follow
  , unfollowUser
      :: mode
        :- "profiles"
          :> Capture "username" Text
          :> "follow"
          :> Summary "Unfollow User"
          :> Description "Unfollow a user by username"
          :> Tag "Profile"
          :> Delete '[JSON] ProfileResponse
  -- ^ DELETE /api/profiles/:username/follow
  }
  deriving stock (Generic)
