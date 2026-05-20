module Infrastructure.Interpreter.Stub.DB.VisitorDB
  ( runVisitorDBStub
  ) where

import Effectful
import Effectful.Dispatch.Dynamic

import Capability.Database.VisitorDB

runVisitorDBStub :: Eff (VisitorDB : es) a -> Eff es a
runVisitorDBStub = interpret $ \_ -> \case
  InsertVisitor{} -> pure (error "VisitorDBStub: InsertVisitor")
  ListVisitors{} -> pure ([], 0)
  GetVisitorsSince _ -> pure []
  CountAllVisitors -> pure 0
