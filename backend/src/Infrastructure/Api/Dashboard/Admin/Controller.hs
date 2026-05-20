module Infrastructure.Api.Dashboard.Admin.Controller
  ( adminDashboardRoute
  ) where

import Data.Map.Strict qualified as Map
import Data.Maybe (fromMaybe)
import Data.Text (Text)
import Data.Text qualified as T
import Data.Time
  ( addUTCTime
  , defaultTimeLocale
  , formatTime
  , toGregorian
  , utctDay
  )
import Effectful.Error.Static (throwError)
import Servant (NamedRoutes)
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Domain.Log (LogEntry (..))
import Domain.Visitor (Visitor (..))
import Infrastructure.Api.Dashboard.Admin.Type
import Infrastructure.Entity.Dashboard.DTO
  ( DashboardStatsResponse (..)
  , VisitorStatResponse (..)
  )
import Infrastructure.Entity.Log.DTO
  ( LogLevel (..)
  , LogListResponse (..)
  , LogResponse (..)
  , logLevelFromText
  , logLevelToText
  )
import Infrastructure.Entity.Visitor.DTO (VisitorListResponse (..), VisitorResponse (..))
import Infrastructure.Common.Type.App (App)
import Infrastructure.Common.Util.Guard (guardAdmin)
import Infrastructure.Interpreter.Real.DB.Schema.Schema (UserId)

import Capability.Database.ArticleDB
import Capability.Database.CommentDB
import Capability.Database.LoggerDB
import Capability.Database.UserDB
import Capability.Database.VisitorDB
import Capability.Time

adminDashboardRoute
  :: S.AuthResult UserId -> S.ServerT (NamedRoutes AdminDashboardRoute) App
adminDashboardRoute auth =
  AdminDashboardRoute
    { getDashboardStats = getDashboardStatsHandler auth
    , getVisitorStats = getVisitorStatsHandler auth
    , getLogs = getLogsHandler auth
    , getVisitors = getVisitorsHandler auth
    }

getDashboardStatsHandler :: S.AuthResult UserId -> App DashboardStatsResponse
getDashboardStatsHandler (S.Authenticated uid) = do
  guardAdmin uid
  totalUsers <- listUsers Nothing Nothing Nothing Nothing >>= \(_, c) -> return c
  totalArticles <- countArticles Nothing Nothing Nothing
  (_, totalComments) <- listAdminComments Nothing Nothing 0 0
  totalVisitors <- countAllVisitors
  now <- getCurrentTime
  let oneDayAgo = addUTCTime (-86400) now
  activeVisitors <- getVisitorsSince oneDayAgo
  let activeCount = length activeVisitors
  return
    DashboardStatsResponse
      { totalUsers = totalUsers
      , totalArticles = totalArticles
      , totalComments = totalComments
      , totalVisitors = totalVisitors
      , activeUsers24h = if activeCount == 0 then totalUsers else activeCount
      }
getDashboardStatsHandler _ = throwError S.err401

getVisitorStatsHandler :: S.AuthResult UserId -> Maybe Text -> App [VisitorStatResponse]
getVisitorStatsHandler (S.Authenticated uid) mFilter = do
  guardAdmin uid
  let filterVal = maybe "week" id mFilter
  now <- getCurrentTime
  let limitTime = case filterVal of
        "24h" -> addUTCTime (-86400) now
        "week" -> addUTCTime (-7 * 86400) now
        "month" -> addUTCTime (-30 * 86400) now
        "year" -> addUTCTime (-365 * 86400) now
        _ -> addUTCTime (-7 * 86400) now

  visitors <- getVisitorsSince limitTime

  let buckets = case filterVal of
        "24h" -> map (\h -> (if h < 10 then "0" else "") <> T.pack (show h) <> ":00") [0 .. 23 :: Int]
        "week" -> ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        "month" -> ["Week 1", "Week 2", "Week 3", "Week 4"]
        "year" -> ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        _ -> ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  let initMap = Map.fromList $ map (\b -> (b, 0)) buckets

  let getBucketName t = case filterVal of
        "24h" -> T.pack (formatTime defaultTimeLocale "%H:00" t)
        "week" -> T.pack (formatTime defaultTimeLocale "%a" t)
        "month" ->
          let (_, _, day) = toGregorian (utctDay t)
              w = min 4 (((day - 1) `div` 7) + 1)
           in "Week " <> T.pack (show w)
        "year" -> T.pack (formatTime defaultTimeLocale "%b" t)
        _ -> T.pack (formatTime defaultTimeLocale "%a" t)

  let countsMap =
        foldr
          ( \(v :: Visitor) acc ->
              let bName = getBucketName v.timestamp
               in Map.adjust (+ 1) bName acc
          )
          initMap
          visitors

  let result = map (\b -> VisitorStatResponse b (fromMaybe 0 $ Map.lookup b countsMap)) buckets
  return result
getVisitorStatsHandler _ _ = throwError S.err401

getLogsHandler
  :: S.AuthResult UserId
  -> Maybe Int
  -> Maybe Int
  -> Maybe LogLevel
  -> Maybe Text
  -> App LogListResponse
getLogsHandler (S.Authenticated uid) mLimit mOffset mLevel mSource = do
  guardAdmin uid
  let limit = maybe 10 id mLimit
      offset = maybe 0 id mOffset
      levelText = fmap logLevelToText mLevel
  (logs, total) <- listLogs (Just limit) (Just offset) levelText mSource
  let logResponses = map toLogResponse logs
  return
    LogListResponse
      { logs = logResponses
      , totalCount = total
      }
 where
  toLogResponse :: LogEntry -> LogResponse
  toLogResponse (l :: LogEntry) =
    LogResponse
      { id = l.logId
      , level = logLevelFromText l.level
      , message = l.message
      , source = l.source
      , timestamp = l.timestamp
      , userId = l.userId
      }
getLogsHandler _ _ _ _ _ = throwError S.err401

getVisitorsHandler
  :: S.AuthResult UserId
  -> Maybe Int
  -> Maybe Int
  -> Maybe Text
  -> Maybe Text
  -> App VisitorListResponse
getVisitorsHandler (S.Authenticated uid) mLimit mOffset mIp mPath = do
  guardAdmin uid
  let limit = maybe 10 id mLimit
      offset = maybe 0 id mOffset
  (visitors, total) <- listVisitors (Just limit) (Just offset) mIp mPath
  let visitorResponses = map toVisitorResponse visitors
  return
    VisitorListResponse
      { visitors = visitorResponses
      , totalCount = total
      }
 where
  toVisitorResponse :: Visitor -> VisitorResponse
  toVisitorResponse (v :: Visitor) =
    VisitorResponse
      { id = v.visitorId
      , ip = v.ip
      , userAgent = v.userAgent
      , path = v.path
      , timestamp = v.timestamp
      }
getVisitorsHandler _ _ _ _ _ = throwError S.err401
