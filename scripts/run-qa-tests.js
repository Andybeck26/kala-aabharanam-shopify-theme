/**
 * QA Testing Automation Script
 * Automates basic functionality testing for Kala Aabharanam e-commerce site
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class QATestRunner {
  constructor(baseUrl = 'https://kala-aabharanam.myshopify.com') {
    this.baseUrl = baseUrl;
    this.browser = null;
    this.page = null;
    this.testResults = [];
  }

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: false, // Set to true for CI/CD
      defaultViewport: { width: 1280, height: 720 }
    });
    this.page = await this.browser.newPage();
    
    // Set user agent
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    // Enable request interception for performance monitoring
    await this.page.setRequestInterception(true);
    this.page.on('request', (req) => {
      req.continue();
    });
  }

  async runTest(testName, testFunction) {
    console.log(`Running test: ${testName}`);
    const startTime = Date.now();
    
    try {
      await testFunction();
      const duration = Date.now() - startTime;
      this.testResults.push({
        name: testName,
        status: 'PASS',
        duration: `${duration}ms`,
        timestamp: new Date().toISOString()
      });
      console.log(`✅ ${testName} - PASSED (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      this.testResults.push({
        name: testName,
        status: 'FAIL',
        error: error.message,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString()
      });
      console.log(`❌ ${testName} - FAILED: ${error.message}`);
    }
  }

  async testHomepageLoad() {
    await this.page.goto(this.baseUrl, { waitUntil: 'networkidle2' });
    
    // Check if page title contains site name
    const title = await this.page.title();
    if (!title.includes('Kala Aabharanam')) {
      throw new Error(`Page title "${title}" does not contain site name`);
    }

    // Check for main navigation
    const nav = await this.page.$('nav, .header__nav');
    if (!nav) {
      throw new Error('Main navigation not found');
    }

    // Check for logo
    const logo = await this.page.$('.header__logo, .logo');
    if (!logo) {
      throw new Error('Site logo not found');
    }

    // Check for cart icon
    const cart = await this.page.$('.header__cart, .cart-icon');
    if (!cart) {
      throw new Error('Cart icon not found');
    }
  }

  async testProductNavigation() {
    await this.page.goto(this.baseUrl);
    
    // Click on first product category
    const categoryLink = await this.page.$('nav a[href*="collections"]');
    if (!categoryLink) {
      throw new Error('No collection links found in navigation');
    }
    
    await categoryLink.click();
    await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
    
    // Check if we're on a collection page
    const url = this.page.url();
    if (!url.includes('collections')) {
      throw new Error('Navigation did not lead to collection page');
    }

    // Check for product grid
    const productGrid = await this.page.$('.product-grid, .collection__products');
    if (!productGrid) {
      throw new Error('Product grid not found on collection page');
    }

    // Check for at least one product
    const products = await this.page.$$('.product-card, .product-item');
    if (products.length === 0) {
      throw new Error('No products found on collection page');
    }
  }

  async testProductDetailPage() {
    await this.page.goto(this.baseUrl);
    
    // Navigate to first product
    const productLink = await this.page.$('.product-card a, .product-item a');
    if (!productLink) {
      throw new Error('No product links found');
    }
    
    await productLink.click();
    await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
    
    // Check product page elements
    const productTitle = await this.page.$('.product__title, h1');
    if (!productTitle) {
      throw new Error('Product title not found');
    }

    const productPrice = await this.page.$('.product__price, .price');
    if (!productPrice) {
      throw new Error('Product price not found');
    }

    const productImages = await this.page.$('.product__gallery, .product-images');
    if (!productImages) {
      throw new Error('Product images not found');
    }

    const addToCartButton = await this.page.$('button[name="add"], .btn-add-to-cart');
    if (!addToCartButton) {
      throw new Error('Add to cart button not found');
    }
  }

  async testAddToCart() {
    await this.page.goto(this.baseUrl);
    
    // Navigate to first product
    const productLink = await this.page.$('.product-card a, .product-item a');
    await productLink.click();
    await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
    
    // Get initial cart count
    const initialCartCount = await this.getCartCount();
    
    // Click add to cart
    const addToCartButton = await this.page.$('button[name="add"], .btn-add-to-cart');
    await addToCartButton.click();
    
    // Wait for cart to update
    await this.page.waitForTimeout(2000);
    
    // Check if cart count increased
    const newCartCount = await this.getCartCount();
    if (newCartCount <= initialCartCount) {
      throw new Error('Cart count did not increase after adding product');
    }
  }

  async getCartCount() {
    try {
      const cartCountElement = await this.page.$('.cart-count, .header__cart-count');
      if (!cartCountElement) return 0;
      
      const countText = await this.page.evaluate(el => el.textContent, cartCountElement);
      return parseInt(countText) || 0;
    } catch {
      return 0;
    }
  }

  async testSearchFunctionality() {
    await this.page.goto(this.baseUrl);
    
    // Find search input
    const searchInput = await this.page.$('input[type="search"], .search__input');
    if (!searchInput) {
      throw new Error('Search input not found');
    }
    
    // Type search query
    await searchInput.type('necklace');
    
    // Submit search (either by pressing Enter or clicking search button)
    await this.page.keyboard.press('Enter');
    await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
    
    // Check if we're on search results page
    const url = this.page.url();
    if (!url.includes('search') && !url.includes('q=')) {
      throw new Error('Search did not navigate to results page');
    }
    
    // Check for search results
    const results = await this.page.$('.search-results, .collection__products');
    if (!results) {
      throw new Error('Search results container not found');
    }
  }

  async testMobileResponsiveness() {
    // Test mobile viewport
    await this.page.setViewport({ width: 375, height: 667 });
    await this.page.goto(this.baseUrl, { waitUntil: 'networkidle2' });
    
    // Check if mobile menu exists
    const mobileMenuToggle = await this.page.$('.mobile-menu-toggle, .header__menu-toggle');
    if (!mobileMenuToggle) {
      throw new Error('Mobile menu toggle not found');
    }
    
    // Test mobile menu functionality
    await mobileMenuToggle.click();
    await this.page.waitForTimeout(1000);
    
    const mobileMenu = await this.page.$('.mobile-menu, .header__mobile-menu');
    if (!mobileMenu) {
      throw new Error('Mobile menu did not appear');
    }
    
    // Reset to desktop viewport
    await this.page.setViewport({ width: 1280, height: 720 });
  }

  async testFormValidation() {
    await this.page.goto(`${this.baseUrl}/pages/contact`);
    
    // Find contact form
    const form = await this.page.$('form');
    if (!form) {
      throw new Error('Contact form not found');
    }
    
    // Try to submit empty form
    const submitButton = await this.page.$('button[type="submit"], input[type="submit"]');
    if (submitButton) {
      await submitButton.click();
      
      // Check for validation messages
      const validationMessage = await this.page.$('.error, .field-error, :invalid');
      if (!validationMessage) {
        console.warn('Form validation may not be working properly');
      }
    }
  }

  async testPerformance() {
    const metrics = await this.page.metrics();
    
    // Check Core Web Vitals approximations
    const performanceEntries = await this.page.evaluate(() => {
      return JSON.stringify(performance.getEntriesByType('navigation'));
    });
    
    const navigation = JSON.parse(performanceEntries)[0];
    if (navigation) {
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      if (loadTime > 3000) {
        throw new Error(`Page load time ${loadTime}ms exceeds 3 second threshold`);
      }
    }
    
    // Check for layout shifts (basic check)
    const layoutShifts = await this.page.evaluate(() => {
      return new Promise((resolve) => {
        let cls = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              cls += entry.value;
            }
          }
          resolve(cls);
        }).observe({ type: 'layout-shift', buffered: true });
        
        setTimeout(() => resolve(cls), 5000);
      });
    });
    
    if (layoutShifts > 0.1) {
      throw new Error(`Cumulative Layout Shift ${layoutShifts} exceeds 0.1 threshold`);
    }
  }

  async generateReport() {
    const report = {
      testSuite: 'Kala Aabharanam QA Tests',
      timestamp: new Date().toISOString(),
      baseUrl: this.baseUrl,
      totalTests: this.testResults.length,
      passed: this.testResults.filter(t => t.status === 'PASS').length,
      failed: this.testResults.filter(t => t.status === 'FAIL').length,
      results: this.testResults
    };

    // Save report to file
    const reportPath = path.join(__dirname, '..', 'docs', 'qa-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Generate HTML report
    const htmlReport = this.generateHTMLReport(report);
    const htmlPath = path.join(__dirname, '..', 'docs', 'qa-test-report.html');
    fs.writeFileSync(htmlPath, htmlReport);
    
    console.log(`\n📊 Test Report Generated:`);
    console.log(`JSON: ${reportPath}`);
    console.log(`HTML: ${htmlPath}`);
    console.log(`\n📈 Results: ${report.passed}/${report.totalTests} tests passed`);
    
    return report;
  }

  generateHTMLReport(report) {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>QA Test Report - Kala Aabharanam</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #8A3324; color: white; padding: 20px; border-radius: 5px; }
        .summary { display: flex; gap: 20px; margin: 20px 0; }
        .metric { background: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; }
        .pass { color: #28a745; }
        .fail { color: #dc3545; }
        .test-result { margin: 10px 0; padding: 10px; border-left: 4px solid #ddd; }
        .test-result.pass { border-color: #28a745; background: #f8fff9; }
        .test-result.fail { border-color: #dc3545; background: #fff8f8; }
    </style>
</head>
<body>
    <div class="header">
        <h1>QA Test Report - Kala Aabharanam</h1>
        <p>Generated: ${report.timestamp}</p>
        <p>Base URL: ${report.baseUrl}</p>
    </div>
    
    <div class="summary">
        <div class="metric">
            <h3>Total Tests</h3>
            <div style="font-size: 2em;">${report.totalTests}</div>
        </div>
        <div class="metric">
            <h3>Passed</h3>
            <div style="font-size: 2em; color: #28a745;">${report.passed}</div>
        </div>
        <div class="metric">
            <h3>Failed</h3>
            <div style="font-size: 2em; color: #dc3545;">${report.failed}</div>
        </div>
        <div class="metric">
            <h3>Success Rate</h3>
            <div style="font-size: 2em;">${Math.round((report.passed / report.totalTests) * 100)}%</div>
        </div>
    </div>
    
    <h2>Test Results</h2>
    ${report.results.map(test => `
        <div class="test-result ${test.status.toLowerCase()}">
            <h4>${test.name} <span class="${test.status.toLowerCase()}">[${test.status}]</span></h4>
            <p><strong>Duration:</strong> ${test.duration}</p>
            <p><strong>Timestamp:</strong> ${test.timestamp}</p>
            ${test.error ? `<p><strong>Error:</strong> ${test.error}</p>` : ''}
        </div>
    `).join('')}
</body>
</html>`;
  }

  async runAllTests() {
    await this.initialize();
    
    console.log('🚀 Starting QA Test Suite for Kala Aabharanam\n');
    
    // Core functionality tests
    await this.runTest('Homepage Load', () => this.testHomepageLoad());
    await this.runTest('Product Navigation', () => this.testProductNavigation());
    await this.runTest('Product Detail Page', () => this.testProductDetailPage());
    await this.runTest('Add to Cart', () => this.testAddToCart());
    await this.runTest('Search Functionality', () => this.testSearchFunctionality());
    await this.runTest('Mobile Responsiveness', () => this.testMobileResponsiveness());
    await this.runTest('Form Validation', () => this.testFormValidation());
    await this.runTest('Performance Check', () => this.testPerformance());
    
    const report = await this.generateReport();
    
    await this.browser.close();
    
    return report;
  }
}

// CLI execution
if (require.main === module) {
  const baseUrl = process.argv[2] || 'https://kala-aabharanam.myshopify.com';
  const runner = new QATestRunner(baseUrl);
  
  runner.runAllTests()
    .then(report => {
      console.log('\n✅ QA Testing Complete!');
      process.exit(report.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('❌ QA Testing Failed:', error);
      process.exit(1);
    });
}

module.exports = QATestRunner;