# GitHub Setup Guide

Complete guide for setting up GitHub integration with Cardeeno, including MCP server configuration and CI/CD.

## Repository Information

- **Repository**: https://github.com/tothgabor2002/Cardeeno
- **Owner**: tothgabor2002
- **Branch**: master

## Initial Setup (Already Completed)

The repository has been created and the initial code has been pushed. You can now:

```bash
# Clone the repository (for other machines)
git clone https://github.com/tothgabor2002/Cardeeno.git
cd Cardeeno

# Check current remote
git remote -v
```

## Pushing Future Changes

To push your changes to GitHub:

```bash
# Check status
git status

# Add changes
git add .

# Commit with descriptive message
git commit -m "feat: add new feature"

# Push to GitHub
git push origin master
```

### Commit Message Convention

Follow conventional commits format:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example:
```bash
git commit -m "feat: implement word card matching game"
git commit -m "fix: resolve animation timing issue"
git commit -m "docs: update setup guide with database config"
```

## GitHub MCP Server Setup

The GitHub MCP server is already configured in `.claude/mcp.json`. To activate it:

### 1. Create a Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Set token name: `Cardeeno MCP`
4. Set expiration: 90 days or longer
5. Select scopes:
   - ✅ **repo** (Full control of private repositories)
   - ✅ **workflow** (Update GitHub Action workflows)
   - ✅ **read:org** (Read org and team membership)

6. Click "Generate token"
7. **Copy the token immediately** (you won't see it again)

### 2. Add Token to Environment

Edit `.env.local`:

```env
GITHUB_TOKEN=ghp_your_token_here
```

### 3. Verify MCP Server

In Claude Code, the GitHub MCP server should now be available with these capabilities:

- **Repository management**: Create, update, delete repos
- **Issue management**: Create, list, update issues
- **Pull requests**: Create, review, merge PRs
- **File operations**: Read, write files in repo
- **Branch management**: Create, delete branches
- **Search**: Search code, issues, PRs

### 4. Test GitHub MCP

In Claude Code, try:

```
List issues in the Cardeeno repository
```

Or:

```
Create a new issue titled "Test MCP Integration"
```

## GitHub Actions Setup

### Required Secrets

Add these secrets to your repository:

1. Go to https://github.com/tothgabor2002/Cardeeno/settings/secrets/actions
2. Click "New repository secret"
3. Add the following secrets:

#### Required:
- **ANTHROPIC_API_KEY**: Your Anthropic API key (for AI features)
  - Get from: https://console.anthropic.com/

#### Optional (for enhanced features):
- **PERCY_TOKEN**: Percy visual testing token
  - Get from: https://percy.io/
- **CODECOV_TOKEN**: Codecov reporting token
  - Get from: https://codecov.io/

### Enable GitHub Actions

1. Go to https://github.com/tothgabor2002/Cardeeno/actions
2. Click "I understand my workflows, go ahead and enable them"
3. The CI/CD pipeline will now run on every push and PR

### Workflow Files

Two workflows are configured:

1. **`.github/workflows/ci.yml`**
   - Runs on: Push to master, all PRs
   - Jobs: Lint, test, build, deploy
   - Duration: ~5-10 minutes

2. **`.github/workflows/ai-test-fix.yml`**
   - Runs on: Daily schedule or manual trigger
   - Automatically fixes failing tests

## Branch Protection (Recommended)

Set up branch protection for production-ready code:

1. Go to https://github.com/tothgabor2002/Cardeeno/settings/branches
2. Click "Add branch protection rule"
3. Branch name pattern: `master`
4. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Require conversation resolution before merging
5. Click "Create"

## Working with Pull Requests

### Creating a PR

```bash
# Create a feature branch
git checkout -b feature/word-matching-game

# Make changes, commit
git add .
git commit -m "feat: implement word matching game"

# Push to GitHub
git push origin feature/word-matching-game

# Create PR using GitHub CLI
gh pr create --title "Add word matching game" --body "Implements the core card matching functionality"
```

### Merging a PR

```bash
# After reviews and tests pass
gh pr merge <pr-number> --squash

# Or use the GitHub web interface
```

## Using Claude Code with GitHub

### Slash Commands

Available in Claude Code:

```
/deploy        # Deploy to production
```

### AI Code Review

Every PR will receive an automated AI code review that checks:
- Code quality and best practices
- Potential bugs and issues
- Security vulnerabilities
- Performance concerns
- Documentation completeness

## Useful GitHub CLI Commands

```bash
# View repository info
gh repo view

# List issues
gh issue list

# Create an issue
gh issue create --title "Bug: Cards not animating" --body "Description..."

# List pull requests
gh pr list

# View PR details
gh pr view <pr-number>

# Check GitHub Actions status
gh run list

# View workflow logs
gh run view <run-id> --log
```

## Milestones and Releases

### Creating Milestones

1. Go to https://github.com/tothgabor2002/Cardeeno/milestones
2. Click "New milestone"
3. Examples:
   - MVP v1.0
   - Public Beta
   - Production Release

### Creating Releases

When ready to release:

```bash
# Tag the release
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Create release on GitHub
gh release create v1.0.0 --title "Version 1.0.0" --notes "Release notes here"
```

## Troubleshooting

### Issue: GitHub MCP not working

**Solution:**
1. Check `.env.local` has `GITHUB_TOKEN` set
2. Verify token has correct scopes
3. Restart Claude Code
4. Check token hasn't expired

### Issue: GitHub Actions failing

**Solution:**
1. Check https://github.com/tothgabor2002/Cardeeno/actions
2. View logs for failed jobs
3. Verify secrets are set correctly
4. Check if all tests pass locally first

### Issue: Push rejected

**Solution:**
```bash
# Pull latest changes first
git pull origin master

# Resolve conflicts if any
# Then push
git push origin master
```

### Issue: Authentication failed

**Solution:**
```bash
# Re-authenticate with GitHub CLI
gh auth login

# Follow the prompts
```

## Best Practices

### Daily Workflow

1. **Start of day**: Pull latest changes
   ```bash
   git pull origin master
   ```

2. **Create feature branch** for each feature
   ```bash
   git checkout -b feature/new-feature
   ```

3. **Commit frequently** with clear messages
   ```bash
   git commit -m "feat: add user authentication"
   ```

4. **Push regularly** to backup your work
   ```bash
   git push origin feature/new-feature
   ```

5. **Create PR** when feature is complete
   ```bash
   gh pr create
   ```

### Milestone Workflow

When reaching a milestone:

```bash
# Ensure all tests pass
npm run test:ci
npm run test:e2e

# Update version in package.json
# Commit changes
git add .
git commit -m "chore: bump version to 1.0.0"

# Create and push tag
git tag -a v1.0.0 -m "Milestone: MVP Complete"
git push origin v1.0.0

# Create GitHub release
gh release create v1.0.0 --title "MVP Release" --notes "$(cat CHANGELOG.md)"
```

## Additional Resources

- [GitHub Docs](https://docs.github.com/)
- [GitHub CLI Manual](https://cli.github.com/manual/)
- [Git Documentation](https://git-scm.com/doc)
- [Conventional Commits](https://www.conventionalcommits.org/)

## Quick Reference

```bash
# Daily commands
git status                  # Check current state
git pull                    # Get latest changes
git add .                   # Stage all changes
git commit -m "message"     # Commit with message
git push                    # Push to GitHub

# Branch management
git branch                  # List branches
git checkout -b feature/x   # Create new branch
git merge feature/x         # Merge branch
git branch -d feature/x     # Delete branch

# GitHub CLI
gh repo view               # View repo info
gh issue list              # List issues
gh pr list                 # List PRs
gh run list                # List workflow runs

# Undo changes
git reset HEAD~1           # Undo last commit (keep changes)
git checkout -- file.txt   # Discard changes to file
git clean -fd              # Remove untracked files
```

---

**Your repository is ready!** You can now push milestones and collaborate effectively.

Repository URL: https://github.com/tothgabor2002/Cardeeno
