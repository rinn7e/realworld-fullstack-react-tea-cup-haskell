module Infrastructure.Api.Route.Comment.Web.Type where

import GHC.Generics (Generic)
import Servant
  ( Capture
  , Delete
  , Description
  , GenericMode (type (:-))
  , Get
  , JSON
  , PostCreated
  , ReqBody
  , Summary
  , (:>)
  )
import Servant qualified as S

import Infrastructure.Api.DTO.Comment
  ( CommentListResponse
  , CommentResponse
  , NewCommentRequest
  )
import Infrastructure.Api.Route.TagCombinator (Tag)

data CommentRoute mode = CommentRoute
  { getCommentList
      :: mode
        :- Summary "Get Comments"
          :> Description "Get comments for an article"
          :> Tag "Articles"
          :> Get '[JSON] CommentListResponse
  -- ^ GET /api/articles/:slug/comments
  , createComment
      :: mode
        :- Summary "Create Comment"
          :> Description "Create a comment for an article"
          :> Tag "Articles"
          :> ReqBody '[JSON] NewCommentRequest
          :> PostCreated '[JSON] CommentResponse
  -- ^ POST /api/articles/:slug/comments
  , deleteComment
      :: mode
        :- Capture "id" Int
          :> Summary "Delete Comment"
          :> Description "Delete a comment for an article"
          :> Tag "Articles"
          :> Delete '[JSON] S.NoContent
  -- ^ DELETE /api/articles/:slug/comments/:id
  }
  deriving stock (Generic)
