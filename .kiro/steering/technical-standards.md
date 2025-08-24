# Technical Standards & Guidelines

## Development Principles
1. **Performance First:** Evaluate all additions for Core Web Vitals impact
2. **Simplicity & Maintainability:** Prefer Shopify native features over complex custom solutions
3. **App Curation:** Maximum 10-12 apps, all must have >4.5 stars and recent positive reviews
4. **Future-Proofing:** Follow Shopify Online Store 2.0 architecture with modular JSON templates

## Code Standards

### Liquid Templates
- Follow Shopify's official Liquid style guide
- Use semantic HTML5 elements
- Implement proper error handling with default values
- Example: `{{ product.title | default: 'Product Name' }}`

### JavaScript
- Use Alpine.js for lightweight interactivity over heavy frameworks
- Follow Airbnb JavaScript Style Guide
- Use Prettier for automatic formatting
- Implement try...catch blocks for API calls
- Example pattern:
```javascript
// Alpine.js component structure
<div x-data="{ isOpen: false }">
  <button @click="isOpen = !isOpen">Toggle</button>
  <div x-show="isOpen" x-collapse>Content</div>
</div>
```

### CSS
- Use BEM (Block, Element, Modifier) naming convention
- Mobile-first responsive design approach
- Leverage Shopify's built-in CSS variables for theming
- Example: `.product-card__title--featured`

## Performance Requirements
- Largest Contentful Paint (LCP): <2.5 seconds
- First Input Delay (FID): <100 milliseconds
- Cumulative Layout Shift (CLS): <0.1
- Use Shopify's image optimization and lazy loading
- Minimize third-party scripts

## Accessibility Standards
- Follow WCAG 2.1 AA guidelines
- Ensure proper color contrast ratios
- Implement keyboard navigation
- Use semantic HTML and ARIA labels
- Test with screen readers