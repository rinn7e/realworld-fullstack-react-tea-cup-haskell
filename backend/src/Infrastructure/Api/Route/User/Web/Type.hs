module Infrastructure.Api.Route.User.Web.Type where

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

import Infrastructure.Api.DTO qualified as Api
import Infrastructure.Api.Route.TagCombinator (Tag)
import Domain.Type qualified as D

data UserRoute mode = UserRoute
  { getCurrentUser
      :: mode
        :- "user"
          :> Summary "Get Current User"
          :> Description "Get the currently logged-in user details"
          :> Tag "User"
          :> Get '[JSON] Api.UserResponse
  -- ^ GET /api/user
  , updateCurrentUser
      :: mode
        :- "user"
          :> Summary "Update Current User"
          :> Description "Update the currently logged-in user details"
          :> Tag "User"
          :> ReqBody '[JSON] Api.UpdateUserRequest
          :> Put '[JSON] Api.UserResponse
  -- ^ PUT /api/user
  , getUserByName
      :: mode
        :- "profiles"
          :> Capture "username" D.Username
          :> Summary "Get Profile"
          :> Description "Get a user profile by username"
          :> Tag "Profile"
          :> Get '[JSON] Api.ProfileResponse
  -- ^ GET /api/profiles/:username
  , followUser
      :: mode
        :- "profiles"
          :> Capture "username" D.Username
          :> "follow"
          :> Summary "Follow User"
          :> Description "Follow a user by username"
          :> Tag "Profile"
          :> Post '[JSON] Api.ProfileResponse
  -- ^ POST /api/profiles/:username/follow
  , unfollowUser
      :: mode
        :- "profiles"
          :> Capture "username" D.Username
          :> "follow"
          :> Summary "Unfollow User"
          :> Description "Unfollow a user by username"
          :> Tag "Profile"
          :> Delete '[JSON] Api.ProfileResponse
  -- ^ DELETE /api/profiles/:username/follow
  }
  deriving stock (Generic)
