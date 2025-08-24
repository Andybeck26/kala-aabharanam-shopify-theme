# **"Kala Aabharanam" UI/UX Specification \- v1.0**

## **Introduction**

This document defines the user experience goals, information architecture, user flows, and visual design specifications for the "Kala Aabharanam" user interface. It serves as the foundation for visual design and frontend development, ensuring a cohesive, luxurious, and user-centered experience that aligns with the vision outlined in the PRD v2.1.

### **Overall UX Goals & Principles**

* **Target User Personas:**  
  * **The Modern Traditionalist (25-40):** Digitally savvy, appreciates cultural heritage but seeks modern elegance. Values quality, authenticity, and personalization.  
  * **The Occasional Buyer (18-50+):** Shops for specific events (weddings, festivals). Prioritizes ease of use, clear product information, and trustworthy reviews.  
* **Usability Goals:**  
  * **Effortless Discovery:** Users should be able to find a specific product or browse collections within three clicks from the homepage.  
  * **Clarity in Customization:** The process for customizing products must be intuitive, with real-time visual and price feedback.  
  * **Seamless Checkout:** The checkout process should be frictionless, aiming for a cart-to-purchase completion time of under 90 seconds for registered users.  
* **Design Principles:**  
  1. **Elegance in Simplicity:** Prioritize a clean, uncluttered interface that allows the products to be the heroes.  
  2. **Visual Storytelling:** Use high-quality imagery and typography to convey the brand's cultural richness and commitment to craftsmanship.  
  3. **Intuitive Interaction:** Employ familiar e-commerce patterns and provide immediate feedback for all user actions.  
  4. **Accessible Luxury:** Ensure the design is beautiful and functional for all users, adhering to WCAG 2.1 AA standards.

### **Change Log**

| Date | Version | Description | Author |
| :---- | :---- | :---- | :---- |
| 2025-08-23 | 1.0 | Initial Draft | Sally (UX Expert) |

## **Information Architecture (IA)**

### **Site Map**

graph TD  
    A\[Homepage\] \--\> B\[Shop\];  
    A \--\> C\[Lookbook/Gallery\];  
    A \--\> D\[About Us\];  
    A \--\> E\[Blog\];  
    A \--\> F\[Contact Us\];  
    A \--\> G\[FAQ\];

    B \--\> B1\[Artificial Gold Jewellery\];  
    B \--\> B2\[Oxidized Jewellery\];  
    B \--\> B3\[Beads & Chains (Custom)\];  
    B \--\> B4\[Kalamkari Wear\];  
      
    B1 \--\> B1a\[Necklaces\];  
    B1 \--\> B1b\[Earrings\];  
      
    subgraph "Utility Navigation"  
        H\[Search\]  
        I\[User Account\]  
        J\[Shopping Cart\]  
    end

    I \--\> I1\[Login/Register\];  
    I \--\> I2\[Dashboard\];  
    I2 \--\> I2a\[Order History\];  
    I2 \--\> I2b\[Addresses\];

### **Navigation Structure**

* **Primary Navigation (Header):** Shop, Lookbook, About Us, Blog, Contact Us.  
* **Utility Navigation (Header):** Search Icon, Account Icon, Cart Icon (with item count).  
* **Footer Navigation:** Will include all primary links plus FAQ, Shipping & Returns Policy, Terms of Service.

## **User Flows**

### **1\. Product Discovery and Purchase Flow**

**User Goal:** To find a specific type of earring, view its details, and purchase it.

sequenceDiagram  
    participant User  
    participant Homepage  
    participant PLP as Product Listing Page  
    participant PDP as Product Detail Page  
    participant Cart  
    participant Checkout

    User-\>\>Homepage: Lands on site  
    User-\>\>Homepage: Clicks "Shop" \-\> "Artificial Gold" \-\> "Earrings"  
    Homepage-\>\>PLP: Navigates to Earring Collection  
    User-\>\>PLP: Applies "Price" and "Material" filters  
    PLP--\>\>User: Shows filtered results  
    User-\>\>PLP: Clicks on a product image  
    PLP-\>\>PDP: Navigates to Product Detail Page  
    User-\>\>PDP: Zooms on image, reads description  
    User-\>\>PDP: Clicks "Add to Cart"  
    PDP--\>\>Cart: Item added, Cart Drawer opens  
    User-\>\>Cart: Clicks "Proceed to Checkout"  
    Cart-\>\>Checkout: Redirects to Shopify Checkout  
    User-\>\>Checkout: Fills shipping & payment info  
    Checkout--\>\>User: Shows Order Confirmation Page

### **2\. Custom Product Flow (Kalamkari Wear)**

**User Goal:** To customize and purchase a Kalamkari dress.

sequenceDiagram  
    participant User  
    participant PDP as Kalamkari Dress PDP  
    participant Cart

    User-\>\>PDP: Lands on a custom dress page  
    PDP--\>\>User: Displays base price and default options  
    User-\>\>PDP: Selects Size 'L' from dropdown  
    PDP--\>\>User: Price updates for size 'L'  
    User-\>\>PDP: Selects Sleeve Length 'Full' from dropdown  
    PDP--\>\>User: Image updates to show full sleeves  
    User-\>\>PDP: Clicks "Add to Cart"  
    PDP--\>\>Cart: Adds customized dress to cart

## **Wireframes & Mockups (Conceptual)**

### **Core Screen Layouts**

* **Homepage:**  
  * **Purpose:** To immerse the user in the brand and guide them to key shopping paths.  
  * **Key Elements:**  
    * Full-width hero banner with a strong lifestyle image and a clear Call-to-Action (CTA).  
    * Grid of "Featured Collections" with high-quality images.  
    * Carousel for "New Arrivals".  
    * A section dedicated to the "About Us" story with a link to the full page.  
    * Newsletter signup form in the footer.  
* **Product Listing Page (PLP):**  
  * **Purpose:** To allow users to easily browse, filter, and sort products.  
  * **Key Elements:**  
    * **Desktop:** Sticky filter sidebar on the left.  
    * **Mobile:** Filter button at the top that opens a slide-out filter menu.  
    * Sort dropdown on the top right.  
    * A responsive grid of product-card components.  
    * Infinite scroll or paginated navigation.  
* **Product Detail Page (PDP):**  
  * **Purpose:** To provide all necessary information for a confident purchase decision.  
  * **Key Elements:**  
    * **Desktop:** Two-column layout. Left: Image gallery with thumbnails. Right: Product title, price, customization options, "Add to Cart" button, and product description.  
    * **Mobile:** Single-column layout. Image gallery at the top, followed by product info and CTA.  
    * Tabs or an accordion for "Materials & Care," "Shipping & Returns," and "Customer Reviews."

## **Component Library / Design System**

### **Core Components**

* **Buttons:**  
  * **Primary:** Burnt Orange background, white text. Used for major CTAs like "Add to Cart".  
  * **Secondary:** White background, Burnt Orange border and text. Used for secondary actions like "View All".  
  * **States:** Default, Hover (slight darken/lighten), Disabled (grayed out).  
* **Forms & Inputs:**  
  * **Text Inputs:** Simple line underneath, with the label moving above the line on focus.  
  * **Dropdowns:** Styled to match the site's elegant aesthetic.  
  * **Error State:** Red border and a small error message below the input.  
* **Product Card:**  
  * **Content:** Product Image, Product Title, Price.  
  * **Interaction:** On hover, a "Quick View" button appears.  
* **Modals / Drawers:**  
  * Used for "Quick View" and the "Shopping Cart".  
  * Semi-transparent black overlay on the background page.

## **Branding & Style Guide**

### **Color Palette**

| Color Type | Hex Code | Usage |
| :---- | :---- | :---- |
| Primary | \#8A3324 (Burnt Orange) | CTAs, accents, links |
| Secondary | \#D2B48C (Sand Dollar) | Backgrounds, secondary elements |
| Accent | \#C71585 (Puce) | Special highlights, sale tags |
| Text | \#36454F (Charcoal) | Body copy, headings |
| Neutral | \#F5F5DC (Beige) | Page backgrounds |
| Error | \#D22B2B (Vermilion) | Error messages, validation |

### **Typography**

* **Headings:** A classic, elegant Serif font (e.g., Playfair Display).  
* **Body Text:** A clean, highly-legible Sans-serif font (e.g., Lato).  
* **Type Scale:** A clear hierarchy will be established (e.g., H1: 36px, H2: 28px, Body: 16px).

## **Next Steps**

### **Immediate Actions**

1. Review this UI/UX Specification with stakeholders for feedback and approval.  
2. Begin high-fidelity mockups for the core screens (Homepage, PLP, PDP) in a design tool like Figma.  
3. Create a detailed component library in Figma based on the style guide.

### **Design Handoff Checklist**

* \[ \] All user flows documented and approved.  
* \[ \] High-fidelity mockups for all core screens are complete.  
* \[ \] Component library with all states (hover, disabled, etc.) is defined.  
* \[ \] Accessibility requirements (color contrast, focus states) are specified.  
* \[ \] Responsive designs for mobile, tablet, and desktop are provided.