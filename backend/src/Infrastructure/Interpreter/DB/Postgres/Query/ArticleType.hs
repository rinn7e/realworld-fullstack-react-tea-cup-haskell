module Infrastructure.Interpreter.DB.Postgres.Query.ArticleType where

import Data.Map.Append (AppendMap (..))
import Data.Map.Strict qualified as Map
import Data.Ord (Down (..))
import Data.Semigroup (First (..))
import Data.Time (UTCTime)
import Database.Esqueleto.Experimental

import Infrastructure.Interpreter.DB.Postgres.Schema.Schema

-- | SQL expression level (internal Esqueleto query)
type ArticleExpr =
  ( SqlExpr (Entity Article)
  , SqlExpr (Entity User)
  , SqlExpr (Maybe (Entity Tag))
  , SqlExpr (Value (Maybe Int))
  , SqlExpr (Value Bool)
  , SqlExpr (Value Bool)
  )

-- | SQL result level (raw row from database)
type ArticleRow =
  ( Entity Article
  , Entity User -- author
  , Maybe (Entity Tag)
  , Value (Maybe Int) -- favorites count
  , Value Bool -- is favorited by current user
  , Value Bool -- is following author
  )

-- | Grouped level (aggregated data for API response)
type ArticleGrouped =
  ( First (Entity Article)
  , First (Entity User)
  , AppendMap TagId (First (Entity Tag))
  , ( First (Maybe Int)
    , First Bool
    , First Bool
    )
  )

mkArticleGrouped :: ArticleRow -> AppendMap (Down UTCTime, ArticleId) ArticleGrouped
mkArticleGrouped (art, auth, mTag, Value favCount, Value isFav, Value isFol) =
  AppendMap $
    Map.singleton
      (Down art.entityVal.createdAt, art.entityKey)
      ( First art
      , First auth
      , case mTag of
          Just t -> AppendMap $ Map.singleton t.entityKey (First t)
          Nothing -> AppendMap Map.empty
      ,
        ( First favCount
        , First isFav
        , First isFol
        )
      )
