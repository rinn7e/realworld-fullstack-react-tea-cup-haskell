{-# LANGUAGE OverloadedStrings #-}

module CommentSpec (spec) where

import Data.IORef
import Data.Time.Calendar (Day (..))
import Data.Time.Clock (UTCTime (..))
import Database.Persist.Sql (toSqlKey)
import Servant.Auth.Server qualified as S
import Servant.Server qualified as S
import Test.Hspec

import Domain.Type qualified as D
import Infrastructure.Api.DTO
import Infrastructure.Api.Route.Article.Web.Controller (createArticleHandler)
import Infrastructure.Api.Route.Auth.Web.Controller (registerUserHandler)
import Infrastructure.Api.Route.Comment.Web.Controller
import Infrastructure.Interpreter.Stub
import Infrastructure.Interpreter.Stub.DB.UserDB (MockDB (..), emptyMockDB)

spec :: Spec
spec = do
  describe "Web Comment Controller" $ do
    it "adds, lists, and deletes comments on articles correctly" $ do
      dbRef <- newIORef emptyMockDB
      let fixedTime = UTCTime (ModifiedJulianDay 60000) 0

      -- 1. Register users "alice" and "bob"
      let aliceReg = NewUserRequest "alice" "alice@example.com" "alicepassword"
      _ <- runAppInMemory dbRef fixedTime (registerUserHandler S.Indefinite (UserWrapper aliceReg))
      let bobReg = NewUserRequest "bob" "bob@example.com" "bobpassword"
      _ <- runAppInMemory dbRef fixedTime (registerUserHandler S.Indefinite (UserWrapper bobReg))

      let aliceAuth = S.Authenticated (toSqlKey 1)
          bobAuth = S.Authenticated (toSqlKey 2)

      -- 2. Alice creates an article
      let newArtReq = NewArticleRequest
            { title = D.ArticleTitle "Haskell for Beginners"
            , description = D.ArticleDescription "A gentle introduction to Haskell"
            , body = D.ArticleBody "Haskell is a purely functional programming language..."
            , tagList = Just [D.TagName "functional", D.TagName "haskell"]
            }
      _ <- runAppInMemory dbRef fixedTime (createArticleHandler aliceAuth (ArticleWrapper newArtReq))
      let artSlug = D.ArticleSlug "haskell-for-beginners"

      -- 3. Bob creates a comment
      let newCommentReq = NewCommentRequest { body = "Great article!" }
      resCreateComm <- runAppInMemory dbRef fixedTime (createCommentHandler bobAuth artSlug (CommentWrapper newCommentReq))
      case resCreateComm of
        CommentResponse c -> do
          c.body `shouldBe` "Great article!"
          c.author.username `shouldBe` "bob"
          c.id `shouldBe` 1

      -- 4. Get comment list (Alice gets list)
      resListComm <- runAppInMemory dbRef fixedTime (getCommentListHandler aliceAuth artSlug)
      case resListComm of
        CommentListResponse comments count -> do
          count `shouldBe` 1
          length comments `shouldBe` 1
          let comm = head comments
          comm.body `shouldBe` "Great article!"
          comm.author.username `shouldBe` "bob"
          comm.id `shouldBe` 1

      -- 5. Alice tries to delete Bob's comment (should throw 403 Forbidden)
      resFailDelete <- runAppInMemoryEither dbRef fixedTime (deleteCommentHandler aliceAuth artSlug 1)
      case resFailDelete of
        Left err -> S.errHTTPCode err `shouldBe` 403
        Right _ -> fail "Expected Alice deleting Bob's comment to fail with 403"

      -- 6. Bob deletes his own comment
      _ <- runAppInMemory dbRef fixedTime (deleteCommentHandler bobAuth artSlug 1)

      -- 7. Get comment list again, should be empty
      resListComm2 <- runAppInMemory dbRef fixedTime (getCommentListHandler aliceAuth artSlug)
      case resListComm2 of
        CommentListResponse comments count -> do
          count `shouldBe` 0
          length comments `shouldBe` 0
