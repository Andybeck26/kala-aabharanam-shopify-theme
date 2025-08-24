/**
 * Enhanced Mobile Interactions and Touch Gestures
 * Comprehensive mobile experience optimization
 */

// Advanced Touch Gesture Handler
class TouchGestureHandler {
  constructor() {
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;
    this.threshold = 50;
    this.velocityThreshold = 0.3;
    this.startTime = 0;
    this.isScrolling = false;
    
    this.init();
  }
  
  init() {
    document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
    document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    document.addEventListener('touchcancel', this.handleTouchCancel.bind(this), { passive: true });
  }
  
  handleTouchStart(e) {
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
    this.startTime = Date.now();
    this.isScrolling = false;
  }
  
  handleTouchMove(e) {
    if (!this.startTime) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = Math.abs(currentX - this.startX);
    const deltaY = Math.abs(currentY - this.startY);
    
    // Determine if user is scrolling
    if (deltaY > deltaX && deltaY > 10) {
      this.isScrolling = true;
    }
    
    // Prevent default for horizontal swipes on specific elements
    const target = e.target.closest('.swipe-container, .product-gallery, .carousel');
    if (target && !this.isScrolling && deltaX > 10) {
      e.preventDefault();
    }
    
    // Handle pull-to-refresh prevention
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop === 0 && currentY > this.startY) {
      const pullToRefreshElement = e.target.closest('.prevent-pull-refresh');
      if (pullToRefreshElement) {
        e.preventDefault();
      }
    }
  }
  
  handleTouchEnd(e) {
    if (!this.startTime) return;
    
    this.endX = e.changedTouches[0].clientX;
    this.endY = e.changedTouches[0].clientY;
    
    const duration = Date.now() - this.startTime;
    const deltaX = this.endX - this.startX;
    const deltaY = this.endY - this.startY;
    const velocity = Math.abs(deltaX) / duration;
    
    // Only process swipes if not scrolling
    if (!this.isScrolling) {
      this.detectSwipe(deltaX, deltaY, velocity, e.target);
    }
    
    this.reset();
  }
  
  handleTouchCancel() {
    this.reset();
  }
  
  reset() {
    this.startTime = 0;
    this.isScrolling = false;
  }
  
  detectSwipe(deltaX, deltaY, velocity, target) {
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    // Check if it's a valid swipe
    if (absX > this.threshold || absY > this.threshold || velocity > this.velocityThreshold) {
      
      if (absX > absY) {
        // Horizontal swipe
        const direction = deltaX > 0 ? 'right' : 'left';
        this.dispatchSwipeEvent(direction, target, { deltaX, velocity });
      } else {
        // Vertical swipe
        const direction = deltaY > 0 ? 'down' : 'up';
        this.dispatchSwipeEvent(direction, target, { deltaY, velocity });
      }
    }
  }
  
  dispatchSwipeEvent(direction, target, details) {
    const event = new CustomEvent(`swipe${direction.charAt(0).toUpperCase() + direction.slice(1)}`, {
      detail: { target, ...details },
      bubbles: true
    });
    
    target.dispatchEvent(event);
    document.dispatchEvent(event);
  }
}

// Enhanced Mobile Menu Handler
class MobileMenuHandler {
  constructor() {
    this.isOpen = false;
    this.overlay = null;
    this.focusTrap = null;
    this.init();
  }
  
  init() {
    this.createMenuStructure();
    this.setupEventListeners();
    this.setupAccessibility();
  }
  
  createMenuStructure() {
    const menuToggle = document.querySelector('.header__menu-toggle');
    const mobileMenu = document.querySelector('.header__mobile-menu');
    
    if (menuToggle && mobileMenu) {
      // Create overlay
      this.overlay = document.createElement('div');
      this.overlay.className = 'mobile-menu-overlay';
      document.body.appendChild(this.overlay);
      
      // Add close button to menu
      const closeButton = document.createElement('button');
      closeButton.className = 'mobile-menu-close';
      closeButton.innerHTML = '×';
      closeButton.setAttribute('aria-label', 'Close menu');
      mobileMenu.insertBefore(closeButton, mobileMenu.firstChild);
    }
  }
  
  setupEventListeners() {
    const menuToggle = document.querySelector('.header__menu-toggle');
    const mobileMenu = document.querySelector('.header__mobile-menu');
    const closeButton = document.querySelector('.mobile-menu-close');
    
    if (menuToggle) {
      menuToggle.addEventListener('click', this.toggleMenu.bind(this));
    }
    
    if (closeButton) {
      closeButton.addEventListener('click', this.closeMenu.bind(this));
    }
    
    if (this.overlay) {
      this.overlay.addEventListener('click', this.closeMenu.bind(this));
    }
    
    // Handle swipe gestures
    document.addEventListener('swipeLeft', (e) => {
      if (this.isOpen && e.detail.target.closest('.header__mobile-menu')) {
        this.closeMenu();
      }
    });
    
    document.addEventListener('swipeRight', (e) => {
      const startX = e.detail.target.getBoundingClientRect().left;
      if (!this.isOpen && startX < 20) { // Edge swipe
        this.openMenu();
      }
    });
    
    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMenu();
      }
    });
  }
  
  setupAccessibility() {
    const menuToggle = document.querySelector('.header__menu-toggle');
    const mobileMenu = document.querySelector('.header__mobile-menu');
    
    if (menuToggle && mobileMenu) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-controls', 'mobile-menu');
      mobileMenu.setAttribute('id', 'mobile-menu');
      mobileMenu.setAttribute('role', 'navigation');
      mobileMenu.setAttribute('aria-label', 'Mobile navigation');
    }
  }
  
  toggleMenu() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }
  
  openMenu() {
    this.isOpen = true;
    document.body.classList.add('mobile-menu-open');
    document.querySelector('.header__mobile-menu').classList.add('open');
    this.overlay.classList.add('visible');
    
    // Update ARIA attributes
    const menuToggle = document.querySelector('.header__menu-toggle');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'true');
    }
    
    // Focus management
    const firstFocusable = document.querySelector('.header__mobile-menu button, .header__mobile-menu a');
    if (firstFocusable) {
      firstFocusable.focus();
    }
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Announce to screen readers
    this.announceToScreenReader('Menu opened');
  }
  
  closeMenu() {
    this.isOpen = false;
    document.body.classList.remove('mobile-menu-open');
    document.querySelector('.header__mobile-menu').classList.remove('open');
    this.overlay.classList.remove('visible');
    
    // Update ARIA attributes
    const menuToggle = document.querySelector('.header__menu-toggle');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.focus(); // Return focus to toggle button
    }
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Announce to screen readers
    this.announceToScreenReader('Menu closed');
  }
  
  announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
}

// Enhanced Cart Drawer Handler
class MobileCartHandler {
  constructor() {
    this.isOpen = false;
    this.startY = 0;
    this.currentY = 0;
    this.isDragging = false;
    this.init();
  }
  
  init() {
    this.setupSwipeToClose();
    this.setupEdgeSwipeToOpen();
    this.setupDragToClose();
  }
  
  setupSwipeToClose() {
    document.addEventListener('swipeDown', (e) => {
      const cartDrawer = document.querySelector('.cart-drawer');
      if (cartDrawer && cartDrawer.classList.contains('open')) {
        const swipeTarget = e.detail.target.closest('.cart-drawer');
        if (swipeTarget) {
          Alpine.store('ui').closeCartDrawer();
        }
      }
    });
  }
  
  setupEdgeSwipeToOpen() {
    let edgeSwipeStarted = false;
    
    document.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      if (touch.clientX > window.innerWidth - 30) {
        edgeSwipeStarted = true;
      }
    }, { passive: true });
    
    document.addEventListener('swipeLeft', (e) => {
      if (edgeSwipeStarted && e.detail.deltaX < -50) {
        Alpine.store('ui').openCartDrawer();
        edgeSwipeStarted = false;
      }
    });
    
    document.addEventListener('touchend', () => {
      edgeSwipeStarted = false;
    }, { passive: true });
  }
  
  setupDragToClose() {
    const cartDrawer = document.querySelector('.cart-drawer');
    if (!cartDrawer) return;
    
    cartDrawer.addEventListener('touchstart', (e) => {
      if (cartDrawer.classList.contains('open')) {
        this.startY = e.touches[0].clientY;
        this.isDragging = true;
      }
    }, { passive: true });
    
    cartDrawer.addEventListener('touchmove', (e) => {
      if (!this.isDragging) return;
      
      this.currentY = e.touches[0].clientY;
      const deltaY = this.currentY - this.startY;
      
      if (deltaY > 0) {
        // Dragging down
        const progress = Math.min(deltaY / 200, 1);
        cartDrawer.style.transform = `translateX(${progress * 100}%)`;
        cartDrawer.style.opacity = 1 - progress * 0.5;
      }
    }, { passive: true });
    
    cartDrawer.addEventListener('touchend', () => {
      if (!this.isDragging) return;
      
      const deltaY = this.currentY - this.startY;
      
      if (deltaY > 100) {
        // Close cart if dragged down enough
        Alpine.store('ui').closeCartDrawer();
      } else {
        // Snap back to original position
        cartDrawer.style.transform = '';
        cartDrawer.style.opacity = '';
      }
      
      this.isDragging = false;
    }, { passive: true });
  }
}

// Enhanced Mobile Form Handler
class MobileFormHandler {
  constructor() {
    this.init();
  }
  
  init() {
    this.enhanceInputs();
    this.setupVirtualKeyboard();
    this.setupFormValidation();
    this.setupAutoComplete();
  }
  
  enhanceInputs() {
    // Enhanced input type detection and setup
    const inputEnhancements = {
      phone: { type: 'tel', pattern: '[0-9]*', inputMode: 'numeric' },
      email: { type: 'email', inputMode: 'email', autocomplete: 'email' },
      name: { autocomplete: 'name', inputMode: 'text' },
      address: { autocomplete: 'address-line1', inputMode: 'text' },
      postal: { inputMode: 'numeric', autocomplete: 'postal-code' },
      credit: { inputMode: 'numeric', autocomplete: 'cc-number' }
    };
    
    Object.keys(inputEnhancements).forEach(key => {
      const inputs = document.querySelectorAll(`input[name*="${key}"], input[data-type="${key}"]`);
      inputs.forEach(input => {
        Object.assign(input, inputEnhancements[key]);
      });
    });
    
    // Add visual feedback for input states
    const allInputs = document.querySelectorAll('input, textarea, select');
    allInputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.closest('.form-field, .input-wrapper')?.classList.add('focused');
      });
      
      input.addEventListener('blur', () => {
        input.closest('.form-field, .input-wrapper')?.classList.remove('focused');
      });
      
      input.addEventListener('input', () => {
        const wrapper = input.closest('.form-field, .input-wrapper');
        if (wrapper) {
          wrapper.classList.toggle('has-value', input.value.length > 0);
        }
      });
    });
  }
  
  setupVirtualKeyboard() {
    let initialViewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    
    const handleViewportChange = () => {
      const currentHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      const heightDifference = initialViewportHeight - currentHeight;
      
      if (heightDifference > 150) {
        document.body.classList.add('keyboard-open');
        document.documentElement.style.setProperty('--keyboard-height', `${heightDifference}px`);
      } else {
        document.body.classList.remove('keyboard-open');
        document.documentElement.style.removeProperty('--keyboard-height');
      }
    };
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
    } else {
      window.addEventListener('resize', handleViewportChange);
    }
    
    // Enhanced scroll into view for inputs
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        setTimeout(() => {
          const rect = input.getBoundingClientRect();
          const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
          
          if (rect.bottom > viewportHeight * 0.5) {
            input.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'nearest'
            });
          }
        }, 300);
      });
    });
  }
  
  setupFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        if (!this.validateForm(form)) {
          e.preventDefault();
        }
      });
    });
  }
  
  validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
      const fieldValid = this.validateField(input);
      if (!fieldValid) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  validateField(input) {
    const value = input.value.trim();
    const type = input.type || input.dataset.type;
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (input.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }
    
    // Type-specific validation
    if (value && type) {
      switch (type) {
        case 'email':
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
          }
          break;
        case 'tel':
          if (!/^[\d\s\-\+\(\)]+$/.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
          }
          break;
        case 'url':
          if (!/^https?:\/\/.+/.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid URL';
          }
          break;
      }
    }
    
    // Update UI
    const wrapper = input.closest('.form-field, .input-wrapper');
    if (wrapper) {
      wrapper.classList.toggle('error', !isValid);
      
      let errorElement = wrapper.querySelector('.error-message');
      if (!isValid && errorMessage) {
        if (!errorElement) {
          errorElement = document.createElement('div');
          errorElement.className = 'error-message';
          wrapper.appendChild(errorElement);
        }
        errorElement.textContent = errorMessage;
      } else if (errorElement) {
        errorElement.remove();
      }
    }
    
    return isValid;
  }
  
  setupAutoComplete() {
    // Enhanced autocomplete for common fields
    const autoCompleteFields = {
      'given-name': 'input[name*="first"], input[name*="fname"]',
      'family-name': 'input[name*="last"], input[name*="lname"]',
      'email': 'input[type="email"], input[name*="email"]',
      'tel': 'input[type="tel"], input[name*="phone"]',
      'address-line1': 'input[name*="address1"], input[name*="street"]',
      'address-line2': 'input[name*="address2"], input[name*="apt"]',
      'address-level2': 'input[name*="city"]',
      'address-level1': 'input[name*="state"], input[name*="province"]',
      'postal-code': 'input[name*="zip"], input[name*="postal"]',
      'country': 'select[name*="country"]'
    };
    
    Object.keys(autoCompleteFields).forEach(autocomplete => {
      const inputs = document.querySelectorAll(autoCompleteFields[autocomplete]);
      inputs.forEach(input => {
        if (!input.getAttribute('autocomplete')) {
          input.setAttribute('autocomplete', autocomplete);
        }
      });
    });
  }
}

// Initialize all mobile enhancements
document.addEventListener('DOMContentLoaded', () => {
  // Check if device is mobile or has touch support
  const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  if (isMobile) {
    new TouchGestureHandler();
    new MobileMenuHandler();
    new MobileCartHandler();
    new MobileFormHandler();
    
    // Add mobile class to body
    document.body.classList.add('mobile-device');
  }
});

// Handle orientation changes
window.addEventListener('orientationchange', () => {
  // Update viewport height for iOS Safari
  setTimeout(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Trigger resize event for other components
    window.dispatchEvent(new Event('resize'));
  }, 100);
});

// Export for global access
window.TouchGestureHandler = TouchGestureHandler;
window.MobileMenuHandler = MobileMenuHandler;
window.MobileCartHandler = MobileCartHandler;
window.MobileFormHandler = MobileFormHandler;