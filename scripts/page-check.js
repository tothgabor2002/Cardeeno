#!/usr/bin/env node

/**
 * Page Check & Error Detection
 *
 * Opens the application in Playwright, takes a screenshot,
 * detects errors, and reports findings.
 */

const { chromium } = require('@playwright/test')
const fs = require('fs').promises

async function checkPage(url = 'http://localhost:3000') {
  console.log(`\n🔍 Checking page: ${url}\n`)

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  })
  const page = await context.newPage()

  // Collect console errors
  const consoleErrors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text())
    }
  })

  // Collect page errors
  const pageErrors = []
  page.on('pageerror', (error) => {
    pageErrors.push(error.message)
  })

  try {
    // Navigate to page
    console.log('📄 Loading page...')
    const response = await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000,
    })

    // Check response status
    const status = response.status()
    console.log(`📊 Response status: ${status}`)

    if (status === 500) {
      // Try to get error details
      const bodyText = await page.textContent('body')
      console.log(`\n❌ ERROR 500: Server Error\n`)

      // Try to extract error message from Next.js error page
      const errorElement = await page.$('pre')
      if (errorElement) {
        const errorText = await errorElement.textContent()
        console.log('Error details:')
        console.log(errorText.substring(0, 500))
      }
    }

    // Take screenshot
    const screenshotPath = 'screenshots/page-check.png'
    await fs.mkdir('screenshots', { recursive: true })
    await page.screenshot({ path: screenshotPath, fullPage: true })
    console.log(`📸 Screenshot saved: ${screenshotPath}`)

    // Check for visible errors
    const errorSelectors = [
      '[data-nextjs-dialog]',
      '[data-overlay]',
      '.error',
      '#__next-error',
      '[role="alert"]',
    ]

    for (const selector of errorSelectors) {
      const errorElement = await page.$(selector)
      if (errorElement) {
        const text = await errorElement.textContent()
        console.log(`\n⚠️  Visible error found (${selector}):`)
        console.log(text.substring(0, 300))
      }
    }

    // Report console errors
    if (consoleErrors.length > 0) {
      console.log(`\n❌ Console Errors (${consoleErrors.length}):`)
      consoleErrors.forEach((error, i) => {
        console.log(`  ${i + 1}. ${error.substring(0, 200)}`)
      })
    }

    // Report page errors
    if (pageErrors.length > 0) {
      console.log(`\n❌ Page Errors (${pageErrors.length}):`)
      pageErrors.forEach((error, i) => {
        console.log(`  ${i + 1}. ${error.substring(0, 200)}`)
      })
    }

    // Success check
    if (status === 200 && consoleErrors.length === 0 && pageErrors.length === 0) {
      console.log(`\n✅ Page loaded successfully! No errors detected.`)

      // Get page title
      const title = await page.title()
      console.log(`📄 Title: ${title}`)

      // Check if main content is visible
      const mainContent = await page.$('#__next')
      if (mainContent) {
        console.log(`✅ Main content rendered`)
      }
    }
  } catch (error) {
    console.error(`\n❌ Failed to load page:`)
    console.error(error.message)
  } finally {
    await browser.close()
  }
}

// Get URL from command line or use default
const url = process.argv[2] || 'http://localhost:3000'
checkPage(url).catch(console.error)
