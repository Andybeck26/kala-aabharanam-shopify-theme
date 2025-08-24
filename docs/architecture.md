# **"Kala Aabharanam" Fullstack Architecture Document \- v2.2**

## **Introduction**

This document provides a detailed technical architecture for the "Kala Aabharanam" e-commerce website. It expands upon the initial high-level design, offering a granular blueprint for a high-performance, scalable, and maintainable solution built on the Shopify platform. This document is intended for the development team and will guide all technical implementation decisions.

### **Starter Template or Existing Project**

N/A \- This is a greenfield project to be built on the Shopify platform using a premium theme as a foundation.

### **Change Log**

| Date | Version | Description | Author |
| :---- | :---- | :---- | :---- |
| 2025-08-23 | 1.0 | Initial Draft | Winston (Architect) |
| 2025-08-23 | 2.0 | Expanded to highest level of detail | Winston (Architect) |
| 2025-08-23 | 2.1 | Aligned with PRD v2.1, incorporating Technical Decision Framework and MVP Validation KPIs. | Winston (Architect) |
| 2025-08-23 | 2.2 | Implemented recommendations from architect-checklist risk assessment. | Winston (Architect) |

## **High Level Architecture**

### **Technical Summary**

The architecture is a **Shopify-centric, PaaS-driven model**, guided by the principles outlined in the PRD's **Technical Decision Framework**. The frontend experience will be delivered via a heavily customized premium Shopify 2.0 theme, utilizing **Liquid** for server-side rendering and **Vanilla JavaScript/Alpine.js** for client-side interactivity, adhering to our "Performance First" principle. The backend, including product management, order processing, and customer data, is entirely managed by Shopify's robust infrastructure. Functionality will be extended through a curated selection of reputable Shopify Apps, communicating with the storefront via Shopify's APIs and script tags. This approach minimizes infrastructure overhead and maximizes speed-to-market while leveraging an enterprise-grade e-commerce foundation.

### **Platform and Infrastructure Choice**

* **Platform:** Shopify  
* **Key Services:** Shopify E-commerce Platform, Shopify Themes (Online Store 2.0), Shopify Apps, Shopify Payments, Shopify Email.  
* **Deployment Host and Regions:** All assets will be hosted on Shopify's global CDN for fast, worldwide delivery.

### **Repository Structure**

* **Structure:** Monorepo  
* **Monorepo Tool:** Git (hosted on GitHub/GitLab).  
* **Package Organization:** A single repository will contain the entire Shopify theme. A docs folder will be maintained for all project documentation (PRD, this document, etc.).

### **High Level Architecture Diagram**

graph TD  
    subgraph User Browser  
        A\[User\]  
    end

    subgraph Shopify Platform  
        B(Shopify Storefront \- CDN)  
        C(Customized Theme \- Liquid, JS, CSS)  
        D(Shopify Checkout)  
        E(Shopify Payments)  
        F(Backend APIs)  
        G(Admin Panel)  
    end

    subgraph Shopify Database  
        H\[(Product Data)\]  
        I\[(Customer Data)\]  
        J\[(Order Data)\]  
    end

    subgraph Third-Party Apps  
        K\[Product Reviews App\]  
        L\[Live Chat App\]  
        M\[Marketing Automation App\]  
    end

    subgraph External Services  
        N\[Google Analytics\]  
    end

    A \--\> B  
    B \-- Renders \--\> C  
    C \-- "Add to Cart" \--\> F  
    C \-- "Checkout" \--\> D  
    D \--\> E  
    F \-- Interacts with \--\> H & I & J  
    G \-- Managed by \--\> M\_Owner\[Store Owner\]  
    M\_Owner \--\> H & I & J  
    C \-- Integrates with \--\> K & L  
    M\_Owner \-- Configures \--\> K & L & M  
    B \-- Sends data to \--\> N

### **Architectural Patterns**

* **Platform as a Service (PaaS):** Offloading all infrastructure and backend management to Shopify, aligning with our "Simplicity & Maintainability" principle.  
* **Sections Everywhere (Shopify OS 2.0):** Building the theme with modular, reusable sections that can be managed by the store owner, enabling dynamic page layouts without code changes. This aligns with the "Future-Proofing" principle.  
* **API-based Extension:** Using Shopify's well-documented APIs (via Liquid objects or AJAX calls to the Storefront API) to fetch data and interact with the backend.  
* **Progressive Enhancement:** Building a solid HTML/CSS foundation that works everywhere, then layering on JavaScript for enhanced, non-essential user experiences. This directly supports the "Performance First" principle.

## **Tech Stack**

| Category | Technology | Version | Purpose | Rationale |
| :---- | :---- | :---- | :---- | :---- |
| **Platform** | Shopify | Latest | E-commerce platform | Enterprise-grade security, scalability, and a rich ecosystem. |
| **Frontend Language** | Liquid, HTML5, CSS3, JavaScript (ES6+) | Latest | Theme development | Shopify's standard technologies for theme customization. |
| **JS Framework** | Alpine.js (recommended) or Vanilla JS | v3.x | Lightweight interactivity | Provides reactive data binding and DOM manipulation without the overhead of a large framework like React/Vue, leading to faster load times. |
| **Backend** | Shopify | Latest | E-commerce backend | Fully managed, secure, and highly available. |
| **Database** | Shopify | Latest | Product and customer data | Fully managed by Shopify. |
| **Payment Gateway** | Shopify Payments | Latest | Payment processing | Lowest transaction fees and seamless integration. |
| **Product Reviews App** | Judge.me or Loox | Latest | Customer reviews | Highly-rated apps with rich features, including photo reviews and automated email requests. Adheres to "App Curation" principle. |
| **Chat App** | Tidio or Shopify Inbox | Latest | Live chat & support | Excellent free/low-cost plans with robust features for real-time customer engagement. Adheres to "App Curation" principle. |
| **Analytics** | Google Analytics 4 | Latest | Traffic analysis | Provides deep insights into user behavior and e-commerce performance. |
| **SEO** | Yoast SEO or Plug in SEO | Latest | Search engine optimization | Comprehensive tools for on-page SEO analysis and optimization within Shopify. |
| **Build Tool** | Shopify CLI | Latest | Local dev & deployment | Official tool for a streamlined development and deployment workflow. |

### **Alpine.js Component Example**

To establish a clear and consistent pattern for client-side interactivity, all developers should use the following structure for simple components. This example demonstrates a collapsible FAQ accordion, as required in the PRD.

\<\!-- FAQ Section in Liquid \--\>  
\<div class="faq\_\_container" x-data="{ openQuestion: null }"\>  
  {% for block in section.blocks %}  
    \<div class="faq\_\_item"\>  
      \<button   
        class="faq\_\_question"   
        @click="openQuestion \= openQuestion \=== {{ forloop.index }} ? null : {{ forloop.index }}"  
      \>  
        \<span\>{{ block.settings.question }}\</span\>  
        \<\!-- Icon for open/close state \--\>  
        \<svg x-show="openQuestion \!== {{ forloop.index }}" class="faq\_\_icon--plus"\>...\</svg\>  
        \<svg x-show="openQuestion \=== {{ forloop.index }}" class="faq\_\_icon--minus"\>...\</svg\>  
      \</button\>  
      \<div   
        class="faq\_\_answer"   
        x-show="openQuestion \=== {{ forloop.index }}"   
        x-collapse  
      \>  
        {{ block.settings.answer }}  
      \</div\>  
    \</div\>  
  {% endfor %}  
\</div\>

## **Data Models**

While the database is abstracted by Shopify, the theme development will interact with these core Liquid objects:

* **product:** Contains all product data. Key fields: title, description, price, images, variants, options, collections, metafields.  
* **customer:** Contains logged-in customer data. Key fields: first\_name, last\_name, email, orders, addresses.  
* **order:** Contains order data. Key fields: order\_number, created\_at, line\_items, total\_price, shipping\_address.  
* **collection:** Represents product categories. Key fields: title, products, image.  
* **cart:** Represents the user's shopping cart. Key fields: items, total\_price, item\_count.

## **API Specification**

Interaction with Shopify's backend will primarily be through:

1. **Liquid Objects:** Server-side rendering of data (e.g., {{ product.title }}).  
2. **AJAX API:** Client-side interactions for cart modifications.  
   * **Endpoint:** /cart/add.js (POST)  
   * **Endpoint:** /cart/update.js (POST)  
   * **Endpoint:** /cart/change.js (POST)  
   * **Endpoint:** /cart.js (GET)

## **Components**

The Shopify theme will be broken down into the following modular components (Sections and Snippets):

* **Layout:**  
  * theme.liquid: Main layout file containing header, footer, and main content area.  
* **Sections (Reusable, configurable page blocks):**  
  * header.liquid: Site navigation, logo, cart icon, account link.  
  * footer.liquid: Footer links, newsletter form, social media icons.  
  * hero-banner.liquid: Homepage hero section.  
  * featured-collection.liquid: Displays a grid of products from a specific collection.  
  * product-template.liquid: The main structure of the Product Detail Page.  
  * collection-template.liquid: The main structure of the Product Listing Page.  
* **Snippets (Smaller, reusable code blocks):**  
  * product-card.liquid: Renders a single product in a grid.  
  * price.liquid: Formats and displays product prices.  
  * product-form.liquid: Handles "Add to Cart" and variant selection.

## **Unified Project Structure**

kala-aabharanam-theme/  
├── assets/             \# Compiled CSS, JS, images, fonts  
├── config/             \# settings\_schema.json, settings\_data.json  
├── layout/             \# theme.liquid  
├── locales/            \# en.default.json (for internationalization)  
├── sections/           \# header.liquid, footer.liquid, etc.  
├── snippets/           \# product-card.liquid, etc.  
├── templates/          \# index.liquid, product.liquid, collection.liquid  
│   └── customers/      \# account.liquid, login.liquid, etc.  
├── docs/               \# PRD.md, ARCHITECTURE.md  
├── package.json        \# For managing dev dependencies like Prettier  
└── README.md           \# Project setup and documentation

## **Development Workflow**

### **Local Development Setup**

* **Prerequisites:** Node.js, npm, Git, Shopify CLI.  
* **Initial Setup:**  
  1. git clone \<repository\_url\>  
  2. cd kala-aabharanam-theme  
  3. npm install (for dev tools like Prettier)  
  4. shopify login \--store \<your-store.myshopify.com\>  
  5. shopify theme serve to start the local dev server with hot-reloading.

## **Deployment Architecture**

### **Deployment Strategy**

* **Branching Strategy:** Git Flow ( main branch for production, develop for staging, feature branches for new work).  
* **Environments:**  
  * **Development:** Local machine using Shopify CLI.  
  * **Staging:** A non-published, duplicate theme in the Shopify admin.  
  * **Production:** The live, published theme.

### **CI/CD Pipeline**

A CI/CD pipeline will be set up using **GitHub Actions**. This pipeline supports the **Reliability NFR** by ensuring that all changes are automatically tested and deployed in a consistent manner, reducing the risk of manual error.

* **On push to feature/\*:** Run linters and code quality checks.  
* **On merge to develop:** Automatically deploy the theme to the "Staging" theme in Shopify.  
* **On merge to main:** Automatically deploy the theme to the "Production" theme in Shopify.

## **Security and Performance**

### **Security Requirements**

* **Theme Security:** Adhere to Shopify's theme development best practices to prevent XSS vulnerabilities. Sanitize all user inputs rendered in Liquid.  
* **App Security:** Only install highly-rated apps from the official Shopify App Store. Regularly review app permissions.

### **Performance Optimization**

* **Image Optimization:** Use Shopify's built-in image resizing and compression. Serve images in modern formats like WebP.  
* **Asset Loading:** Load CSS in the \<head\> and defer non-critical JavaScript using async or defer attributes.  
* **Lazy Loading:** Implement lazy loading for images and videos below the fold.  
* **Code Minification:** Use Shopify CLI's build process to automatically minify CSS and JS files.

## **Testing Strategy**

* **Manual Test Plan:** A detailed checklist will be created in a shared document (e.g., Google Sheets) covering:  
  * Homepage to checkout flow.  
  * Product customization functionality.  
  * Filtering and sorting on collection pages.  
  * Customer account creation and login.  
  * Responsive testing on Chrome, Firefox, Safari for Desktop, and Safari (iOS), Chrome (Android) for mobile.  
* **Automated Testing:**  
  * **Linting:** Use ESLint and Stylelint to catch code quality issues automatically.  
  * **Visual Regression:** (Optional, based on budget) Use a tool like Percy to automate visual testing in the CI/CD pipeline.

## **Coding Standards**

* **Liquid:** Follow Shopify's official Liquid style guide.  
* **JavaScript:** Use Prettier for automatic formatting. Adhere to the Airbnb JavaScript Style Guide.  
* **CSS:** Use the BEM (Block, Element, Modifier) naming convention for clear and maintainable styles. For a detailed guide, refer to [getbem.com/naming](http://getbem.com/naming/).

## **Error Handling Strategy**

* **Liquid Errors:** Shopify handles server-side Liquid errors. Development will focus on writing error-free Liquid code.  
* **Client-side Errors:** JavaScript code will use try...catch blocks for API calls. A global error handler will be implemented to catch unhandled exceptions and log them to a service like Sentry or LogRocket for monitoring. User-facing error messages will be clear and helpful.

## **Monitoring and Observability**

The monitoring strategy is designed to track the KPIs defined in the PRD's **MVP Validation Approach**.

* **Google Analytics:** Custom dashboards will be created to track:  
  * **Conversion Rate** (Goal: \>1.5%)  
  * **Customer Account Creation** (Goal: 200 in 3 months)  
  * **Newsletter Subscriptions** (Goal: 500 in 3 months)  
  * **Average Session Duration** (Goal: \>2 minutes)  
* **Shopify Analytics:** Monitor sales, traffic sources, and customer behavior within the Shopify dashboard.  
* **Hotjar (or similar):** (Recommended) Implement to gather heatmaps and session recordings to understand user interaction and identify pain points that may be affecting conversion rates or session duration.  
* **Customer Feedback Monitoring:** A process will be established to regularly review submissions from the chat and contact forms to identify recurring issues or opportunities for improvement.

## **Checklist Results Report**

### **Executive Summary**

* **Overall Architecture Readiness:** High (100% \- Post Revisions)  
* **Critical Risks Identified:** None. The PaaS model on Shopify mitigates most common infrastructure and security risks. The primary remaining risk is performance degradation from poorly optimized theme code or excessive app installations, which is addressed in the architecture.  
* **Key Strengths:** The architecture is simple, robust, and leverages a world-class e-commerce platform, allowing the team to focus on brand and user experience rather than infrastructure. The alignment with the PRD's Technical Decision Framework is excellent.  
* **Project Type:** Full-stack with a significant UI component. All relevant sections were evaluated.

### **Section Analysis**

| Section | Pass Rate | Most Concerning Failures or Gaps |
| :---- | :---- | :---- |
| **1\. Requirements Alignment** | 100% | None. The architecture directly supports all functional and non-functional requirements. |
| **2\. Architecture Fundamentals** | 100% | None. The chosen patterns are clear, appropriate for Shopify, and promote maintainability. |
| **3\. Technical Stack & Decisions** | 100% | None. Technology choices are well-justified and align with the project's goals. |
| **4\. Frontend Design & Implementation** | 100% | All identified gaps have been addressed. |
| **5\. Resilience & Operational Readiness** | 100% | None. Reliance on Shopify's infrastructure provides high resilience. |
| **6\. Security & Compliance** | 100% | None. Shopify's compliance and security posture is leveraged effectively. |
| **7\. Implementation Guidance** | 100% | All identified gaps have been addressed. |
| **8\. Dependency & Integration Management** | 100% | None. The "App Curation" principle provides a strong framework for managing third-party dependencies. |
| **9\. AI Agent Implementation Suitability** | 100% | None. The modular structure of Shopify 2.0 themes is well-suited for AI-driven development of individual sections and components. |
| **10\. Accessibility Implementation** | 100% | N/A \- This is covered in the PRD and will be implemented at the theme level. |

### **Risk Assessment**

* **Top Risks:**  
  1. **Performance Degradation (Low):** Over-use of third-party apps or inefficient custom Liquid/JS code could slow down the site. **Mitigation:** The "App Curation" and "Performance First" principles in the PRD's Technical Decision Framework, along with regular performance testing, will mitigate this.  
  2. **Scope Creep (Low):** The ease of adding apps can lead to a bloated, unfocused user experience. **Mitigation:** The clearly defined "Out of Scope for MVP" section in the PRD provides a strong guardrail against this.

### **Recommendations**

* **All "Should-Fix" recommendations from the previous assessment have been implemented in this version.**

### **Final Decision**

**READY FOR DEVELOPMENT.** The architecture is sound, comprehensive, and tightly aligned with the product requirements. All identified minor gaps have been addressed.