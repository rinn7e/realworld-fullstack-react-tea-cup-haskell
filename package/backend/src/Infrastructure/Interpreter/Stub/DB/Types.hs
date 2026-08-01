module Infrastructure.Interpreter.Stub.DB.Types
  ( MockDB (..)
  , emptyMockDB
  , ensureTag
  ) where

import Data.Map.Strict (Map)
import Data.Map.Strict qualified as Map
import Domain.Type

data MockDB = MockDB
  { nextUserId :: Int
  , users :: Map UserId User
  , follows :: [(UserId, UserId)] -- (followerId, followedId)
  , nextArticleId :: Int
  , articles :: Map ArticleId Article
  , articleTags :: [(ArticleId, TagName)] -- (articleId, tagname)
  , nextTagId :: Int
  , tags :: Map TagName TagId
  , favorites :: [(UserId, ArticleId)] -- (userId, articleId)
  , nextCommentId :: Int
  , comments :: Map CommentId Comment
  , nextLogId :: Int
  , logs :: Map LogId LogEntry
  , nextVisitorId :: Int
  , visitors :: Map VisitorId Visitor
  , lastRanMigration :: Maybe Int
  }
  deriving (Show)

emptyMockDB :: MockDB
emptyMockDB =
  MockDB
    { nextUserId = 1
    , users = Map.empty
    , follows = []
    , nextArticleId = 1
    , articles = Map.empty
    , articleTags = []
    , nextTagId = 1
    , tags = Map.empty
    , favorites = []
    , nextCommentId = 1
    , comments = Map.empty
    , nextLogId = 1
    , logs = Map.empty
    , nextVisitorId = 1
    , visitors = Map.empty
    , lastRanMigration = Just 1
    }

ensureTag :: TagName -> MockDB -> (MockDB, TagId)
ensureTag name db =
  case Map.lookup name db.tags of
    Just tid -> (db, tid)
    Nothing ->
      let tid = TagId db.nextTagId
          newDb =
            db
              { nextTagId = db.nextTagId + 1
              , tags = Map.insert name tid db.tags
              }
       in (newDb, tid)
