# Quick Start Guide

Your Cardeeno project is live on GitHub and ready for development!

## Repository Information

**GitHub Repository**: https://github.com/tothgabor2002/Cardeeno

## Quick Commands

### Push Your Changes

```bash
# Check what changed
git status

# Add all changes
git add .

# Commit with message
git commit -m "feat: your feature description"

# Push to GitHub
git push origin master
```

### Pull Latest Changes

```bash
git pull origin master
```

### Create a Feature Branch

```bash
# Create and switch to new branch
git checkout -b feature/your-feature-name

# Work on your feature...

# Push feature branch
git push origin feature/your-feature-name

# Create pull request
gh pr create --title "Your feature" --body "Description"
```

## Next Steps

### 1. Set Up GitHub Token for MCP (Optional but Recommended)

To enable GitHub MCP server in Claude Code:

1. **Create token**: https://github.com/settings/tokens
2. **Select scopes**: `repo`, `workflow`, `read:org`
3. **Add to `.env.local`**:
   ```env
   GITHUB_TOKEN=ghp_your_token_here
   ```

See [docs/GITHUB_SETUP.md](docs/GITHUB_SETUP.md) for detailed instructions.

### 2. Set Up GitHub Actions Secrets

For CI/CD to work:

1. Go to: https://github.com/tothgabor2002/Cardeeno/settings/secrets/actions
2. Add secret: **ANTHROPIC_API_KEY** (required for AI features)
3. Optional: **PERCY_TOKEN** for visual testing

### 3. Enable GitHub Actions

1. Visit: https://github.com/tothgabor2002/Cardeeno/actions
2. Click "I understand my workflows, go ahead and enable them"

## Daily Workflow

```bash
# Morning: Get latest code
git pull origin master

# Start development server
npm run dev

# Make changes, test locally
npm run test:ci

# Commit and push
git add .
git commit -m "feat: add new feature"
git push origin master
```

## Milestone Workflow

When you reach a milestone:

```bash
# Tag the version
git tag -a v0.1.0 -m "Milestone: Basic game working"
git push origin v0.1.0

# Create GitHub release
gh release create v0.1.0 --title "Alpha v0.1.0" --notes "First working version"
```

## Useful Links

- **Repository**: https://github.com/tothgabor2002/Cardeeno
- **Actions**: https://github.com/tothgabor2002/Cardeeno/actions
- **Issues**: https://github.com/tothgabor2002/Cardeeno/issues
- **Settings**: https://github.com/tothgabor2002/Cardeeno/settings

## Documentation

- [Setup Guide](docs/SETUP_GUIDE.md) - Complete setup instructions
- [GitHub Setup](docs/GITHUB_SETUP.md) - GitHub integration details
- [Architecture](docs/ARCHITECTURE.md) - System design
- [Deployment](docs/DEPLOYMENT.md) - Deployment guides
- [Contributing](docs/CONTRIBUTING.md) - How to contribute

## Need Help?

Check the documentation in the `docs/` folder or create an issue on GitHub.

---

**You're all set!** Start building your vocabulary learning platform. 🚀
