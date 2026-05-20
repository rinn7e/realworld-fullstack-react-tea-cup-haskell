module Infrastructure.Interpreter.Stub.DB.TagDB
  ( runTagDBStub
  ) where

import Data.List qualified as L
import Effectful
import Effectful.Dispatch.Dynamic
import UnliftIO.IORef

import Capability.Database.TagDB
import Infrastructure.Interpreter.Stub.DB.Types (MockDB (..))

runTagDBStub :: (IOE :> es) => IORef MockDB -> Eff (TagDB : es) a -> Eff es a
runTagDBStub ref = interpret $ \_ -> \case
  GetTags -> do
    db <- readIORef ref
    pure $ L.nub $ map snd db.articleTags
