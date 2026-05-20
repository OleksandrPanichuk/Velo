# Code Exploration

Prefer `grep` and `find` over reading whole files when locating symbols, patterns, or file paths. Read a file only after narrowing down the exact location.

```bash
# find a symbol
grep -rn "symbolName" apps/api/src --include="*.ts"

# find files by pattern
find apps/api/src -name "*.module.ts"

# find usages of a decorator or import
grep -rn "@BeforeUpdate\|@BeforeInsert" apps/api/src --include="*.ts"
```

Only use `Read` on a specific file once you know it contains what you need.
