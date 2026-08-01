{-# LANGUAGE OverloadedStrings #-}

module ArticleSpec (spec) where

import Data.IORef
import Data.Map.Strict qualified as Map
import Data.Time.Calendar (Day (..))
import Data.Time.Clock (UTCTime (..))
import Database.Persist.Sql (toSqlKey)
import Servant.Auth.Server qualified as S
import Servant.Server qualified as S
import Test.Hspec

import Domain.Type qualified as D
import Infrastructure.Api.DTO
import Infrastructure.Api.Route.Article.Web.Controller
import Infrastructure.Api.Route.Auth.Web.Controller (registerUserHandler)
import Infrastructure.Api.Route.User.Web.Controller (followUserHandler)
import Infrastructure.Interpreter.Stub
import Infrastructure.Interpreter.Stub.DB.UserDB (MockDB (..), emptyMockDB)

spec :: Spec
spec = do
  describe "Web Article Controller" $ do
    it "performs full CRUD, favoriting, and feed operations correctly" $ do
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
      resCreate <- runAppInMemory dbRef fixedTime (createArticleHandler aliceAuth (ArticleWrapper newArtReq))
      case resCreate of
        ArticleResponse art -> do
          art.slug.unArticleSlug `shouldBe` "haskell-for-beginners"
          art.title.unArticleTitle `shouldBe` "Haskell for Beginners"
          art.tagList `shouldContain` [D.TagName "functional", D.TagName "haskell"]
          art.author.username `shouldBe` "alice"

      -- 3. Retrieve the article by slug (Bob retrieves it)
      let artSlug = D.ArticleSlug "haskell-for-beginners"
      resGetOne <- runAppInMemory dbRef fixedTime (getArticleOneHandler bobAuth artSlug)
      case resGetOne of
        ArticleResponse art -> do
          art.slug.unArticleSlug `shouldBe` "haskell-for-beginners"
          art.author.username `shouldBe` "alice"
          art.favorited `shouldBe` False
          art.favoritesCount `shouldBe` 0

      -- 4. Bob favorites the article
      resFav <- runAppInMemory dbRef fixedTime (favoriteArticleHandler bobAuth artSlug)
      case resFav of
        ArticleResponse art -> do
          art.favorited `shouldBe` True
          art.favoritesCount `shouldBe` 1

      -- Check database state directly
      dbState1 <- readIORef dbRef
      dbState1.favorites `shouldBe` [(D.UserId 2, D.ArticleId 1)]

      -- 5. Bob unfavorites the article
      resUnfav <- runAppInMemory dbRef fixedTime (unfavoriteArticleHandler bobAuth artSlug)
      case resUnfav of
        ArticleResponse art -> do
          art.favorited `shouldBe` False
          art.favoritesCount `shouldBe` 0

      -- 6. Bob follows Alice, and gets Bob's feed
      _ <- runAppInMemory dbRef fixedTime (followUserHandler bobAuth "alice")
      resFeed <- runAppInMemory dbRef fixedTime (getArticleFeedHandler bobAuth Nothing Nothing)
      case resFeed of
        ArticleListResponse arts count -> do
          count `shouldBe` 1
          length arts `shouldBe` 1
          (head arts).slug.unArticleSlug `shouldBe` "haskell-for-beginners"

      -- 7. Alice updates the article
      let updateArtReq = UpdateArticleRequest
            { title = Just (D.ArticleTitle "Advanced Haskell")
            , description = Just (D.ArticleDescription "Going deeper into functional types")
            , body = Nothing
            , tagList = Nothing
            }
      resUpdate <- runAppInMemory dbRef fixedTime (updateArticleHandler aliceAuth artSlug (ArticleWrapper updateArtReq))
      case resUpdate of
        ArticleResponse art -> do
          art.slug.unArticleSlug `shouldBe` "advanced-haskell"
          art.title.unArticleTitle `shouldBe` "Advanced Haskell"
          art.description.unArticleDescription `shouldBe` "Going deeper into functional types"

      -- 8. Alice deletes the article
      _ <- runAppInMemory dbRef fixedTime (deleteArticleHandler aliceAuth (D.ArticleSlug "advanced-haskell"))

      -- Bob tries to retrieve it and it should fail (Left/throwError with 404)
      resFailGet <- runAppInMemoryEither dbRef fixedTime (getArticleOneHandler bobAuth (D.ArticleSlug "advanced-haskell"))
      case resFailGet of
        Left err -> S.errHTTPCode err `shouldBe` 404
        Right _ -> fail "Expected article to be deleted and return 404"
