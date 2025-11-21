#!/usr/bin/env node

/**
 * AI Code Generator
 *
 * Automatically generates components, pages, and API routes using Claude AI
 *
 * Usage:
 *   npm run ai:generate -- --type component --name Button --description "A reusable button component"
 *   npm run ai:generate -- --type page --name dashboard --description "User dashboard page"
 *   npm run ai:generate -- --type api --name wordsets --description "API for managing word sets"
 */

const Anthropic = require('@anthropic-ai/sdk')
const fs = require('fs').promises
const path = require('path')

async function generateCode(type, name, description) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  const prompts = {
    component: `Generate a React component named ${name} with TypeScript and Tailwind CSS.
Description: ${description}

Requirements:
- Use 'use client' directive if interactive
- TypeScript with proper types
- Tailwind CSS for styling
- Include JSDoc comments
- Follow Next.js 15 best practices
- Make it production-ready and accessible

Output only the code, no explanations.`,

    page: `Generate a Next.js page component for ${name}.
Description: ${description}

Requirements:
- Next.js 15 App Router format
- TypeScript with proper types
- Tailwind CSS styling
- SEO metadata
- Responsive design
- Include loading and error states

Output only the code, no explanations.`,

    api: `Generate a Next.js API route for ${name}.
Description: ${description}

Requirements:
- Next.js 15 Route Handlers (app/api)
- TypeScript with proper types
- Input validation with Zod
- Error handling
- Proper HTTP status codes
- RESTful design

Output only the code, no explanations.`,
  }

  console.log(`Generating ${type}: ${name}...`)

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: prompts[type],
      },
    ],
  })

  const code = message.content[0].text

  // Determine file path
  let filePath
  if (type === 'component') {
    filePath = path.join(process.cwd(), 'components', `${name}.tsx`)
  } else if (type === 'page') {
    filePath = path.join(process.cwd(), 'app', name, 'page.tsx')
    await fs.mkdir(path.dirname(filePath), { recursive: true })
  } else if (type === 'api') {
    filePath = path.join(process.cwd(), 'app', 'api', name, 'route.ts')
    await fs.mkdir(path.dirname(filePath), { recursive: true })
  }

  // Extract code from markdown if wrapped
  let cleanCode = code
  if (code.includes('```')) {
    const match = code.match(/```(?:typescript|tsx|ts)?\n([\s\S]*?)\n```/)
    if (match) {
      cleanCode = match[1]
    }
  }

  await fs.writeFile(filePath, cleanCode)
  console.log(`✓ Generated: ${filePath}`)

  return filePath
}

// Parse command line arguments
const args = process.argv.slice(2)
const typeIndex = args.indexOf('--type')
const nameIndex = args.indexOf('--name')
const descIndex = args.indexOf('--description')

if (typeIndex === -1 || nameIndex === -1 || descIndex === -1) {
  console.error('Usage: npm run ai:generate -- --type <component|page|api> --name <name> --description "<description>"')
  process.exit(1)
}

const type = args[typeIndex + 1]
const name = args[nameIndex + 1]
const description = args[descIndex + 1]

if (!['component', 'page', 'api'].includes(type)) {
  console.error('Type must be one of: component, page, api')
  process.exit(1)
}

generateCode(type, name, description).catch(console.error)
