module Domain.Tag where

import Data.Text (Text)
import GHC.Generics (Generic)

data Tag = Tag
  { tagId :: Int
  , name :: Text
  }
  deriving stock (Eq, Show, Generic)
