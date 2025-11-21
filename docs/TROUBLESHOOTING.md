# Troubleshooting Guide

Common issues and solutions for Cardeeno development.

## Quick Diagnostics

### Check if application is running

```bash
npm run page-check
```

### Auto-fix common issues

Type in Claude Code:

```
/fix-page
```

## Common Issues

### 1. Missing Dependencies Error

**Symptom**: 500 error with "Cannot find module" message

**Example**:

```
Error: Cannot find module 'autoprefixer'
```

**Solution**:

```bash
# Install missing package
npm install autoprefixer

# Or reinstall all dependencies
rm -rf node_modules package-lock.json
npm install

# Restart server
npm run dev
```

### 2. Port Already in Use

**Symptom**: "Port 3000 is in use"

**Solution**:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill

# Or use different port
PORT=3001 npm run dev
```

### 3. Build Errors

**Symptom**: Compilation errors, TypeScript errors

**Solution**:

```bash
# Check TypeScript errors
npm run type-check

# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

### 4. Page Shows 500 Error

**Symptom**: White screen or "500 Internal Server Error"

**Diagnosis**:

```bash
# Check server logs
# Look for error messages in terminal

# Use page-check tool
npm run page-check
```

**Common Causes**:

- Missing dependencies
- Syntax errors in code
- Configuration issues

**Solution**:

1. Check server console for error details
2. Install any missing packages
3. Fix syntax errors
4. Restart development server

### 5. Slow Page Load

**Symptom**: Page takes long to load

**Solution**:

```bash
# Clear Next.js cache
rm -rf .next

# Check for large dependencies
npm run build
# Look for large bundles in output

# Optimize images
# Use Next.js Image component
```

### 6. Hot Reload Not Working

**Symptom**: Changes don't appear after saving

**Solution**:

```bash
# Restart dev server
# Press Ctrl+C, then npm run dev

# Clear browser cache
# Hard refresh: Ctrl+Shift+R

# Check file watcher limits (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### 7. TypeScript Errors

**Symptom**: Red squiggles, type errors

**Solution**:

```bash
# Check all errors
npm run type-check

# Common fixes:
# - Add type annotations
# - Install @types packages
# - Update tsconfig.json
```

### 8. CSS/Tailwind Not Loading

**Symptom**: No styles on page

**Solution**:

```bash
# Verify Tailwind is installed
npm list tailwindcss

# Check postcss.config.js exists
cat postcss.config.js

# Install missing PostCSS tools
npm install autoprefixer postcss

# Restart server
npm run dev
```

### 9. Environment Variables Not Working

**Symptom**: API keys or config values undefined

**Solution**:

```bash
# Check .env.local exists
ls .env.local

# Copy from example
cp .env.example .env.local

# Edit and add your values
# Note: Must restart server after changing .env files!

# Public variables must start with NEXT_PUBLIC_
```

### 10. Database Connection Errors

**Symptom**: "Cannot connect to database"

**Solution**:

```bash
# Check DATABASE_URL in .env.local
# Verify database is running

# Test connection
psql $DATABASE_URL

# Check network access
# Verify firewall rules
```

## Using Automated Tools

### Page Check Tool

Automatically checks page for errors:

```bash
npm run page-check
# or
npm run page-check -- http://localhost:3001
```

What it checks:

- ✅ HTTP response status
- ✅ Console errors
- ✅ Page errors (JavaScript)
- ✅ Visible error messages
- ✅ Takes screenshot for visual inspection

### Slash Commands

In Claude Code, use these commands:

#### `/check-page`

Opens page in Playwright and reports any errors.

**Usage**:

```
/check-page
```

Claude will:

1. Find the running dev server port
2. Open page in browser
3. Take screenshot
4. Report errors
5. Show you the screenshot

#### `/fix-page`

Automatically diagnoses and fixes common page errors.

**Usage**:

```
/fix-page
```

Claude will:

1. Check for errors
2. Analyze the issue
3. Install missing dependencies
4. Fix configuration
5. Restart server
6. Verify fix worked

#### `/fix-errors`

General error fixing for code issues.

**Usage**:

```
/fix-errors
```

## Error Analysis Guide

### Reading Error Messages

**Next.js Errors**:

```
Error: Cannot find module 'package-name'
```

→ Install the package: `npm install package-name`

**TypeScript Errors**:

```
Type 'string' is not assignable to type 'number'
```

→ Fix type annotations in your code

**Build Errors**:

```
Module not found: Can't resolve './component'
```

→ Check import path, verify file exists

**Runtime Errors**:

```
TypeError: Cannot read property 'x' of undefined
```

→ Add null checks, verify data exists

## Prevention Tips

### Before Pushing Code

```bash
# Run full check
npm run type-check
npm run lint
npm run test:ci
npm run build
```

### After Pulling Changes

```bash
# Update dependencies
npm install

# Clear cache
rm -rf .next

# Restart server
npm run dev
```

### Regular Maintenance

```bash
# Update dependencies monthly
npm outdated
npm update

# Clean node_modules quarterly
rm -rf node_modules package-lock.json
npm install
```

## Getting Help

If you're still stuck:

1. **Check Documentation**
   - `docs/SETUP_GUIDE.md`
   - `docs/ARCHITECTURE.md`
   - `docs/CLAUDE_CODE_GUIDE.md`

2. **Use AI Tools**

   ```
   /fix-page
   ```

3. **Check GitHub Issues**
   - https://github.com/tothgabor2002/Cardeeno/issues

4. **Ask Claude**
   Just describe the error you're seeing!

## Debug Checklist

When troubleshooting:

- [ ] Check server console for errors
- [ ] Check browser console for errors
- [ ] Verify all dependencies installed (`npm install`)
- [ ] Check `.env.local` has required variables
- [ ] Verify port is not in use
- [ ] Try clearing cache (`rm -rf .next`)
- [ ] Restart development server
- [ ] Check recent code changes
- [ ] Run `npm run page-check`
- [ ] Use `/fix-page` command

## Emergency Reset

If everything is broken:

```bash
# Nuclear option - fresh start
rm -rf node_modules package-lock.json .next
npm install
npm run dev
```

---

**Remember**: Most issues can be solved with:

1. `npm install` (missing dependencies)
2. Restart server (cached issues)
3. `/fix-page` (automated fixing)

**Your application is now running successfully on http://localhost:3001** ✅
