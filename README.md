# Cardeeno - Quizlet-Style Flashcard Learning Platform

<div align="center">

![Cardeeno Logo](public/logo.png)

**Create, share, and study flashcard sets with interactive study modes and engaging animations**

[![CI/CD](https://github.com/tothgabor2002/Cardeeno/actions/workflows/ci.yml/badge.svg)](https://github.com/tothgabor2002/Cardeeno/actions)
[![codecov](https://codecov.io/gh/tothgabor2002/Cardeeno/branch/master/graph/badge.svg)](https://codecov.io/gh/tothgabor2002/Cardeeno)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

## Overview

Cardeeno is a modern, full-stack flashcard and study tool inspired by Quizlet. Built with Next.js 15, TypeScript, PostgreSQL, and Prisma ORM, it enables users to create, share, and study sets of flashcards using interactive study modes with smooth 3D animations.

### Key Features

- **User Authentication**: Secure login with Clerk/NextAuth.js (email/password + social login)
- **Study Set Management**: Full CRUD operations - create, edit, delete study sets with dynamic card inputs
- **Flashcard Mode**: Interactive 3D card flipping with smooth animations and keyboard navigation
- **Learn Mode (Quiz)**: Multiple-choice quiz with instant feedback and score tracking
- **User Dashboard**: View your study sets, recent activity, and search for sets
- **Search & Discovery**: Find sets by title, filter by public/private, sort by popularity
- **Responsive Design**: Fully responsive interface (mobile, tablet, desktop)
- **PostgreSQL + Prisma**: Type-safe database access with relational data
- **AI-Powered Development**: Automated code generation, testing, and documentation

## Technology Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe code (strict mode)
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth 3D animations
- **Zustand** - Lightweight state management

### Backend & Database

- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database client
- **PostgreSQL** - Relational database (via Supabase)

### Authentication

- **Clerk** or **NextAuth.js** - User authentication
  - Email/Password authentication
  - Social login (Google, GitHub, etc.)
  - Protected routes with middleware

### Testing

- **Jest** - Unit testing
- **React Testing Library** - Component testing
- **Playwright** - E2E testing (Chromium, Firefox, WebKit)
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
- PostgreSQL database (Supabase account recommended)
- Docker (for containerized deployment)
- Anthropic API key (for AI features)
- Clerk or NextAuth.js account (for authentication)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/tothgabor2002/Cardeeno.git
   cd Cardeeno
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your configuration:

   ```env
   # Database (Supabase PostgreSQL URL)
   DATABASE_URL="postgresql://user:password@host:5432/database"

   # Authentication (Clerk or NextAuth)
   NEXTAUTH_SECRET="your-secret-here"
   NEXTAUTH_URL="http://localhost:3000"

   # Anthropic API (for AI features)
   ANTHROPIC_API_KEY="your-anthropic-key"
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev

   # (Optional) Seed the database with sample data
   npx prisma db seed
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
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
