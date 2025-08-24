# Production Environment Setup Guide

## Overview
This guide outlines the complete setup process for deploying the Kala Aabharanam e-commerce platform to production on Shopify.

## Prerequisites

### Required Accounts and Access
- [ ] Shopify store with Basic Monthly Plan or higher
- [ ] Domain name registered and ready for configuration
- [ ] SSL certificate (handled automatically by Shopify)
- [ ] Google Analytics 4 account
- [ ] Google Search Console access
- [ ] Third-party app accounts (Judge.me, Tidio, etc.)

### Development Environment
- [ ] Shopify CLI installed and configured
- [ ] Theme development completed and tested
- [ ] All assets optimized and ready
- [ ] Content and product data prepared

## Production Shopify Store Configuration

### 1. Store Settings Configuration

#### Basic Store Information
```bash
# Access: Shopify Admin > Settings > General
Store name: Kala Aabharanam
Store industry: Apparel & Accessories > Jewelry
Store address: [Complete business address]
Contact email: info@kala-aabharanam.com
Customer email: support@kala-aabharanam.com
```

#### Currency and Regional Settings
```bash
Store currency: INR (Indian Rupee)
Timezone: (GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi
Unit system: Metric
Default weight unit: kg
```

#### Store Status
```bash
# Ensure store is set to "Online" before launch
Password protection: Disabled
Search engine listing: Enabled
```

### 2. Domain Configuration

#### Custom Domain Setup
1. **Purchase Domain** (if not already owned)
   - Recommended: kala-aabharanam.com
   - Alternative: kalaaabharanam.com

2. **DNS Configuration**
   ```bash
   # Add these DNS records at your domain registrar:
   
   # A Record
   Type: A
   Name: @
   Value: 23.227.38.65
   TTL: 300
   
   # CNAME Record  
   Type: CNAME
   Name: www
   Value: shops.myshopify.com
   TTL: 300
   ```

3. **Shopify Domain Connection**
   ```bash
   # In Shopify Admin > Online Store > Domains
   1. Click "Connect existing domain"
   2. Enter: kala-aabharanam.com
   3. Verify DNS settings
   4. Set as primary domain
   5. Enable SSL certificate (automatic)
   ```

### 3. Theme Deployment

#### Production Theme Upload
```bash
# Using Shopify CLI
shopify theme push --store=kala-aabharanam.myshopify.com --theme-id=live

# Or create new theme first
shopify theme push --store=kala-aabharanam.myshopify.com --unpublished --theme-name="Kala Aabharanam v1.0"
```

#### Theme Settings Configuration
```liquid
<!-- Configure in Shopify Admin > Online Store > Themes > Customize -->

Colors:
- Primary Color: #8A3324 (Burnt Orange)
- Secondary Color: #D2B48C (Sand Dollar)  
- Accent Color: #C71585 (Puce)
- Gold Accent: #FFD700

Typography:
- Heading Font: Playfair Display
- Body Font: Lato

Logo:
- Upload high-resolution logo (SVG preferred)
- Set appropriate sizing for header

Social Media:
- Facebook: https://facebook.com/kalaaabharanam
- Instagram: https://instagram.com/kalaaabharanam
- Twitter: https://twitter.com/kalaaabharanam
```

## Payment Gateway Configuration

### Shopify Payments Setup
```bash
# In Shopify Admin > Settings > Payments

Primary Payment Method: Shopify Payments
Accepted Cards: Visa, Mastercard, American Express, RuPay
Currency: INR

Additional Payment Methods:
- UPI (Unified Payments Interface)
- Net Banking
- Wallets (Paytm, PhonePe, Google Pay)
- EMI options for orders above ₹5,000
```

### Payment Security
```bash
# Fraud Analysis Settings
Risk threshold: Medium
Automatically capture payment: Enabled for low-risk orders
Manual review: Enabled for high-risk orders

# 3D Secure Authentication
Enable 3D Secure: Yes (for enhanced security)
```

## Shipping Configuration

### Shipping Zones and Rates
```bash
# India Domestic Shipping
Zone: India
Rate 1: Free shipping on orders above ₹999
Rate 2: Standard shipping ₹99 (3-7 business days)
Rate 3: Express shipping ₹199 (1-3 business days)

# International Shipping (if applicable)
Zone: Rest of World  
Rate: International shipping ₹1,999 (7-14 business days)
```

### Shipping Settings
```bash
# In Shopify Admin > Settings > Shipping and delivery
Package dimensions: Set default package size
Weight-based rates: Configure if needed
Shipping labels: Enable Shopify Shipping (if available in India)
```

## Tax Configuration

### Indian Tax Settings
```bash
# In Shopify Admin > Settings > Taxes and duties

GST Configuration:
- Enable tax collection: Yes
- Tax registration number: [Your GST number]
- Default tax rate: 18% (for jewelry)
- Tax-inclusive pricing: Yes

State-wise GST:
- Intra-state: CGST + SGST (9% + 9%)
- Inter-state: IGST (18%)
```

## Analytics and Tracking Setup

### Google Analytics 4 Configuration
```javascript
// Add to theme.liquid before </head>
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    // Enhanced E-commerce tracking
    send_page_view: true,
    custom_map: {
      'custom_parameter_1': 'dimension1'
    }
  });

  // E-commerce events
  {% if template contains 'product' %}
    gtag('event', 'view_item', {
      currency: '{{ cart.currency.iso_code }}',
      value: {{ product.price | money_without_currency }},
      items: [{
        item_id: '{{ product.id }}',
        item_name: '{{ product.title | escape }}',
        category: '{{ product.type }}',
        price: {{ product.price | money_without_currency }}
      }]
    });
  {% endif %}
</script>
```

### Google Search Console Setup
```bash
1. Go to Google Search Console
2. Add property: kala-aabharanam.com
3. Verify ownership via DNS or HTML file
4. Submit sitemap: https://kala-aabharanam.com/sitemap.xml
5. Set up performance monitoring
```

### Facebook Pixel (Optional)
```javascript
// Add to theme.liquid if using Facebook advertising
<!-- Facebook Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
```

## Third-Party App Configuration

### Judge.me Product Reviews
```bash
# Installation and Setup
1. Install Judge.me from Shopify App Store
2. Configure review request timing: 7 days after delivery
3. Customize review widget design to match theme
4. Enable photo reviews and Q&A features
5. Set up review moderation workflow
```

### Tidio Live Chat
```bash
# Installation and Setup  
1. Install Tidio from Shopify App Store
2. Configure business hours: 9 AM - 6 PM IST
3. Set up automated greetings and responses
4. Configure offline messages
5. Train customer service team on chat management
```

### Email Marketing (Shopify Email or Klaviyo)
```bash
# Shopify Email Setup
1. Enable Shopify Email in admin
2. Create welcome email series
3. Set up abandoned cart recovery (24h, 3 days, 1 week)
4. Configure order confirmation templates
5. Create newsletter templates

# Or Klaviyo Setup (if preferred)
1. Install Klaviyo app
2. Sync customer data
3. Set up automated flows
4. Create segmentation rules
5. Design email templates
```

## Security Configuration

### SSL Certificate
```bash
# Automatic SSL through Shopify
- Certificate type: Let's Encrypt (free) or Shopify SSL
- Force HTTPS: Enabled
- HSTS: Enabled
- Certificate renewal: Automatic
```

### Content Security Policy
```liquid
<!-- Add to theme.liquid <head> section -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self' *.shopify.com *.shopifycdn.com; 
               script-src 'self' 'unsafe-inline' *.shopify.com *.google-analytics.com *.googletagmanager.com;
               style-src 'self' 'unsafe-inline' fonts.googleapis.com;
               img-src 'self' data: *.shopifycdn.com *.google-analytics.com;
               font-src 'self' fonts.gstatic.com;">
```

### Privacy and GDPR Compliance
```bash
# In Shopify Admin > Settings > Customer privacy
1. Enable customer data request portal
2. Configure data retention policies  
3. Set up cookie consent (if required)
4. Create privacy policy page
5. Enable customer data deletion requests
```

## Performance Optimization

### Shopify Performance Settings
```bash
# In theme code and settings:
1. Enable lazy loading for images
2. Optimize image sizes and formats
3. Minimize HTTP requests
4. Use Shopify's CDN for all assets
5. Enable browser caching headers
```

### Core Web Vitals Optimization
```liquid
<!-- Critical CSS inlining -->
<style>
  /* Critical above-the-fold CSS here */
  .header { /* styles */ }
  .hero { /* styles */ }
</style>

<!-- Preload important resources -->
<link rel="preload" href="{{ 'application.css' | asset_url }}" as="style">
<link rel="preload" href="{{ 'application.js' | asset_url }}" as="script">

<!-- Preconnect to external domains -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://www.google-analytics.com">
```

## Backup and Recovery

### Theme Backup Strategy
```bash
# Regular theme backups
1. Weekly automated backups via Shopify CLI
2. Version control with Git repository
3. Store backup copies of theme files
4. Document all customizations and changes

# Backup commands
shopify theme pull --store=kala-aabharanam.myshopify.com
git add . && git commit -m "Production backup $(date)"
git push origin main
```

### Data Backup
```bash
# Shopify automatically backs up:
- Product data
- Customer information  
- Order history
- Store settings

# Additional backups:
- Export customer data monthly
- Export product data before major updates
- Backup custom metafields and settings
```

## Deployment Checklist

### Pre-Launch Verification
- [ ] Domain properly configured and SSL active
- [ ] All theme files uploaded and tested
- [ ] Payment gateways tested with small transactions
- [ ] Shipping rates configured and tested
- [ ] Tax settings verified for compliance
- [ ] All third-party apps installed and configured
- [ ] Analytics tracking verified
- [ ] Email notifications tested
- [ ] Mobile responsiveness confirmed
- [ ] Performance metrics meet targets
- [ ] Security headers implemented
- [ ] Backup procedures in place

### Launch Day Tasks
- [ ] Remove password protection from store
- [ ] Enable search engine indexing
- [ ] Submit sitemap to search engines
- [ ] Announce launch on social media
- [ ] Monitor site performance and errors
- [ ] Test all critical user flows
- [ ] Verify analytics data collection
- [ ] Check email deliverability

### Post-Launch Monitoring
- [ ] Daily performance monitoring
- [ ] Weekly analytics review
- [ ] Monthly security updates
- [ ] Quarterly backup verification
- [ ] Ongoing optimization based on data

## Rollback Procedures

### Emergency Rollback Plan
```bash
# If critical issues arise:
1. Revert to previous theme version
   shopify theme publish --store=kala-aabharanam.myshopify.com --theme-id=[BACKUP_THEME_ID]

2. Restore from Git backup
   git checkout [LAST_STABLE_COMMIT]
   shopify theme push --store=kala-aabharanam.myshopify.com

3. Enable maintenance mode if needed
   # Add password protection temporarily

4. Communicate with customers
   # Update social media and send email if necessary
```

### Issue Escalation
```bash
Priority 1 (Critical): Site down, payment issues
- Response time: Immediate
- Contact: Technical lead + Shopify support

Priority 2 (High): Functionality broken, performance issues  
- Response time: Within 2 hours
- Contact: Development team

Priority 3 (Medium): Minor bugs, cosmetic issues
- Response time: Within 24 hours
- Contact: Development team via normal channels
```

## Support and Maintenance

### Ongoing Maintenance Schedule
```bash
Daily:
- Monitor site performance
- Check for broken links or errors
- Review customer feedback

Weekly:  
- Update product information
- Review analytics data
- Check app functionality
- Backup theme files

Monthly:
- Security updates
- Performance optimization
- Content updates
- App updates and reviews

Quarterly:
- Comprehensive site audit
- User experience review
- Conversion optimization
- Backup verification
```

This production setup guide ensures a smooth deployment and ongoing operation of the Kala Aabharanam e-commerce platform.