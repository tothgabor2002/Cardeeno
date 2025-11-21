# MCP Servers Configuration

Model Context Protocol (MCP) servers extend Claude Code with powerful integrations.

## Configured MCP Servers

### 1. **filesystem** ✅ Active

Access to project files and directories.

**Capabilities**:

- Read files
- Write files
- Search in files
- List directories
- File operations

**No setup required** - Works out of the box.

### 2. **github**

GitHub integration for repository management.

**Capabilities**:

- Create/manage issues
- Create/manage pull requests
- Search code
- Manage repositories
- Read/write files in repos

**Setup Required**:

1. Create personal access token: https://github.com/settings/tokens
2. Select scopes: `repo`, `workflow`, `read:org`
3. Add to `.env.local`:
   ```env
   GITHUB_TOKEN=ghp_your_token_here
   ```
4. Restart Claude Code

**Usage Examples**:

```
"Create a GitHub issue titled 'Bug: Cards not animating'"
"Search for all TODO comments in the repository"
"List all open pull requests"
```

### 3. **memory**

Persistent context and memory across sessions.

**Capabilities**:

- Remember information between sessions
- Store project-specific knowledge
- Maintain conversation context
- Learn project patterns

**No setup required** - Works automatically.

**Usage Examples**:

```
"Remember that we use Zustand for state management"
"What did we discuss about the spaced repetition algorithm?"
```

### 4. **postgres**

PostgreSQL database access and operations.

**Capabilities**:

- Run SQL queries
- Manage database schema
- View table structure
- Execute migrations

**Setup Required**:

1. Set up PostgreSQL database
2. Add to `.env.local`:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/cardeeno
   ```
3. Restart Claude Code

**Status**: Ready to activate when you add a database.

### 5. **context7** ⭐ NEW

Access to latest documentation from various sources.

**Capabilities**:

- Search React documentation
- Access Next.js docs
- TypeScript reference
- Tailwind CSS docs
- Node.js documentation
- And many more...

**No setup required** - Works out of the box.

**Usage Examples**:

```
"What's the latest way to use Server Actions in Next.js 15?"
"Show me TypeScript 5.7 new features"
"How do I use Tailwind CSS container queries?"
"What are React 19 new hooks?"
```

**Supported Documentation**:

- React (latest version)
- Next.js
- TypeScript
- Tailwind CSS
- Node.js
- Express
- Prisma
- And more...

## How to Use MCP Servers

### In Conversation

Simply ask questions naturally:

```
"Search the codebase for authentication logic"
→ Uses filesystem MCP

"Create an issue for the bug we just found"
→ Uses github MCP

"What did we decide about the database schema?"
→ Uses memory MCP

"How do I use the new Next.js 15 App Router?"
→ Uses context7 MCP
```

### Checking MCP Status

In Claude Code, you can check which MCP servers are active:

```
List available MCP servers
```

### Activating MCP Servers

Most MCP servers work automatically. For those requiring setup:

1. **GitHub MCP**:
   - Add `GITHUB_TOKEN` to `.env.local`
   - Restart Claude Code

2. **Postgres MCP**:
   - Add `DATABASE_URL` to `.env.local`
   - Restart Claude Code

## MCP Server Benefits

### 1. **Faster Development**

- Instant access to documentation
- Quick file operations
- Automated GitHub workflows

### 2. **Better Context**

- Memory across sessions
- Project-specific knowledge
- Pattern recognition

### 3. **Integration Power**

- Direct GitHub access
- Database operations
- File system control

### 4. **Up-to-Date Information**

- Latest documentation (context7)
- Current best practices
- New framework features

## Common Use Cases

### Use Case 1: Quick Documentation Lookup

Instead of googling:

```
"How do I implement Server Components in Next.js 15?"
```

Context7 provides the latest, accurate answer immediately.

### Use Case 2: GitHub Workflow

Instead of switching to browser:

```
"Create an issue for tracking the word matching game feature"
"List all open PRs"
"Create a PR for the authentication branch"
```

### Use Case 3: Code Search

Instead of manual searching:

```
"Find all components that use useState"
"Search for database queries in the codebase"
```

### Use Case 4: Memory & Context

Instead of re-explaining:

```
"What was the architecture we decided on?"
"Remember: we're using spaced repetition with 3 levels"
```

## Troubleshooting

### GitHub MCP Not Working

**Symptom**: GitHub commands don't work

**Solution**:

1. Check `.env.local` has `GITHUB_TOKEN`
2. Verify token has correct scopes
3. Check token hasn't expired
4. Restart Claude Code

### Context7 Not Providing Answers

**Symptom**: No documentation results

**Solution**:

1. Check internet connection
2. Restart Claude Code
3. Try rephrasing the question

### Memory Not Persisting

**Symptom**: Claude doesn't remember previous sessions

**Solution**:

1. Explicitly tell Claude to remember: "Remember this..."
2. Restart Claude Code
3. Check MCP server is running

## Adding More MCP Servers

To add additional MCP servers, edit `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "your-server-name": {
      "command": "npx",
      "args": ["-y", "package-name"],
      "description": "Description of what it does"
    }
  }
}
```

### Popular MCP Servers

- **@modelcontextprotocol/server-brave-search** - Web search
- **@modelcontextprotocol/server-slack** - Slack integration
- **@modelcontextprotocol/server-sqlite** - SQLite database
- **@modelcontextprotocol/server-puppeteer** - Browser automation

## Best Practices

1. **Use Specific Questions**
   - ❌ "How do I use React?"
   - ✅ "How do I use React Server Components in Next.js 15?"

2. **Leverage Context**
   - Tell Claude to remember important decisions
   - Reference previous discussions

3. **Combine MCP Servers**
   - Search docs (context7) → Write code (filesystem) → Create PR (github)

4. **Keep Tokens Updated**
   - GitHub tokens expire
   - Rotate regularly for security

## Current Configuration

Your project has **5 MCP servers** configured:

| Server     | Status            | Setup Required      |
| ---------- | ----------------- | ------------------- |
| filesystem | ✅ Active         | No                  |
| github     | ⚠️ Requires token | Yes                 |
| memory     | ✅ Active         | No                  |
| postgres   | ⏸️ Ready          | Yes (when DB added) |
| context7   | ✅ Active         | No                  |

**3 servers active** and ready to use now!

## Quick Start

Try these commands in Claude Code:

1. **Documentation lookup**:

   ```
   "What are the new features in React 19?"
   ```

2. **File search**:

   ```
   "Find all components in the project"
   ```

3. **Remember context**:

   ```
   "Remember: We're using spaced repetition with short/medium/long term levels"
   ```

4. **GitHub (after adding token)**:
   ```
   "Create an issue for implementing the game board"
   ```

---

**Your MCP servers are configured and ready!** Start using them to accelerate development. 🚀
