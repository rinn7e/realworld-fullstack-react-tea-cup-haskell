{-# LANGUAGE OverloadedStrings #-}

module UserSpec (spec) where

import Data.IORef
import Data.Map.Strict qualified as Map
import Data.Time.Calendar (Day (..))
import Data.Time.Clock (UTCTime (..))
import Database.Persist.Sql (toSqlKey)
import Servant.Auth.Server qualified as S
import Test.Hspec

import Infrastructure.Api.Route.Auth.Web.Controller (loginUserHandler, registerUserHandler)
import Infrastructure.Api.Route.User.Web.Controller (followUserHandler)
import Infrastructure.Api.DTO
  ( LoginUserRequest (..)
  , NewUserRequest (..)
  , Profile (..)
  , ProfileResponse (..)
  , User (..)
  , UserResponse (..)
  )
import Infrastructure.Interpreter.Stub
import Infrastructure.Interpreter.Stub.DB.UserDB (MockDB (..), emptyMockDB)

spec :: Spec
spec = do
  describe "In-Memory Controller Testing" $ do
    it "can register a user, log them in, and follow another user completely in-memory" $ do
      -- 1. Initialize empty in-memory DB
      dbRef <- newIORef emptyMockDB
      let fixedTime = UTCTime (ModifiedJulianDay 60000) 0

      -- 2. Register first user "alice"
      let regReq1 = NewUserRequest "alice" "alice@example.com" "alicepassword"
      resReg1 <- runAppInMemory dbRef fixedTime (registerUserHandler S.Indefinite regReq1)

      case resReg1 of
        UserResponse User{username = uname, email = uemail, token = utoken} -> do
          uname `shouldBe` "alice"
          uemail `shouldBe` "alice@example.com"
          utoken `shouldBe` "mock_token_1"

      -- Verify database state contains Alice
      dbState1 <- readIORef dbRef
      case dbState1 of
        MockDB{nextUserId = nuid, users = uMap} -> do
          nuid `shouldBe` 2
          Map.size uMap `shouldBe` 1

      -- 3. Register second user "bob"
      let regReq2 = NewUserRequest "bob" "bob@example.com" "bobpassword"
      _ <- runAppInMemory dbRef fixedTime (registerUserHandler S.Indefinite regReq2)

      -- 4. Try logging in as Alice
      let loginReq = LoginUserRequest "alice@example.com" "alicepassword"
      resLogin <- runAppInMemory dbRef fixedTime (loginUserHandler S.Indefinite loginReq)

      case resLogin of
        UserResponse User{username = uname, token = utoken} -> do
          uname `shouldBe` "alice"
          utoken `shouldBe` "mock_token_1"

      -- 5. Alice (uid 1) follows Bob (username "bob")
      let aliceAuth = S.Authenticated (toSqlKey 1)
      resFollow <- runAppInMemory dbRef fixedTime (followUserHandler aliceAuth "bob")

      case resFollow of
        ProfileResponse Profile{username = puname, following = pfollowing} -> do
          puname `shouldBe` "bob"
          pfollowing `shouldBe` True

      -- Verify follows table state
      dbState2 <- readIORef dbRef
      case dbState2 of
        MockDB{follows = fList} -> do
          fList `shouldBe` [(1, 2)]
