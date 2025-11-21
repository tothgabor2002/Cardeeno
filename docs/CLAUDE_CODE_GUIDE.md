# Claude Code Development Guide

Complete guide to using Claude Code effectively with Cardeeno project.

## 1. Using Slash Commands

### What Are Slash Commands?

Slash commands are shortcuts stored in `.claude/commands/` that trigger specific workflows. They're markdown files that tell Claude what to do.

### Available Slash Commands

Your project has 6 built-in commands:

| Command          | Purpose                  | Usage                         |
| ---------------- | ------------------------ | ----------------------------- |
| `/dev`           | Start development server | Type `/dev` in chat           |
| `/test-all`      | Run all tests            | Type `/test-all` in chat      |
| `/gen-component` | Generate a component     | Type `/gen-component` in chat |
| `/gen-tests`     | Generate tests           | Type `/gen-tests` in chat     |
| `/deploy`        | Deploy application       | Type `/deploy` in chat        |
| `/fix-errors`    | Auto-fix errors          | Type `/fix-errors` in chat    |

### How to Use

Simply type the command in your Claude Code chat:

```
/dev
```

Claude will:

1. Read the command file (`.claude/commands/dev.md`)
2. Execute the instructions
3. Show you the results

### Example Workflow

```
You: /dev

Claude: Starting the development server...
[Executes: npm run dev]
Server started at http://localhost:3000

You: /gen-component

Claude: I'll help you generate a component. What would you like to create?
```

### Creating Custom Commands

Create a new file in `.claude/commands/`:

**Example: `.claude/commands/quick-test.md`**

```markdown
---
description: Run quick unit tests only
---

Run the unit tests in watch mode:

\`\`\`bash
npm run test
\`\`\`

This will run tests and watch for changes.
```

Then use it: `/quick-test`

---

## 2. Opening the Application in Browser

### Development Server

The development server is **currently running** at:

- **Local**: http://localhost:3000
- **Network**: http://192.168.6.33:3000

### How to Access

#### Option 1: Open Manually

1. Open your browser
2. Go to: **http://localhost:3000**

#### Option 2: Use Command

```bash
# Windows
start http://localhost:3000

# Mac
open http://localhost:3000

# Linux
xdg-open http://localhost:3000
```

#### Option 3: Use Slash Command

```
/dev
```

Then open http://localhost:3000 in your browser.

### Server Commands

```bash
# Start server
npm run dev

# Stop server
# Press Ctrl+C in terminal

# Build for production
npm run build

# Start production server
npm run start
```

### Available Endpoints

Once running, you can access:

| Endpoint                         | Purpose                  |
| -------------------------------- | ------------------------ |
| http://localhost:3000            | Home page                |
| http://localhost:3000/api/health | Health check API         |
| http://localhost:3000/game       | Game page (when created) |
| http://localhost:3000/wordsets   | Word sets (when created) |

### Hot Reload

The development server has **hot reload** enabled:

- Edit any file in `app/` or `components/`
- Save the file
- Browser **automatically refreshes** with changes
- No need to restart the server!

### Troubleshooting

**Port already in use?**

```bash
# Find process on port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm run dev
```

---

## 3. Using Skills and Agents for Development

### Overview

Claude Code has three powerful features for efficient development:

1. **MCP Servers** - External tool integrations
2. **Skills** - Reusable workflows (coming soon)
3. **Task Agent** - Autonomous task completion

### MCP Servers (Currently Available)

MCP servers are already configured in `.claude/mcp.json`:

#### Available MCP Servers

1. **filesystem** - File operations
   - Read/write files
   - Search in files
   - File management

2. **github** - GitHub integration
   - Create issues/PRs
   - Manage repositories
   - Search code
   - _Requires GITHUB_TOKEN in .env.local_

3. **memory** - Persistent context
   - Remember information across sessions
   - Store project knowledge
   - Context awareness

4. **postgres** - Database operations
   - When you add a database
   - Run queries
   - Manage schema

#### Activating MCP Servers

To enable GitHub MCP:

1. Create token: https://github.com/settings/tokens
2. Add to `.env.local`:
   ```env
   GITHUB_TOKEN=ghp_your_token_here
   ```
3. Restart Claude Code

#### Using MCP Servers

Once activated, you can use natural language:

```
You: Create a GitHub issue titled "Add user authentication"

Claude: [Uses GitHub MCP to create issue]
Issue created: https://github.com/tothgabor2002/Cardeeno/issues/1
```

```
You: Search for all TODO comments in the codebase

Claude: [Uses filesystem MCP to search]
Found 3 TODOs:
- app/page.tsx:15 - TODO: Add loading state
- components/WordCard.tsx:42 - TODO: Implement flip animation
```

### Skills (Custom Workflows)

Skills are reusable workflows that can be invoked. You can create them in `.claude/skills/`.

#### Creating a Skill

**Example: `.claude/skills/component-workflow.md`**

```markdown
---
name: component-workflow
description: Complete workflow for creating a new component
---

When creating a new component, follow these steps:

1. Generate the component using AI
2. Generate tests for the component
3. Run tests to verify
4. Format the code
5. Create a Git commit

Always follow this sequence for consistency.
```

#### Using Skills in Conversation

```
You: I need to create a WordCard component using the component-workflow

Claude: I'll follow the component-workflow skill:

Step 1: Generating component...
[Runs: npm run ai:generate -- --type component --name WordCard]

Step 2: Generating tests...
[Runs: npm run ai:test -- --file components/WordCard.tsx]

Step 3: Running tests...
[Runs: npm run test:ci]

Step 4: Formatting...
[Runs: npm run format]

Step 5: Committing...
[Runs: git add . && git commit -m "feat: add WordCard component"]

✓ Component created successfully!
```

### Task Agent (Built-in)

The Task agent can autonomously complete complex, multi-step tasks.

#### When to Use Task Agent

Use for tasks that require:

- Multiple steps
- Research and exploration
- File searches across large codebases
- Complex decision-making

#### Example: Using Task Agent

```
You: Create a complete word matching game with all necessary components, tests, and documentation

Claude: I'll use the Task agent to handle this complex task...

[Agent works autonomously]
[Creates components, tests, documentation]
[Runs tests and fixes issues]
[Creates Git commits]

✓ Complete! Created:
- WordCard component with tests
- GameBoard component with tests
- MatchAnimation component
- API routes for game logic
- E2E tests for game flow
- Updated documentation
```

### Efficient Development Patterns

#### Pattern 1: AI-Generated Components

```
You: Generate a ProgressBar component that shows learning progress with three color levels

Claude: [Uses ai-generate.js script]
✓ Created: components/ProgressBar.tsx
✓ Created: tests/unit/ProgressBar.test.tsx
```

#### Pattern 2: Test-Driven Development with AI

```
You: /gen-tests -- --file components/ProgressBar.tsx

Claude: [Generates comprehensive tests]
✓ Created: tests/unit/ProgressBar.test.tsx
- Tests all three color levels
- Tests percentage calculations
- Tests accessibility
- Coverage: 98%
```

#### Pattern 3: Automated Test Fixing

```
You: /fix-errors

Claude: [Runs tests, detects failures, uses AI to fix]
Found 3 failing tests
✓ Fixed: ProgressBar animation timing
✓ Fixed: WordCard flip state
✓ Fixed: GameBoard layout test
All tests passing!
```

#### Pattern 4: Multi-File Changes

```
You: Add authentication to the entire application

Claude: I'll use the Task agent for this complex change...

[Agent autonomously:]
1. Creates auth components
2. Adds API routes
3. Updates existing pages
4. Generates tests
5. Updates documentation
6. Creates migration guide

✓ Complete! 23 files changed.
```

### Best Practices

#### 1. Use Specific Commands

❌ Less efficient:

```
You: Can you start the server?
```

✅ More efficient:

```
You: /dev
```

#### 2. Leverage AI Scripts

Instead of writing code manually:

```bash
# Generate component
npm run ai:generate -- --type component --name WordCard --description "A card component for word pairs"

# Generate tests
npm run ai:test -- --file components/WordCard.tsx

# Generate documentation
npm run ai:docs
```

#### 3. Use Task Agent for Complex Work

For multi-file, multi-step tasks:

```
You: Implement the complete spaced repetition system with database integration, scheduling logic, and progress tracking

Claude: [Uses Task agent]
[Handles complexity autonomously]
```

#### 4. Combine MCP + Scripts + Agent

```
You: Find all components that need tests, generate the tests, run them, and create a PR

Claude:
1. [Uses filesystem MCP to find components]
2. [Uses ai-test script for each component]
3. [Runs test suite]
4. [Uses GitHub MCP to create PR]

✓ Created PR #5 with 12 new test files
```

### Development Workflow Example

**Goal**: Add a new feature (Word Set Management)

```
You: I need to implement word set management - create, edit, delete word sets

Claude: I'll break this into tasks and use the appropriate tools:

[Uses Task agent to:]
1. Generate API routes for CRUD operations
   [Uses ai-generate.js]
   ✓ app/api/wordsets/route.ts
   ✓ app/api/wordsets/[id]/route.ts

2. Generate frontend components
   [Uses ai-generate.js]
   ✓ components/WordSetList.tsx
   ✓ components/WordSetForm.tsx

3. Generate tests for all
   [Uses ai-test-generator.js]
   ✓ 6 test files created

4. Run tests
   [Uses npm run test:ci]
   ✓ All tests passing

5. Generate documentation
   [Uses ai-docs-generator.js]
   ✓ Updated docs/API.md

6. Create commit
   [Uses git commands]
   ✓ Committed: feat: implement word set management

Total time: ~5 minutes (vs hours manually)
```

### Measuring Efficiency

**Traditional Development:**

- Write component: 30 min
- Write tests: 20 min
- Debug: 15 min
- Documentation: 15 min
- **Total: 80 minutes**

**With Claude Code + AI Tools:**

- Generate component: 1 min
- Generate tests: 1 min
- Auto-fix issues: 2 min
- Generate docs: 1 min
- **Total: 5 minutes**

**16x faster!** ⚡

---

## Quick Reference

### Slash Commands

```
/dev              # Start development
/test-all         # Run all tests
/gen-component    # Generate component
/gen-tests        # Generate tests
/deploy           # Deploy app
/fix-errors       # Auto-fix errors
```

### AI Scripts

```bash
npm run ai:generate     # Generate code
npm run ai:test         # Generate tests
npm run ai:fix-tests    # Fix failing tests
npm run ai:docs         # Generate docs
```

### Access Application

```
http://localhost:3000
```

### Enable MCP Servers

```env
# .env.local
GITHUB_TOKEN=ghp_your_token
ANTHROPIC_API_KEY=sk-ant-your-key
```

### Task Agent Trigger Phrases

```
"Implement [complex feature]..."
"Create complete [multi-component feature]..."
"Find and fix all [issues]..."
```

---

## Next Steps

1. ✅ Start development server: `/dev`
2. ✅ Open http://localhost:3000 in browser
3. ✅ Enable GitHub MCP (add GITHUB_TOKEN)
4. ✅ Generate your first component
5. ✅ Use Task agent for complex features

**Happy coding with AI superpowers!** 🚀
