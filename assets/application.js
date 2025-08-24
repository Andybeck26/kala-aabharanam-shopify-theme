/**
 * Kala Aabharanam Theme JavaScript
 * Main application JavaScript file with Alpine.js integration
 */

// Initialize Alpine.js stores and components
document.addEventListener('alpine:init', () => {
  // Cart store for managing cart state
  Alpine.store('cart', {
    count: 0,
    items: [],
    total: 0,
    loading: false,
    error: null,
    
    init() {
      // Initialize cart from Shopify cart API
      this.fetchCart();
      // Set up cart persistence
      this.setupPersistence();
    },
    
    async fetchCart() {
      try {
        this.loading = true;
        this.error = null;
        
        const response = await fetch('/cart.js');
        if (!response.ok) throw new Error('Failed to fetch cart');
        
        const cart = await response.json();
        this.count = cart.item_count;
        this.items = cart.items;
        this.total = cart.total_price;
      } catch (error) {
        console.error('Error fetching cart:', error);
        this.error = 'Failed to load cart';
      } finally {
        this.loading = false;
      }
    },
    
    async addItem(variantId, quantity = 1, properties = {}) {
      try {
        this.loading = true;
        this.error = null;
        
        // Check inventory before adding
        const inventoryCheck = await this.checkInventory(variantId, quantity);
        if (!inventoryCheck.available) {
          throw new Error(inventoryCheck.message);
        }
        
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: variantId,
            quantity: quantity,
            properties: properties
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add item to cart');
        }
        
        await this.fetchCart();
        
        // Track analytics
        if (window.KalaAabharanam.Analytics) {
          const variant = await this.getVariantInfo(variantId);
          window.KalaAabharanam.Analytics.trackAddToCart(variant, quantity);
        }
        
        // Show success notification
        window.KalaAabharanam.showNotification('Item added to cart!', 'success');
        
        // Open cart drawer
        Alpine.store('ui').openCartDrawer();
        
        return true;
      } catch (error) {
        console.error('Error adding to cart:', error);
        this.error = error.message;
        window.KalaAabharanam.showNotification(error.message, 'error');
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    async updateItem(key, quantity) {
      try {
        this.loading = true;
        this.error = null;
        
        // Find the item to get variant info for inventory check
        const currentItem = this.items.find(item => item.key === key);
        if (currentItem && quantity > 0) {
          const inventoryCheck = await this.checkInventory(currentItem.variant_id, quantity);
          if (!inventoryCheck.available) {
            throw new Error(inventoryCheck.message);
          }
        }
        
        const response = await fetch('/cart/change.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: key,
            quantity: quantity
          })
        });
        
        if (!response.ok) throw new Error('Failed to update cart');
        
        await this.fetchCart();
        
        // Show appropriate notification
        if (quantity === 0) {
          window.KalaAabharanam.showNotification('Item removed from cart', 'success');
        } else {
          window.KalaAabharanam.showNotification('Cart updated', 'success');
        }
        
        return true;
      } catch (error) {
        console.error('Error updating cart:', error);
        this.error = error.message || 'Failed to update cart';
        window.KalaAabharanam.showNotification(this.error, 'error');
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    async removeItem(key) {
      return this.updateItem(key, 0);
    },
    
    async checkInventory(variantId, requestedQuantity) {
      try {
        // Get current cart quantity for this variant
        const currentCartQuantity = this.items
          .filter(item => item.variant_id === variantId)
          .reduce((total, item) => total + item.quantity, 0);
        
        // Fetch variant info to check inventory
        const response = await fetch(`/products.json?limit=1&ids=${variantId}`);
        if (!response.ok) {
          return { available: true, message: '' }; // Fallback to allowing the request
        }
        
        const data = await response.json();
        const variant = data.products?.[0]?.variants?.find(v => v.id === variantId);
        
        if (!variant) {
          return { available: true, message: '' }; // Fallback to allowing the request
        }
        
        // Check if variant is available
        if (!variant.available) {
          return { 
            available: false, 
            message: 'This item is currently out of stock' 
          };
        }
        
        // Check inventory quantity if tracked
        if (variant.inventory_management === 'shopify' && variant.inventory_policy === 'deny') {
          const totalRequestedQuantity = currentCartQuantity + requestedQuantity;
          if (totalRequestedQuantity > variant.inventory_quantity) {
            const availableQuantity = Math.max(0, variant.inventory_quantity - currentCartQuantity);
            return {
              available: false,
              message: availableQuantity > 0 
                ? `Only ${availableQuantity} items available`
                : 'This item is currently out of stock'
            };
          }
        }
        
        return { available: true, message: '' };
      } catch (error) {
        console.error('Error checking inventory:', error);
        return { available: true, message: '' }; // Fallback to allowing the request
      }
    },
    
    async getVariantInfo(variantId) {
      try {
        const response = await fetch(`/products.json?limit=1&ids=${variantId}`);
        if (!response.ok) return null;
        
        const data = await response.json();
        return data.products?.[0]?.variants?.find(v => v.id === variantId) || null;
      } catch (error) {
        console.error('Error fetching variant info:', error);
        return null;
      }
    },
    
    setupPersistence() {
      // Save cart state to localStorage periodically
      setInterval(() => {
        try {
          const cartState = {
            timestamp: Date.now(),
            count: this.count,
            total: this.total
          };
          localStorage.setItem('kala_cart_state', JSON.stringify(cartState));
        } catch (error) {
          console.error('Error saving cart state:', error);
        }
      }, 30000); // Save every 30 seconds
      
      // Listen for storage events to sync across tabs
      window.addEventListener('storage', (e) => {
        if (e.key === 'kala_cart_state' && e.newValue) {
          try {
            const newState = JSON.parse(e.newValue);
            // Only update if the change is recent (within 1 minute)
            if (Date.now() - newState.timestamp < 60000) {
              this.fetchCart();
            }
          } catch (error) {
            console.error('Error syncing cart state:', error);
          }
        }
      });
    },
    
    // Cart abandonment recovery
    setupAbandonmentRecovery() {
      // Track when user adds items but doesn't checkout
      let abandonmentTimer;
      
      // Reset timer when items are added
      document.addEventListener('cart:updated', () => {
        clearTimeout(abandonmentTimer);
        
        if (this.count > 0) {
          // Set timer for 30 minutes
          abandonmentTimer = setTimeout(() => {
            this.triggerAbandonmentRecovery();
          }, 30 * 60 * 1000);
        }
      });
      
      // Clear timer on checkout
      document.addEventListener('checkout:started', () => {
        clearTimeout(abandonmentTimer);
      });
    },
    
    triggerAbandonmentRecovery() {
      // Show a subtle notification encouraging checkout
      if (this.count > 0 && document.visibilityState === 'visible') {
        window.KalaAabharanam.showNotification(
          'Don\'t forget about your items! Complete your purchase now.',
          'warning'
        );
        
        // Optionally open cart drawer
        setTimeout(() => {
          Alpine.store('ui').openCartDrawer();
        }, 2000);
      }
    }
  });
  
  // UI store for managing interface state
  Alpine.store('ui', {
    mobileMenuOpen: false,
    searchOpen: false,
    cartDrawerOpen: false,
    
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
      // Prevent body scroll when menu is open
      document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
    },
    
    closeMobileMenu() {
      this.mobileMenuOpen = false;
      document.body.style.overflow = '';
    },
    
    toggleSearch() {
      this.searchOpen = !this.searchOpen;
    },
    
    closeSearch() {
      this.searchOpen = false;
    },
    
    openCartDrawer() {
      this.cartDrawerOpen = true;
      document.body.style.overflow = 'hidden';
    },
    
    closeCartDrawer() {
      this.cartDrawerOpen = false;
      document.body.style.overflow = '';
    }
  });
  
  // Product component for product pages
  Alpine.data('productForm', (product) => ({
    selectedVariant: product.selected_or_first_available_variant,
    quantity: 1,
    loading: false,
    
    init() {
      // Watch for variant changes
      this.$watch('selectedVariant', () => {
        this.updateURL();
        this.updatePrice();
      });
    },
    
    selectVariant(variantId) {
      this.selectedVariant = product.variants.find(v => v.id === variantId);
    },
    
    updatePrice() {
      // Update price display based on selected variant
      const priceElement = document.querySelector('[data-price]');
      if (priceElement && this.selectedVariant) {
        priceElement.textContent = window.KalaAabharanam.formatMoney(this.selectedVariant.price);
      }
    },
    
    updateURL() {
      if (this.selectedVariant && window.history.replaceState) {
        const url = new URL(window.location);
        url.searchParams.set('variant', this.selectedVariant.id);
        window.history.replaceState({}, '', url);
      }
    },
    
    async addToCart() {
      if (!this.selectedVariant || !this.selectedVariant.available) {
        window.KalaAabharanam.showNotification('This variant is not available', 'error');
        return;
      }
      
      this.loading = true;
      
      try {
        await Alpine.store('cart').addItem(this.selectedVariant.id, this.quantity);
      } finally {
        this.loading = false;
      }
    },
    
    increaseQuantity() {
      this.quantity++;
    },
    
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    }
  }));
  
  // Search component
  Alpine.data('searchForm', () => ({
    query: '',
    results: [],
    loading: false,
    showResults: false,
    
    init() {
      // Debounced search
      this.debouncedSearch = window.KalaAabharanam.debounce(this.search.bind(this), 300);
      
      this.$watch('query', (value) => {
        if (value.length >= 2) {
          this.debouncedSearch();
        } else {
          this.results = [];
          this.showResults = false;
        }
      });
    },
    
    async search() {
      if (this.query.length < 2) return;
      
      this.loading = true;
      
      try {
        const response = await fetch(`/search/suggest.json?q=${encodeURIComponent(this.query)}&resources[type]=product&resources[limit]=5`);
        const data = await response.json();
        
        this.results = data.resources.results.products || [];
        this.showResults = true;
      } catch (error) {
        console.error('Search error:', error);
        this.results = [];
      } finally {
        this.loading = false;
      }
    },
    
    selectResult(product) {
      window.location.href = product.url;
    },
    
    submitSearch() {
      if (this.query.trim()) {
        window.location.href = `/search?q=${encodeURIComponent(this.query)}`;
      }
    }
  }));
});

// Utility functions
window.KalaAabharanam = {
  // Format money using Shopify's money format
  formatMoney(cents, format = '₹{{amount}}') {
    const value = (cents / 100).toFixed(2);
    return format.replace('{{amount}}', value);
  },
  
  // Debounce function for search and other inputs
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Show notification
  showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
};

// Initialize theme when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('Kala Aabharanam theme initialized');
});// Alpine.
js Event System and Component Communication
document.addEventListener('alpine:init', () => {
  // Global event listeners for component communication
  
  // Cart events
  document.addEventListener('cart:open', () => {
    Alpine.store('ui').openCartDrawer();
  });
  
  document.addEventListener('cart:close', () => {
    Alpine.store('ui').closeCartDrawer();
  });
  
  document.addEventListener('cart:add', (event) => {
    const { variantId, quantity, properties } = event.detail;
    Alpine.store('cart').addItem(variantId, quantity, properties);
  });
  
  // Search events
  document.addEventListener('search:open', () => {
    Alpine.store('ui').toggleSearch();
  });
  
  document.addEventListener('search:close', () => {
    Alpine.store('ui').closeSearch();
  });
  
  // Menu events
  document.addEventListener('menu:toggle', () => {
    Alpine.store('ui').toggleMobileMenu();
  });
  
  document.addEventListener('menu:close', () => {
    Alpine.store('ui').closeMobileMenu();
  });
});

// Error Handling Utilities
window.KalaAabharanam.ErrorHandler = {
  // Handle AJAX errors
  handleAjaxError(error, context = 'Operation') {
    console.error(`${context} failed:`, error);
    
    let message = `${context} failed. Please try again.`;
    
    if (error.message) {
      message = error.message;
    } else if (error.status === 422) {
      message = 'Invalid request. Please check your input.';
    } else if (error.status >= 500) {
      message = 'Server error. Please try again later.';
    } else if (error.status === 0) {
      message = 'Network error. Please check your connection.';
    }
    
    window.KalaAabharanam.showNotification(message, 'error');
  },
  
  // Handle form validation errors
  handleFormErrors(errors, formElement) {
    // Clear existing errors
    const existingErrors = formElement.querySelectorAll('.form-error');
    existingErrors.forEach(error => error.remove());
    
    // Display new errors
    Object.keys(errors).forEach(field => {
      const fieldElement = formElement.querySelector(`[name="${field}"]`);
      if (fieldElement) {
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.textContent = errors[field][0];
        fieldElement.parentNode.appendChild(errorElement);
      }
    });
  }
};

// Performance and Analytics Utilities
window.KalaAabharanam.Analytics = {
  // Track cart events
  trackAddToCart(variant, quantity) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'add_to_cart', {
        currency: 'INR',
        value: (variant.price * quantity) / 100,
        items: [{
          item_id: variant.sku || variant.id,
          item_name: variant.product_title,
          item_variant: variant.title,
          quantity: quantity,
          price: variant.price / 100
        }]
      });
    }
  },
  
  // Track remove from cart
  trackRemoveFromCart(variant, quantity) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'remove_from_cart', {
        currency: 'INR',
        value: (variant.price * quantity) / 100,
        items: [{
          item_id: variant.sku || variant.id,
          item_name: variant.product_title,
          item_variant: variant.title,
          quantity: quantity,
          price: variant.price / 100
        }]
      });
    }
  },
  
  // Track view cart
  trackViewCart(cart) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'view_cart', {
        currency: 'INR',
        value: cart.total_price / 100,
        items: cart.items.map(item => ({
          item_id: item.sku || item.variant_id,
          item_name: item.product_title,
          item_variant: item.variant_title,
          quantity: item.quantity,
          price: item.price / 100
        }))
      });
    }
  },
  
  // Track begin checkout
  trackBeginCheckout(cart) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'begin_checkout', {
        currency: 'INR',
        value: cart.total_price / 100,
        items: cart.items.map(item => ({
          item_id: item.sku || item.variant_id,
          item_name: item.product_title,
          item_variant: item.variant_title,
          quantity: item.quantity,
          price: item.price / 100
        }))
      });
    }
    
    // Dispatch custom event for abandonment recovery
    document.dispatchEvent(new CustomEvent('checkout:started'));
  },
  
  // Track purchase (for order confirmation page)
  trackPurchase(order) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'purchase', {
        transaction_id: order.order_number,
        currency: 'INR',
        value: order.total_price / 100,
        tax: order.tax_price / 100,
        shipping: order.shipping_price / 100,
        items: order.line_items.map(item => ({
          item_id: item.sku || item.variant_id,
          item_name: item.title,
          item_variant: item.variant_title,
          quantity: item.quantity,
          price: item.price / 100
        }))
      });
    }
  },
  
  // Track search events
  trackSearch(query, results_count) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'search', {
        search_term: query,
        results_count: results_count
      });
    }
  },
  
  // Track page views
  trackPageView(page_title, page_location) {
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: page_title,
        page_location: page_location
      });
    }
  },
  
  // Track product views
  trackViewItem(product, variant) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'view_item', {
        currency: 'INR',
        value: (variant?.price || product.price) / 100,
        items: [{
          item_id: variant?.sku || variant?.id || product.id,
          item_name: product.title,
          item_variant: variant?.title,
          price: (variant?.price || product.price) / 100,
          item_category: product.type
        }]
      });
    }
  },
  
  // Track collection/category views
  trackViewItemList(collection, products) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'view_item_list', {
        item_list_name: collection.title,
        items: products.slice(0, 10).map((product, index) => ({
          item_id: product.id,
          item_name: product.title,
          price: product.price / 100,
          item_category: product.type,
          index: index
        }))
      });
    }
  }
};

// Accessibility Utilities
window.KalaAabharanam.A11y = {
  // Trap focus within an element
  trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
      
      if (e.key === 'Escape') {
        element.dispatchEvent(new CustomEvent('escape'));
      }
    });
    
    firstElement?.focus();
  },
  
  // Announce to screen readers
  announce(message, priority = 'polite') {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;
    
    document.body.appendChild(announcer);
    
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  }
};

// Initialize theme when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('Kala Aabharanam theme initialized');
  
  // Initialize cart store
  if (Alpine.store('cart')) {
    Alpine.store('cart').init();
    Alpine.store('cart').setupAbandonmentRecovery();
  }
  
  // Handle escape key for closing modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const ui = Alpine.store('ui');
      if (ui.cartDrawerOpen) {
        ui.closeCartDrawer();
      }
      if (ui.searchOpen) {
        ui.closeSearch();
      }
      if (ui.mobileMenuOpen) {
        ui.closeMobileMenu();
      }
    }
  });
  
  // Handle clicks outside of dropdowns/modals
  document.addEventListener('click', (e) => {
    const ui = Alpine.store('ui');
    
    // Close search if clicking outside
    if (ui.searchOpen && !e.target.closest('[data-search]')) {
      ui.closeSearch();
    }
  });
});