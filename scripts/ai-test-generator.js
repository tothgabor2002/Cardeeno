#!/usr/bin/env node

/**
 * AI Test Generator
 *
 * Automatically generates comprehensive tests for components, pages, and API routes
 *
 * Usage:
 *   npm run ai:test -- --file components/Button.tsx
 *   npm run ai:test -- --file app/page.tsx
 *   npm run ai:test -- --file app/api/wordsets/route.ts
 */

const Anthropic = require('@anthropic-ai/sdk')
const fs = require('fs').promises
const path = require('path')

async function generateTests(filePath) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  // Read the source file
  const sourceCode = await fs.readFile(filePath, 'utf-8')

  const isComponent = filePath.includes('components/') || filePath.includes('app/') && filePath.endsWith('page.tsx')
  const isApi = filePath.includes('api/route.ts')

  const testType = isApi ? 'integration' : 'unit'
  const testLib = isApi ? 'node test runner and supertest' : 'Jest and React Testing Library'

  console.log(`Generating ${testType} tests for ${filePath}...`)

  const prompt = `Generate comprehensive tests for this code using ${testLib}.

Source file: ${path.basename(filePath)}

\`\`\`typescript
${sourceCode}
\`\`\`

Requirements:
- Use ${testLib}
- TypeScript with proper types
- Test happy paths and edge cases
- Test error handling
- Test accessibility (if UI component)
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies
- Achieve high code coverage
- Use descriptive test names

Output only the test code, no explanations.`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  const testCode = message.content[0].text

  // Extract code from markdown if wrapped
  let cleanCode = testCode
  if (testCode.includes('```')) {
    const match = testCode.match(/```(?:typescript|tsx|ts)?\n([\s\S]*?)\n```/)
    if (match) {
      cleanCode = match[1]
    }
  }

  // Determine test file path
  const testDir = path.join(process.cwd(), 'tests', testType)
  const fileName = path.basename(filePath, path.extname(filePath))
  const testFilePath = path.join(testDir, `${fileName}.test.ts${filePath.endsWith('.tsx') ? 'x' : ''}`)

  await fs.mkdir(testDir, { recursive: true })
  await fs.writeFile(testFilePath, cleanCode)

  console.log(`✓ Generated tests: ${testFilePath}`)

  return testFilePath
}

// Parse command line arguments
const args = process.argv.slice(2)
const fileIndex = args.indexOf('--file')

if (fileIndex === -1) {
  console.error('Usage: npm run ai:test -- --file <path-to-file>')
  process.exit(1)
}

const filePath = args[fileIndex + 1]

if (!filePath) {
  console.error('Please provide a file path')
  process.exit(1)
}

generateTests(filePath).catch(console.error)
