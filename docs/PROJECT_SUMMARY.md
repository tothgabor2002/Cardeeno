# Cardeeno - Quizlet-Style Flashcard Learning Platform

## Project Overview

Cardeeno is a modern, full-stack flashcard and study tool application inspired by Quizlet. Built with cutting-edge technologies, it enables users to create, share, and study sets of flashcards using interactive study modes with engaging animations and gamification.

## Technology Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations (3D card flips)
- **Zustand** - Lightweight state management

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database client
- **PostgreSQL** - Relational database (via Supabase)

### Authentication

- **Clerk** or **NextAuth.js** - User authentication
  - Email/Password authentication
  - Social login (Google, GitHub, etc.)
  - Protected routes with middleware

### Testing & Quality

- **Jest** - Unit testing
- **React Testing Library** - Component testing
- **Playwright** - E2E testing
- **Percy** - Visual regression testing
- **ESLint & Prettier** - Code quality

### DevOps & AI

- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **Claude AI** - Automated code generation and testing

## Core Features

### 1. User Authentication ✅

**Sign Up & Login:**

- Email/Password authentication
- Social login (Google, GitHub, etc.)
- Secure JWT-based sessions
- Protected routes (only logged-in users can create/edit)

**User Profile:**

- Profile management
- Avatar upload
- Account settings

### 2. Dashboard (Home) ✅

**User's Study Hub:**

- Grid display of user's created study sets
- "Recent" sets studied section
- Search bar to find sets by title or tags
- Quick access to study modes
- Set creation button

**Features:**

- Real-time search
- Filter by public/private
- Sort options (date, popularity, card count)

### 3. Study Set Management (CRUD) ✅

**Create Set:**

```
Form Fields:
├── Title (required)
├── Description (optional)
└── Cards (dynamic list)
    ├── Term input
    ├── Definition input
    ├── Add card button (+)
    └── Remove card button (×)
```

**Features:**

- Dynamic add/remove card rows
- Real-time validation
- Minimum 2 cards required
- Auto-save drafts (future)

**View Set:**

- Display all cards in list format
- Term/Definition pairs visible
- Set metadata (author, card count, created date)
- Study mode selector buttons
- Edit/Delete buttons (owner only)

**Edit Set:**

- Inline editing of cards
- Update title/description
- Reorder cards (drag & drop - future)
- Bulk import/export CSV (future)

**Delete Set:**

- Confirmation modal
- Cascade delete all cards
- Soft delete option (future)

### 4. Study Modes

#### Flashcard Mode ✅

**Interactive Card Flipping:**

```
┌─────────────────────────┐
│                         │
│      TERM               │ ← Click to flip
│                         │
└─────────────────────────┘
        ↓ (3D rotation)
┌─────────────────────────┐
│                         │
│      DEFINITION         │
│                         │
└─────────────────────────┘
```

**Features:**

- Single centered card (responsive sizing)
- 3D flip animation (Framer Motion)
- Click anywhere on card to flip
- Navigation buttons (Previous/Next)
- Progress indicator ("5 / 20")
- Keyboard shortcuts:
  - **Space**: Flip card
  - **Arrow Right**: Next card
  - **Arrow Left**: Previous card

**Visual Design:**

- Clean white card on colored background
- Smooth transitions
- Progress bar at bottom
- Card counter

#### Learn Mode (Quiz) ✅

**Multiple-Choice Quiz:**

```
Question: What does "Hello" mean in German?

○ A. Auf Wiedersehen
● B. Hallo          ← Correct answer
○ C. Danke
○ D. Bitte

[Submit Answer]
```

**Features:**

- Display definition (question text)
- 4 multiple-choice options
- 1 correct answer + 3 random distractors
- Instant feedback (green/red colors)
- Score tracking throughout quiz
- Option to retry incorrect cards
- Final results summary

**Quiz Logic:**

- Randomize card order
- Select 3 incorrect terms from same set
- Track correct/incorrect attempts
- Calculate final score percentage
- Show missed cards at end

### 5. Search & Discovery ✅

**Search Bar:**

- Full-text search across titles and descriptions
- Real-time search results
- Debounced input (300ms)

**Filters:**

- Public/Private toggle
- Sort by: Recent, Popular, Card Count
- Filter by tags (future)

## Database Schema

### Tables

```
users
├── id (PK)
├── email (unique)
├── name
├── avatar_url
├── created_at
└── updated_at

sets
├── id (PK)
├── title
├── description
├── is_public
├── user_id (FK → users)
├── created_at
└── updated_at

cards
├── id (PK)
├── set_id (FK → sets)
├── term
├── definition
├── order_index
├── created_at
└── updated_at

study_sessions
├── id (PK)
├── user_id (FK → users)
├── set_id (FK → sets)
├── mode ("flashcard" | "learn")
├── score
├── total_cards
├── completed_cards
├── started_at
└── completed_at
```

## API Endpoints

### Authentication

```
POST   /api/auth/login       # Login (Clerk/NextAuth)
POST   /api/auth/logout      # Logout
GET    /api/auth/callback    # OAuth callback
```

### Study Sets

```
GET    /api/sets             # List all sets (with filters)
POST   /api/sets             # Create new set (protected)
GET    /api/sets/[id]        # Get specific set with cards
PUT    /api/sets/[id]        # Update set (owner only)
DELETE /api/sets/[id]        # Delete set (owner only)
```

### Cards

```
GET    /api/sets/[id]/cards           # Get all cards in set
POST   /api/sets/[id]/cards           # Add card to set
PUT    /api/sets/[id]/cards/[cardId]  # Update card
DELETE /api/sets/[id]/cards/[cardId]  # Delete card
```

### User & Dashboard

```
GET    /api/user/dashboard    # User's sets + recent activity
GET    /api/user/profile      # User profile
GET    /api/user/sets         # User's created sets
GET    /api/user/recent       # Recently studied sets
```

### Study Sessions

```
POST   /api/study/session     # Start study session
PUT    /api/study/session/[id] # Update progress
GET    /api/study/progress    # Get study statistics
```

### Search

```
GET    /api/search?q=term     # Search sets by title/tags
```

## Project Structure

```
cardeeno/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Auth routes (layout group)
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/             # Protected routes
│   │   ├── dashboard/           # User dashboard
│   │   ├── sets/
│   │   │   ├── [id]/           # View set
│   │   │   ├── [id]/edit/      # Edit set
│   │   │   └── new/            # Create set
│   │   └── study/
│   │       ├── flashcards/[id]/ # Flashcard mode
│   │       └── learn/[id]/     # Learn/Quiz mode
│   ├── api/                     # API routes
│   │   ├── auth/
│   │   ├── sets/
│   │   ├── search/
│   │   └── user/
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
├── components/                   # React components
│   ├── ui/                      # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   ├── auth/                    # Auth components
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── dashboard/               # Dashboard components
│   │   ├── SetGrid.tsx
│   │   ├── SetCard.tsx
│   │   ├── SearchBar.tsx
│   │   └── RecentSets.tsx
│   ├── set/                     # Set management
│   │   ├── SetForm.tsx
│   │   ├── CardInput.tsx
│   │   └── CardList.tsx
│   └── study/                   # Study mode components
│       ├── Flashcard.tsx        # 3D flip card
│       ├── QuizQuestion.tsx
│       ├── ProgressBar.tsx
│       └── ScoreDisplay.tsx
├── lib/                         # Utilities
│   ├── prisma.ts               # Prisma client
│   ├── auth.ts                 # Auth utilities
│   ├── utils.ts                # Helper functions
│   └── constants.ts            # App constants
├── prisma/                      # Database
│   ├── schema.prisma           # Database schema
│   ├── migrations/             # Migration files
│   └── seed.ts                 # Seed data
├── stores/                      # Zustand stores
│   ├── studyModeStore.ts
│   ├── userStore.ts
│   └── setStore.ts
├── tests/                       # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── public/                      # Static assets
```

## Design Requirements

### Visual Design (Quizlet-inspired)

- **Color Scheme**: White and blue aesthetic
  - Primary: Blue (#4255FF)
  - Background: Light gray (#F6F7FB)
  - Cards: White (#FFFFFF)
  - Text: Dark gray (#2E3856)

- **Typography**: Clean sans-serif
  - Inter or Roboto font family
  - Font sizes: 14px (body), 16px (headings), 24px (titles)

- **Layout**:
  - Fully responsive (mobile-first)
  - Max-width: 1200px (desktop)
  - Padding: 16px (mobile), 24px (tablet), 32px (desktop)

### Component Design Patterns

**Card Component:**

```tsx
<Card className="shadow-md hover:shadow-lg transition-shadow">
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
  <CardFooter>Actions</CardFooter>
</Card>
```

**Flashcard 3D Flip:**

```tsx
<motion.div
  animate={{ rotateY: isFlipped ? 180 : 0 }}
  transition={{ duration: 0.6 }}
  style={{ transformStyle: 'preserve-3d' }}
>
  <Front>Term</Front>
  <Back>Definition</Back>
</motion.div>
```

## Implementation Phases

### Phase 1: Foundation (Week 1)

- [x] Project setup with Next.js 15
- [ ] Prisma schema definition
- [ ] Supabase PostgreSQL setup
- [ ] Authentication (Clerk/NextAuth)
- [ ] Basic UI components (Button, Card, Input)

### Phase 2: Core Features (Week 2)

- [ ] User dashboard
- [ ] Study set CRUD operations
- [ ] Card input with dynamic add/remove
- [ ] Search functionality
- [ ] Protected routes

### Phase 3: Study Modes (Week 3)

- [ ] Flashcard mode with 3D flip
- [ ] Navigation and progress tracking
- [ ] Learn/Quiz mode
- [ ] Multiple-choice logic
- [ ] Score calculation

### Phase 4: Polish & Testing (Week 4)

- [ ] Responsive design refinement
- [ ] E2E tests for critical flows
- [ ] Performance optimization
- [ ] Visual regression tests
- [ ] Deployment

## Key Deliverables

### 1. Database Schema (Prisma)

✅ Defined in `prisma/schema.prisma`

### 2. Flashcard Study Mode

- 3D flip animation component
- Navigation controls
- Progress indicator
- Keyboard shortcuts

### 3. Learn Mode (Quiz)

- Quiz interface
- Multiple-choice component
- Score tracking
- Results summary

### 4. Study Set CRUD

- Create form with dynamic cards
- View set with all cards
- Edit mode
- Delete confirmation

### 5. User Dashboard

- Study set grid
- Recent sets section
- Search bar
- Quick actions

## Success Metrics

### Performance

- Page load time: < 2 seconds
- Time to Interactive: < 3 seconds
- Lighthouse score: > 90

### User Experience

- Mobile responsive (100%)
- Accessibility (WCAG 2.1 AA)
- Smooth animations (60 FPS)

### Code Quality

- Test coverage: > 70%
- TypeScript strict mode
- ESLint: 0 errors
- Prettier formatted

## Future Enhancements

1. **Spaced Repetition**: SM-2 algorithm for optimal learning
2. **Collaborative Sets**: Real-time co-editing
3. **Import/Export**: CSV, Quizlet format
4. **AI Features**: Auto-generate definitions, smart hints
5. **Mobile App**: React Native version
6. **Gamification**: Streaks, achievements, leaderboards
7. **Social Features**: Friends, shared folders, comments
8. **Offline Mode**: PWA with offline study
9. **Voice**: Text-to-speech for pronunciation
10. **Analytics**: Detailed learning insights

## Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run start            # Start production server

# Database
npx prisma generate      # Generate Prisma client
npx prisma migrate dev   # Run migrations
npx prisma studio        # Open Prisma Studio (DB GUI)
npx prisma db seed       # Seed database

# Testing
npm run test             # Unit tests (watch)
npm run test:ci          # Unit tests with coverage
npm run test:e2e         # E2E tests
npm run test:visual      # Visual regression

# Code Quality
npm run lint             # Check linting
npm run lint:fix         # Fix linting issues
npm run type-check       # TypeScript validation
npm run format           # Format code

# AI Tools
npm run ai:generate      # Generate components
npm run ai:test          # Generate tests
npm run ai:fix-tests     # Auto-fix failing tests
```

## Resources & Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Clerk Docs](https://clerk.com/docs)
- [NextAuth Docs](https://next-auth.js.org)
- [Framer Motion](https://www.framer.com/motion)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)

---

**Status**: Phase 1 - Foundation ✅ (Setup complete)
**Next**: Phase 2 - Core Features (Dashboard & Set Management)

**Last Updated**: 2024-11-21
