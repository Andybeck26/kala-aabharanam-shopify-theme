/**
 * Cross-Browser Compatibility and Device Testing Utilities
 * Ensures consistent functionality across different browsers and devices
 */

(function() {
  'use strict';
  
  // Browser and device detection
  const BrowserDetector = {
    
    // Detect browser type and version
    detectBrowser() {
      const userAgent = navigator.userAgent;
      const browsers = {
        chrome: /Chrome\/(\d+)/.exec(userAgent),
        firefox: /Firefox\/(\d+)/.exec(userAgent),
        safari: /Version\/(\d+).*Safari/.exec(userAgent),
        edge: /Edg\/(\d+)/.exec(userAgent),
        ie: /MSIE (\d+)|Trident.*rv:(\d+)/.exec(userAgent)
      };
      
      for (const [name, match] of Object.entries(browsers)) {
        if (match) {
          return {
            name: name,
            version: parseInt(match[1] || match[2], 10)
          };
        }
      }
      
      return { name: 'unknown', version: 0 };
    },
    
    // Detect device type
    detectDevice() {
      const userAgent = navigator.userAgent;
      
      if (/iPad|iPhone|iPod/.test(userAgent)) {
        return {
          type: 'ios',
          mobile: /iPhone|iPod/.test(userAgent),
          tablet: /iPad/.test(userAgent)
        };
      }
      
      if (/Android/.test(userAgent)) {
        return {
          type: 'android',
          mobile: /Mobile/.test(userAgent),
          tablet: !/Mobile/.test(userAgent)
        };
      }
      
      if (/Windows Phone/.test(userAgent)) {
        return {
          type: 'windows-phone',
          mobile: true,
          tablet: false
        };
      }
      
      return {
        type: 'desktop',
        mobile: false,
        tablet: false
      };
    },
    
    // Check for touch support
    hasTouchSupport() {
      return 'ontouchstart' in window || 
             navigator.maxTouchPoints > 0 || 
             navigator.msMaxTouchPoints > 0;
    },
    
    // Check for specific feature support
    supportsFeature(feature) {
      const features = {
        webp: () => {
          const canvas = document.createElement('canvas');
          canvas.width = 1;
          canvas.height = 1;
          return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        },
        
        intersectionObserver: () => 'IntersectionObserver' in window,
        
        serviceWorker: () => 'serviceWorker' in navigator,
        
        webGL: () => {
          try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
          } catch (e) {
            return false;
          }
        },
        
        localStorage: () => {
          try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
          } catch (e) {
            return false;
          }
        },
        
        flexbox: () => {
          const div = document.createElement('div');
          div.style.display = 'flex';
          return div.style.display === 'flex';
        },
        
        grid: () => {
          const div = document.createElement('div');
          div.style.display = 'grid';
          return div.style.display === 'grid';
        },
        
        customProperties: () => window.CSS && CSS.supports('color', 'var(--test)'),
        
        fetch: () => 'fetch' in window,
        
        promises: () => 'Promise' in window,
        
        arrow_functions: () => {
          try {
            new Function('() => {}');
            return true;
          } catch (e) {
            return false;
          }
        }
      };
      
      return features[feature] ? features[feature]() : false;
    }
  };
  
  // Cross-browser polyfills and fixes
  const CrossBrowserFixes = {
    
    init() {
      this.addBrowserClasses();
      this.setupPolyfills();
      this.fixBrowserSpecificIssues();
      this.setupTouchHandling();
      this.setupKeyboardNavigation();
      this.fixFormCompatibility();
      this.setupMediaQuerySupport();
    },
    
    // Add browser and device classes to HTML element
    addBrowserClasses() {
      const browser = BrowserDetector.detectBrowser();
      const device = BrowserDetector.detectDevice();
      const html = document.documentElement;
      
      // Add browser classes
      html.classList.add(`browser-${browser.name}`);
      html.classList.add(`browser-${browser.name}-${browser.version}`);
      
      // Add device classes
      html.classList.add(`device-${device.type}`);
      if (device.mobile) html.classList.add('device-mobile');
      if (device.tablet) html.classList.add('device-tablet');
      if (!device.mobile && !device.tablet) html.classList.add('device-desktop');
      
      // Add touch support class
      if (BrowserDetector.hasTouchSupport()) {
        html.classList.add('touch-enabled');
      } else {
        html.classList.add('no-touch');
      }
      
      // Add feature support classes
      const features = ['webp', 'intersectionObserver', 'serviceWorker', 'localStorage', 'flexbox', 'grid'];
      features.forEach(feature => {
        if (BrowserDetector.supportsFeature(feature)) {
          html.classList.add(`supports-${feature}`);
        } else {
          html.classList.add(`no-${feature}`);
        }
      });
    },
    
    // Setup polyfills for older browsers
    setupPolyfills() {
      // Intersection Observer polyfill
      if (!BrowserDetector.supportsFeature('intersectionObserver')) {
        this.loadPolyfill('https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver');
      }
      
      // Fetch polyfill for IE
      if (!BrowserDetector.supportsFeature('fetch')) {
        this.loadPolyfill('https://polyfill.io/v3/polyfill.min.js?features=fetch');
      }
      
      // Promise polyfill for IE
      if (!BrowserDetector.supportsFeature('promises')) {
        this.loadPolyfill('https://polyfill.io/v3/polyfill.min.js?features=Promise');
      }
      
      // Custom properties polyfill for IE
      if (!BrowserDetector.supportsFeature('customProperties')) {
        this.loadPolyfill('https://cdn.jsdelivr.net/npm/css-vars-ponyfill@2');
      }
      
      // Object.assign polyfill
      if (!Object.assign) {
        Object.assign = function(target) {
          for (let i = 1; i < arguments.length; i++) {
            const source = arguments[i];
            for (const key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }
          return target;
        };
      }
      
      // Array.from polyfill
      if (!Array.from) {
        Array.from = function(arrayLike) {
          return Array.prototype.slice.call(arrayLike);
        };
      }
    },
    
    // Load polyfill script
    loadPolyfill(src) {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.head.appendChild(script);
    },
    
    // Fix browser-specific issues
    fixBrowserSpecificIssues() {
      const browser = BrowserDetector.detectBrowser();
      
      // Safari-specific fixes
      if (browser.name === 'safari') {
        this.fixSafariIssues();
      }
      
      // Firefox-specific fixes
      if (browser.name === 'firefox') {
        this.fixFirefoxIssues();
      }
      
      // Edge-specific fixes
      if (browser.name === 'edge') {
        this.fixEdgeIssues();
      }
      
      // IE-specific fixes
      if (browser.name === 'ie') {
        this.fixIEIssues();
      }
    },
    
    // Safari-specific fixes
    fixSafariIssues() {
      // Fix Safari's 100vh issue on mobile
      const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };
      
      setVH();
      window.addEventListener('resize', setVH);
      window.addEventListener('orientationchange', setVH);
      
      // Fix Safari's date input issues
      const dateInputs = document.querySelectorAll('input[type="date"]');
      dateInputs.forEach(input => {
        input.addEventListener('focus', () => {
          input.type = 'text';
          input.placeholder = 'YYYY-MM-DD';
        });
        
        input.addEventListener('blur', () => {
          input.type = 'date';
        });
      });
      
      // Fix Safari's sticky positioning issues
      const stickyElements = document.querySelectorAll('[style*="position: sticky"], .sticky');
      stickyElements.forEach(element => {
        element.style.webkitPosition = 'sticky';
      });
    },
    
    // Firefox-specific fixes
    fixFirefoxIssues() {
      // Fix Firefox's flexbox issues
      const flexContainers = document.querySelectorAll('.flex, [style*="display: flex"]');
      flexContainers.forEach(container => {
        container.style.display = '-moz-flex';
        container.style.display = 'flex';
      });
      
      // Fix Firefox's grid issues
      const gridContainers = document.querySelectorAll('.grid, [style*="display: grid"]');
      gridContainers.forEach(container => {
        container.style.display = '-ms-grid';
        container.style.display = 'grid';
      });
    },
    
    // Edge-specific fixes
    fixEdgeIssues() {
      // Fix Edge's CSS custom properties
      if (!BrowserDetector.supportsFeature('customProperties')) {
        // Fallback styles for Edge
        const style = document.createElement('style');
        style.textContent = `
          .header { background-color: #f5f5dc; }
          .btn--primary { background-color: #c71585; }
          .product-card { background-color: #ffffff; }
        `;
        document.head.appendChild(style);
      }
    },
    
    // IE-specific fixes
    fixIEIssues() {
      // Add IE-specific classes
      document.documentElement.classList.add('ie');
      
      // Fix IE's flexbox issues
      const style = document.createElement('style');
      style.textContent = `
        .flex { display: -ms-flexbox; display: flex; }
        .flex-column { -ms-flex-direction: column; flex-direction: column; }
        .flex-wrap { -ms-flex-wrap: wrap; flex-wrap: wrap; }
        .justify-center { -ms-flex-pack: center; justify-content: center; }
        .align-center { -ms-flex-align: center; align-items: center; }
      `;
      document.head.appendChild(style);
      
      // Fix IE's addEventListener issues
      if (!window.addEventListener) {
        window.addEventListener = function(event, callback) {
          window.attachEvent('on' + event, callback);
        };
      }
    },
    
    // Setup touch handling for mobile devices
    setupTouchHandling() {
      if (!BrowserDetector.hasTouchSupport()) return;
      
      // Add touch classes
      document.documentElement.classList.add('touch-device');
      
      // Handle touch events for better mobile experience
      let touchStartY = 0;
      let touchEndY = 0;
      
      document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });
      
      document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        this.handleSwipeGesture(touchStartY, touchEndY);
      }, { passive: true });
      
      // Prevent zoom on double tap for iOS
      let lastTouchEnd = 0;
      document.addEventListener('touchend', (e) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
          e.preventDefault();
        }
        lastTouchEnd = now;
      }, false);
      
      // Add hover effects for touch devices
      const hoverElements = document.querySelectorAll('[data-hover]');
      hoverElements.forEach(element => {
        element.addEventListener('touchstart', () => {
          element.classList.add('touch-hover');
        });
        
        element.addEventListener('touchend', () => {
          setTimeout(() => {
            element.classList.remove('touch-hover');
          }, 300);
        });
      });
    },
    
    // Handle swipe gestures
    handleSwipeGesture(startY, endY) {
      const threshold = 50;
      const diff = startY - endY;
      
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          // Swipe up
          document.dispatchEvent(new CustomEvent('swipeUp'));
        } else {
          // Swipe down
          document.dispatchEvent(new CustomEvent('swipeDown'));
        }
      }
    },
    
    // Setup keyboard navigation
    setupKeyboardNavigation() {
      // Track keyboard usage
      let isUsingKeyboard = false;
      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          isUsingKeyboard = true;
          document.documentElement.classList.add('using-keyboard');
        }
      });
      
      document.addEventListener('mousedown', () => {
        isUsingKeyboard = false;
        document.documentElement.classList.remove('using-keyboard');
      });
      
      // Enhance keyboard navigation for dropdowns
      const dropdowns = document.querySelectorAll('[data-dropdown]');
      dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('[data-dropdown-trigger]');
        const menu = dropdown.querySelector('[data-dropdown-menu]');
        
        if (trigger && menu) {
          trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              menu.classList.toggle('open');
            }
            
            if (e.key === 'Escape') {
              menu.classList.remove('open');
            }
          });
        }
      });
    },
    
    // Fix form compatibility issues
    fixFormCompatibility() {
      // Fix placeholder support for older browsers
      if (!('placeholder' in document.createElement('input'))) {
        const inputs = document.querySelectorAll('input[placeholder], textarea[placeholder]');
        inputs.forEach(input => {
          const placeholder = input.getAttribute('placeholder');
          
          if (input.value === '') {
            input.value = placeholder;
            input.classList.add('placeholder');
          }
          
          input.addEventListener('focus', () => {
            if (input.value === placeholder) {
              input.value = '';
              input.classList.remove('placeholder');
            }
          });
          
          input.addEventListener('blur', () => {
            if (input.value === '') {
              input.value = placeholder;
              input.classList.add('placeholder');
            }
          });
        });
      }
      
      // Fix HTML5 input types for older browsers
      const html5Inputs = document.querySelectorAll('input[type="email"], input[type="tel"], input[type="url"]');
      html5Inputs.forEach(input => {
        // Test if browser supports the input type
        const test = document.createElement('input');
        test.type = input.type;
        
        if (test.type === 'text') {
          // Browser doesn't support this input type
          input.type = 'text';
          
          // Add validation
          input.addEventListener('blur', () => {
            this.validateInput(input);
          });
        }
      });
    },
    
    // Validate input based on type
    validateInput(input) {
      const type = input.getAttribute('data-type') || input.type;
      const value = input.value;
      let isValid = true;
      
      switch (type) {
        case 'email':
          isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          break;
        case 'tel':
          isValid = /^[\d\s\-\+\(\)]+$/.test(value);
          break;
        case 'url':
          isValid = /^https?:\/\/.+/.test(value);
          break;
      }
      
      if (isValid) {
        input.classList.remove('invalid');
      } else {
        input.classList.add('invalid');
      }
      
      return isValid;
    },
    
    // Setup media query support for older browsers
    setupMediaQuerySupport() {
      // Polyfill for matchMedia
      if (!window.matchMedia) {
        window.matchMedia = function(query) {
          return {
            matches: false,
            media: query,
            addListener: function() {},
            removeListener: function() {}
          };
        };
      }
      
      // Setup responsive breakpoints
      const breakpoints = {
        mobile: '(max-width: 767px)',
        tablet: '(min-width: 768px) and (max-width: 1023px)',
        desktop: '(min-width: 1024px)'
      };
      
      Object.keys(breakpoints).forEach(name => {
        const mq = window.matchMedia(breakpoints[name]);
        
        const handleBreakpoint = (mq) => {
          if (mq.matches) {
            document.documentElement.classList.add(`breakpoint-${name}`);
          } else {
            document.documentElement.classList.remove(`breakpoint-${name}`);
          }
        };
        
        handleBreakpoint(mq);
        mq.addListener(handleBreakpoint);
      });
    }
  };
  
  // Testing utilities
  const TestingUtils = {
    
    // Run automated tests
    runTests() {
      console.log('Running cross-browser compatibility tests...');
      
      const tests = [
        this.testBasicFunctionality,
        this.testResponsiveDesign,
        this.testFormFunctionality,
        this.testNavigationFunctionality,
        this.testPerformance
      ];
      
      tests.forEach((test, index) => {
        try {
          test.call(this);
          console.log(`✓ Test ${index + 1} passed`);
        } catch (error) {
          console.error(`✗ Test ${index + 1} failed:`, error);
        }
      });
    },
    
    // Test basic functionality
    testBasicFunctionality() {
      // Test if essential elements exist
      const essentialElements = [
        'header',
        'main',
        'footer',
        '.product-grid',
        '.cart-drawer'
      ];
      
      essentialElements.forEach(selector => {
        const element = document.querySelector(selector);
        if (!element) {
          throw new Error(`Essential element not found: ${selector}`);
        }
      });
      
      // Test if JavaScript is working
      if (typeof Alpine === 'undefined') {
        throw new Error('Alpine.js not loaded');
      }
    },
    
    // Test responsive design
    testResponsiveDesign() {
      const viewports = [
        { width: 320, height: 568 }, // Mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1200, height: 800 }  // Desktop
      ];
      
      // This would typically be done with actual viewport changes
      // For now, we'll just check if responsive classes exist
      const responsiveElements = document.querySelectorAll('[class*="sm:"], [class*="md:"], [class*="lg:"]');
      if (responsiveElements.length === 0) {
        console.warn('No responsive utility classes found');
      }
    },
    
    // Test form functionality
    testFormFunctionality() {
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
          // Test if input is accessible
          if (!input.id && !input.getAttribute('aria-label')) {
            console.warn('Input without proper labeling found:', input);
          }
        });
      });
    },
    
    // Test navigation functionality
    testNavigationFunctionality() {
      const navLinks = document.querySelectorAll('nav a');
      navLinks.forEach(link => {
        if (!link.href || link.href === '#') {
          console.warn('Navigation link without proper href:', link);
        }
      });
    },
    
    // Test performance
    testPerformance() {
      // Check if performance API is available
      if (!window.performance) {
        throw new Error('Performance API not available');
      }
      
      // Check for large images
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (img.naturalWidth > 2000 || img.naturalHeight > 2000) {
          console.warn('Large image detected:', img.src);
        }
      });
    },
    
    // Generate test report
    generateReport() {
      const browser = BrowserDetector.detectBrowser();
      const device = BrowserDetector.detectDevice();
      
      const report = {
        timestamp: new Date().toISOString(),
        browser: browser,
        device: device,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        features: {
          webp: BrowserDetector.supportsFeature('webp'),
          intersectionObserver: BrowserDetector.supportsFeature('intersectionObserver'),
          serviceWorker: BrowserDetector.supportsFeature('serviceWorker'),
          localStorage: BrowserDetector.supportsFeature('localStorage'),
          flexbox: BrowserDetector.supportsFeature('flexbox'),
          grid: BrowserDetector.supportsFeature('grid')
        },
        performance: {
          loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
          domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
        }
      };
      
      console.log('Browser Compatibility Report:', report);
      return report;
    }
  };
  
  // Initialize cross-browser fixes
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      CrossBrowserFixes.init();
      
      // Run tests in development mode
      if (window.location.hostname === 'localhost' || window.location.hostname.includes('ngrok')) {
        setTimeout(() => {
          TestingUtils.runTests();
          TestingUtils.generateReport();
        }, 1000);
      }
    });
  } else {
    CrossBrowserFixes.init();
  }
  
  // Export for global access
  window.BrowserDetector = BrowserDetector;
  window.CrossBrowserFixes = CrossBrowserFixes;
  window.TestingUtils = TestingUtils;
  
})();