---
inclusion: fileMatch
fileMatchPattern: '*.liquid,*.css,*.scss,*.js'
---

# Kala Aabharanam Design System

## Brand Colors

### Primary Palette
```css
:root {
  --color-primary: #8A3324;      /* Burnt Orange - CTAs, accents, links */
  --color-secondary: #D2B48C;    /* Sand Dollar - Backgrounds, secondary elements */
  --color-accent: #C71585;       /* Puce - Special highlights, sale tags */
  --color-gold: #FFD700;         /* Gold - Premium accents */
  
  --color-text-primary: #36454F; /* Charcoal - Body copy, headings */
  --color-text-secondary: #666;  /* Secondary text */
  --color-background: #F5F5DC;   /* Beige - Page backgrounds */
  --color-white: #FFFFFF;
  --color-error: #D22B2B;        /* Vermilion - Error messages */
}
```

### Usage Guidelines
- **Burnt Orange (#8A3324):** Primary CTAs, navigation highlights, product badges
- **Sand Dollar (#D2B48C):** Section backgrounds, card backgrounds, subtle borders
- **Puce (#C71585):** Sale indicators, special promotions, accent elements
- **Gold (#FFD700):** Premium product indicators, luxury accents (use sparingly)

## Typography

### Font Stack
```css
/* Headings - Elegant serif for traditional feel */
--font-heading: 'Playfair Display', 'Times New Roman', serif;

/* Body text - Clean sans-serif for readability */
--font-body: 'Lato', 'Helvetica Neue', Arial, sans-serif;

/* UI elements - System fonts for performance */
--font-ui: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Type Scale
```css
--font-size-xs: 0.75rem;    /* 12px - Small labels, captions */
--font-size-sm: 0.875rem;   /* 14px - Secondary text */
--font-size-base: 1rem;     /* 16px - Body text */
--font-size-lg: 1.125rem;   /* 18px - Large body text */
--font-size-xl: 1.25rem;    /* 20px - Small headings */
--font-size-2xl: 1.5rem;    /* 24px - Section headings */
--font-size-3xl: 1.875rem;  /* 30px - Page headings */
--font-size-4xl: 2.25rem;   /* 36px - Hero headings */
```

## Spacing System

### Consistent Spacing Scale
```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-2xl: 3rem;     /* 48px */
--spacing-3xl: 4rem;     /* 64px */
```

## Component Specifications

### Buttons
```css
.btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: 4px;
  font-family: var(--font-ui);
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.btn--primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.btn--primary:hover {
  background-color: #7A2B1F;
  transform: translateY(-1px);
}

.btn--secondary {
  background-color: transparent;
  color: var(--color-primary);
  border-color: var(--color-primary);
}
```

### Product Cards
```css
.product-card {
  background: var(--color-white);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.product-card__image {
  aspect-ratio: 1;
  object-fit: cover;
  width: 100%;
}

.product-card__content {
  padding: var(--spacing-md);
}

.product-card__title {
  font-family: var(--font-heading);
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
}

.product-card__price {
  font-weight: 600;
  color: var(--color-primary);
  font-size: var(--font-size-lg);
}
```

### Form Elements
```css
.form-field {
  margin-bottom: var(--spacing-lg);
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 600;
  color: var(--color-text-primary);
}

.form-input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--color-secondary);
  border-radius: 4px;
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(138, 51, 36, 0.1);
}
```

## Layout Guidelines

### Grid System
- Use CSS Grid for complex layouts
- Use Flexbox for component-level alignment
- Mobile-first breakpoints:
  - Mobile: 320px+
  - Tablet: 768px+
  - Desktop: 1024px+
  - Large Desktop: 1200px+

### Container Widths
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

@media (min-width: 768px) {
  .container {
    padding: 0 var(--spacing-lg);
  }
}
```

## Interaction Guidelines

### Hover Effects
- Subtle elevation changes (2-4px translateY)
- Smooth transitions (0.2s ease)
- Color shifts should be 10-15% darker/lighter
- Use box-shadow for depth, not heavy borders

### Loading States
- Use skeleton screens for content loading
- Implement smooth fade-in animations
- Show progress indicators for longer operations

### Micro-interactions
- Button press feedback (slight scale down)
- Form field focus states with subtle glow
- Smooth page transitions
- Hover states on interactive elements

## Accessibility Requirements

### Color Contrast
- Text on background: minimum 4.5:1 ratio
- Large text (18px+): minimum 3:1 ratio
- Interactive elements: minimum 3:1 ratio

### Focus States
```css
.focusable:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### Screen Reader Support
- Use semantic HTML elements
- Provide alt text for all images
- Include ARIA labels for complex interactions
- Ensure logical tab order