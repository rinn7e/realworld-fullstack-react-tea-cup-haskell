module Infrastructure.Api.Route.Auth.Web.Type where

import Infrastructure.Api.Route.TagCombinator (Tag)

import GHC.Generics (Generic)
import Servant
  ( Description
  , GenericMode (type (:-))
  , JSON
  , Post
  , PostCreated
  , ReqBody
  , Summary
  , (:>)
  )

import Infrastructure.Api.DTO qualified as Api

data AuthRoute mode = AuthRoute
  { loginUser
      :: mode
        :- "users"
          :> "login"
          :> Summary "Login"
          :> Description "Login an existing user"
          :> Tag "Authentication"
          :> ReqBody '[JSON] (Api.UserWrapper Api.LoginUserRequest)
          :> Post '[JSON] Api.UserResponse
  -- ^ POST /api/users/login
  , registerUser
      :: mode
        :- "users"
          :> Summary "Register"
          :> Description "Register a new user"
          :> Tag "Authentication"
          :> ReqBody '[JSON] (Api.UserWrapper Api.NewUserRequest)
          :> PostCreated '[JSON] Api.UserResponse
  -- ^ POST /api/users
  }
  deriving stock (Generic)
