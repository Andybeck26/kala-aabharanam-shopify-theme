---
inclusion: manual
---

# Testing Guidelines for Kala Aabharanam

## Testing Strategy Overview

### Testing Pyramid
1. **Manual Testing** (Primary) - Comprehensive user flow testing
2. **Automated Linting** - Code quality and standards
3. **Performance Testing** - Core Web Vitals monitoring
4. **Accessibility Testing** - WCAG 2.1 AA compliance

## Manual Testing Checklist

### Cross-Browser Testing
**Required Browsers:**
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest version)

**Mobile Browsers:**
- Safari iOS (latest)
- Chrome Android (latest)

### Device Testing
**Mobile Devices:**
- iPhone 12/13/14 (Safari)
- Samsung Galaxy S21/S22 (Chrome)
- iPad (Safari)

**Desktop Resolutions:**
- 1920x1080 (Full HD)
- 1366x768 (Common laptop)
- 2560x1440 (QHD)

### Core User Flows Testing

#### 1. Homepage to Purchase Flow
```
Test Steps:
1. Land on homepage
2. Navigate to product category
3. Apply filters and sorting
4. Click on product
5. View product details and images
6. Add to cart
7. Proceed to checkout
8. Complete purchase

Expected Results:
- All pages load within performance targets
- Images display correctly with zoom functionality
- Cart updates properly
- Checkout process completes successfully
- Order confirmation displays
```

#### 2. Product Customization Flow
```
Test Steps:
1. Navigate to customizable product (Kalamkari dress)
2. Select different size options
3. Choose customization options
4. Verify price updates in real-time
5. Add customized product to cart
6. Verify cart shows correct customizations

Expected Results:
- Options display correctly
- Price updates immediately
- Customizations persist in cart
- Product image updates when applicable
```

#### 3. Customer Account Flow
```
Test Steps:
1. Register new account
2. Verify email confirmation
3. Login with credentials
4. Update profile information
5. Add shipping address
6. View order history
7. Logout and login again

Expected Results:
- Registration completes successfully
- Login persists across sessions
- Profile updates save correctly
- Order history displays accurately
```

### Performance Testing

#### Core Web Vitals Targets
- **Largest Contentful Paint (LCP):** < 2.5 seconds
- **First Input Delay (FID):** < 100 milliseconds
- **Cumulative Layout Shift (CLS):** < 0.1

#### Testing Tools
- Google PageSpeed Insights
- Chrome DevTools Lighthouse
- WebPageTest.org
- GTmetrix

#### Performance Test Scenarios
1. **Homepage Load Test**
   - Test with empty cache
   - Test with primed cache
   - Test on 3G connection simulation

2. **Product Page Load Test**
   - Test with multiple high-resolution images
   - Test customization option loading
   - Test related products section

3. **Collection Page Load Test**
   - Test with 24+ products
   - Test filter application speed
   - Test infinite scroll performance

### Accessibility Testing

#### Automated Testing Tools
- axe DevTools browser extension
- WAVE Web Accessibility Evaluator
- Lighthouse accessibility audit

#### Manual Accessibility Tests
1. **Keyboard Navigation**
   - Tab through entire site
   - Verify focus indicators
   - Test skip links
   - Ensure logical tab order

2. **Screen Reader Testing**
   - Test with NVDA (Windows)
   - Test with VoiceOver (Mac)
   - Verify alt text on images
   - Check form labels and descriptions

3. **Color Contrast Testing**
   - Verify all text meets WCAG AA standards
   - Test with color blindness simulators
   - Ensure information isn't conveyed by color alone

### Form Testing

#### Contact Form Testing
```
Test Cases:
1. Submit with all required fields filled
2. Submit with missing required fields
3. Submit with invalid email format
4. Test spam protection
5. Verify confirmation message
6. Confirm admin receives email

Expected Results:
- Validation messages display clearly
- Form submits successfully when valid
- Error states are accessible
- Confirmation feedback is provided
```

#### Newsletter Signup Testing
```
Test Cases:
1. Subscribe with valid email
2. Subscribe with invalid email
3. Subscribe with existing email
4. Test GDPR consent checkbox
5. Verify confirmation email

Expected Results:
- Subscription processes correctly
- Duplicate handling works
- Privacy compliance maintained
```

### E-commerce Specific Testing

#### Cart Functionality
```
Test Cases:
1. Add single item to cart
2. Add multiple items to cart
3. Update quantities in cart
4. Remove items from cart
5. Cart persistence across sessions
6. Cart drawer functionality

Expected Results:
- Cart updates reflect immediately
- Totals calculate correctly
- Cart persists for logged-in users
- Empty cart states display properly
```

#### Checkout Process
```
Test Cases:
1. Guest checkout flow
2. Registered user checkout
3. Multiple shipping addresses
4. Different payment methods
5. Order confirmation process
6. Email receipt delivery

Expected Results:
- All payment methods work
- Shipping calculations are correct
- Order confirmation is accurate
- Receipts are delivered promptly
```

## Bug Reporting Template

### Bug Report Format
```
Title: [Component] - Brief description

Environment:
- Browser: [Browser name and version]
- Device: [Device type and model]
- Screen Resolution: [Width x Height]
- User Type: [Guest/Logged in]

Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Expected Result:
[What should happen]

Actual Result:
[What actually happened]

Severity:
- Critical: Site unusable/checkout broken
- High: Major feature broken
- Medium: Minor feature issue
- Low: Cosmetic issue

Screenshots/Video:
[Attach relevant media]
```

## Test Data Requirements

### Sample Products
- At least 5 products per category
- Mix of simple and variable products
- Products with and without images
- Products with different price ranges
- Out of stock products

### Test Customer Accounts
- Regular customer account
- Customer with order history
- Customer with saved addresses
- Guest checkout scenarios

### Test Orders
- Small order (1 item)
- Large order (10+ items)
- Mixed category order
- Customized product order

## Pre-Launch Testing Checklist

### Final QA Checklist
- [ ] All user flows tested on all required browsers
- [ ] Mobile responsiveness verified on actual devices
- [ ] Performance targets met on all key pages
- [ ] Accessibility compliance verified
- [ ] All forms tested and working
- [ ] Payment processing tested end-to-end
- [ ] Email notifications working
- [ ] Analytics tracking verified
- [ ] SEO elements implemented correctly
- [ ] SSL certificate active and working
- [ ] 404 and error pages tested
- [ ] Site search functionality working
- [ ] Social media integration tested