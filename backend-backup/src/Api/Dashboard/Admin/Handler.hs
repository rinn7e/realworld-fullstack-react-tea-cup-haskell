module Api.Dashboard.Admin.Handler where

import Data.Maybe (fromMaybe)
import Data.Map.Strict qualified as Map
import Data.Text (Text)
import Data.Text qualified as T
import Data.Time (UTCTime, addUTCTime, getCurrentTime, toGregorian, utctDay, formatTime, defaultTimeLocale)
import Database.Persist
  ( Filter
  , SelectOpt (..)
  , count
  , selectList
  , (!=.)
  , (==.)
  , (>=.)
  )
import Database.Persist.Sql (Entity (..), fromSqlKey)
import Effectful (liftIO)
import Effectful.Error.Static (throwError)
import Servant (NamedRoutes)
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Api.Dashboard.Admin.Type
import Common.Type.App (App)
import Common.Util.Guard (guardAdmin)
import DB.Schema.Type (UserId)
import DB.Schema.Type qualified as DB
import DB.Util (runDB)
import Entity.Dashboard.Api (DashboardStatsResponse (..), VisitorStatResponse (..))
import Entity.Log.Api
  ( LogListResponse (..)
  , LogResponse (..)
  , LogLevel (..)
  , logLevelToText
  , logLevelFromText
  )
import Entity.Visitor.Api (VisitorListResponse (..), VisitorResponse (..))

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
  now <- liftIO getCurrentTime
  let oneDayAgo = addUTCTime (-86400) now

  runDB $ do
    totalUsers <- fromIntegral <$> count ([] :: [Filter DB.User])
    totalArticles <- fromIntegral <$> count ([] :: [Filter DB.Article])
    totalComments <- fromIntegral <$> count ([] :: [Filter DB.Comment])
    totalVisitors <- fromIntegral <$> count ([] :: [Filter DB.Visitor])

    -- Simple estimation: count visitors who hit within last 24h
    activeUsers24h <- fromIntegral <$> count [DB.VisitorTimestamp >=. oneDayAgo]

    return
      DashboardStatsResponse
        { totalUsers = totalUsers
        , totalArticles = totalArticles
        , totalComments = totalComments
        , totalVisitors = totalVisitors
        , activeUsers24h = if activeUsers24h == 0 then totalUsers else activeUsers24h
        }
getDashboardStatsHandler _ = throwError S.err401

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

  let filters =
        concat
          [ maybe [] (\lvl -> [DB.LogLevel ==. logLevelToText lvl]) mLevel
          , maybe [] (\src -> [DB.LogSource ==. src]) mSource
          ]

  runDB $ do
    totalCount <- fromIntegral <$> count filters
    entities <- selectList filters [Desc DB.LogTimestamp, LimitTo limit, OffsetBy offset]
    let logs = map toLogResponse entities
    return
      LogListResponse
        { logs = logs
        , totalCount = totalCount
        }
  where
   toLogResponse :: Entity DB.Log -> LogResponse
   toLogResponse (Entity lid l) =
     LogResponse
       { id = fromIntegral (fromSqlKey lid)
       , level = logLevelFromText l.level
       , message = l.message
       , source = l.source
       , timestamp = l.timestamp
       , userId = fmap (fromIntegral . fromSqlKey) l.userId
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

  let filters =
        concat
          [ maybe [] (\ip -> [DB.VisitorIp ==. ip]) mIp
          , maybe [] (\p -> [DB.VisitorPath ==. p]) mPath
          ]

  runDB $ do
    totalCount <- fromIntegral <$> count filters
    entities <-
      selectList filters [Desc DB.VisitorTimestamp, LimitTo limit, OffsetBy offset]
    let visitors = map toVisitorResponse entities
    return
      VisitorListResponse
        { visitors = visitors
        , totalCount = totalCount
        }
  where
   toVisitorResponse :: Entity DB.Visitor -> VisitorResponse
   toVisitorResponse (Entity vid v) =
     VisitorResponse
       { id = fromIntegral (fromSqlKey vid)
       , ip = v.ip
       , userAgent = v.userAgent
       , path = v.path
       , timestamp = v.timestamp
       }
getVisitorsHandler _ _ _ _ _ = throwError S.err401

getVisitorStatsHandler :: S.AuthResult UserId -> Maybe Text -> App [VisitorStatResponse]
getVisitorStatsHandler (S.Authenticated uid) mFilter = do
  guardAdmin uid
  let filterVal = maybe "week" id mFilter
  now <- liftIO getCurrentTime
  let limitTime = case filterVal of
        "24h" -> addUTCTime (-86400) now
        "week" -> addUTCTime (-7 * 86400) now
        "month" -> addUTCTime (-30 * 86400) now
        "year" -> addUTCTime (-365 * 86400) now
        _ -> addUTCTime (-7 * 86400) now

  visitors <- runDB $ selectList [DB.VisitorTimestamp >=. limitTime] []

  let buckets = case filterVal of
        "24h" -> map (\h -> (if h < 10 then "0" else "") <> T.pack (show h) <> ":00") [0..23 :: Int]
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

  let countsMap = foldr (\(Entity _ v) acc ->
        let bName = getBucketName v.timestamp
        in Map.adjust (+1) bName acc) initMap visitors

  let result = map (\b -> VisitorStatResponse b (fromMaybe 0 $ Map.lookup b countsMap)) buckets
  return result
getVisitorStatsHandler _ _ = throwError S.err401
