module Infrastructure.Api.Route.Dashboard.Admin.Type where

import Data.Text (Text)
import GHC.Generics (Generic)
import Servant
  ( Description
  , GenericMode (type (:-))
  , Get
  , JSON
  , QueryParam
  , Summary
  , (:>)
  )

import Infrastructure.Api.DTO.Dashboard (DashboardStatsResponse, VisitorStatResponse)
import Infrastructure.Api.DTO.Log (LogLevel, LogListResponse)
import Infrastructure.Api.Route.TagCombinator (Tag)
import Infrastructure.Api.DTO.Visitor (VisitorListResponse)

data AdminDashboardRoute mode = AdminDashboardRoute
  { getDashboardStats
      :: mode
        :- "dashboard"
          :> "stats"
          :> Summary "Get Dashboard Stats"
          :> Description "Get dashboard card and visitor metrics"
          :> Tag "Admin Dashboard"
          :> Get '[JSON] DashboardStatsResponse
  , getVisitorStats
      :: mode
        :- "dashboard"
          :> "visitor-stats"
          :> Summary "Get Visitor Stats"
          :> Description "Get time-series visitor counts filtered by range (24h, week, month, year)"
          :> Tag "Admin Dashboard"
          :> QueryParam "filter" Text
          :> Get '[JSON] [VisitorStatResponse]
  , getLogs
      :: mode
        :- "logs"
          :> Summary "Get Paginated Logs"
          :> Description "Get paginated system audit and moderator logs using limit and offset"
          :> Tag "Admin Dashboard"
          :> QueryParam "limit" Int
          :> QueryParam "offset" Int
          :> QueryParam "level" LogLevel
          :> QueryParam "source" Text
          :> Get '[JSON] LogListResponse
  , getVisitors
      :: mode
        :- "visitors"
          :> Summary "Get Paginated Visitor Logs"
          :> Description "Get paginated visitor traffic records using limit and offset"
          :> Tag "Admin Dashboard"
          :> QueryParam "limit" Int
          :> QueryParam "offset" Int
          :> QueryParam "ip" Text
          :> QueryParam "path" Text
          :> Get '[JSON] VisitorListResponse
  }
  deriving stock (Generic)
