{-# LANGUAGE FieldSelectors #-}
module Domain.Type.Common
  ( Limit(..)
  , Offset(..)
  , Sort(..)
  , unSort
  , Direction(..)
  )
where

import Data.Aeson (FromJSON, ToJSON)
import Data.Text (Text)
import Data.Text qualified as T
import GHC.Generics (Generic)
import Web.HttpApiData (FromHttpApiData (..), ToHttpApiData (..))

newtype Limit = Limit {unLimit :: Int}
  deriving stock (Eq, Ord, Show, Generic)
  deriving newtype (Num, ToJSON, FromJSON, ToHttpApiData, FromHttpApiData)

newtype Offset = Offset {unOffset :: Int}
  deriving stock (Eq, Ord, Show, Generic)
  deriving newtype (Num, ToJSON, FromJSON, ToHttpApiData, FromHttpApiData)

newtype Sort = Sort {unSort :: Text}
  deriving stock (Eq, Ord, Show, Generic)
  deriving newtype (ToJSON, FromJSON, ToHttpApiData, FromHttpApiData)

data Direction = Asc | Desc
  deriving stock (Eq, Ord, Show, Generic)
  deriving anyclass (ToJSON, FromJSON)

instance FromHttpApiData Direction where
  parseQueryParam t = case T.toLower t of
    "asc" -> Right Asc
    "desc" -> Right Desc
    _ -> Left "Invalid direction, must be asc or desc"

instance ToHttpApiData Direction where
  toQueryParam Asc = "asc"
  toQueryParam Desc = "desc"
