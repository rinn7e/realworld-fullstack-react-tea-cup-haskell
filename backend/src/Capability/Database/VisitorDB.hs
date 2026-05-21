module Capability.Database.VisitorDB where

import Data.Time (UTCTime)
import Domain.Type hiding (Limit, Offset)
import Domain.Type qualified as D
import Effectful
import Effectful.Dispatch.Dynamic

data VisitorDB :: Effect where
  InsertVisitor
    :: VisitorIp -> VisitorUserAgent -> VisitorPath -> UTCTime -> Maybe UserId -> VisitorDB m Visitor
  ListVisitors
    :: Maybe D.Limit
    -> Maybe D.Offset
    -> Maybe VisitorIp
    -> Maybe VisitorPath
    -> Maybe D.VisitorSort
    -> Maybe D.Direction
    -> VisitorDB m ([(Visitor, Maybe User)], Int)
  GetVisitorsSince :: UTCTime -> VisitorDB m [Visitor]
  CountAllVisitors :: VisitorDB m Int

type instance DispatchOf VisitorDB = 'Dynamic

insertVisitor
  :: (VisitorDB :> es)
  => VisitorIp
  -> VisitorUserAgent
  -> VisitorPath
  -> UTCTime
  -> Maybe UserId
  -> Eff es Visitor
insertVisitor ip ua path t mUid = send (InsertVisitor ip ua path t mUid)

listVisitors
  :: (VisitorDB :> es)
  => Maybe D.Limit
  -> Maybe D.Offset
  -> Maybe VisitorIp
  -> Maybe VisitorPath
  -> Maybe D.VisitorSort
  -> Maybe D.Direction
  -> Eff es ([(Visitor, Maybe User)], Int)
listVisitors mLimit mOffset mIp mPath mSort mDir = send (ListVisitors mLimit mOffset mIp mPath mSort mDir)

getVisitorsSince :: (VisitorDB :> es) => UTCTime -> Eff es [Visitor]
getVisitorsSince since = send (GetVisitorsSince since)

countAllVisitors :: (VisitorDB :> es) => Eff es Int
countAllVisitors = send CountAllVisitors
