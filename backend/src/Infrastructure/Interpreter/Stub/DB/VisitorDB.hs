module Infrastructure.Interpreter.Stub.DB.VisitorDB
  ( runVisitorDBStub
  ) where

import Data.List qualified as L
import Data.Map.Strict qualified as Map
import Effectful
import Effectful.Dispatch.Dynamic
import UnliftIO.IORef

import Capability.Database.VisitorDB
import Domain.Type hiding (Limit, Offset)
import Domain.Type qualified as D
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
  ListVisitors mLimit mOffset mIp mPath mSort mDir -> do
    db <- readIORef ref
    let allVisitors = Map.elems db.visitors
        filtered = filter (\v ->
          maybe True (== v.ip) mIp &&
          maybe True (== v.path) mPath
          ) allVisitors
        total = length filtered
        limit = maybe 10 D.unLimit mLimit
        offset = maybe 0 D.unOffset mOffset
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
