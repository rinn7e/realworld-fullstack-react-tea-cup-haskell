{-# LANGUAGE OverloadedStrings #-}

module AuthSpec (spec) where

import Data.ByteString.Char8 qualified as BSC
import Data.Text.Encoding qualified as TE
import Database.Persist.Sql (toSqlKey)
import Infrastructure.Common.Type.JWK (generateToken, makeSecretKey)
import Infrastructure.Interpreter.Real.DB.Schema.Schema (UserId)
import Servant.Auth.Server
import Test.Hspec

spec :: Spec
spec = do
  describe "JWT Token Generation and Decoding" $ do
    it "can successfully decode a generated token using servant-auth-server" $ do
      let secret = "your-secret-key-that-should-be-at-least-32-chars-long-!!"
      let jwk = makeSecretKey secret
      let jwtSettings = defaultJWTSettings jwk

      let uid = toSqlKey 5 :: UserId

      -- Generate token (which returns Text)
      tokenText <- generateToken jwk uid

      let tokenBs = TE.encodeUtf8 tokenText

      -- Verify token using servant-auth-server
      res <- verifyJWT jwtSettings tokenBs

      res `shouldBe` Just uid
