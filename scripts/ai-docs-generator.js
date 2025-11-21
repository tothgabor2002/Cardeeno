#!/usr/bin/env node

/**
 * AI Documentation Generator
 *
 * Automatically generates comprehensive documentation for the project
 *
 * Usage:
 *   npm run ai:docs
 *   npm run ai:docs -- --type api
 *   npm run ai:docs -- --type component
 */

const Anthropic = require('@anthropic-ai/sdk')
const fs = require('fs').promises
const path = require('path')
const { glob } = require('glob')

async function generateDocs(type = 'all') {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  console.log(`Generating documentation for: ${type}`)

  // Collect all relevant files
  let patterns = []
  if (type === 'all' || type === 'component') {
    patterns.push('components/**/*.tsx')
  }
  if (type === 'all' || type === 'api') {
    patterns.push('app/api/**/route.ts')
  }
  if (type === 'all' || type === 'page') {
    patterns.push('app/**/page.tsx')
  }

  const files = []
  for (const pattern of patterns) {
    const matches = await glob(pattern, { cwd: process.cwd() })
    files.push(...matches)
  }

  console.log(`Found ${files.length} files to document`)

  let documentation = `# Cardeeno Documentation

Generated: ${new Date().toISOString()}

## Table of Contents

`

  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8')

    const prompt = `Generate API documentation for this code file.

File: ${file}

\`\`\`typescript
${content}
\`\`\`

Format the documentation as markdown with:
- Brief description
- Props/Parameters (if applicable)
- Return values (if applicable)
- Usage examples
- Notes about behavior

Keep it concise but comprehensive.`

    try {
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      })

      const doc = message.content[0].text
      documentation += `\n## ${file}\n\n${doc}\n\n---\n`

      console.log(`✓ Documented: ${file}`)
    } catch (error) {
      console.error(`✗ Error documenting ${file}:`, error.message)
    }
  }

  // Save documentation
  const docsDir = path.join(process.cwd(), 'docs')
  await fs.mkdir(docsDir, { recursive: true })

  const docPath = path.join(docsDir, type === 'all' ? 'API.md' : `${type}.md`)
  await fs.writeFile(docPath, documentation)

  console.log(`\n✓ Documentation generated: ${docPath}`)
}

// Parse command line arguments
const args = process.argv.slice(2)
const typeIndex = args.indexOf('--type')
const type = typeIndex > -1 ? args[typeIndex + 1] : 'all'

generateDocs(type).catch(console.error)
