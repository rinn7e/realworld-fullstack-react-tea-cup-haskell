module Infrastructure.Api.Route.User.Admin.Type where

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

import Infrastructure.Api.DTO qualified as Api
import Infrastructure.Api.Route.TagCombinator (Tag)
import Domain.Type qualified as D

data AdminUserRoute mode = AdminUserRoute
  { getUsers
      :: mode
        :- "users"
          :> Summary "Get All Users"
          :> Description "Retrieve all registered users with pagination and keyword filters"
          :> Tag "Admin Users"
          :> QueryParam "limit" Int
          :> QueryParam "offset" Int
          :> QueryParam "username" D.Username
          :> QueryParam "email" D.Email
          :> Get '[JSON] Api.AdminUserListResponse
  , updateUserRole
      :: mode
        :- "users"
          :> Capture "id" Int
          :> "role"
          :> Summary "Update User Role"
          :> Description "Promote a user to Admin or demote to User"
          :> Tag "Admin Users"
          :> ReqBody '[JSON] Api.UpdateUserRoleRequest
          :> Put '[JSON] Api.AdminUserResponse
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
