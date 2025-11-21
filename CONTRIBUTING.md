# Contributing to Cardeeno

Thank you for your interest in contributing to Cardeeno! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/cardeeno.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install`
5. Set up environment: `cp .env.example .env.local`

## Development Workflow

### Making Changes

1. Make your changes in your feature branch
2. Write or update tests for your changes
3. Ensure all tests pass: `npm run test:ci`
4. Check code quality: `npm run lint && npm run type-check`
5. Format your code: `npm run format`

### Using AI Development Tools

We encourage using the AI-powered development tools:

- Generate components: `npm run ai:generate -- --type component --name YourComponent --description "description"`
- Generate tests: `npm run ai:test -- --file path/to/file.tsx`
- Generate documentation: `npm run ai:docs`

### Commit Messages

Follow conventional commit format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example: `feat: add word set filtering by difficulty`

### Pull Request Process

1. Update documentation if needed
2. Add tests for new functionality
3. Ensure all CI checks pass
4. Request review from maintainers
5. Address review feedback
6. Squash commits if requested

## Testing Guidelines

- Write unit tests for all new functions and components
- Add integration tests for feature workflows
- Include E2E tests for critical user paths
- Aim for >70% code coverage

## Style Guide

- Use TypeScript for all new code
- Follow the ESLint configuration
- Use functional components with hooks
- Keep components small and focused
- Write meaningful variable names
- Add JSDoc comments for public APIs

## Questions?

Feel free to open an issue for any questions or concerns.

Thank you for contributing to Cardeeno!
