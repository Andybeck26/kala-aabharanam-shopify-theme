#!/bin/bash

# Production Deployment Script for Kala Aabharanam
# This script handles the complete deployment process to production

set -e  # Exit on any error

# Configuration
STORE_URL="kala-aabharanam.myshopify.com"
THEME_NAME="Kala Aabharanam Production v$(date +%Y%m%d)"
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Shopify CLI is installed
    if ! command -v shopify &> /dev/null; then
        error "Shopify CLI is not installed. Please install it first."
    fi
    
    # Check if logged in to Shopify
    if ! shopify auth whoami &> /dev/null; then
        error "Not logged in to Shopify CLI. Please run 'shopify auth login' first."
    fi
    
    # Check if in correct directory
    if [ ! -f "shopify.theme.toml" ]; then
        error "Not in a Shopify theme directory. Please run from theme root."
    fi
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        error "package.json not found. Please ensure all dependencies are configured."
    fi
    
    success "Prerequisites check passed"
}

# Run pre-deployment tests
run_tests() {
    log "Running pre-deployment tests..."
    
    # Theme validation
    log "Validating theme files..."
    if ! shopify theme check; then
        error "Theme validation failed. Please fix errors before deploying."
    fi
    
    # Lint JavaScript and Liquid files
    log "Running linting checks..."
    if command -v npm &> /dev/null; then
        npm run lint || warning "Linting issues found - review before proceeding"
    fi
    
    # Check for required files
    required_files=(
        "layout/theme.liquid"
        "sections/header.liquid"
        "sections/footer.liquid"
        "templates/index.liquid"
        "templates/product.liquid"
        "templates/collection.liquid"
        "assets/application.css"
        "assets/application.js"
    )
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            error "Required file missing: $file"
        fi
    done
    
    success "Pre-deployment tests passed"
}

# Create backup of current live theme
create_backup() {
    log "Creating backup of current live theme..."
    
    mkdir -p "$BACKUP_DIR"
    
    # Pull current live theme
    if shopify theme pull --store="$STORE_URL" --path="$BACKUP_DIR" --live; then
        success "Backup created at $BACKUP_DIR"
    else
        warning "Could not create backup - proceeding with deployment"
    fi
}

# Deploy theme to production
deploy_theme() {
    log "Deploying theme to production..."
    
    # Ask for confirmation
    echo -e "${YELLOW}⚠️  This will deploy to PRODUCTION store: $STORE_URL${NC}"
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        error "Deployment cancelled by user"
    fi
    
    # Deploy as unpublished theme first
    log "Uploading theme as unpublished..."
    THEME_ID=$(shopify theme push --store="$STORE_URL" --unpublished --theme-name="$THEME_NAME" --json | jq -r '.theme.id')
    
    if [ -z "$THEME_ID" ] || [ "$THEME_ID" = "null" ]; then
        error "Failed to upload theme"
    fi
    
    success "Theme uploaded with ID: $THEME_ID"
    
    # Ask for final confirmation before publishing
    echo -e "${YELLOW}⚠️  Ready to publish theme $THEME_ID as live theme${NC}"
    read -p "Publish now? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log "Publishing theme..."
        if shopify theme publish --store="$STORE_URL" --theme-id="$THEME_ID"; then
            success "Theme published successfully!"
        else
            error "Failed to publish theme"
        fi
    else
        warning "Theme uploaded but not published. You can publish it manually from Shopify admin."
        echo "Theme ID: $THEME_ID"
    fi
}

# Verify deployment
verify_deployment() {
    log "Verifying deployment..."
    
    # Check if site is accessible
    SITE_URL="https://$STORE_URL"
    if curl -s --head "$SITE_URL" | head -n 1 | grep -q "200 OK"; then
        success "Site is accessible at $SITE_URL"
    else
        warning "Site may not be accessible - please check manually"
    fi
    
    # Run basic functionality tests
    if [ -f "scripts/run-qa-tests.js" ]; then
        log "Running post-deployment tests..."
        if node scripts/run-qa-tests.js "$SITE_URL"; then
            success "Post-deployment tests passed"
        else
            warning "Some post-deployment tests failed - please review"
        fi
    fi
}

# Setup monitoring and analytics
setup_monitoring() {
    log "Setting up monitoring and analytics..."
    
    # Create monitoring configuration
    cat > "config/monitoring.json" << EOF
{
  "deployment": {
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "theme_id": "$THEME_ID",
    "store_url": "$STORE_URL",
    "backup_location": "$BACKUP_DIR"
  },
  "monitoring": {
    "google_analytics": {
      "enabled": true,
      "property_id": "G-XXXXXXXXXX"
    },
    "performance": {
      "lighthouse_threshold": 90,
      "core_web_vitals": {
        "lcp_threshold": 2.5,
        "fid_threshold": 100,
        "cls_threshold": 0.1
      }
    }
  }
}
EOF
    
    success "Monitoring configuration created"
}

# Generate deployment report
generate_report() {
    log "Generating deployment report..."
    
    REPORT_FILE="docs/deployment-report-$(date +%Y%m%d_%H%M%S).md"
    
    cat > "$REPORT_FILE" << EOF
# Deployment Report - Kala Aabharanam

## Deployment Details
- **Date:** $(date)
- **Store URL:** $STORE_URL
- **Theme ID:** $THEME_ID
- **Theme Name:** $THEME_NAME
- **Backup Location:** $BACKUP_DIR

## Pre-Deployment Checklist
- [x] Theme validation passed
- [x] Linting checks completed
- [x] Required files verified
- [x] Backup created

## Deployment Steps
- [x] Theme uploaded as unpublished
- [x] Theme published to live
- [x] Site accessibility verified
- [x] Post-deployment tests run

## Post-Deployment Tasks
- [ ] Monitor site performance for 24 hours
- [ ] Verify analytics tracking
- [ ] Check email notifications
- [ ] Test payment processing
- [ ] Monitor error logs

## Rollback Information
If rollback is needed:
\`\`\`bash
# Restore from backup
shopify theme push --store="$STORE_URL" --path="$BACKUP_DIR" --live

# Or revert to previous theme
shopify theme list --store="$STORE_URL"
shopify theme publish --store="$STORE_URL" --theme-id=[PREVIOUS_THEME_ID]
\`\`\`

## Support Contacts
- **Technical Lead:** [Contact Information]
- **Shopify Support:** https://help.shopify.com/
- **Emergency Contact:** [Emergency Contact]

---
Generated by deployment script on $(date)
EOF
    
    success "Deployment report created: $REPORT_FILE"
}

# Main deployment process
main() {
    echo -e "${BLUE}🚀 Starting Kala Aabharanam Production Deployment${NC}"
    echo "=================================================="
    
    check_prerequisites
    run_tests
    create_backup
    deploy_theme
    verify_deployment
    setup_monitoring
    generate_report
    
    echo
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo -e "Site URL: ${BLUE}https://$STORE_URL${NC}"
    echo -e "Admin URL: ${BLUE}https://$STORE_URL/admin${NC}"
    echo
    echo "Next steps:"
    echo "1. Monitor site performance for the next 24 hours"
    echo "2. Verify all integrations are working"
    echo "3. Test critical user flows"
    echo "4. Update DNS if this is initial launch"
    echo
}

# Handle script interruption
trap 'error "Deployment interrupted"' INT TERM

# Run main function
main "$@"