module Infrastructure.Interpreter.Real.DB.Schema.Instance where

import Database.Esqueleto.Experimental (SqlString)
import Database.Persist (PersistField)
import Database.Persist.Sql (PersistFieldSql)
import Domain.Type qualified as D

-- User instances
deriving newtype instance PersistField D.PasswordHashed
deriving newtype instance PersistFieldSql D.PasswordHashed

deriving newtype instance PersistField D.Username
deriving newtype instance PersistFieldSql D.Username

deriving newtype instance PersistField D.Email
deriving newtype instance PersistFieldSql D.Email

deriving newtype instance PersistField D.UserBio
deriving newtype instance PersistFieldSql D.UserBio

deriving newtype instance PersistField D.UserImage
deriving newtype instance PersistFieldSql D.UserImage

-- Tag instances
deriving newtype instance PersistField D.TagName
deriving newtype instance PersistFieldSql D.TagName

-- Article instances
deriving newtype instance PersistField D.ArticleSlug
deriving newtype instance PersistFieldSql D.ArticleSlug

deriving newtype instance PersistField D.ArticleTitle
deriving newtype instance PersistFieldSql D.ArticleTitle
deriving newtype instance SqlString D.ArticleTitle

deriving newtype instance PersistField D.ArticleDescription
deriving newtype instance PersistFieldSql D.ArticleDescription
deriving newtype instance SqlString D.ArticleDescription

deriving newtype instance PersistField D.ArticleBody
deriving newtype instance PersistFieldSql D.ArticleBody

-- Comment instances
deriving newtype instance PersistField D.CommentBody
deriving newtype instance PersistFieldSql D.CommentBody

-- Log instances
deriving newtype instance PersistField D.LogMessage
deriving newtype instance PersistFieldSql D.LogMessage

deriving newtype instance PersistField D.LogSource
deriving newtype instance PersistFieldSql D.LogSource

-- Visitor instances
deriving newtype instance PersistField D.VisitorIp
deriving newtype instance PersistFieldSql D.VisitorIp

deriving newtype instance PersistField D.VisitorUserAgent
deriving newtype instance PersistFieldSql D.VisitorUserAgent

deriving newtype instance PersistField D.VisitorPath
deriving newtype instance PersistFieldSql D.VisitorPath

deriving newtype instance PersistField D.VisitorFp
deriving newtype instance PersistFieldSql D.VisitorFp

