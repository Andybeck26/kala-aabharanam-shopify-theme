# Kala Aabharanam Shopify Theme

A premium Shopify theme for Kala Aabharanam - Art of Jewellery, featuring traditional artificial jewellery and Kalamkari textiles.

## Theme Structure

This theme follows Shopify's Online Store 2.0 architecture with the following structure:

```
├── assets/           # CSS, JavaScript, and image files
├── config/           # Theme settings and configuration
├── layout/           # Layout templates (theme.liquid)
├── locales/          # Translation files
├── sections/         # Reusable sections
├── snippets/         # Reusable code snippets
└── templates/        # Page templates (JSON format)
```

## Development Setup

### Prerequisites

1. **Shopify CLI**: Install the Shopify CLI
   ```bash
   npm install -g @shopify/cli @shopify/theme
   ```

2. **Node.js**: Version 16 or higher
3. **Shopify Store**: Access to a Shopify store for development

### Getting Started

1. **Clone and Setup**
   ```bash
   # Install dependencies
   npm install
   
   # Login to Shopify CLI
   shopify auth login
   ```

2. **Configure Store Connection**
   - Update `shopify.theme.toml` with your store URL
   - Replace `kala-aabharanam.myshopify.com` with your actual store URL

3. **Start Development**
   ```bash
   # Start local development server
   npm run dev
   # or
   shopify theme dev
   ```

4. **Deploy to Development Theme**
   ```bash
   # Push to development theme
   npm run deploy
   # or  
   shopify theme push --development
   ```

### Available Scripts

- `npm run dev` - Start local development server
- `npm run build` - Run theme check for validation
- `npm run deploy` - Deploy to development theme
- `npm run pull` - Pull latest theme from Shopify
- `npm run format` - Format code with Prettier
- `npm run lint` - Lint code with ESLint
- `npm run lint:fix` - Fix linting issues automatically

## Brand Guidelines

### Colors
- **Primary (Puce)**: #C71585
- **Secondary (Sand Dollar)**: #D2B48C  
- **Accent (Burnt Orange)**: #8A3324
- **Gold**: #FFD700
- **Text**: #36454F
- **Background**: #F5F5DC

### Typography
- **Headings**: Playfair Display (elegant, traditional)
- **Body**: Lato (clean, readable)

### Design Principles
- Elegant and traditional aesthetic
- Mobile-first responsive design
- Performance optimized
- Accessibility compliant (WCAG 2.1 AA)

## Features

- **Online Store 2.0 Architecture**: Modern, flexible theme structure
- **Alpine.js Integration**: Lightweight reactive components
- **Performance Optimized**: Core Web Vitals compliant
- **Mobile Responsive**: Touch-friendly interface
- **SEO Optimized**: Structured data and meta tags
- **Accessibility**: WCAG 2.1 AA compliant

## Customization

The theme can be customized through:

1. **Theme Settings**: Available in Shopify admin under Online Store > Themes > Customize
2. **Section Settings**: Individual section configurations
3. **CSS Variables**: Brand colors and spacing defined in CSS custom properties
4. **Liquid Templates**: Modify templates for custom functionality

## Performance

Target metrics:
- **LCP (Largest Contentful Paint)**: < 2.5 seconds
- **FID (First Input Delay)**: < 100 milliseconds  
- **CLS (Cumulative Layout Shift)**: < 0.1

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Contributing

1. Follow the established code style (Prettier + ESLint)
2. Test on multiple devices and browsers
3. Ensure accessibility compliance
4. Validate performance impact

## Support

For technical support or questions about this theme, please contact the development team.

## License

This theme is proprietary to Kala Aabharanam. All rights reserved.