# Technical Architecture Documentation - Kala Aabharanam

## Overview

This document provides comprehensive technical documentation for the Kala Aabharanam e-commerce platform, including architecture decisions, implementation details, maintenance procedures, and troubleshooting guides.

## System Architecture

### Platform Overview
- **Platform:** Shopify (Basic Monthly Plan)
- **Architecture:** Online Store 2.0 with custom theme
- **Frontend:** Liquid templates, HTML5, CSS3, Alpine.js
- **Backend:** Shopify's managed infrastructure
- **CDN:** Shopify's global CDN network
- **Database:** Shopify's managed database

### Technology Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Platform | Shopify | Latest | E-commerce infrastructure |
| Theme Framework | Online Store 2.0 | Latest | Flexible theme architecture |
| JavaScript Framework | Alpine.js | 3.x | Reactive UI components |
| CSS Framework | Custom | - | Brand-specific styling |
| Build Tool | Shopify CLI | Latest | Development and deployment |
| Version Control | Git | Latest | Code management |

### File Structure

```
kala-aabharanam-theme/
├── assets/
│   ├── application.css          # Main stylesheet
│   ├── application.js           # Main JavaScript
│   ├── alpine.min.js           # Alpine.js framework
│   └── images/                 # Brand assets
├── config/
│   ├── settings_schema.json    # Theme customization
│   └── settings_data.json      # Default settings
├── layout/
│   └── theme.liquid            # Master layout
├── locales/
│   └── en.default.json         # Translations
├── sections/
│   ├── header.liquid           # Site header
│   ├── footer.liquid           # Site footer
│   ├── hero-banner.liquid      # Homepage hero
│   └── [other sections]
├── snippets/
│   ├── product-card.liquid     # Product display
│   ├── cart-drawer.liquid      # Shopping cart
│   └── [other snippets]
├── templates/
│   ├── index.liquid            # Homepage
│   ├── collection.liquid       # Category pages
│   ├── product.liquid          # Product pages
│   └── [other templates]
└── docs/
    └── [documentation files]
```

## Development Environment

### Prerequisites
- Node.js (v16 or higher)
- Shopify CLI
- Git
- Code editor (VS Code recommended)

### Setup Instructions

1. **Install Shopify CLI:**
   ```bash
   npm install -g @shopify/cli @shopify/theme
   ```

2. **Clone Repository:**
   ```bash
   git clone [repository-url]
   cd kala-aabharanam-theme
   ```

3. **Connect to Store:**
   ```bash
   shopify theme dev --store=kala-aabharanam.myshopify.com
   ```

4. **Start Development:**
   ```bash
   shopify theme dev
   ```

### Development Workflow

1. **Create Feature Branch:**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make Changes:**
   - Edit theme files
   - Test locally using `shopify theme dev`

3. **Test Changes:**
   - Verify functionality across devices
   - Check performance metrics
   - Validate accessibility

4. **Deploy to Staging:**
   ```bash
   shopify theme push --unpublished
   ```

5. **Deploy to Production:**
   ```bash
   shopify theme push --live
   ```

## Performance Optimization

### Core Web Vitals Targets
- **Largest Contentful Paint (LCP):** < 2.5 seconds
- **First Input Delay (FID):** < 100 milliseconds
- **Cumulative Layout Shift (CLS):** < 0.1

### Optimization Techniques

#### Image Optimization
```liquid
<!-- Responsive images with lazy loading -->
<img
  src="{{ image | image_url: width: 300 }}"
  srcset="{{ image | image_url: width: 300 }} 300w,
          {{ image | image_url: width: 600 }} 600w,
          {{ image | image_url: width: 900 }} 900w"
  sizes="(max-width: 768px) 100vw, 50vw"
  loading="lazy"
  alt="{{ image.alt | default: product.title }}"
>
```

#### CSS Optimization
- Critical CSS inlined in `<head>`
- Non-critical CSS loaded asynchronously
- CSS custom properties for theming
- Minified production CSS

#### JavaScript Optimization
- Alpine.js for lightweight interactivity
- Deferred loading of non-critical scripts
- Event delegation for better performance
- Minimal third-party scripts

### Performance Monitoring

#### Tools Used
- Google PageSpeed Insights
- Lighthouse CI
- Shopify's built-in performance reports
- Google Analytics Core Web Vitals report

#### Monitoring Schedule
- **Daily:** Automated Lighthouse checks
- **Weekly:** Manual performance review
- **Monthly:** Comprehensive performance audit

## Security Implementation

### Security Measures

#### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self' *.shopify.com *.shopifycdn.com;
               script-src 'self' 'unsafe-inline' *.shopify.com *.google-analytics.com;
               style-src 'self' 'unsafe-inline' fonts.googleapis.com;
               img-src 'self' data: *.shopifycdn.com *.google-analytics.com;
               font-src 'self' fonts.gstatic.com;">
```

#### Input Sanitization
```liquid
<!-- Safe output of user data -->
{{ customer.first_name | escape }}
{{ search.terms | escape }}
{{ product.title | escape }}
```

#### HTTPS Enforcement
- All traffic redirected to HTTPS
- Secure cookies only
- HSTS headers enabled

### Data Protection
- Customer data handled by Shopify (GDPR compliant)
- PCI DSS compliance through Shopify Payments
- Regular security updates via Shopify platform

## Third-Party Integrations

### Installed Apps

#### Judge.me Product Reviews
- **Purpose:** Customer review system
- **Configuration:** Custom styling to match brand
- **API Integration:** Automated review requests

#### Tidio Live Chat
- **Purpose:** Customer support
- **Configuration:** Business hours and automated responses
- **Integration:** Embedded chat widget

#### Google Analytics 4
- **Purpose:** Website analytics and e-commerce tracking
- **Configuration:** Enhanced e-commerce events
- **Integration:** Global site tag implementation

### Integration Monitoring
- **App Performance:** Monthly review of app impact
- **API Limits:** Monitor usage against limits
- **Cost Analysis:** Regular review of app costs vs. value

## Backup and Recovery

### Backup Strategy

#### Theme Backups
- **Automated:** Daily theme backups via Shopify
- **Manual:** Weekly downloads of theme files
- **Version Control:** All changes tracked in Git

#### Data Backups
- **Shopify Managed:** Customer and order data
- **Settings Export:** Monthly export of theme settings
- **Content Backup:** Regular export of blog posts and pages

### Recovery Procedures

#### Theme Recovery
1. **Identify Issue:** Determine scope of problem
2. **Rollback:** Use Shopify's theme version history
3. **Alternative:** Deploy from Git repository
4. **Verify:** Test all functionality after recovery

#### Data Recovery
1. **Contact Shopify Support:** For data-related issues
2. **Restore from Backup:** Use most recent backup
3. **Verify Integrity:** Check data completeness
4. **Communicate:** Inform stakeholders of recovery status

## Monitoring and Maintenance

### System Monitoring

#### Performance Metrics
- **Page Load Times:** Daily monitoring
- **Uptime:** 99.9% target (monitored by Shopify)
- **Error Rates:** Track 404s and server errors
- **Conversion Rates:** Monitor checkout completion

#### Monitoring Tools
- **Shopify Analytics:** Built-in performance metrics
- **Google Analytics:** Traffic and behavior analysis
- **Google Search Console:** SEO and indexing status
- **Uptime Monitoring:** Third-party service for alerts

### Maintenance Schedule

#### Daily Tasks
- [ ] Check system alerts and notifications
- [ ] Review error logs for issues
- [ ] Monitor performance metrics
- [ ] Verify backup completion

#### Weekly Tasks
- [ ] Review app performance and updates
- [ ] Check for theme updates
- [ ] Analyze performance reports
- [ ] Update content and product information

#### Monthly Tasks
- [ ] Comprehensive security review
- [ ] Performance optimization audit
- [ ] App cost and value analysis
- [ ] Backup and recovery testing

#### Quarterly Tasks
- [ ] Full system architecture review
- [ ] Security penetration testing
- [ ] Disaster recovery drill
- [ ] Technology stack evaluation

## Troubleshooting Guide

### Common Issues

#### Site Performance Issues

**Symptom:** Slow page loading
**Diagnosis:**
1. Check Shopify status page
2. Review recent changes
3. Analyze performance metrics
4. Check third-party app impact

**Resolution:**
1. Optimize images and assets
2. Review and minimize JavaScript
3. Check app configurations
4. Contact Shopify support if needed

#### Theme Display Issues

**Symptom:** Layout or styling problems
**Diagnosis:**
1. Check browser console for errors
2. Verify CSS and JavaScript files
3. Test across different browsers
4. Check theme settings

**Resolution:**
1. Clear browser cache
2. Verify theme file integrity
3. Rollback to previous version if needed
4. Fix specific CSS/JavaScript issues

#### Checkout Issues

**Symptom:** Customers unable to complete purchases
**Diagnosis:**
1. Test checkout process
2. Check payment gateway status
3. Review error logs
4. Verify SSL certificate

**Resolution:**
1. Contact payment provider
2. Check Shopify Payments settings
3. Verify checkout customizations
4. Test with different payment methods

### Emergency Procedures

#### Site Down
1. **Immediate Response:**
   - Check Shopify status page
   - Verify DNS settings
   - Contact Shopify support

2. **Communication:**
   - Notify stakeholders
   - Update social media
   - Prepare customer communication

3. **Recovery:**
   - Follow Shopify's guidance
   - Monitor restoration progress
   - Verify full functionality

#### Security Incident
1. **Immediate Actions:**
   - Change all admin passwords
   - Review admin user access
   - Contact Shopify support

2. **Investigation:**
   - Document incident details
   - Review access logs
   - Identify potential vulnerabilities

3. **Recovery:**
   - Implement security fixes
   - Monitor for suspicious activity
   - Update security procedures

## API Documentation

### Shopify APIs Used

#### Storefront API
- **Purpose:** Frontend data retrieval
- **Usage:** Product information, cart management
- **Rate Limits:** 1000 requests per minute

#### Admin API
- **Purpose:** Store management operations
- **Usage:** Order processing, inventory updates
- **Rate Limits:** 2 requests per second

### Custom JavaScript Functions

#### Cart Management
```javascript
// Add item to cart
async function addToCart(variantId, quantity) {
  try {
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity })
    });
    return await response.json();
  } catch (error) {
    console.error('Cart error:', error);
    throw error;
  }
}

// Update cart item
async function updateCart(variantId, quantity) {
  try {
    const response = await fetch('/cart/update.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates: { [variantId]: quantity } })
    });
    return await response.json();
  } catch (error) {
    console.error('Update error:', error);
    throw error;
  }
}
```

## Deployment Procedures

### Development to Staging
1. **Code Review:** Ensure code quality and standards
2. **Testing:** Comprehensive functionality testing
3. **Deploy:** `shopify theme push --unpublished`
4. **Verify:** Test all features on staging theme
5. **Approval:** Get stakeholder approval

### Staging to Production
1. **Final Testing:** Complete pre-launch checklist
2. **Backup:** Create backup of current live theme
3. **Deploy:** `shopify theme push --live`
4. **Monitor:** Watch for issues post-deployment
5. **Verify:** Confirm all functionality works

### Rollback Procedures
1. **Identify Issue:** Determine severity and scope
2. **Decision:** Decide on rollback vs. hotfix
3. **Execute:** Use Shopify theme version history
4. **Verify:** Confirm rollback success
5. **Investigate:** Analyze root cause

## Contact Information

### Technical Support Contacts
- **Shopify Support:** 24/7 via admin panel
- **Theme Developer:** [Contact information]
- **System Administrator:** [Contact information]
- **Emergency Contact:** [Contact information]

### Escalation Procedures
1. **Level 1:** Customer service team
2. **Level 2:** Technical team lead
3. **Level 3:** System administrator
4. **Level 4:** External Shopify experts

This technical architecture documentation provides the foundation for maintaining and troubleshooting the Kala Aabharanam e-commerce platform effectively.