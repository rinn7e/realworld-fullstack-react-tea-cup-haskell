---
trigger: always_on
---

When updating code in frontend/**

Must follow the code conventions doc in

./frontend/docs/code-convention.md

use `npm run typecheck` for type checking with typescript

prefer to do manual change instead for writing scripts, unless explicitly said so

when running the e2e test, use sth similar to this

npx playwright test -g "should favorite an article" --reporter=line