module Infrastructure.Api.Route.Auth.Admin.Type where

import GHC.Generics (Generic)
import Infrastructure.Api.Route.TagCombinator (Tag)
import Servant
  ( Description
  , GenericMode (type (:-))
  , Get
  , JSON
  , Post
  , ReqBody
  , Summary
  , (:>)
  )

import Infrastructure.Entity.User.DTO (LoginUserRequest, UserResponse)

data AdminAuthRoute mode = AdminAuthRoute
  { loginAdmin
      :: mode
        :- "login"
          :> Summary "Admin Login"
          :> Description "Login with administrative credentials"
          :> Tag "Admin Authentication"
          :> ReqBody '[JSON] LoginUserRequest
          :> Post '[JSON] UserResponse
  , getCurrentAdmin
      :: mode
        :- "user"
          :> Summary "Get Current Admin"
          :> Description "Get currently logged-in administrator details"
          :> Tag "Admin Authentication"
          :> Get '[JSON] UserResponse
  }
  deriving stock (Generic)
