# Design Document

## Overview

This design document provides a comprehensive technical blueprint for the "Kala Aabharanam" e-commerce platform. The design leverages Shopify's robust infrastructure while creating a premium, culturally-rich shopping experience that meets all functional and non-functional requirements outlined in the requirements document.

The architecture follows a Platform-as-a-Service (PaaS) model, utilizing Shopify's Online Store 2.0 framework for maximum flexibility and maintainability. The design emphasizes performance, accessibility, and brand consistency while providing robust customization capabilities and seamless user experiences across all devices.

## Architecture

### High-Level System Architecture

```mermaid
graph TD
    A[Customer Browser] --> B[Shopify CDN]
    B --> C[Custom Theme Layer]
    C --> D[Shopify Core Platform]

    subgraph "Frontend Layer"
        C --> E[Liquid Templates]
        C --> F[Alpine.js Components]
        C --> G[CSS Framework]
        C --> H[Asset Pipeline]
    end

    subgraph "Shopify Platform"
        D --> I[Product Management]
        D --> J[Order Processing]
        D --> K[Customer Management]
        D --> L[Payment Processing]
    end

    subgraph "Third-Party Integrations"
        M[Judge.me Reviews]
        N[Tidio Chat]
        O[Google Analytics]
        P[Email Marketing]
    end

    C --> M
    C --> N
    C --> O
    C --> P
```

### Technology Stack Decision Matrix

| Component             | Technology              | Rationale                                                                   |
| --------------------- | ----------------------- | --------------------------------------------------------------------------- |
| **Platform**          | Shopify Basic           | Cost-effective e-commerce with built-in security, payments, and scalability |
| **Theme Framework**   | Online Store 2.0        | Modern, flexible architecture with JSON templates and section groups        |
| **Frontend Language** | Liquid + HTML5          | Native Shopify templating with semantic markup                              |
| **Styling**           | CSS3 + Custom Framework | Performance-optimized custom CSS using BEM methodology                      |
| **Interactivity**     | Alpine.js               | Lightweight (15KB) reactive framework, perfect for e-commerce interactions  |
| **Build Process**     | Shopify CLI             | Official tooling for development, testing, and deployment                   |
| **Performance**       | Native Shopify CDN      | Global content delivery with automatic optimization                         |

### Data Flow Architecture

```mermaid
sequenceDiagram
    participant C as Customer
    participant T as Theme Layer
    participant S as Shopify API
    participant P as Payment Gateway
    participant E as External Apps

    C->>T: Browse Products
    T->>S: Fetch Product Data
    S-->>T: Return Product Info
    T-->>C: Render Product Pages

    C->>T: Customize Product
    T->>T: Update Price (Alpine.js)
    T-->>C: Show Real-time Updates

    C->>T: Add to Cart
    T->>S: Update Cart via AJAX
    S-->>T: Return Cart State
    T-->>C: Update Cart UI

    C->>T: Proceed to Checkout
    T->>S: Initialize Checkout
    S->>P: Process Payment
    P-->>S: Payment Confirmation
    S-->>C: Order Confirmation

    Note over E: Reviews, Chat, Analytics run in parallel
```

## Components and Interfaces

### Core Theme Structure

```
kala-aabharanam-theme/
├── assets/
│   ├── application.css          # Main stylesheet
│   ├── application.js           # Main JavaScript
│   ├── alpine.min.js           # Alpine.js framework
│   └── images/                 # Brand assets
├── config/
│   ├── settings_schema.json    # Theme customization options
│   └── settings_data.json      # Default theme settings
├── layout/
│   └── theme.liquid            # Master layout template
├── locales/
│   └── en.default.json         # Internationalization strings
├── sections/
│   ├── header.liquid           # Site navigation
│   ├── footer.liquid           # Site footer
│   ├── hero-banner.liquid      # Homepage hero
│   ├── featured-collection.liquid # Product collections
│   ├── product-grid.liquid     # Product listing
│   ├── testimonials.liquid     # Customer reviews
│   └── newsletter.liquid       # Email signup
├── snippets/
│   ├── product-card.liquid     # Individual product display
│   ├── product-form.liquid     # Add to cart functionality
│   ├── cart-drawer.liquid      # Shopping cart sidebar
│   ├── price.liquid            # Price formatting
│   └── icon.liquid             # SVG icon system
├── templates/
│   ├── index.liquid            # Homepage
│   ├── collection.liquid       # Category pages
│   ├── product.liquid          # Product detail pages
│   ├── cart.liquid             # Shopping cart page
│   ├── page.liquid             # Static pages
│   ├── blog.liquid             # Blog listing
│   ├── article.liquid          # Blog posts
│   └── customers/              # Account pages
└── docs/
    └── README.md               # Development documentation
```

### Layout Components

#### Master Layout (theme.liquid)

```liquid
<!doctype html>
<html class="no-js" lang="{{ request.locale.iso_code }}">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1">

  <!-- Performance optimizations -->
  <link rel="preconnect" href="https://cdn.shopify.com" crossorigin>
  <link rel="dns-prefetch" href="https://productreviews.shopifycdn.com">

  <!-- SEO and meta tags -->
  <title>{{ page_title }}{% if current_tags %} &ndash; {{ 'general.meta.tags' | t: tags: current_tags.first }}{% endif %}{% if current_page != 1 %} &ndash; {{ 'general.meta.page' | t: page: current_page }}{% endif %}{% unless page_title contains shop.name %} &ndash; {{ shop.name }}{% endunless %}</title>

  {% if page_description %}
    <meta name="description" content="{{ page_description | escape }}">
  {% endif %}

  <!-- Brand colors and theme variables -->
  <style>
    :root {
      --color-primary: #8A3324;
      --color-secondary: #D2B48C;
      --color-accent: #C71585;
      --color-gold: #FFD700;
      --color-text: #36454F;
      --color-background: #F5F5DC;
      --font-heading: 'Playfair Display', serif;
      --font-body: 'Lato', sans-serif;
    }
  </style>

  <!-- Critical CSS inline -->
  {{ 'application.css' | asset_url | stylesheet_tag }}

  <!-- Alpine.js for interactivity -->
  <script defer src="{{ 'alpine.min.js' | asset_url }}"></script>

  {{ content_for_header }}
</head>

<body class="template-{{ template | replace: '.', ' ' | truncatewords: 1, '' | handle }}">
  <a class="skip-to-content-link button visually-hidden" href="#MainContent">
    {{ 'accessibility.skip_to_text' | t }}
  </a>

  {% section 'header' %}

  <main id="MainContent" class="content-for-layout focus-none" role="main" tabindex="-1">
    {{ content_for_layout }}
  </main>

  {% section 'footer' %}

  <!-- Cart drawer -->
  {% render 'cart-drawer' %}

  <!-- JavaScript -->
  <script src="{{ 'application.js' | asset_url }}" defer="defer"></script>

  <!-- Analytics -->
  {% render 'google-analytics' %}
</body>
</html>
```

#### Header Section (sections/header.liquid)

```liquid
<header class="header" x-data="{ mobileMenuOpen: false, searchOpen: false }">
  <div class="header__container container">
    <!-- Mobile menu toggle -->
    <button
      class="header__menu-toggle md:hidden"
      @click="mobileMenuOpen = !mobileMenuOpen"
      :aria-expanded="mobileMenuOpen"
    >
      {% render 'icon', icon: 'hamburger' %}
    </button>

    <!-- Logo -->
    <div class="header__logo">
      <a href="{{ routes.root_url }}" class="header__logo-link">
        {% if section.settings.logo %}
          <img src="{{ section.settings.logo | image_url: width: 200 }}"
               alt="{{ shop.name }}"
               class="header__logo-image">
        {% else %}
          <span class="header__logo-text">{{ shop.name }}</span>
        {% endif %}
      </a>
    </div>

    <!-- Desktop Navigation -->
    <nav class="header__nav hidden md:flex" role="navigation">
      {% for link in linklists.main-menu.links %}
        <div class="header__nav-item">
          <a href="{{ link.url }}" class="header__nav-link">
            {{ link.title }}
          </a>
          {% if link.links != blank %}
            <div class="header__dropdown">
              {% for child_link in link.links %}
                <a href="{{ child_link.url }}" class="header__dropdown-link">
                  {{ child_link.title }}
                </a>
              {% endfor %}
            </div>
          {% endif %}
        </div>
      {% endfor %}
    </nav>

    <!-- Header actions -->
    <div class="header__actions">
      <!-- Search -->
      <button
        class="header__action-btn"
        @click="searchOpen = !searchOpen"
      >
        {% render 'icon', icon: 'search' %}
      </button>

      <!-- Account -->
      <a href="{{ routes.account_url }}" class="header__action-btn">
        {% render 'icon', icon: 'account' %}
      </a>

      <!-- Cart -->
      <button
        class="header__action-btn header__cart-btn"
        @click="$dispatch('cart:open')"
      >
        {% render 'icon', icon: 'cart' %}
        <span class="header__cart-count" x-text="$store.cart.count">{{ cart.item_count }}</span>
      </button>
    </div>
  </div>

  <!-- Mobile menu -->
  <div
    class="header__mobile-menu md:hidden"
    x-show="mobileMenuOpen"
    x-transition
  >
    <!-- Mobile navigation content -->
  </div>

  <!-- Search overlay -->
  <div
    class="header__search-overlay"
    x-show="searchOpen"
    x-transition
  >
    {% render 'search-form' %}
  </div>
</header>

{% schema %}
{
  "name": "Header",
  "settings": [
    {
      "type": "image_picker",
      "id": "logo",
      "label": "Logo image"
    }
  ]
}
{% endschema %}
```

## Data Models

### Product Data Structure

The design leverages Shopify's native product model with custom metafields for enhanced functionality:

```liquid
<!-- Product object structure -->
{
  "id": "product_id",
  "title": "Product Name",
  "description": "Product description",
  "price": "price_in_cents",
  "compare_at_price": "original_price",
  "images": [
    {
      "src": "image_url",
      "alt": "alt_text",
      "width": 1000,
      "height": 1000
    }
  ],
  "variants": [
    {
      "id": "variant_id",
      "title": "Size / Color",
      "price": "variant_price",
      "available": true,
      "option1": "Size",
      "option2": "Color"
    }
  ],
  "options": ["Size", "Color"],
  "metafields": {
    "custom.material": "Gold-plated brass",
    "custom.care_instructions": "Store in dry place",
    "custom.cultural_significance": "Traditional design"
  }
}
```

### Customer Data Model

```liquid
<!-- Customer object for account management -->
{
  "id": "customer_id",
  "email": "customer@example.com",
  "first_name": "First",
  "last_name": "Last",
  "orders": [
    {
      "id": "order_id",
      "name": "#1001",
      "created_at": "2025-01-01",
      "financial_status": "paid",
      "fulfillment_status": "fulfilled"
    }
  ],
  "addresses": [
    {
      "id": "address_id",
      "first_name": "First",
      "last_name": "Last",
      "address1": "123 Main St",
      "city": "City",
      "province": "State",
      "zip": "12345",
      "country": "Country"
    }
  ]
}
```

## Error Handling

### Client-Side Error Handling

```javascript
// Alpine.js error handling for cart operations
Alpine.data("cartManager", () => ({
  loading: false,
  error: null,

  async addToCart(variantId, quantity = 1) {
    this.loading = true;
    this.error = null;

    try {
      const response = await fetch("/cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: variantId,
          quantity: quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      const result = await response.json();
      this.$dispatch("cart:updated", result);
      this.$dispatch("cart:open");
    } catch (error) {
      this.error = "Unable to add item to cart. Please try again.";
      console.error("Cart error:", error);
    } finally {
      this.loading = false;
    }
  },
}));
```

### Liquid Template Error Handling

```liquid
<!-- Safe product image rendering with fallbacks -->
{% if product.featured_image %}
  <img
    src="{{ product.featured_image | image_url: width: 600 }}"
    alt="{{ product.featured_image.alt | default: product.title }}"
    loading="lazy"
    class="product__image"
  >
{% else %}
  <div class="product__image-placeholder">
    {% render 'icon', icon: 'placeholder' %}
  </div>
{% endif %}

<!-- Safe price rendering -->
{% if product.compare_at_price > product.price %}
  <span class="price price--on-sale">
    <span class="price__current">{{ product.price | money }}</span>
    <span class="price__compare">{{ product.compare_at_price | money }}</span>
  </span>
{% else %}
  <span class="price">{{ product.price | money }}</span>
{% endif %}
```

## Testing Strategy

### Performance Testing Approach

1. **Core Web Vitals Monitoring**

   - LCP target: < 2.5 seconds
   - FID target: < 100 milliseconds
   - CLS target: < 0.1

2. **Testing Tools Integration**

   - Google PageSpeed Insights for automated testing
   - Lighthouse CI for continuous monitoring
   - WebPageTest for detailed performance analysis

3. **Performance Optimization Techniques**
   - Critical CSS inlining
   - Image lazy loading with native loading="lazy"
   - JavaScript code splitting and deferred loading
   - Shopify's responsive image system

### Accessibility Testing Framework

```liquid
<!-- Semantic HTML structure -->
<nav aria-label="Main navigation" role="navigation">
  <ul class="nav__list">
    {% for link in linklists.main-menu.links %}
      <li class="nav__item">
        <a href="{{ link.url }}"
           class="nav__link"
           {% if link.active %}aria-current="page"{% endif %}>
          {{ link.title }}
        </a>
      </li>
    {% endfor %}
  </ul>
</nav>

<!-- Form accessibility -->
<div class="form-field">
  <label for="email" class="form__label">
    Email Address
    <span class="form__required" aria-label="required">*</span>
  </label>
  <input
    type="email"
    id="email"
    name="email"
    class="form__input"
    required
    aria-describedby="email-error"
    autocomplete="email"
  >
  <div id="email-error" class="form__error" role="alert" x-show="emailError">
    Please enter a valid email address
  </div>
</div>
```

### Cross-Browser Testing Matrix

| Browser | Desktop | Mobile | Testing Priority |
| ------- | ------- | ------ | ---------------- |
| Chrome  | ✓       | ✓      | High             |
| Safari  | ✓       | ✓      | High             |
| Firefox | ✓       | ✓      | Medium           |
| Edge    | ✓       | -      | Medium           |

## Security Implementation

### Content Security Policy

```liquid
<!-- CSP headers for enhanced security -->
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self' *.shopify.com *.shopifycdn.com;
               script-src 'self' 'unsafe-inline' *.shopify.com *.google-analytics.com;
               style-src 'self' 'unsafe-inline' fonts.googleapis.com;
               img-src 'self' data: *.shopifycdn.com *.google-analytics.com;
               font-src 'self' fonts.gstatic.com;">
```

### Input Sanitization

```liquid
<!-- Safe user input handling -->
{% assign safe_search_term = search.terms | escape %}
<h1>Search results for "{{ safe_search_term }}"</h1>

<!-- Safe URL generation -->
<a href="{{ product.url | within: collection }}">{{ product.title | escape }}</a>
```

This comprehensive design document provides the technical foundation for building the Kala Aabharanam e-commerce platform, ensuring all requirements are met while maintaining high standards for performance, accessibility, and security.
