/**
 * Comprehensive Monitoring System
 * Performance, Security, and Error Monitoring for Kala Aabharanam
 */

(function() {
  'use strict';
  
  // Monitoring System Manager
  const MonitoringSystem = {
    
    // Configuration
    config: {
      performanceThresholds: {
        LCP: 2500,  // Largest Contentful Paint
        FID: 100,   // First Input Delay
        CLS: 0.1,   // Cumulative Layout Shift
        FCP: 1800,  // First Contentful Paint
        TTFB: 800   // Time to First Byte
      },
      errorReporting: {
        maxErrors: 10,
        reportingInterval: 30000 // 30 seconds
      },
      securityMonitoring: {
        maxFailedAttempts: 5,
        lockoutDuration: 300000 // 5 minutes
      }
    },
    
    // Initialize monitoring system
    init() {
      this.setupPerformanceMonitoring();
      this.setupErrorMonitoring();
      this.setupSecurityMonitoring();
      this.setupUserBehaviorTracking();
      this.setupResourceMonitoring();
      this.setupNetworkMonitoring();
      this.startReporting();
    },
    
    // Performance Monitoring
    setupPerformanceMonitoring() {
      // Core Web Vitals monitoring
      this.monitorCoreWebVitals();
      
      // Resource timing monitoring
      this.monitorResourceTiming();
      
      // Long task monitoring
      this.monitorLongTasks();
      
      // Memory usage monitoring
      this.monitorMemoryUsage();
      
      // Frame rate monitoring
      this.monitorFrameRate();
    },
    
    // Monitor Core Web Vitals
    monitorCoreWebVitals() {
      // LCP (Largest Contentful Paint)
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            this.reportMetric('LCP', lastEntry.startTime, {
              element: lastEntry.element?.tagName || 'unknown',
              url: lastEntry.url || 'unknown'
            });
          });
          
          lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (e) {
          console.warn('LCP monitoring not supported');
        }
        
        // FID (First Input Delay)
        try {
          const fidObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
              const fid = entry.processingStart - entry.startTime;
              this.reportMetric('FID', fid, {
                eventType: entry.name,
                target: entry.target?.tagName || 'unknown'
              });
            });
          });
          
          fidObserver.observe({ type: 'first-input', buffered: true });
        } catch (e) {
          console.warn('FID monitoring not supported');
        }
        
        // CLS (Cumulative Layout Shift)
        try {
          let clsValue = 0;
          let clsEntries = [];
          
          const clsObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
                clsEntries.push(entry);
                
                this.reportMetric('CLS', clsValue, {
                  sources: clsEntries.map(e => e.sources?.[0]?.node?.tagName || 'unknown')
                });
              }
            });
          });
          
          clsObserver.observe({ type: 'layout-shift', buffered: true });
        } catch (e) {
          console.warn('CLS monitoring not supported');
        }
      }
      
      // Navigation timing metrics
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0];
          if (navigation) {
            this.reportMetric('TTFB', navigation.responseStart);
            this.reportMetric('DOMContentLoaded', navigation.domContentLoadedEventEnd - navigation.navigationStart);
            this.reportMetric('LoadComplete', navigation.loadEventEnd - navigation.navigationStart);
          }
        }, 0);
      });
    },
    
    // Monitor resource timing
    monitorResourceTiming() {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // Monitor slow resources
          if (entry.duration > 1000) {
            this.reportIssue('slow_resource', {
              name: entry.name,
              duration: entry.duration,
              size: entry.transferSize || 0,
              type: entry.initiatorType
            });
          }
          
          // Monitor failed resources
          if (entry.responseStart === 0) {
            this.reportIssue('failed_resource', {
              name: entry.name,
              type: entry.initiatorType
            });
          }
        });
      });
      
      observer.observe({ entryTypes: ['resource'] });
    },
    
    // Monitor long tasks
    monitorLongTasks() {
      if ('PerformanceObserver' in window) {
        try {
          const longTaskObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
              this.reportIssue('long_task', {
                duration: entry.duration,
                startTime: entry.startTime,
                attribution: entry.attribution?.[0]?.name || 'unknown'
              });
            });
          });
          
          longTaskObserver.observe({ type: 'longtask', buffered: true });
        } catch (e) {
          console.warn('Long task monitoring not supported');
        }
      }
    },
    
    // Monitor memory usage
    monitorMemoryUsage() {
      if ('memory' in performance) {
        setInterval(() => {
          const memory = performance.memory;
          const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
          
          if (usagePercent > 90) {
            this.reportIssue('high_memory_usage', {
              usedMB: Math.round(memory.usedJSHeapSize / 1048576),
              totalMB: Math.round(memory.totalJSHeapSize / 1048576),
              limitMB: Math.round(memory.jsHeapSizeLimit / 1048576),
              percentage: Math.round(usagePercent)
            });
          }
        }, 30000); // Check every 30 seconds
      }
    },
    
    // Monitor frame rate
    monitorFrameRate() {
      let lastTime = performance.now();
      let frameCount = 0;
      let fps = 0;
      
      const measureFPS = (currentTime) => {
        frameCount++;
        
        if (currentTime - lastTime >= 1000) {
          fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
          
          if (fps < 30) {
            this.reportIssue('low_fps', { fps });
          }
          
          frameCount = 0;
          lastTime = currentTime;
        }
        
        requestAnimationFrame(measureFPS);
      };
      
      requestAnimationFrame(measureFPS);
    },
    
    // Error Monitoring
    setupErrorMonitoring() {
      this.errors = [];
      
      // JavaScript errors
      window.addEventListener('error', (event) => {
        this.reportError('javascript_error', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack
        });
      });
      
      // Unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.reportError('unhandled_promise_rejection', {
          reason: event.reason?.toString() || 'Unknown reason',
          stack: event.reason?.stack
        });
      });
      
      // Network errors
      this.monitorNetworkErrors();
      
      // Console errors (in development)
      if (window.location.hostname === 'localhost' || window.location.hostname.includes('ngrok')) {
        this.interceptConsoleErrors();
      }
    },
    
    // Monitor network errors
    monitorNetworkErrors() {
      // Override fetch to monitor network errors
      const originalFetch = window.fetch;
      window.fetch = async function(...args) {
        try {
          const response = await originalFetch(...args);
          
          if (!response.ok) {
            MonitoringSystem.reportError('network_error', {
              url: args[0],
              status: response.status,
              statusText: response.statusText
            });
          }
          
          return response;
        } catch (error) {
          MonitoringSystem.reportError('fetch_error', {
            url: args[0],
            message: error.message
          });
          throw error;
        }
      };
      
      // Monitor XMLHttpRequest errors
      const originalXHROpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this.addEventListener('error', () => {
          MonitoringSystem.reportError('xhr_error', {
            method,
            url,
            status: this.status
          });
        });
        
        return originalXHROpen.call(this, method, url, ...args);
      };
    },
    
    // Intercept console errors
    interceptConsoleErrors() {
      const originalConsoleError = console.error;
      console.error = function(...args) {
        MonitoringSystem.reportError('console_error', {
          message: args.join(' ')
        });
        return originalConsoleError.apply(console, args);
      };
    },
    
    // Security Monitoring
    setupSecurityMonitoring() {
      this.securityEvents = [];
      this.failedAttempts = new Map();
      
      // Monitor CSP violations
      document.addEventListener('securitypolicyviolation', (event) => {
        this.reportSecurityEvent('csp_violation', {
          blockedURI: event.blockedURI,
          violatedDirective: event.violatedDirective,
          originalPolicy: event.originalPolicy,
          sourceFile: event.sourceFile,
          lineNumber: event.lineNumber
        });
      });
      
      // Monitor form submissions for potential attacks
      this.monitorFormSecurity();
      
      // Monitor suspicious user behavior
      this.monitorSuspiciousBehavior();
      
      // Monitor for XSS attempts
      this.monitorXSSAttempts();
    },
    
    // Monitor form security
    monitorFormSecurity() {
      document.addEventListener('submit', (event) => {
        const form = event.target;
        const formData = new FormData(form);
        
        // Check for potential SQL injection patterns
        const sqlPatterns = [
          /('|(\\')|(;)|(\\;)|(--)|(\s*(union|select|insert|delete|update|drop|create|alter|exec|execute)\s+)/i
        ];
        
        // Check for XSS patterns
        const xssPatterns = [
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
          /javascript:/i,
          /on\w+\s*=/i
        ];
        
        for (const [key, value] of formData.entries()) {
          const stringValue = value.toString();
          
          // Check for SQL injection
          if (sqlPatterns.some(pattern => pattern.test(stringValue))) {
            this.reportSecurityEvent('potential_sql_injection', {
              field: key,
              value: stringValue.substring(0, 100) // Limit logged data
            });
          }
          
          // Check for XSS
          if (xssPatterns.some(pattern => pattern.test(stringValue))) {
            this.reportSecurityEvent('potential_xss', {
              field: key,
              value: stringValue.substring(0, 100)
            });
          }
        }
      });
    },
    
    // Monitor suspicious behavior
    monitorSuspiciousBehavior() {
      let rapidClicks = 0;
      let lastClickTime = 0;
      
      document.addEventListener('click', (event) => {
        const now = Date.now();
        
        // Detect rapid clicking (potential bot behavior)
        if (now - lastClickTime < 100) {
          rapidClicks++;
          
          if (rapidClicks > 10) {
            this.reportSecurityEvent('rapid_clicking', {
              clicks: rapidClicks,
              timespan: now - lastClickTime,
              target: event.target.tagName
            });
          }
        } else {
          rapidClicks = 0;
        }
        
        lastClickTime = now;
      });
      
      // Monitor for automated form filling
      const inputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');
      inputs.forEach(input => {
        let keystrokes = 0;
        let startTime = 0;
        
        input.addEventListener('focus', () => {
          keystrokes = 0;
          startTime = Date.now();
        });
        
        input.addEventListener('keydown', () => {
          keystrokes++;
        });
        
        input.addEventListener('blur', () => {
          const duration = Date.now() - startTime;
          const wpm = (keystrokes / 5) / (duration / 60000); // Words per minute
          
          // Detect suspiciously fast typing (potential bot)
          if (wpm > 200 && keystrokes > 20) {
            this.reportSecurityEvent('suspicious_typing_speed', {
              wpm: Math.round(wpm),
              keystrokes,
              duration,
              field: input.name || input.id
            });
          }
        });
      });
    },
    
    // Monitor XSS attempts
    monitorXSSAttempts() {
      // Monitor for script injection attempts
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Check for suspicious script tags
              const scripts = node.querySelectorAll('script');
              scripts.forEach(script => {
                if (!script.src || !this.isAllowedScriptSource(script.src)) {
                  this.reportSecurityEvent('suspicious_script_injection', {
                    src: script.src || 'inline',
                    content: script.textContent?.substring(0, 100)
                  });
                }
              });
              
              // Check for suspicious event handlers
              const elementsWithEvents = node.querySelectorAll('*[onclick], *[onload], *[onerror]');
              if (elementsWithEvents.length > 0) {
                this.reportSecurityEvent('suspicious_event_handlers', {
                  count: elementsWithEvents.length,
                  elements: Array.from(elementsWithEvents).map(el => el.tagName)
                });
              }
            }
          });
        });
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    },
    
    // Check if script source is allowed
    isAllowedScriptSource(src) {
      const allowedDomains = [
        'shopify.com',
        'shopifycdn.com',
        'google-analytics.com',
        'googletagmanager.com',
        'googleapis.com',
        'gstatic.com',
        'jsdelivr.net',
        'polyfill.io',
        'tidio.co',
        'judgeme.io'
      ];
      
      return allowedDomains.some(domain => src.includes(domain));
    },
    
    // User Behavior Tracking
    setupUserBehaviorTracking() {
      this.userSession = {
        startTime: Date.now(),
        pageViews: 1,
        interactions: 0,
        scrollDepth: 0,
        timeOnPage: 0
      };
      
      // Track interactions
      ['click', 'keydown', 'scroll', 'mousemove'].forEach(eventType => {
        document.addEventListener(eventType, () => {
          this.userSession.interactions++;
        }, { passive: true });
      });
      
      // Track scroll depth
      let maxScrollDepth = 0;
      window.addEventListener('scroll', () => {
        const scrollPercent = Math.round(
          (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        );
        
        if (scrollPercent > maxScrollDepth) {
          maxScrollDepth = scrollPercent;
          this.userSession.scrollDepth = maxScrollDepth;
        }
      }, { passive: true });
      
      // Track time on page
      setInterval(() => {
        this.userSession.timeOnPage = Date.now() - this.userSession.startTime;
      }, 1000);
      
      // Report session data on page unload
      window.addEventListener('beforeunload', () => {
        this.reportUserSession();
      });
    },
    
    // Resource Monitoring
    setupResourceMonitoring() {
      // Monitor critical resources
      this.monitorCriticalResources();
      
      // Monitor third-party resources
      this.monitorThirdPartyResources();
      
      // Monitor image loading
      this.monitorImageLoading();
    },
    
    // Monitor critical resources
    monitorCriticalResources() {
      const criticalResources = [
        'application.css',
        'application.js',
        'alpine.min.js'
      ];
      
      criticalResources.forEach(resource => {
        const element = document.querySelector(`[src*="${resource}"], [href*="${resource}"]`);
        if (element) {
          element.addEventListener('error', () => {
            this.reportIssue('critical_resource_failed', { resource });
          });
          
          element.addEventListener('load', () => {
            // Resource loaded successfully
          });
        }
      });
    },
    
    // Monitor third-party resources
    monitorThirdPartyResources() {
      const thirdPartyDomains = [
        'google-analytics.com',
        'googletagmanager.com',
        'tidio.co',
        'judgeme.io'
      ];
      
      // Monitor for third-party script failures
      window.addEventListener('error', (event) => {
        const filename = event.filename || '';
        const isThirdParty = thirdPartyDomains.some(domain => filename.includes(domain));
        
        if (isThirdParty) {
          this.reportIssue('third_party_script_error', {
            filename,
            message: event.message
          });
        }
      });
    },
    
    // Monitor image loading
    monitorImageLoading() {
      const images = document.querySelectorAll('img');
      let totalImages = images.length;
      let loadedImages = 0;
      let failedImages = 0;
      
      images.forEach(img => {
        if (img.complete) {
          loadedImages++;
        } else {
          img.addEventListener('load', () => {
            loadedImages++;
            this.checkImageLoadingComplete();
          });
          
          img.addEventListener('error', () => {
            failedImages++;
            this.reportIssue('image_load_failed', {
              src: img.src,
              alt: img.alt
            });
            this.checkImageLoadingComplete();
          });
        }
      });
      
      this.imageStats = { totalImages, loadedImages, failedImages };
    },
    
    // Check if image loading is complete
    checkImageLoadingComplete() {
      const { totalImages, loadedImages, failedImages } = this.imageStats;
      
      if (loadedImages + failedImages >= totalImages) {
        this.reportMetric('image_load_completion', {
          total: totalImages,
          loaded: loadedImages,
          failed: failedImages,
          successRate: Math.round((loadedImages / totalImages) * 100)
        });
      }
    },
    
    // Network Monitoring
    setupNetworkMonitoring() {
      // Monitor connection quality
      if ('connection' in navigator) {
        const connection = navigator.connection;
        
        this.reportMetric('network_info', {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData
        });
        
        connection.addEventListener('change', () => {
          this.reportMetric('network_change', {
            effectiveType: connection.effectiveType,
            downlink: connection.downlink,
            rtt: connection.rtt
          });
        });
      }
      
      // Monitor online/offline status
      window.addEventListener('online', () => {
        this.reportEvent('network_online');
      });
      
      window.addEventListener('offline', () => {
        this.reportEvent('network_offline');
      });
    },
    
    // Reporting Methods
    reportMetric(name, value, metadata = {}) {
      const metric = {
        type: 'metric',
        name,
        value,
        metadata,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      };
      
      this.sendToAnalytics(metric);
      
      // Check against thresholds
      if (this.config.performanceThresholds[name] && value > this.config.performanceThresholds[name]) {
        this.reportIssue('performance_threshold_exceeded', {
          metric: name,
          value,
          threshold: this.config.performanceThresholds[name]
        });
      }
    },
    
    reportError(type, details) {
      const error = {
        type: 'error',
        errorType: type,
        details,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      };
      
      this.errors.push(error);
      
      // Limit stored errors
      if (this.errors.length > this.config.errorReporting.maxErrors) {
        this.errors.shift();
      }
      
      this.sendToAnalytics(error);
    },
    
    reportSecurityEvent(type, details) {
      const event = {
        type: 'security',
        eventType: type,
        details,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      };
      
      this.securityEvents.push(event);
      this.sendToAnalytics(event);
      
      // Log security events to console in development
      if (window.location.hostname === 'localhost' || window.location.hostname.includes('ngrok')) {
        console.warn('Security Event:', event);
      }
    },
    
    reportIssue(type, details) {
      const issue = {
        type: 'issue',
        issueType: type,
        details,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      };
      
      this.sendToAnalytics(issue);
    },
    
    reportEvent(type, details = {}) {
      const event = {
        type: 'event',
        eventType: type,
        details,
        timestamp: Date.now(),
        url: window.location.href
      };
      
      this.sendToAnalytics(event);
    },
    
    reportUserSession() {
      const session = {
        type: 'session',
        ...this.userSession,
        endTime: Date.now()
      };
      
      this.sendToAnalytics(session);
    },
    
    // Send data to analytics
    sendToAnalytics(data) {
      // Send to Google Analytics if available
      if (typeof gtag !== 'undefined') {
        gtag('event', data.type, {
          event_category: 'Monitoring',
          event_label: data.name || data.errorType || data.eventType || data.issueType,
          value: typeof data.value === 'number' ? Math.round(data.value) : 1,
          custom_map: data
        });
      }
      
      // Log to console in development
      if (window.location.hostname === 'localhost' || window.location.hostname.includes('ngrok')) {
        console.log('Monitoring Data:', data);
      }
      
      // Store locally for debugging
      this.storeLocally(data);
    },
    
    // Store data locally for debugging
    storeLocally(data) {
      if (typeof localStorage !== 'undefined') {
        try {
          const key = `monitoring_${data.type}`;
          const stored = JSON.parse(localStorage.getItem(key) || '[]');
          stored.push(data);
          
          // Keep only last 50 entries per type
          if (stored.length > 50) {
            stored.splice(0, stored.length - 50);
          }
          
          localStorage.setItem(key, JSON.stringify(stored));
        } catch (e) {
          console.warn('Could not store monitoring data locally');
        }
      }
    },
    
    // Start periodic reporting
    startReporting() {
      setInterval(() => {
        this.generateReport();
      }, this.config.errorReporting.reportingInterval);
    },
    
    // Generate comprehensive report
    generateReport() {
      const report = {
        timestamp: Date.now(),
        url: window.location.href,
        performance: this.getPerformanceSnapshot(),
        errors: this.errors.slice(-5), // Last 5 errors
        security: this.securityEvents.slice(-5), // Last 5 security events
        userSession: this.userSession,
        system: {
          userAgent: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          },
          connection: navigator.connection ? {
            effectiveType: navigator.connection.effectiveType,
            downlink: navigator.connection.downlink,
            rtt: navigator.connection.rtt
          } : null
        }
      };
      
      // Send report
      this.sendToAnalytics({
        type: 'report',
        report
      });
      
      return report;
    },
    
    // Get performance snapshot
    getPerformanceSnapshot() {
      const navigation = performance.getEntriesByType('navigation')[0];
      
      return {
        loadTime: navigation ? navigation.loadEventEnd - navigation.navigationStart : 0,
        domReady: navigation ? navigation.domContentLoadedEventEnd - navigation.navigationStart : 0,
        resources: performance.getEntriesByType('resource').length,
        memory: performance.memory ? {
          used: Math.round(performance.memory.usedJSHeapSize / 1048576),
          total: Math.round(performance.memory.totalJSHeapSize / 1048576),
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
        } : null
      };
    }
  };
  
  // Initialize monitoring system
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      MonitoringSystem.init();
    });
  } else {
    MonitoringSystem.init();
  }
  
  // Export for debugging (in development only)
  if (window.location.hostname === 'localhost' || window.location.hostname.includes('ngrok')) {
    window.MonitoringSystem = MonitoringSystem;
  }
  
})();