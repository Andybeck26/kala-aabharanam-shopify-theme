# Shopify Development Best Practices

## Theme Development Guidelines

### Shopify 2.0 Architecture
- Use JSON templates for dynamic page layouts
- Build modular sections that can be reused across templates
- Implement section groups for flexible page building
- Leverage theme settings for easy customization

### Liquid Best Practices
```liquid
<!-- Always provide fallbacks -->
{{ product.title | default: 'Product Name' }}

<!-- Use proper filters for safety -->
{{ product.description | strip_html | truncate: 150 }}

<!-- Handle empty states gracefully -->
{% if collection.products.size > 0 %}
  <!-- Display products -->
{% else %}
  <p>No products found in this collection.</p>
{% endif %}

<!-- Use assign for complex logic -->
{% assign sale_price = product.compare_at_price | minus: product.price %}
```

### Performance Optimization
- Use Shopify's responsive image system: `{{ image | image_url: width: 300 }}`
- Implement lazy loading for images below the fold
- Minimize HTTP requests by combining CSS/JS files
- Use Shopify's CDN for all assets
- Avoid inline styles and scripts

### SEO Implementation
```liquid
<!-- Product structured data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "{{ product.title }}",
  "description": "{{ product.description | strip_html }}",
  "image": "{{ product.featured_image | image_url }}",
  "offers": {
    "@type": "Offer",
    "price": "{{ product.price | money_without_currency }}",
    "priceCurrency": "{{ cart.currency.iso_code }}"
  }
}
</script>
```

## Recommended Apps (Curated List)

### Essential Apps
1. **Judge.me Product Reviews** (4.9★) - Comprehensive review system
2. **Tidio Live Chat** (4.7★) - Customer support integration
3. **TinyIMG** (4.9★) - Image optimization and SEO
4. **Searchanise** (4.8★) - Advanced search and filtering
5. **Klaviyo** (4.6★) - Email marketing automation

### App Integration Guidelines
- Always test apps in development environment first
- Monitor performance impact after installation
- Regularly review app permissions and data access
- Keep apps updated to latest versions
- Remove unused apps to maintain performance

## Security Considerations
- Never store sensitive data in theme files
- Use Shopify's built-in CSRF protection
- Sanitize all user inputs in Liquid templates
- Implement proper form validation
- Use HTTPS for all external resources

## Mobile-First Development
- Design for mobile screens first (320px+)
- Use flexible grid systems and relative units
- Implement touch-friendly interface elements
- Test on actual devices, not just browser dev tools
- Optimize images for different screen densities

## Accessibility Implementation
```liquid
<!-- Proper image alt text -->
<img src="{{ image | image_url }}" alt="{{ image.alt | default: product.title }}">

<!-- Semantic HTML structure -->
<nav aria-label="Main navigation">
  <ul>
    {% for link in linklists.main-menu.links %}
      <li><a href="{{ link.url }}">{{ link.title }}</a></li>
    {% endfor %}
  </ul>
</nav>

<!-- Form labels and ARIA attributes -->
<label for="email">Email Address</label>
<input type="email" id="email" name="email" required aria-describedby="email-error">
```