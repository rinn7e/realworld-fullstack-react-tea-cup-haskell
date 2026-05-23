{-# LANGUAGE OverloadedStrings #-}

module AdminSpec (spec) where

import Data.IORef
import Data.Map.Strict qualified as Map
import Data.Time.Calendar (Day (..))
import Data.Time.Clock (UTCTime (..))
import Database.Persist.Sql (toSqlKey)
import Servant.Auth.Server qualified as S
import Servant.Server qualified as S
import Test.Hspec
import Data.Text qualified as T

import Capability.Database.VisitorDB (insertVisitor)
import Domain.Type qualified as D
import Infrastructure.Api.DTO
import Infrastructure.Api.Route.Auth.Web.Controller (registerUserHandler)
import Infrastructure.Api.Route.Dashboard.Admin.Controller
import Infrastructure.Api.Route.Visitor.Web.Controller (trackVisitorHandler)
import Infrastructure.Api.Route.User.Admin.Controller
import Infrastructure.Interpreter.Stub
import Infrastructure.Interpreter.Stub.DB.UserDB (MockDB (..), emptyMockDB)

spec :: Spec
spec = do
  describe "Admin Dashboard and User Management Controller" $ do
    it "restricts regular users, allows admins, and updates roles correctly with logs" $ do
      dbRef <- newIORef emptyMockDB
      let fixedTime = UTCTime (ModifiedJulianDay 60000) 0

      -- 1. Register two users: normal_user (uid 1) and admin_user (uid 2)
      let normalReg = NewUserRequest "normal" "normal@example.com" "normalpwd"
      _ <- runAppInMemory dbRef fixedTime (registerUserHandler S.Indefinite (UserWrapper normalReg))
      let adminReg = NewUserRequest "admin" "admin@example.com" "adminpwd"
      _ <- runAppInMemory dbRef fixedTime (registerUserHandler S.Indefinite (UserWrapper adminReg))

      let normalAuth = S.Authenticated (toSqlKey 1)
          adminAuth = S.Authenticated (toSqlKey 2)

      -- 2. Regular user (uid 1) gets 403 Forbidden trying to access dashboard stats
      resFailStats <- runAppInMemoryEither dbRef fixedTime (getDashboardStatsHandler normalAuth)
      case resFailStats of
        Left err -> S.errHTTPCode err `shouldBe` 403
        Right _ -> fail "Expected regular user to get 403 Forbidden for stats"

      -- 3. Promoted admin_user (uid 2) to AdminRole in in-memory DB directly
      atomicModifyIORef' dbRef $ \db ->
        case Map.lookup (D.UserId 2) db.users of
          Nothing -> error "Admin user not found"
          Just u ->
            let updated = u { D.role = D.AdminRole }
                newDb = (db { users = Map.insert (D.UserId 2) updated db.users } :: MockDB)
            in (newDb, ())

      -- 4. Admin user (uid 2) successfully gets dashboard stats
      resStats <- runAppInMemory dbRef fixedTime (getDashboardStatsHandler adminAuth)
      resStats.totalUsers `shouldBe` 2
      resStats.totalArticles `shouldBe` 0
      resStats.totalVisitors `shouldBe` 0

      -- 5. Admin updates normal user role to AdminRole
      let updateRoleReq = UpdateUserRoleRequest { role = D.AdminRole }
      resUpdateUser <- runAppInMemory dbRef fixedTime (updateUserRoleHandler adminAuth 1 updateRoleReq)
      resUpdateUser.username `shouldBe` "normal"
      resUpdateUser.role `shouldBe` D.AdminRole

      -- 6. Verify normal_user (uid 1) can now access dashboard stats
      resStats2 <- runAppInMemory dbRef fixedTime (getDashboardStatsHandler normalAuth)
      resStats2.totalUsers `shouldBe` 2

      -- 7. Test visitor insertion capability, controller handler, and retrieval by admin
      _ <- runAppInMemory dbRef fixedTime (insertVisitor (D.VisitorIp "127.0.0.1") (D.VisitorUserAgent "Mozilla") (D.VisitorPath "/api/articles") (D.VisitorFp "dummy-fp") fixedTime Nothing)
      
      let trackReq = TrackVisitorRequest { path = "/home" }
      resTrack <- runAppInMemory dbRef fixedTime (trackVisitorHandler S.Indefinite trackReq (Just "Mozilla/5.0") (Just "1.2.3.4") Nothing Nothing)
      resTrack.ip `shouldBe` "1.2.3.4"
      resTrack.userAgent `shouldBe` "Mozilla/5.0"
      resTrack.path `shouldBe` "/home"
      resTrack.fingerprint `shouldSatisfy` (\fp -> T.length fp == 64)

      resVisitors <- runAppInMemory dbRef fixedTime (getVisitorsHandler adminAuth Nothing Nothing Nothing Nothing)
      resVisitors.totalCount `shouldBe` 2
      let vis1 = resVisitors.visitors !! 0
          vis2 = resVisitors.visitors !! 1
      vis1.ip `shouldBe` "127.0.0.1"
      vis1.path `shouldBe` "/api/articles"
      vis1.fingerprint `shouldBe` "dummy-fp"
      vis2.ip `shouldBe` "1.2.3.4"
      vis2.path `shouldBe` "/home"
      vis2.fingerprint `shouldSatisfy` (\fp -> T.length fp == 64)

      -- 8. Test log retrieval by admin (role promotion logged an action)
      resLogs <- runAppInMemory dbRef fixedTime (getLogsHandler adminAuth Nothing Nothing Nothing Nothing)
      resLogs.totalCount `shouldBe` 1
      let logEntry = head resLogs.logs
      logEntry.level `shouldBe` D.INFO
      logEntry.source.unLogSource `shouldBe` "AUTH"
      logEntry.message.unLogMessage `shouldBe` "Updated user role for normal to AdminRole"
