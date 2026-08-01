module Infrastructure.Common.Type.DBPools where

import Database.Persist.Sql (ConnectionPool)

newtype ReadPool = ReadPool ConnectionPool
newtype WritePool = WritePool ConnectionPool
