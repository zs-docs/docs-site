const { chromium } = require('playwright');
const { expect } = require('@playwright/test');

/**
 * Comprehensive E2E tests for ZARISH SPHERE documentation
 */
class DocumentationE2ETests {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
  }

  async setup() {
    this.browser = await chromium.launch({
      headless: process.env.CI === 'true',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    this.context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 },
    });
    this.page = await this.context.newPage();
  }

  async teardown() {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }

  async testHomePage() {
    await this.page.goto(this.baseUrl);

    // Check page title
    await expect(this.page).toHaveTitle(/ZARISH SPHERE/);

    // Check main navigation
    await expect(this.page.locator('nav')).toBeVisible();

    // Check main content
    await expect(this.page.locator('main')).toBeVisible();

    // Check footer
    await expect(this.page.locator('footer')).toBeVisible();
  }

  async testNavigation() {
    await this.page.goto(this.baseUrl);

    // Test main navigation items
    const navItems = [
      'Platform',
      'Health Modules',
      'FHIR R5',
      'API Reference',
      'Operations',
      'Contributing',
    ];

    for (const item of navItems) {
      const navLink = this.page.locator(`nav a:has-text("${item}")`);
      await expect(navLink).toBeVisible();

      // Click and verify navigation
      await navLink.click();
      await this.page.waitForLoadState('networkidle');
      await expect(this.page.locator('h1')).toBeVisible();
    }
  }

  async testFHIRR5Section() {
    await this.page.goto(`${this.baseUrl}/docs/fhir-r5/overview`);

    // Check FHIR R5 overview page
    await expect(this.page.locator('h1:has-text("FHIR R5")')).toBeVisible();

    // Test country configurations
    const countryLinks = [
      'Bangladesh Configuration',
      'Thailand Configuration',
      'Myanmar Configuration',
    ];

    for (const country of countryLinks) {
      const link = this.page.locator(`a:has-text("${country}")`);
      await expect(link).toBeVisible();

      await link.click();
      await this.page.waitForLoadState('networkidle');

      // Verify country-specific content
      await expect(this.page.locator('h1')).toBeVisible();
      await expect(this.page.locator('code')).toBeVisible();
    }
  }

  async testHealthModules() {
    await this.page.goto(`${this.baseUrl}/docs/health/overview`);

    // Test health module navigation
    const modules = ['EMR', 'Pharmacy', 'Laboratory', 'Billing', 'Interoperability'];

    for (const module of modules) {
      const moduleLink = this.page.locator(`a:has-text("${module}")`);
      await expect(moduleLink).toBeVisible();

      await moduleLink.click();
      await this.page.waitForLoadState('networkidle');

      // Verify module content
      await expect(this.page.locator('h1')).toBeVisible();
      await expect(this.page.locator('main')).toContainText(module);
    }
  }

  async testSearchFunctionality() {
    await this.page.goto(this.baseUrl);

    // Test search if available
    const searchBox = this.page.locator('input[placeholder*="Search"]');
    if (await searchBox.isVisible()) {
      await searchBox.fill('FHIR');
      await this.page.waitForTimeout(1000);

      // Check search results
      const searchResults = this.page.locator('.search-results');
      if (await searchResults.isVisible()) {
        await expect(searchResults.locator('a')).toHaveCount.greaterThan(0);
      }
    }
  }

  async testResponsiveDesign() {
    const viewports = [
      { width: 375, height: 667 }, // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1920, height: 1080 }, // Desktop
    ];

    for (const viewport of viewports) {
      await this.page.setViewportSize(viewport);
      await this.page.goto(this.baseUrl);

      // Check navigation is accessible
      const nav = this.page.locator('nav');
      await expect(nav).toBeVisible();

      // Check content is readable
      const main = this.page.locator('main');
      await expect(main).toBeVisible();
    }
  }

  async testCodeExamples() {
    await this.page.goto(`${this.baseUrl}/docs/fhir-r5/patient`);

    // Check code blocks are present and syntax highlighted
    const codeBlocks = this.page.locator('pre code');
    await expect(codeBlocks).toHaveCount.greaterThan(0);

    // Test code block functionality
    const firstCodeBlock = codeBlocks.first();
    await expect(firstCodeBlock).toBeVisible();

    // Check for copy button if present
    const copyButton = this.page.locator('.copy-button').first();
    if (await copyButton.isVisible()) {
      await copyButton.click();
      // Verify copy functionality would require clipboard access
    }
  }

  async testLinks() {
    await this.page.goto(this.baseUrl);

    // Get all links
    const links = await this.page.locator('a[href]').all();

    // Test a sample of internal links
    const internalLinks = links
      .filter(async (link) => {
        const href = await link.getAttribute('href');
        return href && href.startsWith('/') && !href.includes('#');
      })
      .slice(0, 10); // Test first 10 internal links

    for (const link of internalLinks) {
      const href = await link.getAttribute('href');

      // Navigate to link
      await this.page.goto(`${this.baseUrl}${href}`);

      // Check page loads successfully
      await expect(this.page.locator('h1')).toBeVisible({ timeout: 10000 });

      // Go back to home page
      await this.page.goto(this.baseUrl);
    }
  }

  async testPerformance() {
    const startTime = Date.now();
    await this.page.goto(this.baseUrl);
    const loadTime = Date.now() - startTime;

    // Check page load time is reasonable (< 3 seconds)
    expect(loadTime).toBeLessThan(3000);

    // Check for performance metrics
    const performanceMetrics = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded:
          navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime || 0,
      };
    });

    console.log('Performance Metrics:', performanceMetrics);
  }

  async runAllTests() {
    const tests = [
      () => this.testHomePage(),
      () => this.testNavigation(),
      () => this.testFHIRR5Section(),
      () => this.testHealthModules(),
      () => this.testSearchFunctionality(),
      () => this.testResponsiveDesign(),
      () => this.testCodeExamples(),
      () => this.testLinks(),
      () => this.testPerformance(),
    ];

    const results = [];

    for (const test of tests) {
      try {
        await test();
        results.push({ name: test.name, status: 'passed' });
        console.log(`✅ ${test.name} passed`);
      } catch (error) {
        results.push({ name: test.name, status: 'failed', error: error.message });
        console.log(`❌ ${test.name} failed: ${error.message}`);
      }
    }

    return results;
  }
}

// Export for use in test files
module.exports = DocumentationE2ETests;

// Run tests if called directly
if (require.main === module) {
  const tests = new DocumentationE2ETests();

  tests
    .setup()
    .then(() => tests.runAllTests())
    .then((results) => {
      const failed = results.filter((r) => r.status === 'failed');
      if (failed.length > 0) {
        console.error(`\n❌ ${failed.length} tests failed`);
        process.exit(1);
      } else {
        console.log(`\n✅ All ${results.length} tests passed`);
        process.exit(0);
      }
    })
    .catch((error) => {
      console.error('Test execution failed:', error);
      process.exit(1);
    })
    .finally(() => tests.teardown());
}
