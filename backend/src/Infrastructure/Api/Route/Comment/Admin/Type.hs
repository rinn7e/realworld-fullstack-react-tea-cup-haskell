module Infrastructure.Api.Route.Comment.Admin.Type where

import Data.Text (Text)
import GHC.Generics (Generic)
import Servant
  ( Capture
  , Delete
  , Description
  , GenericMode (type (:-))
  , Get
  , JSON
  , QueryParam
  , Summary
  , (:>)
  )
import Servant qualified as S

import Infrastructure.Api.DTO qualified as Api
import Infrastructure.Api.Route.TagCombinator (Tag)

data AdminCommentRoute mode = AdminCommentRoute
  { getComments
      :: mode
        :- "comments"
          :> Summary "Get All Comments"
          :> Description "Retrieve all comments in the system with optional author and article filters"
          :> Tag "Admin Comments"
          :> QueryParam "limit" Int
          :> QueryParam "offset" Int
          :> QueryParam "author" Text
          :> QueryParam "articleSlug" Text
          :> Get '[JSON] Api.CommentListResponse
  , deleteComment
      :: mode
        :- "comments"
          :> Capture "id" Int
          :> Summary "Delete Comment"
          :> Description "Administrative deletion of an offensive comment globally"
          :> Tag "Admin Comments"
          :> Delete '[JSON] S.NoContent
  }
  deriving stock (Generic)
