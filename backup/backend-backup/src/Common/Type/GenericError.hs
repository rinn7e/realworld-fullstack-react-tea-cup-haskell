module Common.Type.GenericError where

import Data.Aeson (ToJSON (..), (.=))
import Data.Aeson qualified as A
import GHC.Generics (Generic)

-------------------------------
-- GenericErrorResponse
-------------------------------
data GenericErrorResponse = GenericErrorResponse
  { errors :: A.Object
  }
  deriving (Show, Generic)

instance ToJSON GenericErrorResponse where
  toJSON (GenericErrorResponse errs) = A.object ["errors" .= errs]
