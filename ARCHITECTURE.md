# Cardeeno Architecture

## Overview

Cardeeno is built as a modern web application using Next.js 15 with the App Router, TypeScript, and a comprehensive testing and deployment infrastructure.

## Architecture Principles

1. **Component-Based**: Modular, reusable React components
2. **Type-Safe**: TypeScript throughout the codebase
3. **Test-Driven**: High test coverage with unit, integration, and E2E tests
4. **AI-Augmented**: Automated code generation and maintenance
5. **Cloud-Native**: Docker containers, CI/CD, scalable deployment

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  (Next.js App Router, React Components, Tailwind CSS)       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP/WebSocket
                     │
┌────────────────────┴────────────────────────────────────────┐
│                      Application Layer                       │
│  (Next.js API Routes, Server Actions, Business Logic)       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Database Queries
                     │
┌────────────────────┴────────────────────────────────────────┐
│                       Data Layer                             │
│  (PostgreSQL, Redis Cache, File Storage)                    │
└──────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App Layout
├── Navigation
├── Page Components
│   ├── HomePage
│   ├── GamePage
│   │   ├── CardGrid
│   │   │   ├── WordCard
│   │   │   └── MatchAnimation
│   │   └── ProgressBar
│   └── WordSetsPage
│       ├── WordSetList
│       └── WordSetCard
└── Footer
```

### State Management

- **Local State**: React `useState` for component-specific state
- **Global State**: Zustand stores for shared application state
- **Server State**: Next.js Server Components for data fetching

### Key State Stores

1. **GameStore**: Current game state, selected cards, score
2. **ProgressStore**: User learning progress, repetition levels
3. **WordSetStore**: Available word sets, user's custom sets

## Backend Architecture

### API Routes

```
/api
├── /health              # Health check endpoint
├── /wordsets
│   ├── GET             # List word sets
│   ├── POST            # Create word set
│   └── /[id]
│       ├── GET         # Get specific word set
│       ├── PUT         # Update word set
│       └── DELETE      # Delete word set
├── /game
│   ├── /start          # Initialize game session
│   ├── /match          # Submit card match
│   └── /progress       # Update learning progress
└── /user
    ├── /profile        # User profile
    └── /stats          # Learning statistics
```

## Data Models

### WordSet
```typescript
{
  id: string
  name: string
  description: string
  language: string
  targetLanguage: string
  wordPairs: WordPair[]
  isPublic: boolean
  createdBy: string
  createdAt: Date
}
```

### WordPair
```typescript
{
  id: string
  word: string
  translation: string
  repetitionLevel: 'short' | 'medium' | 'long'
  lastReviewed: Date
  correctCount: number
  incorrectCount: number
}
```

### UserProgress
```typescript
{
  userId: string
  wordSetId: string
  wordPairId: string
  repetitionLevel: 'short' | 'medium' | 'long'
  nextReviewDate: Date
  easeFactor: number
}
```

## Spaced Repetition Algorithm

Based on the SM-2 algorithm with modifications:

1. **Initial Learning** (Short-term):
   - Review interval: 1 day
   - Successful matches advance to medium-term

2. **Consolidation** (Medium-term):
   - Review interval: 3-7 days
   - Successful matches advance to long-term

3. **Retention** (Long-term):
   - Review interval: 14+ days
   - Interval increases with each successful review

## AI Development Integration

### Claude Code Integration

- **MCP Servers**: Filesystem, GitHub, Memory, Postgres
- **Slash Commands**: Common development tasks
- **Skills**: Custom workflows (coming soon)

### AI-Powered Scripts

1. **ai-generate.js**: Generates components, pages, API routes
2. **ai-test-generator.js**: Creates comprehensive tests
3. **ai-fix-tests.js**: Automatically fixes failing tests
4. **ai-docs-generator.js**: Generates API documentation

### CI/CD with AI

- Automated code review on PRs
- Test failure auto-fixing
- Documentation generation
- Code quality analysis

## Testing Strategy

### Unit Tests (Jest)
- Component logic
- Utility functions
- State management

### Integration Tests (Jest)
- API routes
- Database operations
- Multi-component interactions

### E2E Tests (Playwright)
- Critical user flows
- Cross-browser compatibility
- Mobile responsiveness

### Visual Regression (Percy)
- UI consistency
- Responsive design
- Animation accuracy

## Deployment Architecture

### Docker Container

```
┌─────────────────────────────────────┐
│         Nginx Reverse Proxy         │
│         (Load Balancer)             │
└──────────┬──────────┬───────────────┘
           │          │
    ┌──────┴───┐  ┌───┴──────┐
    │ App Pod 1│  │ App Pod 2│
    │ (Next.js)│  │ (Next.js)│
    └──────┬───┘  └───┬──────┘
           │          │
    ┌──────┴──────────┴───────┐
    │    PostgreSQL Database   │
    └──────────────────────────┘
```

### Scaling Strategy

1. **Horizontal Scaling**: Multiple container instances
2. **Database Scaling**: Read replicas for queries
3. **Caching**: Redis for session and frequently accessed data
4. **CDN**: Static assets served via CDN

## Security Considerations

1. **Authentication**: JWT-based authentication (future)
2. **Input Validation**: Zod schemas for API inputs
3. **XSS Protection**: React's built-in escaping
4. **CSRF Protection**: Next.js built-in protection
5. **Rate Limiting**: API route rate limiting
6. **Environment Variables**: Secure secrets management

## Performance Optimization

1. **Code Splitting**: Automatic with Next.js
2. **Image Optimization**: Next.js Image component
3. **Lazy Loading**: Components and routes
4. **Caching**: Aggressive caching strategy
5. **Bundle Analysis**: Regular bundle size monitoring

## Monitoring and Observability

1. **Logging**: Structured logging with Winston (future)
2. **Error Tracking**: Sentry integration (future)
3. **Analytics**: User behavior tracking (future)
4. **Performance**: Web Vitals monitoring
5. **Health Checks**: Regular health check endpoints

## Future Enhancements

1. **Real-time Multiplayer**: WebSocket-based multiplayer mode
2. **Mobile Apps**: React Native applications
3. **AI Pronunciation**: Speech recognition for pronunciation practice
4. **Social Features**: Friends, leaderboards, challenges
5. **Advanced Analytics**: Detailed learning insights
6. **Content Marketplace**: User-created content marketplace

## Technology Decisions

### Why Next.js?
- Server-side rendering for SEO
- API routes for backend
- Excellent developer experience
- Built-in optimizations

### Why TypeScript?
- Type safety catches errors early
- Better IDE support
- Self-documenting code
- Easier refactoring

### Why Docker?
- Consistent environments
- Easy deployment
- Scalability
- Cloud-agnostic

### Why Claude AI Integration?
- Accelerated development
- Consistent code quality
- Automated testing
- Reduced maintenance burden

## Development Best Practices

1. **Component Design**: Small, focused, reusable
2. **Type Safety**: Strict TypeScript configuration
3. **Testing**: High coverage, meaningful tests
4. **Code Review**: AI + human review process
5. **Documentation**: Keep docs up-to-date
6. **Performance**: Regular performance audits
7. **Accessibility**: WCAG 2.1 AA compliance

## Troubleshooting Guide

### Common Issues

1. **Build Failures**: Check TypeScript errors first
2. **Test Failures**: Use AI auto-fix or debug manually
3. **Docker Issues**: Ensure Docker daemon is running
4. **Dependency Issues**: Clear node_modules and reinstall

### Debug Commands

```bash
npm run type-check    # TypeScript errors
npm run lint          # Linting errors
npm run test:ci       # Run all tests
npm run build         # Production build
```

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Playwright Documentation](https://playwright.dev)
- [Claude AI Documentation](https://docs.anthropic.com)
