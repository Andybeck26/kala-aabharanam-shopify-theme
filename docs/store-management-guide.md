# Kala Aabharanam Store Management Guide

## Overview
This comprehensive guide provides step-by-step instructions for managing the Kala Aabharanam e-commerce store on Shopify. It covers daily operations, product management, order processing, and customer service.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Product Management](#product-management)
3. [Order Management](#order-management)
4. [Customer Management](#customer-management)
5. [Content Management](#content-management)
6. [Analytics and Reports](#analytics-and-reports)
7. [Marketing and Promotions](#marketing-and-promotions)
8. [Troubleshooting](#troubleshooting)

## Getting Started

### Accessing Your Store Admin
1. **Login URL:** https://kala-aabharanam.myshopify.com/admin
2. **Use your admin credentials** provided during setup
3. **Bookmark the admin URL** for quick access

### Admin Dashboard Overview
The Shopify admin dashboard is your control center:
- **Home:** Overview of recent activity and key metrics
- **Orders:** Manage customer orders and fulfillment
- **Products:** Add, edit, and organize your product catalog
- **Customers:** View and manage customer information
- **Analytics:** Track store performance and sales data
- **Marketing:** Create campaigns and manage promotions
- **Discounts:** Set up coupon codes and automatic discounts
- **Apps:** Manage installed applications
- **Online Store:** Customize your website and content
- **Settings:** Configure store settings and preferences

## Product Management

### Adding New Products

#### Step 1: Navigate to Products
1. Click **Products** in the admin sidebar
2. Click **Add product** button

#### Step 2: Basic Product Information
```
Title: Enter descriptive product name
Example: "Traditional Gold-Plated Kundan Necklace Set"

Description: Write compelling product description
- Highlight key features and benefits
- Include materials and craftsmanship details
- Mention cultural significance if applicable
- Add care instructions

Product type: Select category
- Artificial Gold Jewellery
- Oxidized Jewellery  
- Artificial Beads and Chains
- Kalamkari Women's Wear

Vendor: Kala Aabharanam
```

#### Step 3: Product Images
1. **Upload high-quality images** (minimum 1000x1000 pixels)
2. **Add 5-8 images per product:**
   - Main product shot (front view)
   - Detail shots (close-ups of craftsmanship)
   - Lifestyle/model shots
   - Back/side views
   - Packaging (if premium)
3. **Add alt text** for each image for SEO and accessibility
4. **Arrange images** in logical order (main image first)

#### Step 4: Pricing
```
Price: Set regular selling price
Compare at price: Set if item is on sale (shows original price)
Cost per item: Your cost (for profit tracking)
Profit: Automatically calculated
Margin: Automatically calculated

Tax settings:
☑ Charge tax on this product
Tax code: Use default (18% GST for jewelry in India)
```

#### Step 5: Inventory Tracking
```
☑ Track quantity
Quantity: Enter current stock level
☑ Continue selling when out of stock (optional)
☑ This product has a SKU
SKU: Create unique identifier (e.g., KA-NK-001)
Barcode: Add if available
```

#### Step 6: Shipping
```
☑ This is a physical product
Weight: Enter accurate weight for shipping calculations
Customs information: Required for international shipping
- Country of origin: India
- HS code: Look up appropriate code for jewelry
```

#### Step 7: Product Variants (if applicable)
For products with multiple options (size, color):
1. Click **Add variant**
2. Set up options (Size: Small/Medium/Large, Color: Gold/Silver)
3. Add images for each variant
4. Set individual prices and inventory for each variant

#### Step 8: SEO Settings
```
Search engine listing preview:
Page title: Optimize for search (include keywords)
Meta description: Write compelling 150-character description
URL handle: Keep clean and descriptive
```

#### Step 9: Product Organization
```
Product status: Active (to make visible on store)
Product availability: Online Store
Collections: Add to relevant collections
Tags: Add searchable tags (gold, traditional, necklace, etc.)
```

### Managing Product Collections

#### Creating Collections
1. Go to **Products > Collections**
2. Click **Create collection**
3. Choose collection type:
   - **Manual:** Manually select products
   - **Automated:** Products added based on conditions

#### Collection Setup
```
Title: Collection name (e.g., "Bridal Jewelry Collection")
Description: Write engaging collection description
Collection type: Manual or Automated
Search engine listing: Optimize title and description
Collection image: Add attractive banner image
```

#### Automated Collection Conditions
For automated collections, set conditions:
```
Product type equals "Artificial Gold Jewellery"
AND Product tag contains "bridal"
AND Product price is greater than ₹1000
```

### Inventory Management

#### Stock Monitoring
1. **Products > Inventory** shows all product stock levels
2. **Low stock alerts:** Set up notifications when inventory is low
3. **Bulk updates:** Use CSV import/export for large inventory changes

#### Updating Stock Levels
1. Go to **Products > Inventory**
2. Click on quantity field to edit
3. Enter new quantity and save
4. Add notes about stock changes for tracking

## Order Management

### Order Processing Workflow

#### Step 1: New Order Notification
- Orders appear in **Orders** section
- Email notifications sent automatically
- Check order details and customer information

#### Step 2: Order Verification
```
Verify order details:
☑ Correct products and quantities
☑ Accurate shipping address
☑ Valid payment method
☑ No fraud indicators

Check inventory:
☑ All items in stock
☑ Variants are correct
☑ Custom requirements noted
```

#### Step 3: Order Fulfillment
1. **Prepare items for shipping**
2. **Package carefully** with brand materials
3. **Create shipping label** (if using Shopify Shipping)
4. **Mark as fulfilled** in admin:
   - Go to order details
   - Click **Fulfill items**
   - Add tracking number
   - Select shipping carrier
   - Send notification to customer

#### Step 4: Post-Fulfillment
- **Monitor delivery status**
- **Follow up with customer** if needed
- **Request review** after delivery (automated via Judge.me)

### Handling Special Situations

#### Cancellations
1. **Customer requests cancellation:**
   - If unfulfilled: Cancel and refund immediately
   - If fulfilled: Follow return policy
2. **Process refund** through Shopify admin
3. **Update inventory** if items returned to stock

#### Returns and Exchanges
1. **Evaluate return request** against policy
2. **Provide return instructions** to customer
3. **Process refund or exchange** once item received
4. **Inspect returned items** before restocking

#### Custom Orders
1. **Communicate with customer** about requirements
2. **Adjust pricing** if needed for customization
3. **Extended processing time** - inform customer
4. **Document custom specifications** in order notes

## Customer Management

### Customer Information
Access customer details in **Customers** section:
- Contact information
- Order history
- Total spent
- Account status
- Notes and tags

### Customer Service Best Practices

#### Response Times
- **Live chat:** Immediate during business hours
- **Email inquiries:** Within 24 hours
- **Order issues:** Within 4 hours
- **Returns/refunds:** Within 48 hours

#### Communication Guidelines
```
Tone: Professional, friendly, and helpful
Language: Clear and easy to understand
Personalization: Use customer's name
Empathy: Acknowledge concerns and frustrations
Solutions: Offer clear next steps and resolutions
```

#### Common Customer Inquiries

**Product Information:**
- Materials and quality details
- Size and fit guidance
- Care instructions
- Customization options

**Order Status:**
- Processing time updates
- Shipping tracking information
- Delivery estimates
- Order modifications

**Returns and Exchanges:**
- Return policy explanation
- Return process instructions
- Exchange options
- Refund timelines

### Customer Segmentation
Use customer tags for targeted marketing:
- **VIP:** High-value customers
- **Repeat:** Multiple purchases
- **Bridal:** Wedding-related purchases
- **Wholesale:** Bulk buyers
- **International:** Overseas customers

## Content Management

### Blog Management
1. **Online Store > Blog posts**
2. **Create engaging content:**
   - Jewelry care tips
   - Cultural significance of designs
   - Styling guides
   - Behind-the-scenes content
   - Customer spotlights

#### Blog Post Structure
```
Title: SEO-optimized and engaging
Content: 500-1000 words with images
Tags: Relevant keywords for categorization
SEO: Optimize meta title and description
Featured image: High-quality, relevant image
```

### Page Management
**Online Store > Pages** for static content:
- About Us
- Shipping & Returns Policy
- Size Guide
- Care Instructions
- FAQ
- Contact Information

### Menu Management
**Online Store > Navigation** to organize site structure:
- Main menu (header navigation)
- Footer menu (secondary links)
- Mobile menu optimization

## Analytics and Reports

### Key Metrics to Monitor

#### Sales Metrics
- **Total sales:** Revenue over time periods
- **Average order value:** Revenue per order
- **Conversion rate:** Visitors who make purchases
- **Top products:** Best-selling items
- **Sales by traffic source:** Where customers come from

#### Customer Metrics
- **New vs returning customers**
- **Customer lifetime value**
- **Customer acquisition cost**
- **Geographic distribution**

#### Inventory Metrics
- **Stock levels and turnover**
- **Low stock alerts**
- **Product performance**
- **Seasonal trends**

### Generating Reports
1. **Analytics > Reports**
2. **Select report type:**
   - Sales reports
   - Customer reports
   - Inventory reports
   - Marketing reports
3. **Customize date range and filters**
4. **Export data** for further analysis

### Google Analytics Integration
Monitor additional metrics in Google Analytics:
- **Website traffic sources**
- **User behavior on site**
- **Page performance**
- **E-commerce tracking**
- **Goal conversions**

## Marketing and Promotions

### Email Marketing
Using Shopify Email or integrated apps:

#### Campaign Types
- **Welcome series:** New subscriber onboarding
- **Product announcements:** New arrivals and collections
- **Seasonal promotions:** Festival and holiday campaigns
- **Abandoned cart recovery:** Re-engage potential customers
- **Win-back campaigns:** Re-activate inactive customers

#### Email Best Practices
```
Subject lines: Clear, compelling, under 50 characters
Content: Mobile-optimized, visually appealing
Call-to-action: Clear and prominent
Personalization: Use customer name and preferences
Timing: Send at optimal times for your audience
```

### Social Media Integration
- **Instagram:** Showcase products and lifestyle content
- **Facebook:** Community building and customer service
- **Pinterest:** Inspiration and product discovery
- **WhatsApp:** Direct customer communication

### Discount Management
**Discounts** section for promotions:

#### Discount Types
- **Percentage discounts:** 10% off, 25% off
- **Fixed amount:** ₹100 off, ₹500 off
- **Free shipping:** On orders above threshold
- **Buy X Get Y:** Bundle promotions

#### Discount Settings
```
Discount code: Create memorable codes (WELCOME10, FESTIVE25)
Usage limits: Per customer or total uses
Minimum requirements: Order value or quantity
Customer eligibility: All customers or specific groups
Active dates: Start and end dates for promotion
```

## Troubleshooting

### Common Issues and Solutions

#### Website Issues
**Problem:** Page loading slowly
**Solution:** 
- Check image sizes and optimize
- Review installed apps for conflicts
- Contact Shopify support if persistent

**Problem:** Theme customization not showing
**Solution:**
- Clear browser cache
- Check if changes were saved
- Verify theme is published

#### Order Issues
**Problem:** Payment not processing
**Solution:**
- Verify payment gateway settings
- Check for fraud filters
- Confirm customer payment method

**Problem:** Inventory not updating
**Solution:**
- Check inventory tracking settings
- Verify product variants
- Refresh admin dashboard

#### Customer Issues
**Problem:** Customer can't log in
**Solution:**
- Verify email address
- Send password reset link
- Check account status

**Problem:** Email notifications not sending
**Solution:**
- Check email template settings
- Verify customer email address
- Test email deliverability

### Getting Help

#### Shopify Support
- **Help Center:** https://help.shopify.com/
- **24/7 Support:** Available via chat, email, phone
- **Community Forums:** Connect with other merchants

#### App Support
- **Judge.me:** Review app support
- **Tidio:** Live chat support
- **Other apps:** Check individual app documentation

#### Technical Support
- **Theme issues:** Contact theme developer
- **Custom development:** Hire Shopify Expert
- **Advanced features:** Consult with developer

### Emergency Procedures

#### Site Down
1. **Check Shopify status:** status.shopify.com
2. **Contact Shopify support** immediately
3. **Communicate with customers** via social media
4. **Document issue** for follow-up

#### Payment Issues
1. **Verify payment gateway status**
2. **Check for service outages**
3. **Contact payment provider**
4. **Offer alternative payment methods**

#### Security Concerns
1. **Change admin passwords** immediately
2. **Review admin user access**
3. **Contact Shopify support**
4. **Monitor for suspicious activity**

## Daily, Weekly, and Monthly Tasks

### Daily Tasks (15-30 minutes)
- [ ] Check new orders and process fulfillment
- [ ] Respond to customer inquiries
- [ ] Monitor inventory levels
- [ ] Review and respond to product reviews
- [ ] Check website functionality

### Weekly Tasks (1-2 hours)
- [ ] Analyze sales and traffic reports
- [ ] Update product information and inventory
- [ ] Create and schedule social media content
- [ ] Review and respond to customer feedback
- [ ] Plan upcoming promotions

### Monthly Tasks (2-4 hours)
- [ ] Comprehensive analytics review
- [ ] Update product collections and featured items
- [ ] Review and optimize marketing campaigns
- [ ] Backup important data and settings
- [ ] Plan content calendar for next month
- [ ] Review app performance and costs

This guide provides the foundation for successfully managing your Kala Aabharanam store. Regular practice with these procedures will help you become proficient in all aspects of e-commerce management.