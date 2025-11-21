# Cardeeno - AI-Powered Vocabulary Learning Platform

<div align="center">

![Cardeeno Logo](public/logo.png)

**Master vocabulary through engaging card matching games with scientifically proven spaced repetition**

[![CI/CD](https://github.com/yourusername/cardeeno/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/cardeeno/actions)
[![codecov](https://codecov.io/gh/yourusername/cardeeno/branch/main/graph/badge.svg)](https://codecov.io/gh/yourusername/cardeeno)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

## Overview

Cardeeno is a modern vocabulary learning application that combines gamification with spaced repetition techniques. Built with Next.js 15, TypeScript, and AI-powered development workflows, it provides an engaging and effective way to learn new languages.

### Key Features

- **Interactive Card Matching Game**: Match word pairs between known and target languages
- **Spaced Repetition System**: Three-level memory tracking (short, medium, long-term)
- **Progress Visualization**: Color-coded progress bars showing learning status
- **Custom Word Sets**: Create personal word sets or use community-created collections
- **AI-Powered Development**: Automated code generation, testing, and documentation
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations

### State Management
- **Zustand** - Lightweight state management

### Testing
- **Jest** - Unit testing
- **React Testing Library** - Component testing
- **Playwright** - E2E testing
- **Percy** - Visual regression testing

### DevOps & AI
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **Claude AI** - Automated code generation, testing, and documentation
- **ESLint & Prettier** - Code quality and formatting

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn
- Docker (for containerized deployment)
- Anthropic API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cardeeno.git
   cd cardeeno
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your API keys.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Documentation

Comprehensive guides are available in the `docs/` folder:

- **[Setup Guide](docs/SETUP_GUIDE.md)** - Step-by-step installation and configuration
- **[Architecture](docs/ARCHITECTURE.md)** - System design and technical decisions
- **[Deployment](docs/DEPLOYMENT.md)** - Multi-cloud deployment guides
- **[Contributing](docs/CONTRIBUTING.md)** - Contribution guidelines
- **[Project Summary](docs/PROJECT_SUMMARY.md)** - Complete feature overview

## Development Workflow

### AI-Powered Development

This project includes AI-powered scripts that automate common development tasks:

#### Generate Components
```bash
npm run ai:generate -- --type component --name WordCard --description "A card component for displaying word pairs"
```

#### Generate Tests
```bash
npm run ai:test -- --file components/WordCard.tsx
```

#### Auto-Fix Failing Tests
```bash
npm run ai:fix-tests
```

#### Generate Documentation
```bash
npm run ai:docs
```

### Claude Code Integration

This project is optimized for use with [Claude Code](https://claude.com/claude-code). Available slash commands:

- `/dev` - Start the development server
- `/test-all` - Run all tests
- `/gen-component` - Generate a new component
- `/gen-tests` - Generate tests for a file
- `/deploy` - Deploy the application
- `/fix-errors` - Auto-fix common errors

### Testing

Run all tests:
```bash
npm run test:ci          # Unit tests with coverage
npm run test:e2e         # E2E tests
npm run test:visual      # Visual regression tests
```

### Code Quality

```bash
npm run lint             # Check for linting errors
npm run lint:fix         # Fix linting errors
npm run format           # Format code with Prettier
npm run type-check       # TypeScript type checking
```

## Deployment

### Docker

Build and run with Docker:
```bash
docker build -t cardeeno:latest .
docker run -p 3000:3000 cardeeno:latest
```

Or use Docker Compose:
```bash
docker-compose up
```

### Cloud Deployment

The project includes configurations for:
- **AWS ECS/Fargate**
- **Google Cloud Run**
- **DigitalOcean App Platform**
- **Azure Container Apps**

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed guides and [.github/workflows/ci.yml](.github/workflows/ci.yml) for the automated deployment pipeline.

## Project Structure

```
cardeeno/
├── app/                      # Next.js App Router pages
│   ├── api/                 # API routes
│   ├── game/                # Game page
│   ├── wordsets/            # Word sets management
│   └── page.tsx             # Home page
├── components/              # Reusable React components
├── lib/                     # Utility functions and helpers
├── docs/                    # Documentation
│   ├── SETUP_GUIDE.md      # Setup instructions
│   ├── ARCHITECTURE.md     # System architecture
│   ├── DEPLOYMENT.md       # Deployment guides
│   ├── CONTRIBUTING.md     # Contribution guidelines
│   └── PROJECT_SUMMARY.md  # Feature overview
├── tests/                   # Test files
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   └── e2e/                # End-to-end tests
├── scripts/                 # AI-powered development scripts
│   ├── ai-generate.js      # Component generation
│   ├── ai-test-generator.js # Test generation
│   ├── ai-fix-tests.js     # Automated test fixing
│   └── ai-docs-generator.js # Documentation generation
├── .claude/                 # Claude Code configuration
│   ├── commands/           # Slash commands
│   ├── skills/             # Custom skills
│   └── mcp.json            # MCP servers config
├── .github/                 # GitHub Actions workflows
│   └── workflows/
│       ├── ci.yml          # Main CI/CD pipeline
│       └── ai-test-fix.yml # Automated test fixing
└── public/                  # Static assets
```

## Architecture

### Spaced Repetition System

Cardeeno implements a three-tier spaced repetition system:

1. **Short-term Memory** (Yellow): Words recently learned, reviewed frequently
2. **Medium-term Memory** (Orange): Words being consolidated, reviewed periodically
3. **Long-term Memory** (Green): Well-learned words, reviewed occasionally

### Card Matching Game

The game presents two columns of cards:
- Left column: Known language (e.g., English)
- Right column: Target language (e.g., German)

Players match corresponding word pairs. Correct matches trigger success animations, and new cards smoothly appear to replace matched ones.

## MCP Servers

The project uses Model Context Protocol (MCP) servers for enhanced AI capabilities:

- **filesystem**: File system operations
- **github**: GitHub integration for repositories and PRs
- **memory**: Persistent context across sessions
- **postgres**: Database operations (when configured)

Configure in `.claude/mcp.json`.

## CI/CD Pipeline

The project includes a comprehensive CI/CD pipeline that:

- Runs ESLint and type checking
- Executes unit, integration, and E2E tests
- Performs AI-powered code review on PRs
- Runs visual regression tests
- Builds Docker images
- Automatically deploys to production (when configured)
- Auto-fixes failing tests with AI

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Claude AI](https://www.anthropic.com/claude)
- Testing with [Playwright](https://playwright.dev/)
- Visual testing with [Percy](https://percy.io/)

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

<div align="center">

Made with ❤️ by the Cardeeno Team

[Website](https://cardeeno.com) • [Documentation](https://docs.cardeeno.com) • [Blog](https://blog.cardeeno.com)

</div>
