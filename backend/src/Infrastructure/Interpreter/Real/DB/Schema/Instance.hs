module Infrastructure.Interpreter.Real.DB.Schema.Instance where

import Database.Persist (PersistField)
import Database.Persist.Sql (PersistFieldSql)
import Domain.Type.User (PasswordHashed, Username, Email)
import Domain.Type.User qualified as D

deriving newtype instance PersistField PasswordHashed
deriving newtype instance PersistFieldSql PasswordHashed

deriving newtype instance PersistField Username
deriving newtype instance PersistFieldSql Username

deriving newtype instance PersistField Email
deriving newtype instance PersistFieldSql Email

deriving newtype instance PersistField D.UserBio
deriving newtype instance PersistFieldSql D.UserBio

deriving newtype instance PersistField D.UserImage
deriving newtype instance PersistFieldSql D.UserImage
