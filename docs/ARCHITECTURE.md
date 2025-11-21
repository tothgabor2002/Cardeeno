# Cardeeno Architecture

## Overview

Cardeeno is a Quizlet-inspired flashcard and study tool built as a modern full-stack web application. It uses Next.js 15 with App Router, TypeScript, PostgreSQL (via Supabase), Prisma ORM, and Clerk/NextAuth for authentication. The platform enables users to create, share, and study sets of flashcards using various interactive study modes.

## Architecture Principles

1. **Component-Based**: Modular, reusable React components
2. **Type-Safe**: TypeScript throughout the codebase (strict mode)
3. **Database-First**: PostgreSQL with Prisma ORM for type-safe database access
4. **Secure Authentication**: Clerk/NextAuth.js for robust user authentication
5. **Test-Driven**: High test coverage with unit, integration, and E2E tests
6. **AI-Augmented**: Automated code generation and maintenance
7. **Cloud-Native**: Docker containers, CI/CD, scalable deployment

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  (Next.js App Router, React Components, Tailwind CSS,       │
│   Framer Motion for animations)                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP/HTTPS
                     │
┌────────────────────┴────────────────────────────────────────┐
│                   Authentication Layer                       │
│  (Clerk / NextAuth.js - JWT, Social Login, Email/Password)  │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│                      Application Layer                       │
│  (Next.js API Routes, Server Actions, Business Logic)       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Prisma ORM
                     │
┌────────────────────┴────────────────────────────────────────┐
│                       Data Layer                             │
│  (PostgreSQL via Supabase, Redis Cache - future)            │
└──────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App Layout
├── Navigation (with auth status)
├── Page Components
│   ├── HomePage (Landing/Marketing)
│   ├── DashboardPage (Protected)
│   │   ├── StudySetGrid
│   │   ├── RecentSetsSection
│   │   └── SearchBar
│   ├── StudySetPage
│   │   ├── StudySetHeader
│   │   ├── CardList (Term/Definition pairs)
│   │   └── StudyModeSelector
│   ├── FlashcardModePage
│   │   ├── FlashcardViewer (3D flip animation)
│   │   ├── NavigationControls
│   │   └── ProgressIndicator
│   ├── LearnModePage (Quiz)
│   │   ├── QuestionCard
│   │   ├── MultipleChoiceOptions
│   │   └── ScoreTracker
│   ├── CreateSetPage
│   │   ├── SetInfoForm (Title, Description)
│   │   └── CardInputList (Dynamic add/remove)
│   └── EditSetPage
│       ├── SetEditor
│       └── CardManager
└── Footer
```

### State Management

- **Local State**: React `useState` for component-specific state
- **Global State**: Zustand stores for shared application state
- **Server State**: Next.js Server Components + Prisma for data fetching
- **Auth State**: Clerk/NextAuth for user session management

### Key State Stores

1. **StudyModeStore**: Current flashcard, quiz state, navigation, score
2. **UserStore**: User profile, preferences, authentication status
3. **StudySetStore**: Cached study sets, search results, filters
4. **UIStore**: Modal states, loading states, toast notifications

## Backend Architecture

### API Routes

```
/api
├── /health                    # Health check endpoint
├── /auth
│   ├── /login                # (Handled by Clerk/NextAuth)
│   ├── /logout               # (Handled by Clerk/NextAuth)
│   └── /callback             # OAuth callback
├── /sets                     # Study sets management
│   ├── GET                   # List all sets (with filters)
│   ├── POST                  # Create new set (protected)
│   └── /[id]
│       ├── GET               # Get specific set with cards
│       ├── PUT               # Update set (owner only)
│       ├── DELETE            # Delete set (owner only)
│       └── /cards
│           ├── GET           # Get all cards in set
│           ├── POST          # Add card to set
│           ├── PUT /[cardId] # Update specific card
│           └── DELETE /[cardId] # Delete card
├── /search
│   └── GET                   # Search sets by title/tags
├── /user
│   ├── /dashboard            # User's sets + recent activity
│   ├── /profile              # User profile management
│   ├── /sets                 # User's created sets
│   └── /recent               # Recently studied sets
└── /study
    ├── /session
    │   ├── POST              # Start study session
    │   └── PUT /[id]         # Update progress
    └── /progress             # Get study statistics
```

## Data Models

### Database Schema (Prisma)

```prisma
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String?
  avatarUrl   String?  @map("avatar_url")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  sets        Set[]    // User's created sets
  studySessions StudySession[]

  @@map("users")
}

model Set {
  id          String   @id @default(cuid())
  title       String
  description String?
  isPublic    Boolean  @default(false) @map("is_public")
  userId      String   @map("user_id")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  cards       Card[]
  studySessions StudySession[]

  @@map("sets")
  @@index([userId])
  @@index([isPublic])
}

model Card {
  id         String   @id @default(cuid())
  setId      String   @map("set_id")
  term       String
  definition String
  orderIndex Int      @map("order_index")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  set        Set      @relation(fields: [setId], references: [id], onDelete: Cascade)

  @@map("cards")
  @@index([setId])
  @@unique([setId, orderIndex])
}

model StudySession {
  id             String   @id @default(cuid())
  userId         String   @map("user_id")
  setId          String   @map("set_id")
  mode           String   // "flashcard" | "learn"
  score          Int      @default(0)
  totalCards     Int      @map("total_cards")
  completedCards Int      @default(0) @map("completed_cards")
  startedAt      DateTime @default(now()) @map("started_at")
  completedAt    DateTime? @map("completed_at")

  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  set            Set      @relation(fields: [setId], references: [id], onDelete: Cascade)

  @@map("study_sessions")
  @@index([userId])
  @@index([setId])
}
```

### TypeScript Types

```typescript
// User
interface User {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  createdAt: Date
  updatedAt: Date
}

// Study Set
interface Set {
  id: string
  title: string
  description: string | null
  isPublic: boolean
  userId: string
  user?: User
  cards: Card[]
  createdAt: Date
  updatedAt: Date
}

// Flashcard
interface Card {
  id: string
  setId: string
  term: string
  definition: string
  orderIndex: number
  createdAt: Date
  updatedAt: Date
}

// Study Session
interface StudySession {
  id: string
  userId: string
  setId: string
  mode: 'flashcard' | 'learn'
  score: number
  totalCards: number
  completedCards: number
  startedAt: Date
  completedAt: Date | null
}
```

## Study Modes

### 1. Flashcard Mode

Interactive card-flipping interface for memorization:

**Features:**

- Single card display (centered on screen)
- 3D flip animation (Framer Motion)
- Click card to flip between term and definition
- Navigation controls (Previous/Next)
- Progress indicator (e.g., "5 / 20")
- Keyboard shortcuts (Space to flip, Arrow keys to navigate)

**Implementation:**

```typescript
// Card flip using transform: rotateY()
// Front side: Term
// Back side: Definition
```

### 2. Learn Mode (Quiz)

Multiple-choice quiz for active recall:

**Features:**

- Display definition (question)
- 4 multiple-choice options (terms)
- One correct answer, 3 random distractors
- Instant feedback (correct/incorrect)
- Score tracking
- Option to retry incorrect cards
- Final results summary

**Quiz Logic:**

- Randomize card order
- Select 3 random incorrect options from the same set
- Track correct/incorrect attempts
- Calculate final score percentage

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

## Core Features

### 1. User Authentication

- Sign up with email/password
- Social login (Google, GitHub, etc.)
- Protected routes (middleware)
- User profile management

### 2. Dashboard (Home)

- List of user's created sets
- Recent study activity
- Search bar for finding sets
- Filter by tags/categories (future)

### 3. Study Set Management (CRUD)

**Create:**

- Form with title and description fields
- Dynamic card input list (add/remove rows)
- Real-time validation
- Auto-save drafts (future)

**Read:**

- Set view page showing all cards
- Card list with term/definition pairs
- Study mode selector buttons
- Set metadata (author, card count, created date)

**Update:**

- Edit mode for set owners
- Inline card editing
- Bulk operations (import/export CSV)

**Delete:**

- Soft delete with confirmation
- Cascade delete cards

### 4. Study Modes

**Flashcard Mode:**

- Single centered card
- 3D flip animation
- Progress tracking
- Keyboard navigation

**Learn Mode:**

- Multiple-choice quiz
- Random question order
- Score calculation
- Results summary with missed cards

### 5. Search & Discovery

- Full-text search across set titles and descriptions
- Filter by public/private
- Sort by popularity, date, card count

## Future Enhancements

1. **Spaced Repetition System**: SM-2 algorithm for optimal review timing
2. **Real-time Collaboration**: Multiple users editing sets together
3. **Mobile Apps**: React Native applications
4. **AI Features**: Auto-generate definitions, pronunciation help
5. **Social Features**: Friends, leaderboards, shared folders
6. **Advanced Analytics**: Detailed learning insights, progress charts
7. **Content Marketplace**: Browse and clone community sets
8. **Offline Mode**: PWA with offline study capabilities

## Technology Decisions

### Why Next.js 15?

- Server-side rendering for SEO
- App Router for modern routing
- API routes for backend
- React Server Components
- Excellent developer experience
- Built-in optimizations

### Why TypeScript?

- Type safety catches errors early
- Better IDE support
- Self-documenting code
- Easier refactoring
- Pairs perfectly with Prisma

### Why PostgreSQL + Supabase?

- Robust relational database
- ACID compliance
- Complex queries support
- Supabase provides:
  - Managed PostgreSQL
  - Real-time subscriptions (future feature)
  - Built-in authentication option
  - RESTful API auto-generation

### Why Prisma ORM?

- Type-safe database client
- Intuitive schema definition
- Automatic TypeScript types
- Excellent migration system
- Query builder with autocomplete
- Better DX than raw SQL

### Why Clerk/NextAuth.js?

- **Clerk**: Complete auth solution with UI components, social login, webhooks
- **NextAuth.js**: Flexible, self-hosted, supports many providers
- JWT-based sessions
- Social login (Google, GitHub, etc.)
- Email/Password authentication
- Protected routes with middleware

### Why Tailwind CSS?

- Utility-first approach
- Rapid UI development
- Small bundle size
- Customizable design system
- Consistent spacing/colors
- Responsive design made easy

### Why Framer Motion?

- Smooth animations
- 3D transforms for card flips
- Gesture support
- Declarative API
- Excellent performance

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
