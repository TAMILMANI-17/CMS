# Fix for ESLint Dependency Conflict

The issue is that Next.js 16 requires ESLint 9, but there might be cached dependencies.

## Solution

Run these commands in order:

```powershell
# 1. Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# 2. Clear npm cache (optional but recommended)
npm cache clean --force

# 3. Install dependencies
npm install
```

## Alternative: Use legacy peer deps (if above doesn't work)

If you still get errors, you can use:

```powershell
npm install --legacy-peer-deps
```

But the first solution should work since ESLint is already updated to version 9 in package.json.

