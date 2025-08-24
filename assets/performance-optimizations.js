/**
 * Performance Optimizations for Kala Aabharanam Theme
 * Implements various performance enhancements and Core Web Vitals optimizations
 */

(function() {
  'use strict';
  
  // Performance optimization utilities
  const PerformanceOptimizer = {
    
    // Initialize all performance optimizations
    init() {
      this.optimizeImages();
      this.optimizeFonts();
      this.optimizeScripts();
      this.optimizeCSS();
      this.setupIntersectionObserver();
      this.optimizeThirdPartyScripts();
      this.setupResourceHints();
      this.optimizeLayoutShift();
      this.setupPerformanceMonitoring();
    },
    
    // Optimize image loading and reduce LCP
    optimizeImages() {
      // Lazy load images below the fold
      const images = document.querySelectorAll('img[loading="lazy"]');
      
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              
              // Preload the image
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
              }
              
              // Handle srcset
              if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
                img.removeAttribute('data-srcset');
              }
              
              // Add loaded class when image loads
              img.addEventListener('load', () => {
                img.classList.add('loaded');
              });
              
              observer.unobserve(img);
            }
          });
        }, {
          rootMargin: '50px 0px',
          threshold: 0.01
        });
        
        images.forEach(img => imageObserver.observe(img));
      } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }
        });
      }
      
      // Optimize hero images for LCP
      const heroImages = document.querySelectorAll('.hero img, .banner img');
      heroImages.forEach(img => {
        img.loading = 'eager';
        img.fetchPriority = 'high';
      });
    },
    
    // Optimize font loading to reduce CLS
    optimizeFonts() {
      // Preload critical fonts
      const criticalFonts = [
        'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtXK-F2qO0isEw.woff2',
        'https://fonts.gstatic.com/s/lato/v24/S6uNw4BKXS-wLx5_0w.woff2'
      ];
      
      criticalFonts.forEach(fontUrl => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        link.href = fontUrl;
        document.head.appendChild(link);
      });
      
      // Use font-display: swap for web fonts
      if ('fonts' in document) {
        document.fonts.ready.then(() => {
          document.body.classList.add('fonts-loaded');
        });
      }
    },
    
    // Optimize JavaScript loading and execution
    optimizeScripts() {
      // Defer non-critical scripts
      const nonCriticalScripts = document.querySelectorAll('script[data-defer]');
      
      const loadDeferredScripts = () => {
        nonCriticalScripts.forEach(script => {
          const newScript = document.createElement('script');
          newScript.src = script.dataset.src || script.src;
          newScript.async = true;
          document.head.appendChild(newScript);
        });
      };
      
      // Load deferred scripts after page load
      if (document.readyState === 'complete') {
        loadDeferredScripts();
      } else {
        window.addEventListener('load', loadDeferredScripts);
      }
      
      // Optimize Alpine.js initialization
      if (window.Alpine) {
        Alpine.start();
      }
    },
    
    // Optimize CSS loading
    optimizeCSS() {
      // Load non-critical CSS asynchronously
      const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"][media="print"]');
      
      nonCriticalCSS.forEach(link => {
        link.addEventListener('load', () => {
          link.media = 'all';
        });
      });
      
      // Remove unused CSS (basic implementation)
      this.removeUnusedCSS();
    },
    
    // Remove unused CSS to reduce bundle size
    removeUnusedCSS() {
      // This is a simplified implementation
      // In production, use tools like PurgeCSS or UnCSS
      
      const unusedSelectors = [
        '.unused-class',
        '.debug-only',
        '.development-only'
      ];
      
      unusedSelectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => el.remove());
        } catch (e) {
          // Ignore invalid selectors
        }
      });
    },
    
    // Setup Intersection Observer for various optimizations
    setupIntersectionObserver() {
      if (!('IntersectionObserver' in window)) return;
      
      // Lazy load sections
      const lazyElements = document.querySelectorAll('[data-lazy]');
      
      const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;
            
            // Load background images
            if (element.dataset.bg) {
              element.style.backgroundImage = `url(${element.dataset.bg})`;
            }
            
            // Initialize components
            if (element.dataset.component) {
              this.initializeComponent(element, element.dataset.component);
            }
            
            element.classList.add('loaded');
            lazyObserver.unobserve(element);
          }
        });
      }, {
        rootMargin: '100px 0px',
        threshold: 0.1
      });
      
      lazyElements.forEach(el => lazyObserver.observe(el));
    },
    
    // Initialize components on demand
    initializeComponent(element, componentName) {
      switch (componentName) {
        case 'product-reviews':
          this.loadProductReviews(element);
          break;
        case 'live-chat':
          this.loadLiveChat(element);
          break;
        case 'newsletter':
          this.initializeNewsletter(element);
          break;
        default:
          console.warn(`Unknown component: ${componentName}`);
      }
    },
    
    // Optimize third-party scripts
    optimizeThirdPartyScripts() {
      // Delay loading of non-essential third-party scripts
      const delayedScripts = [
        'google-analytics',
        'facebook-pixel',
        'hotjar',
        'intercom'
      ];
      
      // Load after user interaction or 3 seconds
      const loadThirdPartyScripts = () => {
        delayedScripts.forEach(scriptId => {
          const script = document.querySelector(`[data-script="${scriptId}"]`);
          if (script && script.dataset.src) {
            const newScript = document.createElement('script');
            newScript.src = script.dataset.src;
            newScript.async = true;
            document.head.appendChild(newScript);
          }
        });
      };
      
      // Load on first user interaction
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      const loadOnInteraction = () => {
        loadThirdPartyScripts();
        events.forEach(event => {
          document.removeEventListener(event, loadOnInteraction, true);
        });
      };
      
      events.forEach(event => {
        document.addEventListener(event, loadOnInteraction, true);
      });
      
      // Fallback: load after 3 seconds
      setTimeout(loadThirdPartyScripts, 3000);
    },
    
    // Setup resource hints for better performance
    setupResourceHints() {
      const resourceHints = [
        { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
        { rel: 'dns-prefetch', href: '//www.google-analytics.com' },
        { rel: 'preconnect', href: 'https://cdn.shopify.com', crossorigin: true }
      ];
      
      resourceHints.forEach(hint => {
        const link = document.createElement('link');
        link.rel = hint.rel;
        link.href = hint.href;
        if (hint.crossorigin) link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    },
    
    // Optimize layout shift (CLS)
    optimizeLayoutShift() {
      // Reserve space for images
      const images = document.querySelectorAll('img:not([width]):not([height])');
      images.forEach(img => {
        if (img.naturalWidth && img.naturalHeight) {
          img.width = img.naturalWidth;
          img.height = img.naturalHeight;
        }
      });
      
      // Reserve space for ads and embeds
      const ads = document.querySelectorAll('[data-ad-slot]');
      ads.forEach(ad => {
        if (!ad.style.minHeight) {
          ad.style.minHeight = '250px'; // Standard ad height
        }
      });
      
      // Prevent layout shift from web fonts
      document.documentElement.classList.add('fonts-loading');
      
      if ('fonts' in document) {
        document.fonts.ready.then(() => {
          document.documentElement.classList.remove('fonts-loading');
          document.documentElement.classList.add('fonts-loaded');
        });
      }
    },
    
    // Setup performance monitoring
    setupPerformanceMonitoring() {
      // Monitor long tasks
      if ('PerformanceObserver' in window) {
        try {
          const longTaskObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
              if (entry.duration > 50) {
                console.warn('Long task detected:', {
                  duration: entry.duration,
                  startTime: entry.startTime,
                  name: entry.name
                });
                
                // Report to analytics
                if (typeof gtag !== 'undefined') {
                  gtag('event', 'long_task', {
                    event_category: 'Performance',
                    event_label: entry.name,
                    value: Math.round(entry.duration)
                  });
                }
              }
            });
          });
          
          longTaskObserver.observe({ type: 'longtask', buffered: true });
        } catch (e) {
          // Long task API not supported
        }
      }
      
      // Monitor memory usage
      if ('memory' in performance) {
        setInterval(() => {
          const memory = performance.memory;
          const memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
          
          if (memoryUsage > 0.9) {
            console.warn('High memory usage detected:', {
              used: memory.usedJSHeapSize,
              total: memory.totalJSHeapSize,
              limit: memory.jsHeapSizeLimit,
              percentage: Math.round(memoryUsage * 100)
            });
          }
        }, 30000); // Check every 30 seconds
      }
    },
    
    // Load product reviews on demand
    loadProductReviews(element) {
      if (window.jdgm) {
        window.jdgm.customizeBadges();
      } else {
        // Load Judge.me script
        const script = document.createElement('script');
        script.src = 'https://cdn.judge.me/shopify_v2.js';
        script.async = true;
        document.head.appendChild(script);
      }
    },
    
    // Load live chat on demand
    loadLiveChat(element) {
      if (!window.tidioChatApi) {
        const script = document.createElement('script');
        script.src = '//code.tidio.co/your-tidio-key.js';
        script.async = true;
        document.head.appendChild(script);
      }
    },
    
    // Initialize newsletter component
    initializeNewsletter(element) {
      const form = element.querySelector('form');
      if (form) {
        form.addEventListener('submit', this.handleNewsletterSubmit.bind(this));
      }
    },
    
    // Handle newsletter form submission
    handleNewsletterSubmit(event) {
      event.preventDefault();
      
      const form = event.target;
      const email = form.querySelector('input[type="email"]').value;
      
      // Basic email validation
      if (!this.isValidEmail(email)) {
        this.showNotification('Please enter a valid email address', 'error');
        return;
      }
      
      // Submit to Shopify
      fetch('/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'form_type': 'customer',
          'utf8': '✓',
          'contact[tags]': 'newsletter',
          'contact[email]': email
        })
      })
      .then(response => {
        if (response.ok) {
          this.showNotification('Thank you for subscribing!', 'success');
          form.reset();
        } else {
          throw new Error('Subscription failed');
        }
      })
      .catch(error => {
        console.error('Newsletter subscription error:', error);
        this.showNotification('Subscription failed. Please try again.', 'error');
      });
    },
    
    // Validate email address
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    
    // Show notification to user
    showNotification(message, type = 'info') {
      if (window.KalaAabharanam && window.KalaAabharanam.showNotification) {
        window.KalaAabharanam.showNotification(message, type);
      } else {
        // Fallback notification
        alert(message);
      }
    }
  };
  
  // Initialize performance optimizations
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      PerformanceOptimizer.init();
    });
  } else {
    PerformanceOptimizer.init();
  }
  
  // Export for global access
  window.PerformanceOptimizer = PerformanceOptimizer;
  
})();

// Service Worker registration for caching
if ('serviceWorker' in navigator && !Shopify.designMode) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Preload critical resources on hover
document.addEventListener('mouseover', (event) => {
  const link = event.target.closest('a[href]');
  if (link && link.hostname === location.hostname) {
    const url = link.href;
    
    // Only preload if not already preloaded
    if (!document.querySelector(`link[rel="prefetch"][href="${url}"]`)) {
      const prefetchLink = document.createElement('link');
      prefetchLink.rel = 'prefetch';
      prefetchLink.href = url;
      document.head.appendChild(prefetchLink);
    }
  }
});

// Optimize scroll performance
let ticking = false;

function updateScrollPosition() {
  // Perform scroll-related updates here
  ticking = false;
}

document.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateScrollPosition);
    ticking = true;
  }
});

// Reduce JavaScript execution time
const optimizeJavaScript = () => {
  // Use requestIdleCallback for non-critical tasks
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Perform non-critical tasks here
      console.log('Performing non-critical tasks during idle time');
    });
  }
  
  // Break up long tasks
  const performLongTask = (tasks) => {
    const performChunk = () => {
      const start = performance.now();
      
      while (tasks.length > 0 && (performance.now() - start) < 5) {
        const task = tasks.shift();
        task();
      }
      
      if (tasks.length > 0) {
        setTimeout(performChunk, 0);
      }
    };
    
    performChunk();
  };
  
  // Example usage
  const tasks = [];
  for (let i = 0; i < 1000; i++) {
    tasks.push(() => {
      // Some task
    });
  }
  
  performLongTask(tasks);
};

// Initialize JavaScript optimizations
optimizeJavaScript();