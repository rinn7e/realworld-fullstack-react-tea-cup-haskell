module Infrastructure.Interpreter.Real.DB.Util.Internal where

import Data.Char (toLower)
import Data.Text (Text)
import Data.Text qualified as T

stripEntityPrefix :: Text -> Text -> Text
stripEntityPrefix entityName fieldName =
  let prefix = T.toLower entityName
   in case T.stripPrefix prefix fieldName of
        Just rest ->
          case T.uncons rest of
            Just (c, cs) -> T.cons (toLower c) cs
            Nothing -> fieldName
        Nothing -> fieldName
