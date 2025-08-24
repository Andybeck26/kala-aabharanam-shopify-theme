/**
 * Monitoring Setup Script for Kala Aabharanam
 * This script initializes all monitoring systems post-launch
 */

class MonitoringSetup {
  constructor() {
    this.config = {
      ga4_measurement_id: 'G-XXXXXXXXXX', // Replace with actual GA4 ID
      shop_domain: 'kala-aabharanam.myshopify.com',
      api_endpoints: {
        metrics: '/api/metrics',
        errors: '/api/errors',
        feedback: '/api/feedback',
        surveys: '/api/customer-survey'
      }
    };
  }

  /**
   * Initialize all monitoring systems
   */
  async initialize() {
    console.log('🚀 Initializing Kala Aabharanam monitoring systems...');
    
    try {
      await this.setupGoogleAnalytics();
      await this.setupPerformanceMonitoring();
      await this.setupErrorTracking();
      await this.setupCustomerFeedback();
      await this.setupAutomatedReporting();
      
      console.log('✅ All monitoring systems initialized successfully!');
      return true;
    } catch (error) {
      console.error('❌ Error initializing monitoring systems:', error);
      return false;
    }
  }

  /**
   * Setup Google Analytics 4 Enhanced E-commerce
   */
  async setupGoogleAnalytics() {
    console.log('📊 Setting up Google Analytics 4...');
    
    // Load GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.ga4_measurement_id}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', this.config.ga4_measurement_id, {
      enhanced_ecommerce: true,
      custom_map: {
        'custom_parameter_1': 'customer_type',
        'custom_parameter_2': 'product_category',
        'custom_parameter_3': 'traffic_source'
      }
    });

    // Setup enhanced e-commerce events
    this.setupEcommerceTracking();
    
    console.log('✅ Google Analytics 4 setup complete');
  }

  /**
   * Setup Enhanced E-commerce Event Tracking
   */
  setupEcommerceTracking() {
    // Track page views with custom parameters
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      customer_type: this.getCustomerType(),
      product_category: this.getCurrentCategory()
    });

    // Setup cart tracking
    this.setupCartTracking();
    
    // Setup product view tracking
    this.setupProductTracking();
    
    // Setup checkout tracking
    this.setupCheckoutTracking();
  }

  /**
   * Setup cart event tracking
   */
  setupCartTracking() {
    // Listen for cart events
    document.addEventListener('cart:add', (event) => {
      const { product, variant, quantity } = event.detail;
      
      gtag('event', 'add_to_cart', {
        currency: 'INR',
        value: (variant.price * quantity) / 100,
        items: [{
          item_id: variant.id,
          item_name: product.title,
          category: product.type,
          quantity: quantity,
          price: variant.price / 100
        }]
      });
    });

    document.addEventListener('cart:remove', (event) => {
      const { product, variant, quantity } = event.detail;
      
      gtag('event', 'remove_from_cart', {
        currency: 'INR',
        value: (variant.price * quantity) / 100,
        items: [{
          item_id: variant.id,
          item_name: product.title,
          category: product.type,
          quantity: quantity,
          price: variant.price / 100
        }]
      });
    });
  }

  /**
   * Setup product view tracking
   */
  setupProductTracking() {
    // Track product views on product pages
    if (window.location.pathname.includes('/products/')) {
      const productData = this.getProductData();
      if (productData) {
        gtag('event', 'view_item', {
          currency: 'INR',
          value: productData.price / 100,
          items: [{
            item_id: productData.id,
            item_name: productData.title,
            category: productData.type,
            price: productData.price / 100
          }]
        });
      }
    }
  }

  /**
   * Setup checkout tracking
   */
  setupCheckoutTracking() {
    // Track checkout initiation
    if (window.location.pathname.includes('/checkout')) {
      const cartData = this.getCartData();
      if (cartData && cartData.items.length > 0) {
        gtag('event', 'begin_checkout', {
          currency: 'INR',
          value: cartData.total_price / 100,
          items: cartData.items.map(item => ({
            item_id: item.variant_id,
            item_name: item.title,
            category: item.product_type,
            quantity: item.quantity,
            price: item.price / 100
          }))
        });
      }
    }
  }

  /**
   * Setup performance monitoring
   */
  async setupPerformanceMonitoring() {
    console.log('⚡ Setting up performance monitoring...');
    
    // Core Web Vitals monitoring
    this.monitorCoreWebVitals();
    
    // Custom performance metrics
    this.monitorCustomMetrics();
    
    // Error boundary setup
    this.setupErrorBoundary();
    
    console.log('✅ Performance monitoring setup complete');
  }

  /**
   * Monitor Core Web Vitals
   */
  monitorCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: 'LCP',
        value: Math.round(lastEntry.startTime),
        non_interaction: true
      });

      this.sendMetric('lcp', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const firstInput = entryList.getEntries()[0];
      const fid = firstInput.processingStart - firstInput.startTime;
      
      gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: 'FID',
        value: Math.round(fid),
        non_interaction: true
      });

      this.sendMetric('fid', fid);
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      
      gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: 'CLS',
        value: Math.round(clsValue * 1000),
        non_interaction: true
      });

      this.sendMetric('cls', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });
  }

  /**
   * Monitor custom performance metrics
   */
  monitorCustomMetrics() {
    // Time to First Byte (TTFB)
    new PerformanceObserver((entryList) => {
      const [pageNav] = entryList.getEntries();
      const ttfb = pageNav.responseStart - pageNav.requestStart;
      
      this.sendMetric('ttfb', ttfb);
    }).observe({ entryTypes: ['navigation'] });

    // Resource loading times
    new PerformanceObserver((entryList) => {
      entryList.getEntries().forEach(entry => {
        if (entry.name.includes('application.css') || entry.name.includes('application.js')) {
          this.sendMetric('resource_load_time', entry.duration, {
            resource: entry.name.split('/').pop()
          });
        }
      });
    }).observe({ entryTypes: ['resource'] });
  }

  /**
   * Setup error tracking
   */
  async setupErrorTracking() {
    console.log('🐛 Setting up error tracking...');
    
    // Global error handler
    window.addEventListener('error', (event) => {
      this.logError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
    });

    // Promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        type: 'promise_rejection',
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack,
        url: window.location.href,
        timestamp: new Date().toISOString()
      });
    });

    // Network error tracking
    this.interceptFetch();
    
    console.log('✅ Error tracking setup complete');
  }

  /**
   * Intercept fetch requests for error tracking
   */
  interceptFetch() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        if (!response.ok) {
          this.logError({
            type: 'http_error',
            message: `HTTP ${response.status}: ${response.statusText}`,
            url: args[0],
            status: response.status,
            timestamp: new Date().toISOString()
          });
        }
        
        return response;
      } catch (error) {
        this.logError({
          type: 'network_error',
          message: error.message,
          url: args[0],
          timestamp: new Date().toISOString()
        });
        throw error;
      }
    };
  }

  /**
   * Setup customer feedback collection
   */
  async setupCustomerFeedback() {
    console.log('💬 Setting up customer feedback systems...');
    
    // Setup review request automation
    this.setupReviewRequests();
    
    // Setup satisfaction surveys
    this.setupSatisfactionSurveys();
    
    // Setup chat feedback collection
    this.setupChatFeedback();
    
    console.log('✅ Customer feedback systems setup complete');
  }

  /**
   * Setup automated review requests
   */
  setupReviewRequests() {
    // Check for completed orders and trigger review requests
    const checkForReviewRequests = () => {
      const orderData = this.getRecentOrders();
      orderData.forEach(order => {
        const deliveryDate = new Date(order.delivered_at);
        const reviewRequestDate = new Date(deliveryDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        if (new Date() >= reviewRequestDate && !order.review_requested) {
          this.sendReviewRequest(order);
        }
      });
    };

    // Check daily for review requests
    setInterval(checkForReviewRequests, 24 * 60 * 60 * 1000);
  }

  /**
   * Setup satisfaction surveys
   */
  setupSatisfactionSurveys() {
    // Show satisfaction survey for completed purchases
    const showSurveyIfEligible = () => {
      const orderData = this.getCustomerOrders();
      if (orderData && orderData.length > 0) {
        const lastOrder = orderData[0];
        const deliveryDate = new Date(lastOrder.delivered_at);
        const surveyDate = new Date(deliveryDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        if (new Date() >= surveyDate && !lastOrder.survey_completed) {
          this.showSatisfactionSurvey(lastOrder);
        }
      }
    };

    // Check on page load
    document.addEventListener('DOMContentLoaded', showSurveyIfEligible);
  }

  /**
   * Setup automated reporting
   */
  async setupAutomatedReporting() {
    console.log('📈 Setting up automated reporting...');
    
    // Setup daily report generation
    this.scheduleDailyReports();
    
    // Setup weekly performance reviews
    this.scheduleWeeklyReports();
    
    // Setup monthly business reviews
    this.scheduleMonthlyReports();
    
    console.log('✅ Automated reporting setup complete');
  }

  /**
   * Schedule daily reports
   */
  scheduleDailyReports() {
    const generateDailyReport = async () => {
      const reportData = await this.collectDailyMetrics();
      await this.sendDailyReport(reportData);
    };

    // Schedule for 8 AM daily (in production, this would be a server-side cron job)
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(8, 0, 0, 0);
    
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    const timeUntilReport = scheduledTime.getTime() - now.getTime();
    setTimeout(() => {
      generateDailyReport();
      setInterval(generateDailyReport, 24 * 60 * 60 * 1000);
    }, timeUntilReport);
  }

  /**
   * Utility methods
   */
  
  sendMetric(name, value, metadata = {}) {
    fetch(this.config.api_endpoints.metrics, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metric: name,
        value: value,
        metadata: metadata,
        url: window.location.href,
        timestamp: Date.now()
      })
    }).catch(console.error);
  }

  logError(errorData) {
    // Send to Google Analytics
    gtag('event', 'exception', {
      description: errorData.message,
      fatal: false
    });

    // Send to error logging service
    fetch(this.config.api_endpoints.errors, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorData)
    }).catch(() => {
      // Fallback: store in localStorage
      const errors = JSON.parse(localStorage.getItem('pending_errors') || '[]');
      errors.push(errorData);
      localStorage.setItem('pending_errors', JSON.stringify(errors.slice(-10)));
    });
  }

  getCustomerType() {
    // Determine if customer is new, returning, or VIP
    const customerData = this.getCustomerData();
    if (!customerData) return 'anonymous';
    
    if (customerData.orders_count === 0) return 'new';
    if (customerData.total_spent > 10000) return 'vip';
    return 'returning';
  }

  getCurrentCategory() {
    // Extract category from URL or page data
    const path = window.location.pathname;
    if (path.includes('/collections/artificial-gold-jewellery')) return 'artificial_gold';
    if (path.includes('/collections/oxidized-jewellery')) return 'oxidized';
    if (path.includes('/collections/beads-chains')) return 'beads_chains';
    if (path.includes('/collections/kalamkari')) return 'kalamkari';
    return 'general';
  }

  getProductData() {
    // Extract product data from page (implementation depends on theme structure)
    if (window.product) return window.product;
    
    // Fallback: extract from meta tags or JSON-LD
    const productScript = document.querySelector('script[type="application/ld+json"]');
    if (productScript) {
      try {
        const productData = JSON.parse(productScript.textContent);
        if (productData['@type'] === 'Product') {
          return productData;
        }
      } catch (e) {
        console.warn('Could not parse product JSON-LD');
      }
    }
    
    return null;
  }

  getCartData() {
    // Get cart data from Shopify cart API
    return fetch('/cart.js')
      .then(response => response.json())
      .catch(() => null);
  }

  getCustomerData() {
    // Get customer data if logged in
    if (window.customer) return window.customer;
    return null;
  }

  async collectDailyMetrics() {
    // Collect metrics for daily report
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    return {
      date: yesterday.toISOString().split('T')[0],
      sales: await this.getSalesMetrics(yesterday),
      traffic: await this.getTrafficMetrics(yesterday),
      performance: await this.getPerformanceMetrics(yesterday),
      errors: await this.getErrorMetrics(yesterday)
    };
  }

  async sendDailyReport(reportData) {
    // Send daily report via email or dashboard
    fetch('/api/reports/daily', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData)
    }).catch(console.error);
  }
}

// Initialize monitoring when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const monitoring = new MonitoringSetup();
  monitoring.initialize();
});

// Export for use in other scripts
window.KalaAabharanamMonitoring = MonitoringSetup;