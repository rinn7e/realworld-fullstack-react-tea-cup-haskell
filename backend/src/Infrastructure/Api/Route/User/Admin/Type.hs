module Infrastructure.Api.Route.User.Admin.Type where

import Data.Text (Text)
import GHC.Generics (Generic)
import Servant
  ( Capture
  , Delete
  , Description
  , GenericMode (type (:-))
  , Get
  , JSON
  , Put
  , QueryParam
  , ReqBody
  , Summary
  , (:>)
  )
import Servant qualified as S

import Infrastructure.Api.Route.TagCombinator (Tag)
import Infrastructure.Entity.User.DTO
  ( AdminUserListResponse (..)
  , AdminUserResponse (..)
  , UpdateUserRoleRequest (..)
  )

data AdminUserRoute mode = AdminUserRoute
  { getUsers
      :: mode
        :- "users"
          :> Summary "Get All Users"
          :> Description "Retrieve all registered users with pagination and keyword filters"
          :> Tag "Admin Users"
          :> QueryParam "limit" Int
          :> QueryParam "offset" Int
          :> QueryParam "username" Text
          :> QueryParam "email" Text
          :> Get '[JSON] AdminUserListResponse
  , updateUserRole
      :: mode
        :- "users"
          :> Capture "id" Int
          :> "role"
          :> Summary "Update User Role"
          :> Description "Promote a user to Admin or demote to User"
          :> Tag "Admin Users"
          :> ReqBody '[JSON] UpdateUserRoleRequest
          :> Put '[JSON] AdminUserResponse
  , deleteUser
      :: mode
        :- "users"
          :> Capture "id" Int
          :> Summary "Delete User"
          :> Description "Permanently delete a user from the platform"
          :> Tag "Admin Users"
          :> Delete '[JSON] S.NoContent
  }
  deriving stock (Generic)
