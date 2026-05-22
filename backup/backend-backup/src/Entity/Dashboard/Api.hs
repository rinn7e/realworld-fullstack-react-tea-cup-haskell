module Entity.Dashboard.Api where

import Data.Aeson (ToJSON (..))
import Data.Aeson qualified as A
import Data.OpenApi (ToSchema (..))
import Data.Text (Text)
import GHC.Generics (Generic)

data DashboardStatsResponse = DashboardStatsResponse
  { totalUsers :: Int
  , totalArticles :: Int
  , totalComments :: Int
  , totalVisitors :: Int
  , activeUsers24h :: Int
  }
  deriving stock (Show, Generic)
  deriving anyclass (ToJSON, ToSchema)

data VisitorStatResponse = VisitorStatResponse
  { name :: Text
  , visitors :: Int
  }
  deriving stock (Show, Generic)
  deriving anyclass (ToJSON, ToSchema)
