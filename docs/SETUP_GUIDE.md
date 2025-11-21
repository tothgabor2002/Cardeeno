# Cardeeno Setup Guide

Complete step-by-step guide to set up your Cardeeno development environment with AI-powered workflows.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Claude Code Setup](#claude-code-setup)
4. [GitHub Setup](#github-setup)
5. [AI Development Tools](#ai-development-tools)
6. [Testing Setup](#testing-setup)
7. [Deployment Setup](#deployment-setup)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Node.js 20+**: [Download](https://nodejs.org/)
- **npm or yarn**: Comes with Node.js
- **Git**: [Download](https://git-scm.com/)
- **Docker**: [Download](https://www.docker.com/products/docker-desktop)
- **VS Code** (recommended): [Download](https://code.visualstudio.com/)

### Required API Keys

- **Anthropic API Key**: [Get from Anthropic](https://console.anthropic.com/)
- **GitHub Token**: [Create Personal Access Token](https://github.com/settings/tokens)
- **Percy Token** (optional): [Get from Percy](https://percy.io/)

## Initial Setup

### Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js and React
- TypeScript
- Testing libraries (Jest, Playwright)
- Development tools (ESLint, Prettier)
- AI SDK (Anthropic)

### Step 2: Environment Configuration

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your keys:

```env
ANTHROPIC_API_KEY=sk-ant-xxxxx
GITHUB_TOKEN=ghp_xxxxx
PERCY_TOKEN=xxxxx (optional)
```

### Step 3: Initialize Git Hooks

```bash
npm run prepare
```

This sets up Husky for pre-commit hooks that will:
- Run ESLint on staged files
- Format code with Prettier
- Run type checking

## Claude Code Setup

### Step 1: Install Claude Code

Follow the [Claude Code installation guide](https://github.com/anthropics/claude-code)

### Step 2: Configure MCP Servers

The project includes MCP server configuration in `.claude/mcp.json`.

Verify the configuration:
```bash
cat .claude/mcp.json
```

### Step 3: Available Slash Commands

Test slash commands in Claude Code:

```
/dev           # Start development server
/test-all      # Run all tests
/gen-component # Generate a component
/gen-tests     # Generate tests
/deploy        # Deploy application
/fix-errors    # Auto-fix errors
```

### Step 4: Verify MCP Servers

In Claude Code, type:
```
List available MCP servers
```

You should see: filesystem, github, memory, postgres

## GitHub Setup

### Step 1: Create GitHub Repository

```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/cardeeno.git
git branch -M main
git push -u origin main
```

### Step 2: Configure GitHub Secrets

Go to your repository settings and add these secrets:

- `ANTHROPIC_API_KEY`: Your Anthropic API key
- `GITHUB_TOKEN`: Automatically provided
- `PERCY_TOKEN`: Your Percy token (for visual testing)

### Step 3: Enable GitHub Actions

GitHub Actions are pre-configured in `.github/workflows/`. They will automatically:

- Run on every push and PR
- Execute all tests
- Perform AI code review
- Build Docker images
- Deploy to production (when configured)

### Step 4: Branch Protection

Set up branch protection for `main`:

1. Go to Settings > Branches
2. Add rule for `main` branch
3. Require:
   - Pull request reviews
   - Status checks (CI/CD)
   - Up-to-date branches

## AI Development Tools

### Code Generation

Generate new components:
```bash
npm run ai:generate -- --type component --name ProgressBar --description "A progress bar showing learning status with three color levels"
```

Generate API routes:
```bash
npm run ai:generate -- --type api --name wordsets --description "CRUD operations for managing word sets"
```

Generate pages:
```bash
npm run ai:generate -- --type page --name dashboard --description "User dashboard showing learning statistics"
```

### Test Generation

Generate tests for any file:
```bash
npm run ai:test -- --file components/ProgressBar.tsx
npm run ai:test -- --file app/api/wordsets/route.ts
npm run ai:test -- --file app/page.tsx
```

### Auto-Fix Failing Tests

When tests fail:
```bash
npm run ai:fix-tests
```

Or let the GitHub Action do it automatically (scheduled daily).

### Documentation Generation

Generate comprehensive API docs:
```bash
npm run ai:docs                    # All documentation
npm run ai:docs -- --type api      # API routes only
npm run ai:docs -- --type component # Components only
```

## Testing Setup

### Unit Tests

Run unit tests:
```bash
npm run test          # Watch mode
npm run test:ci       # CI mode with coverage
```

Configuration: `jest.config.js`

### E2E Tests

Setup Playwright:
```bash
npx playwright install --with-deps
```

Run E2E tests:
```bash
npm run test:e2e      # Headless
npm run test:e2e:ui   # UI mode for debugging
```

Configuration: `playwright.config.ts`

### Visual Regression Tests

Setup Percy:
1. Sign up at [percy.io](https://percy.io/)
2. Create a project
3. Add `PERCY_TOKEN` to `.env.local`

Run visual tests:
```bash
npm run test:visual
```

Configuration: `.percy.yml`

## Deployment Setup

### Docker Local Testing

Build and test locally:
```bash
docker build -t cardeeno:latest .
docker run -p 3000:3000 cardeeno:latest
```

Or use Docker Compose:
```bash
docker-compose up
```

### Cloud Deployment Options

#### Option 1: AWS ECS

```bash
# Install AWS CLI
# Configure credentials: aws configure

# Create ECR repository
aws ecr create-repository --repository-name cardeeno

# Build and push
aws ecr get-login-password | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com
docker tag cardeeno:latest <account-id>.dkr.ecr.<region>.amazonaws.com/cardeeno:latest
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/cardeeno:latest

# Deploy to ECS (use AWS Console or CLI)
```

#### Option 2: Google Cloud Run

```bash
# Install gcloud CLI
# Initialize: gcloud init

# Build and deploy
gcloud builds submit --tag gcr.io/<project-id>/cardeeno
gcloud run deploy cardeeno --image gcr.io/<project-id>/cardeeno --platform managed
```

#### Option 3: DigitalOcean

```bash
# Install doctl
# Authenticate: doctl auth init

# Create app
doctl apps create --spec .do/app.yaml
```

#### Option 4: Azure

```bash
# Install Azure CLI
# Login: az login

# Create resources and deploy
az group create --name cardeeno-rg --location eastus
az container create --resource-group cardeeno-rg --name cardeeno --image <your-registry>/cardeeno:latest --dns-name-label cardeeno --ports 3000
```

### Automated Deployment

The GitHub Actions workflow automatically deploys to production when:
- Code is pushed to `main` branch
- All tests pass
- Docker image builds successfully

Update `.github/workflows/ci.yml` with your deployment commands.

## Development Workflow

### Daily Development

1. **Start development server**
   ```bash
   npm run dev
   ```

2. **Make changes to code**

3. **Generate tests**
   ```bash
   npm run ai:test -- --file path/to/file.tsx
   ```

4. **Run tests**
   ```bash
   npm run test:ci
   ```

5. **Fix any issues**
   ```bash
   npm run lint:fix
   npm run ai:fix-tests  # if tests fail
   ```

6. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push
   ```

### Before Creating PR

```bash
# Run full test suite
npm run test:ci
npm run test:e2e

# Check code quality
npm run lint
npm run type-check
npm run format:check

# Build to verify
npm run build
```

## Troubleshooting

### Common Issues

#### Issue: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Issue: "Port 3000 already in use"
```bash
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux
lsof -ti:3000 | xargs kill
```

#### Issue: "Docker build fails"
```bash
# Clear Docker cache
docker system prune -a
docker build --no-cache -t cardeeno:latest .
```

#### Issue: "Tests failing"
```bash
# Auto-fix tests
npm run ai:fix-tests

# Or debug manually
npm run test -- --verbose
```

#### Issue: "TypeScript errors"
```bash
# Check all errors
npm run type-check

# Clear TypeScript cache
rm -rf .next
npm run build
```

### Getting Help

1. Check existing [Issues](https://github.com/yourusername/cardeeno/issues)
2. Search [Discussions](https://github.com/yourusername/cardeeno/discussions)
3. Create a new issue with:
   - Description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version, etc.)

## Next Steps

After completing setup:

1. Read [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system design
2. Review [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines
3. Explore the codebase starting with `app/page.tsx`
4. Try generating your first component with AI
5. Write and run your first tests
6. Deploy to staging environment

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Claude Code Guide](https://github.com/anthropics/claude-code)
- [Playwright Documentation](https://playwright.dev)
- [Docker Documentation](https://docs.docker.com)

## Verification Checklist

Use this checklist to verify your setup:

- [ ] Node.js 20+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured (`.env.local`)
- [ ] Git initialized and remote added
- [ ] Development server runs (`npm run dev`)
- [ ] Tests pass (`npm run test:ci`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Docker builds successfully
- [ ] Claude Code integration working
- [ ] GitHub Actions configured
- [ ] Ready to develop!

---

**Congratulations!** Your Cardeeno development environment is ready. Happy coding!
