module Capability.Database.VisitorDB where

import Data.Time (UTCTime)
import Domain.Type
import Effectful
import Effectful.Dispatch.Dynamic

data VisitorDB :: Effect where
  InsertVisitor
    :: VisitorIp -> VisitorUserAgent -> VisitorPath -> UTCTime -> VisitorDB m Visitor
  ListVisitors
    :: Maybe Int
    -> Maybe Int
    -> Maybe VisitorIp
    -> Maybe VisitorPath
    -> VisitorDB m ([Visitor], Int)
  GetVisitorsSince :: UTCTime -> VisitorDB m [Visitor]
  CountAllVisitors :: VisitorDB m Int

type instance DispatchOf VisitorDB = 'Dynamic

insertVisitor
  :: (VisitorDB :> es)
  => VisitorIp
  -> VisitorUserAgent
  -> VisitorPath
  -> UTCTime
  -> Eff es Visitor
insertVisitor ip ua path t = send (InsertVisitor ip ua path t)

listVisitors
  :: (VisitorDB :> es)
  => Maybe Int
  -> Maybe Int
  -> Maybe VisitorIp
  -> Maybe VisitorPath
  -> Eff es ([Visitor], Int)
listVisitors mLimit mOffset mIp mPath = send (ListVisitors mLimit mOffset mIp mPath)

getVisitorsSince :: (VisitorDB :> es) => UTCTime -> Eff es [Visitor]
getVisitorsSince since = send (GetVisitorsSince since)

countAllVisitors :: (VisitorDB :> es) => Eff es Int
countAllVisitors = send CountAllVisitors
