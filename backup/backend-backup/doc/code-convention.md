# Backend Code Convention

## Record Access
- **NEVER** use record pattern matching (spreading) to extract multiple fields for the purpose of constructing another record.
- **PREFER** using dot notation (`OverloadedRecordDot`) for all record field access.

**Incorrect:**
```haskell
let D.User { email = email', username = username', bio = bio', image = image' } = u
in User email' token username' bio' image'
```

**Correct:**
```haskell
User u.email token u.username u.bio u.image
```

## Persistent Entities
- Use generic field names where possible (e.g., `email` instead of `userEmail`).

## Imports
- Always import `Servant` (and related modules) qualified as `S`, except for binary operators like `:<|>` and `:>`.
