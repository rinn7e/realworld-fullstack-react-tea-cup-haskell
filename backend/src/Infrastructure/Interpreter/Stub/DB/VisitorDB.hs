module Infrastructure.Interpreter.Stub.DB.VisitorDB
  ( runVisitorDBStub
  ) where

import Data.List qualified as L
import Data.Map.Strict qualified as Map
import Effectful
import Effectful.Dispatch.Dynamic
import UnliftIO.IORef

import Capability.Database.VisitorDB
import Domain.Type
import Infrastructure.Interpreter.Stub.DB.Types (MockDB (..))

runVisitorDBStub :: (IOE :> es) => IORef MockDB -> Eff (VisitorDB : es) a -> Eff es a
runVisitorDBStub ref = interpret $ \_ -> \case
  InsertVisitor ip ua path t -> do
    atomicModifyIORef' ref $ \db ->
      let vid = VisitorId db.nextVisitorId
          newVisitor = Visitor vid ip ua path t
          newDb = db
            { nextVisitorId = db.nextVisitorId + 1
            , visitors = Map.insert vid newVisitor db.visitors
            }
      in (newDb, newVisitor)
  ListVisitors mLimit mOffset mIp mPath -> do
    db <- readIORef ref
    let allVisitors = Map.elems db.visitors
        sorted = L.sortBy (\v1 v2 -> compare v2.timestamp v1.timestamp) allVisitors
        filtered = filter (\v ->
          maybe True (== v.ip) mIp &&
          maybe True (== v.path) mPath
          ) sorted
        total = length filtered
        limit = maybe 10 id mLimit
        offset = maybe 0 id mOffset
        sliced = take limit $ drop offset filtered
    pure (sliced, total)
  GetVisitorsSince since -> do
    db <- readIORef ref
    let allVisitors = Map.elems db.visitors
        filtered = filter (\v -> v.timestamp >= since) allVisitors
    pure filtered
  CountAllVisitors -> do
    db <- readIORef ref
    pure $ Map.size db.visitors
