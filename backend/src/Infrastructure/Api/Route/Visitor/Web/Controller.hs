module Infrastructure.Api.Route.Visitor.Web.Controller
  ( webVisitorRoute
  , trackVisitorHandler
  ) where

import Control.Applicative ((<|>))
import Crypto.Hash (Digest, SHA256 (..), hash)
import Data.Maybe (fromMaybe)
import Data.Text (Text)
import Data.Text qualified as T
import Data.Text.Encoding (encodeUtf8)
import Database.Persist.Sql (fromSqlKey)
import Effectful
import Servant (NamedRoutes)
import Servant qualified as S
import Servant.Auth.Server qualified as S

import Capability.Database.VisitorDB
import Capability.Time (Time, getCurrentTime)
import Domain.Type qualified as D
import Infrastructure.Api.DTO qualified as Api
import Infrastructure.Api.Route.Visitor.Web.Type
import Infrastructure.Interpreter.Real.DB.Schema.Schema (UserId)

webVisitorRoute
  :: (VisitorDB :> es, Time :> es)
  => S.AuthResult UserId
  -> S.ServerT (NamedRoutes VisitorWebRoute) (Eff es)
webVisitorRoute auth =
  VisitorWebRoute
    { trackVisitor = trackVisitorHandler auth
    }

trackVisitorHandler
  :: (VisitorDB :> es, Time :> es)
  => S.AuthResult UserId
  -> Api.TrackVisitorRequest
  -> Maybe Text
  -> Maybe Text
  -> Maybe Text
  -> Maybe Text
  -> Eff es S.NoContent
trackVisitorHandler auth req mUserAgent mForwarded mRealIp mAcceptLang = do
  now <- getCurrentTime
  let ipVal = fromMaybe "127.0.0.1" (mForwarded <|> mRealIp)
      uaVal = fromMaybe "Unknown" mUserAgent
      langVal = fromMaybe "Unknown" mAcceptLang
      ip = D.VisitorIp ipVal
      ua = D.VisitorUserAgent uaVal
      path = D.VisitorPath req.path
      
      -- Calculate fingerprint: sha256 of IP + User-Agent + Accept-Language
      fingerprintInput = encodeUtf8 $ ipVal <> "|" <> uaVal <> "|" <> langVal
      digest :: Digest SHA256
      digest = hash fingerprintInput
      fingerprint = D.VisitorFp $ T.pack (show digest)

      mUid = case auth of
        S.Authenticated uid -> Just $ D.UserId $ fromIntegral (fromSqlKey uid)
        _ -> Nothing
  _ <- insertVisitor ip ua path fingerprint now mUid
  return S.NoContent

