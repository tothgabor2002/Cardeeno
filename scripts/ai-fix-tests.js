#!/usr/bin/env node

/**
 * AI Test Fixer
 *
 * Automatically fixes failing tests by analyzing errors and updating test code
 *
 * Usage:
 *   npm run test:ci 2>&1 | npm run ai:fix-tests
 *   npm run ai:fix-tests -- --test-output test-results.txt
 */

const Anthropic = require('@anthropic-ai/sdk')
const fs = require('fs').promises
const { exec } = require('child_process')
const util = require('util')

const execPromise = util.promisify(exec)

async function runTests() {
  try {
    const { stdout, stderr } = await execPromise('npm run test:ci')
    return stdout + stderr
  } catch (error) {
    return error.stdout + error.stderr
  }
}

async function fixTests(testOutput) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  console.log('Analyzing test failures...')

  // Parse test failures
  const failurePattern = /FAIL\s+(.+\.test\.tsx?)/g
  const failures = [...testOutput.matchAll(failurePattern)].map(m => m[1])

  if (failures.length === 0) {
    console.log('✓ No test failures found!')
    return
  }

  console.log(`Found ${failures.length} failing test file(s)`)

  for (const testFile of failures) {
    console.log(`\nFixing: ${testFile}`)

    try {
      const testCode = await fs.readFile(testFile, 'utf-8')

      // Extract relevant error messages for this file
      const fileErrorStart = testOutput.indexOf(testFile)
      const nextFileStart = testOutput.indexOf('FAIL', fileErrorStart + testFile.length)
      const errorSection = testOutput.slice(
        fileErrorStart,
        nextFileStart > -1 ? nextFileStart : testOutput.length
      )

      const prompt = `Fix the failing tests in this file.

Test Output:
\`\`\`
${errorSection}
\`\`\`

Current Test Code:
\`\`\`typescript
${testCode}
\`\`\`

Instructions:
- Analyze the test failures
- Fix the test code to make tests pass
- Maintain test coverage and quality
- Don't change test intent, only fix implementation
- Update mocks if needed
- Fix timing issues with proper async/await
- Output ONLY the fixed test code, no explanations`

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

      let fixedCode = message.content[0].text

      // Extract code from markdown if wrapped
      if (fixedCode.includes('```')) {
        const match = fixedCode.match(/```(?:typescript|tsx|ts)?\n([\s\S]*?)\n```/)
        if (match) {
          fixedCode = match[1]
        }
      }

      await fs.writeFile(testFile, fixedCode)
      console.log(`✓ Fixed: ${testFile}`)
    } catch (error) {
      console.error(`✗ Error fixing ${testFile}:`, error.message)
    }
  }

  console.log('\n✓ Test fixing complete! Run tests again to verify.')
}

// Main execution
async function main() {
  const args = process.argv.slice(2)
  const outputIndex = args.indexOf('--test-output')

  let testOutput

  if (outputIndex > -1) {
    const outputFile = args[outputIndex + 1]
    testOutput = await fs.readFile(outputFile, 'utf-8')
  } else {
    console.log('Running tests to detect failures...')
    testOutput = await runTests()
  }

  await fixTests(testOutput)
}

main().catch(console.error)
