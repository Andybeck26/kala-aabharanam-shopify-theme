/**
 * Accessibility Compliance Testing and Enhancement
 * WCAG 2.1 AA compliance implementation and testing
 */

(function() {
  'use strict';
  
  // Accessibility Compliance Manager
  const AccessibilityCompliance = {
    
    // Initialize accessibility enhancements
    init() {
      this.setupKeyboardNavigation();
      this.setupScreenReaderSupport();
      this.setupFocusManagement();
      this.setupColorContrastEnhancements();
      this.setupMotionPreferences();
      this.setupFormAccessibility();
      this.setupLandmarksAndHeadings();
      this.runAccessibilityTests();
    },
    
    // Setup keyboard navigation
    setupKeyboardNavigation() {
      // Track keyboard usage for focus visibility
      let isUsingKeyboard = false;
      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          isUsingKeyboard = true;
          document.documentElement.classList.add('using-keyboard');
        }
        
        // Handle escape key for modals and dropdowns
        if (e.key === 'Escape') {
          this.handleEscapeKey();
        }
        
        // Handle arrow keys for navigation
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          this.handleArrowNavigation(e);
        }
        
        // Handle Enter and Space for activation
        if (e.key === 'Enter' || e.key === ' ') {
          this.handleActivationKeys(e);
        }
      });
      
      document.addEventListener('mousedown', () => {
        isUsingKeyboard = false;
        document.documentElement.classList.remove('using-keyboard');
      });
      
      // Skip to main content functionality
      const skipLink = document.querySelector('.skip-to-content-link');
      if (skipLink) {
        skipLink.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector('#MainContent');
          if (target) {
            target.focus();
            target.scrollIntoView({ behavior: 'smooth' });
          }
        });
      }
      
      // Enhance dropdown navigation
      this.setupDropdownKeyboardNavigation();
      
      // Enhance modal keyboard navigation
      this.setupModalKeyboardNavigation();
    },
    
    // Setup dropdown keyboard navigation
    setupDropdownKeyboardNavigation() {
      const dropdowns = document.querySelectorAll('[data-dropdown]');
      
      dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('[data-dropdown-trigger]');
        const menu = dropdown.querySelector('[data-dropdown-menu]');
        const items = menu ? menu.querySelectorAll('a, button') : [];
        
        if (!trigger || !menu) return;
        
        let currentIndex = -1;
        
        trigger.addEventListener('keydown', (e) => {
          switch (e.key) {
            case 'Enter':
            case ' ':
              e.preventDefault();
              this.toggleDropdown(dropdown);
              if (menu.classList.contains('open')) {
                currentIndex = 0;
                items[0]?.focus();
              }
              break;
            case 'ArrowDown':
              e.preventDefault();
              this.openDropdown(dropdown);
              currentIndex = 0;
              items[0]?.focus();
              break;
            case 'Escape':
              this.closeDropdown(dropdown);
              trigger.focus();
              break;
          }
        });
        
        menu.addEventListener('keydown', (e) => {
          switch (e.key) {
            case 'ArrowDown':
              e.preventDefault();
              currentIndex = (currentIndex + 1) % items.length;
              items[currentIndex]?.focus();
              break;
            case 'ArrowUp':
              e.preventDefault();
              currentIndex = (currentIndex - 1 + items.length) % items.length;
              items[currentIndex]?.focus();
              break;
            case 'Escape':
              e.preventDefault();
              this.closeDropdown(dropdown);
              trigger.focus();
              break;
            case 'Tab':
              if (e.shiftKey && currentIndex === 0) {
                this.closeDropdown(dropdown);
              } else if (!e.shiftKey && currentIndex === items.length - 1) {
                this.closeDropdown(dropdown);
              }
              break;
          }
        });
      });
    },
    
    // Setup modal keyboard navigation
    setupModalKeyboardNavigation() {
      const modals = document.querySelectorAll('[role="dialog"], .modal');
      
      modals.forEach(modal => {
        modal.addEventListener('keydown', (e) => {
          if (e.key === 'Tab') {
            this.trapFocus(modal, e);
          }
        });
      });
    },
    
    // Trap focus within an element
    trapFocus(element, event) {
      const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    },
    
    // Handle escape key
    handleEscapeKey() {
      // Close any open modals
      const openModals = document.querySelectorAll('.modal.open, [role="dialog"][aria-hidden="false"]');
      openModals.forEach(modal => {
        this.closeModal(modal);
      });
      
      // Close any open dropdowns
      const openDropdowns = document.querySelectorAll('[data-dropdown] .open');
      openDropdowns.forEach(dropdown => {
        this.closeDropdown(dropdown.closest('[data-dropdown]'));
      });
      
      // Close mobile menu
      if (document.body.classList.contains('mobile-menu-open')) {
        const closeButton = document.querySelector('.mobile-menu-close');
        if (closeButton) {
          closeButton.click();
        }
      }
    },
    
    // Handle arrow key navigation
    handleArrowNavigation(event) {
      const target = event.target;
      
      // Handle carousel navigation
      if (target.closest('.carousel, .gallery')) {
        this.handleCarouselNavigation(event);
      }
      
      // Handle menu navigation
      if (target.closest('[role="menu"], [role="menubar"]')) {
        this.handleMenuNavigation(event);
      }
    },
    
    // Handle activation keys (Enter/Space)
    handleActivationKeys(event) {
      const target = event.target;
      
      // Handle custom buttons
      if (target.matches('[role="button"]:not(button)')) {
        event.preventDefault();
        target.click();
      }
      
      // Handle disclosure widgets
      if (target.matches('[aria-expanded]')) {
        event.preventDefault();
        const expanded = target.getAttribute('aria-expanded') === 'true';
        target.setAttribute('aria-expanded', !expanded);
        
        // Toggle associated content
        const controls = target.getAttribute('aria-controls');
        if (controls) {
          const content = document.getElementById(controls);
          if (content) {
            content.hidden = expanded;
          }
        }
      }
    },
    
    // Setup screen reader support
    setupScreenReaderSupport() {
      // Add live regions for dynamic content
      this.createLiveRegions();
      
      // Enhance form labels and descriptions
      this.enhanceFormLabels();
      
      // Add descriptive text for complex UI elements
      this.addDescriptiveText();
      
      // Setup ARIA landmarks
      this.setupARIALandmarks();
      
      // Enhance image alt text
      this.enhanceImageAltText();
    },
    
    // Create live regions for announcements
    createLiveRegions() {
      // Create polite live region
      const politeRegion = document.createElement('div');
      politeRegion.id = 'polite-announcements';
      politeRegion.setAttribute('aria-live', 'polite');
      politeRegion.setAttribute('aria-atomic', 'true');
      politeRegion.className = 'sr-only';
      document.body.appendChild(politeRegion);
      
      // Create assertive live region
      const assertiveRegion = document.createElement('div');
      assertiveRegion.id = 'assertive-announcements';
      assertiveRegion.setAttribute('aria-live', 'assertive');
      assertiveRegion.setAttribute('aria-atomic', 'true');
      assertiveRegion.className = 'sr-only';
      document.body.appendChild(assertiveRegion);
      
      // Create status region
      const statusRegion = document.createElement('div');
      statusRegion.id = 'status-announcements';
      statusRegion.setAttribute('role', 'status');
      statusRegion.setAttribute('aria-atomic', 'true');
      statusRegion.className = 'sr-only';
      document.body.appendChild(statusRegion);
    },
    
    // Announce to screen readers
    announce(message, priority = 'polite') {
      const regionId = priority === 'assertive' ? 'assertive-announcements' : 
                      priority === 'status' ? 'status-announcements' : 
                      'polite-announcements';
      
      const region = document.getElementById(regionId);
      if (region) {
        region.textContent = message;
        
        // Clear after announcement
        setTimeout(() => {
          region.textContent = '';
        }, 1000);
      }
    },
    
    // Enhance form labels and descriptions
    enhanceFormLabels() {
      const inputs = document.querySelectorAll('input, textarea, select');
      
      inputs.forEach(input => {
        // Ensure every input has a label
        if (!input.id) {
          input.id = `input-${Math.random().toString(36).substr(2, 9)}`;
        }
        
        let label = document.querySelector(`label[for="${input.id}"]`);
        if (!label) {
          // Look for implicit label
          label = input.closest('label');
          if (label) {
            label.setAttribute('for', input.id);
          } else {
            // Create label from placeholder or name
            const labelText = input.placeholder || input.name || 'Input field';
            label = document.createElement('label');
            label.setAttribute('for', input.id);
            label.textContent = labelText;
            label.className = 'sr-only';
            input.parentNode.insertBefore(label, input);
          }
        }
        
        // Add required indicator
        if (input.hasAttribute('required')) {
          const requiredText = label.querySelector('.required-indicator');
          if (!requiredText) {
            const required = document.createElement('span');
            required.className = 'required-indicator';
            required.textContent = ' (required)';
            required.setAttribute('aria-label', 'required');
            label.appendChild(required);
          }
          
          input.setAttribute('aria-required', 'true');
        }
        
        // Add error descriptions
        const errorElement = input.parentNode.querySelector('.error-message, .field-error');
        if (errorElement) {
          if (!errorElement.id) {
            errorElement.id = `error-${input.id}`;
          }
          input.setAttribute('aria-describedby', errorElement.id);
          errorElement.setAttribute('role', 'alert');
        }
        
        // Add help text descriptions
        const helpElement = input.parentNode.querySelector('.help-text, .field-help');
        if (helpElement) {
          if (!helpElement.id) {
            helpElement.id = `help-${input.id}`;
          }
          const describedBy = input.getAttribute('aria-describedby');
          input.setAttribute('aria-describedby', 
            describedBy ? `${describedBy} ${helpElement.id}` : helpElement.id);
        }
      });
    },
    
    // Add descriptive text for complex UI elements
    addDescriptiveText() {
      // Add descriptions for buttons with only icons
      const iconButtons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
      iconButtons.forEach(button => {
        const icon = button.querySelector('svg, .icon');
        const text = button.textContent.trim();
        
        if (icon && !text) {
          // Try to determine button purpose from context
          let purpose = 'Button';
          
          if (button.classList.contains('cart-btn') || button.closest('.cart')) {
            purpose = 'View cart';
          } else if (button.classList.contains('search-btn') || button.closest('.search')) {
            purpose = 'Search';
          } else if (button.classList.contains('menu-toggle')) {
            purpose = 'Toggle menu';
          } else if (button.classList.contains('close')) {
            purpose = 'Close';
          }
          
          button.setAttribute('aria-label', purpose);
        }
      });
      
      // Add descriptions for product cards
      const productCards = document.querySelectorAll('.product-card');
      productCards.forEach(card => {
        const title = card.querySelector('.product-title, .product-card__title');
        const price = card.querySelector('.price, .product-price');
        const link = card.querySelector('a');
        
        if (title && price && link) {
          const description = `${title.textContent.trim()}, ${price.textContent.trim()}`;
          link.setAttribute('aria-label', description);
        }
      });
    },
    
    // Setup ARIA landmarks
    setupARIALandmarks() {
      // Add main landmark if not present
      const main = document.querySelector('main');
      if (main && !main.getAttribute('role')) {
        main.setAttribute('role', 'main');
      }
      
      // Add navigation landmarks
      const navs = document.querySelectorAll('nav:not([aria-label]):not([aria-labelledby])');
      navs.forEach((nav, index) => {
        if (nav.classList.contains('header__nav') || nav.closest('header')) {
          nav.setAttribute('aria-label', 'Main navigation');
        } else if (nav.classList.contains('footer__nav') || nav.closest('footer')) {
          nav.setAttribute('aria-label', 'Footer navigation');
        } else if (nav.classList.contains('breadcrumb')) {
          nav.setAttribute('aria-label', 'Breadcrumb');
        } else {
          nav.setAttribute('aria-label', `Navigation ${index + 1}`);
        }
      });
      
      // Add search landmark
      const searchForms = document.querySelectorAll('form[role="search"], .search-form');
      searchForms.forEach(form => {
        form.setAttribute('role', 'search');
        if (!form.getAttribute('aria-label')) {
          form.setAttribute('aria-label', 'Site search');
        }
      });
      
      // Add complementary landmarks
      const asides = document.querySelectorAll('aside:not([aria-label])');
      asides.forEach((aside, index) => {
        aside.setAttribute('aria-label', `Sidebar ${index + 1}`);
      });
    },
    
    // Enhance image alt text
    enhanceImageAltText() {
      const images = document.querySelectorAll('img');
      
      images.forEach(img => {
        // Skip decorative images
        if (img.getAttribute('alt') === '' || img.getAttribute('role') === 'presentation') {
          return;
        }
        
        // Add alt text if missing
        if (!img.hasAttribute('alt')) {
          // Try to get alt text from context
          let altText = '';
          
          const figcaption = img.closest('figure')?.querySelector('figcaption');
          if (figcaption) {
            altText = figcaption.textContent.trim();
          } else {
            const title = img.getAttribute('title');
            if (title) {
              altText = title;
            } else {
              // Generate alt text from filename
              const src = img.src || img.dataset.src;
              if (src) {
                const filename = src.split('/').pop().split('.')[0];
                altText = filename.replace(/[-_]/g, ' ');
              }
            }
          }
          
          img.setAttribute('alt', altText || 'Image');
        }
        
        // Add loading state announcement
        if (img.loading === 'lazy') {
          img.addEventListener('load', () => {
            const altText = img.getAttribute('alt');
            if (altText && altText !== 'Image') {
              this.announce(`Image loaded: ${altText}`, 'polite');
            }
          });
        }
      });
    },
    
    // Setup focus management
    setupFocusManagement() {
      // Manage focus for dynamic content
      this.setupDynamicFocusManagement();
      
      // Enhance focus indicators
      this.enhanceFocusIndicators();
      
      // Setup focus restoration
      this.setupFocusRestoration();
    },
    
    // Setup dynamic focus management
    setupDynamicFocusManagement() {
      // Handle focus when content is added dynamically
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                this.enhanceNewContent(node);
              }
            });
          }
        });
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    },
    
    // Enhance newly added content
    enhanceNewContent(element) {
      // Add focus management to new interactive elements
      const interactiveElements = element.querySelectorAll('button, a, input, select, textarea');
      interactiveElements.forEach(el => {
        if (!el.hasAttribute('tabindex') && el.disabled) {
          el.setAttribute('tabindex', '-1');
        }
      });
      
      // Add ARIA attributes to new elements
      this.addARIAAttributes(element);
    },
    
    // Add ARIA attributes to elements
    addARIAAttributes(container) {
      // Add button role to clickable elements
      const clickableElements = container.querySelectorAll('[onclick]:not(button):not(a)');
      clickableElements.forEach(el => {
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
      });
      
      // Add list roles to navigation lists
      const navLists = container.querySelectorAll('nav ul, nav ol');
      navLists.forEach(list => {
        list.setAttribute('role', 'list');
        const items = list.querySelectorAll('li');
        items.forEach(item => {
          item.setAttribute('role', 'listitem');
        });
      });
    },
    
    // Enhance focus indicators
    enhanceFocusIndicators() {
      // Add custom focus styles for better visibility
      const style = document.createElement('style');
      style.textContent = `
        .using-keyboard *:focus {
          outline: 2px solid #C71585 !important;
          outline-offset: 2px !important;
        }
        
        .using-keyboard button:focus,
        .using-keyboard a:focus,
        .using-keyboard input:focus,
        .using-keyboard select:focus,
        .using-keyboard textarea:focus {
          box-shadow: 0 0 0 3px rgba(199, 21, 133, 0.3) !important;
        }
        
        @media (prefers-contrast: high) {
          .using-keyboard *:focus {
            outline: 3px solid currentColor !important;
            outline-offset: 2px !important;
          }
        }
      `;
      document.head.appendChild(style);
    },
    
    // Setup focus restoration
    setupFocusRestoration() {
      let lastFocusedElement = null;
      
      // Store focus before opening modals
      document.addEventListener('modal:open', (e) => {
        lastFocusedElement = document.activeElement;
      });
      
      // Restore focus when closing modals
      document.addEventListener('modal:close', (e) => {
        if (lastFocusedElement) {
          lastFocusedElement.focus();
          lastFocusedElement = null;
        }
      });
    },
    
    // Setup color contrast enhancements
    setupColorContrastEnhancements() {
      // Check for high contrast preference
      if (window.matchMedia('(prefers-contrast: high)').matches) {
        document.documentElement.classList.add('high-contrast');
      }
      
      // Monitor contrast preference changes
      window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
        document.documentElement.classList.toggle('high-contrast', e.matches);
      });
      
      // Add high contrast styles
      const style = document.createElement('style');
      style.textContent = `
        @media (prefers-contrast: high) {
          * {
            border-color: currentColor !important;
          }
          
          .btn, button {
            border: 2px solid currentColor !important;
          }
          
          .product-card, .card {
            border: 1px solid currentColor !important;
          }
          
          a:not(.btn) {
            text-decoration: underline !important;
          }
        }
      `;
      document.head.appendChild(style);
    },
    
    // Setup motion preferences
    setupMotionPreferences() {
      // Check for reduced motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.classList.add('reduce-motion');
      }
      
      // Monitor motion preference changes
      window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
        document.documentElement.classList.toggle('reduce-motion', e.matches);
      });
      
      // Add reduced motion styles
      const style = document.createElement('style');
      style.textContent = `
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
        
        .reduce-motion * {
          animation: none !important;
          transition: none !important;
        }
      `;
      document.head.appendChild(style);
    },
    
    // Setup form accessibility
    setupFormAccessibility() {
      // Enhance form validation messages
      this.enhanceFormValidation();
      
      // Setup fieldset and legend relationships
      this.setupFieldsetLegends();
      
      // Enhance form instructions
      this.enhanceFormInstructions();
    },
    
    // Enhance form validation
    enhanceFormValidation() {
      const forms = document.querySelectorAll('form');
      
      forms.forEach(form => {
        form.addEventListener('submit', (e) => {
          const invalidInputs = form.querySelectorAll(':invalid');
          
          if (invalidInputs.length > 0) {
            e.preventDefault();
            
            // Focus first invalid input
            invalidInputs[0].focus();
            
            // Announce validation errors
            const errorCount = invalidInputs.length;
            this.announce(
              `Form has ${errorCount} error${errorCount > 1 ? 's' : ''}. Please correct and try again.`,
              'assertive'
            );
          }
        });
        
        // Real-time validation feedback
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
          input.addEventListener('blur', () => {
            this.validateInput(input);
          });
          
          input.addEventListener('invalid', (e) => {
            e.preventDefault();
            this.showValidationError(input);
          });
        });
      });
    },
    
    // Validate individual input
    validateInput(input) {
      const isValid = input.checkValidity();
      const errorElement = document.getElementById(`error-${input.id}`);
      
      if (!isValid) {
        this.showValidationError(input);
      } else if (errorElement) {
        errorElement.textContent = '';
        input.setAttribute('aria-invalid', 'false');
      }
    },
    
    // Show validation error
    showValidationError(input) {
      let errorElement = document.getElementById(`error-${input.id}`);
      
      if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = `error-${input.id}`;
        errorElement.className = 'error-message';
        errorElement.setAttribute('role', 'alert');
        input.parentNode.appendChild(errorElement);
        
        input.setAttribute('aria-describedby', errorElement.id);
      }
      
      const errorMessage = input.validationMessage || 'Please correct this field';
      errorElement.textContent = errorMessage;
      input.setAttribute('aria-invalid', 'true');
      
      // Announce error to screen readers
      this.announce(`Error in ${input.labels?.[0]?.textContent || 'field'}: ${errorMessage}`, 'assertive');
    },
    
    // Setup fieldset and legend relationships
    setupFieldsetLegends() {
      const fieldsets = document.querySelectorAll('fieldset');
      
      fieldsets.forEach(fieldset => {
        const legend = fieldset.querySelector('legend');
        if (!legend) {
          // Create legend from first label or heading
          const firstLabel = fieldset.querySelector('label');
          const firstHeading = fieldset.querySelector('h1, h2, h3, h4, h5, h6');
          
          if (firstLabel || firstHeading) {
            const legendElement = document.createElement('legend');
            legendElement.textContent = (firstLabel || firstHeading).textContent;
            legendElement.className = 'sr-only';
            fieldset.insertBefore(legendElement, fieldset.firstChild);
          }
        }
      });
    },
    
    // Enhance form instructions
    enhanceFormInstructions() {
      const forms = document.querySelectorAll('form');
      
      forms.forEach(form => {
        // Add form instructions if not present
        let instructions = form.querySelector('.form-instructions');
        if (!instructions) {
          const requiredFields = form.querySelectorAll('[required]');
          if (requiredFields.length > 0) {
            instructions = document.createElement('div');
            instructions.className = 'form-instructions';
            instructions.textContent = 'Fields marked with * are required.';
            form.insertBefore(instructions, form.firstChild);
          }
        }
        
        if (instructions) {
          instructions.setAttribute('role', 'region');
          instructions.setAttribute('aria-label', 'Form instructions');
        }
      });
    },
    
    // Setup landmarks and headings
    setupLandmarksAndHeadings() {
      this.validateHeadingStructure();
      this.addMissingLandmarks();
    },
    
    // Validate heading structure
    validateHeadingStructure() {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let currentLevel = 0;
      
      headings.forEach(heading => {
        const level = parseInt(heading.tagName.charAt(1));
        
        if (level > currentLevel + 1) {
          console.warn(`Heading level skipped: ${heading.tagName} after h${currentLevel}`, heading);
        }
        
        currentLevel = level;
      });
      
      // Ensure there's only one h1
      const h1s = document.querySelectorAll('h1');
      if (h1s.length > 1) {
        console.warn('Multiple h1 elements found. Consider using h2-h6 for subsections.');
      }
    },
    
    // Add missing landmarks
    addMissingLandmarks() {
      // Add banner landmark to header
      const header = document.querySelector('header');
      if (header && !header.getAttribute('role')) {
        header.setAttribute('role', 'banner');
      }
      
      // Add contentinfo landmark to footer
      const footer = document.querySelector('footer');
      if (footer && !footer.getAttribute('role')) {
        footer.setAttribute('role', 'contentinfo');
      }
      
      // Add complementary landmarks to sidebars
      const sidebars = document.querySelectorAll('.sidebar, .aside');
      sidebars.forEach(sidebar => {
        if (!sidebar.getAttribute('role')) {
          sidebar.setAttribute('role', 'complementary');
        }
      });
    },
    
    // Run accessibility tests
    runAccessibilityTests() {
      if (window.location.hostname === 'localhost' || window.location.hostname.includes('ngrok')) {
        setTimeout(() => {
          this.performAccessibilityAudit();
        }, 2000);
      }
    },
    
    // Perform accessibility audit
    performAccessibilityAudit() {
      const issues = [];
      
      // Test 1: Check for missing alt text
      const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
      if (imagesWithoutAlt.length > 0) {
        issues.push(`${imagesWithoutAlt.length} images missing alt text`);
      }
      
      // Test 2: Check for missing form labels
      const inputsWithoutLabels = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
      const unlabeledInputs = Array.from(inputsWithoutLabels).filter(input => {
        return !document.querySelector(`label[for="${input.id}"]`) && !input.closest('label');
      });
      if (unlabeledInputs.length > 0) {
        issues.push(`${unlabeledInputs.length} form inputs missing labels`);
      }
      
      // Test 3: Check for missing headings
      const h1s = document.querySelectorAll('h1');
      if (h1s.length === 0) {
        issues.push('No h1 heading found');
      } else if (h1s.length > 1) {
        issues.push(`Multiple h1 headings found (${h1s.length})`);
      }
      
      // Test 4: Check for missing landmarks
      const main = document.querySelector('main, [role="main"]');
      if (!main) {
        issues.push('No main landmark found');
      }
      
      // Test 5: Check for color contrast (basic check)
      this.checkColorContrast(issues);
      
      // Test 6: Check for keyboard accessibility
      const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
      const nonKeyboardAccessible = Array.from(interactiveElements).filter(el => {
        return el.tabIndex < 0 && !el.disabled;
      });
      if (nonKeyboardAccessible.length > 0) {
        issues.push(`${nonKeyboardAccessible.length} interactive elements not keyboard accessible`);
      }
      
      // Test 7: Check for ARIA usage
      this.checkARIAUsage(issues);
      
      // Report results
      if (issues.length > 0) {
        console.group('🔍 Accessibility Issues Found:');
        issues.forEach(issue => console.warn('⚠️', issue));
        console.groupEnd();
      } else {
        console.log('✅ No accessibility issues detected');
      }
      
      // Generate detailed report
      this.generateAccessibilityReport(issues);
    },
    
    // Check color contrast (basic implementation)
    checkColorContrast(issues) {
      // This is a simplified check - in production, use a proper color contrast library
      const textElements = document.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6');
      let contrastIssues = 0;
      
      textElements.forEach(el => {
        const styles = window.getComputedStyle(el);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        
        // Skip if transparent background
        if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
          return;
        }
        
        // Basic contrast check (simplified)
        if (color === backgroundColor) {
          contrastIssues++;
        }
      });
      
      if (contrastIssues > 0) {
        issues.push(`${contrastIssues} potential color contrast issues`);
      }
    },
    
    // Check ARIA usage
    checkARIAUsage(issues) {
      // Check for invalid ARIA attributes
      const elementsWithARIA = document.querySelectorAll('[aria-expanded], [aria-controls], [aria-describedby]');
      let ariaIssues = 0;
      
      elementsWithARIA.forEach(el => {
        // Check aria-controls references
        const controls = el.getAttribute('aria-controls');
        if (controls && !document.getElementById(controls)) {
          ariaIssues++;
        }
        
        // Check aria-describedby references
        const describedBy = el.getAttribute('aria-describedby');
        if (describedBy) {
          const ids = describedBy.split(' ');
          ids.forEach(id => {
            if (!document.getElementById(id)) {
              ariaIssues++;
            }
          });
        }
      });
      
      if (ariaIssues > 0) {
        issues.push(`${ariaIssues} ARIA reference issues`);
      }
    },
    
    // Generate accessibility report
    generateAccessibilityReport(issues) {
      const report = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        issues: issues,
        wcagLevel: 'AA',
        totalElements: document.querySelectorAll('*').length,
        interactiveElements: document.querySelectorAll('button, a, input, select, textarea').length,
        images: document.querySelectorAll('img').length,
        headings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
        landmarks: document.querySelectorAll('main, nav, aside, header, footer, [role="banner"], [role="navigation"], [role="complementary"], [role="contentinfo"], [role="main"]').length
      };
      
      console.log('📊 Accessibility Report:', report);
      
      // Store report for later analysis
      if (typeof localStorage !== 'undefined') {
        try {
          const reports = JSON.parse(localStorage.getItem('accessibility-reports') || '[]');
          reports.push(report);
          // Keep only last 10 reports
          if (reports.length > 10) {
            reports.splice(0, reports.length - 10);
          }
          localStorage.setItem('accessibility-reports', JSON.stringify(reports));
        } catch (e) {
          console.warn('Could not save accessibility report to localStorage');
        }
      }
      
      return report;
    },
    
    // Utility methods for modal/dropdown management
    openDropdown(dropdown) {
      const menu = dropdown.querySelector('[data-dropdown-menu]');
      if (menu) {
        menu.classList.add('open');
        menu.setAttribute('aria-hidden', 'false');
      }
    },
    
    closeDropdown(dropdown) {
      const menu = dropdown.querySelector('[data-dropdown-menu]');
      if (menu) {
        menu.classList.remove('open');
        menu.setAttribute('aria-hidden', 'true');
      }
    },
    
    toggleDropdown(dropdown) {
      const menu = dropdown.querySelector('[data-dropdown-menu]');
      if (menu) {
        const isOpen = menu.classList.contains('open');
        if (isOpen) {
          this.closeDropdown(dropdown);
        } else {
          this.openDropdown(dropdown);
        }
      }
    },
    
    closeModal(modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.dispatchEvent(new CustomEvent('modal:close'));
    }
  };
  
  // Initialize accessibility enhancements
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      AccessibilityCompliance.init();
    });
  } else {
    AccessibilityCompliance.init();
  }
  
  // Export for global access
  window.AccessibilityCompliance = AccessibilityCompliance;
  
})();