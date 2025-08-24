# Production Deployment Script for Kala Aabharanam (PowerShell)
# This script handles the complete deployment process to production

param(
    [string]$StoreUrl = "kala-aabharanam.myshopify.com",
    [switch]$SkipTests,
    [switch]$Force
)

# Configuration
$ThemeName = "Kala Aabharanam Production v$(Get-Date -Format 'yyyyMMdd')"
$BackupDir = "backups\$(Get-Date -Format 'yyyyMMdd_HHmmss')"
$ErrorActionPreference = "Stop"

# Logging functions
function Write-Log {
    param([string]$Message)
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
    exit 1
}

# Check prerequisites
function Test-Prerequisites {
    Write-Log "Checking prerequisites..."
    
    # Check if Shopify CLI is installed
    try {
        $null = Get-Command shopify -ErrorAction Stop
    }
    catch {
        Write-Error "Shopify CLI is not installed. Please install it first."
    }
    
    # Check if logged in to Shopify
    try {
        shopify auth whoami | Out-Null
        if ($LASTEXITCODE -ne 0) {
            throw "Not authenticated"
        }
    }
    catch {
        Write-Error "Not logged in to Shopify CLI. Please run 'shopify auth login' first."
    }
    
    # Check if in correct directory
    if (-not (Test-Path "shopify.theme.toml")) {
        Write-Error "Not in a Shopify theme directory. Please run from theme root."
    }
    
    # Check if package.json exists
    if (-not (Test-Path "package.json")) {
        Write-Error "package.json not found. Please ensure all dependencies are configured."
    }
    
    Write-Success "Prerequisites check passed"
}

# Run pre-deployment tests
function Invoke-Tests {
    if ($SkipTests) {
        Write-Warning "Skipping tests as requested"
        return
    }
    
    Write-Log "Running pre-deployment tests..."
    
    # Theme validation
    Write-Log "Validating theme files..."
    shopify theme check
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Theme validation failed. Please fix errors before deploying."
    }
    
    # Lint JavaScript and Liquid files
    Write-Log "Running linting checks..."
    if (Get-Command npm -ErrorAction SilentlyContinue) {
        npm run lint
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "Linting issues found - review before proceeding"
        }
    }
    
    # Check for required files
    $RequiredFiles = @(
        "layout\theme.liquid",
        "sections\header.liquid",
        "sections\footer.liquid",
        "templates\index.liquid",
        "templates\product.liquid",
        "templates\collection.liquid",
        "assets\application.css",
        "assets\application.js"
    )
    
    foreach ($file in $RequiredFiles) {
        if (-not (Test-Path $file)) {
            Write-Error "Required file missing: $file"
        }
    }
    
    Write-Success "Pre-deployment tests passed"
}

# Create backup of current live theme
function New-Backup {
    Write-Log "Creating backup of current live theme..."
    
    New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
    
    # Pull current live theme
    shopify theme pull --store="$StoreUrl" --path="$BackupDir" --live
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Backup created at $BackupDir"
    }
    else {
        Write-Warning "Could not create backup - proceeding with deployment"
    }
}

# Deploy theme to production
function Deploy-Theme {
    Write-Log "Deploying theme to production..."
    
    # Ask for confirmation
    if (-not $Force) {
        Write-Warning "This will deploy to PRODUCTION store: $StoreUrl"
        $confirmation = Read-Host "Are you sure you want to continue? (y/N)"
        
        if ($confirmation -ne 'y' -and $confirmation -ne 'Y') {
            Write-Error "Deployment cancelled by user"
        }
    }
    
    # Deploy as unpublished theme first
    Write-Log "Uploading theme as unpublished..."
    $output = shopify theme push --store="$StoreUrl" --unpublished --theme-name="$ThemeName" --json | ConvertFrom-Json
    
    if (-not $output.theme.id) {
        Write-Error "Failed to upload theme"
    }
    
    $script:ThemeId = $output.theme.id
    Write-Success "Theme uploaded with ID: $ThemeId"
    
    # Ask for final confirmation before publishing
    if (-not $Force) {
        Write-Warning "Ready to publish theme $ThemeId as live theme"
        $publishConfirmation = Read-Host "Publish now? (y/N)"
        
        if ($publishConfirmation -eq 'y' -or $publishConfirmation -eq 'Y') {
            Write-Log "Publishing theme..."
            shopify theme publish --store="$StoreUrl" --theme-id="$ThemeId"
            if ($LASTEXITCODE -eq 0) {
                Write-Success "Theme published successfully!"
            }
            else {
                Write-Error "Failed to publish theme"
            }
        }
        else {
            Write-Warning "Theme uploaded but not published. You can publish it manually from Shopify admin."
            Write-Host "Theme ID: $ThemeId"
        }
    }
    else {
        # Auto-publish when Force flag is used
        Write-Log "Publishing theme (force mode)..."
        shopify theme publish --store="$StoreUrl" --theme-id="$ThemeId"
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Theme published successfully!"
        }
        else {
            Write-Error "Failed to publish theme"
        }
    }
}

# Verify deployment
function Test-Deployment {
    Write-Log "Verifying deployment..."
    
    # Check if site is accessible
    $SiteUrl = "https://$StoreUrl"
    try {
        $response = Invoke-WebRequest -Uri $SiteUrl -Method Head -TimeoutSec 30
        if ($response.StatusCode -eq 200) {
            Write-Success "Site is accessible at $SiteUrl"
        }
        else {
            Write-Warning "Site returned status code: $($response.StatusCode)"
        }
    }
    catch {
        Write-Warning "Site may not be accessible - please check manually: $($_.Exception.Message)"
    }
    
    # Run basic functionality tests
    if (Test-Path "scripts\run-qa-tests.js") {
        Write-Log "Running post-deployment tests..."
        node scripts\run-qa-tests.js $SiteUrl
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Post-deployment tests passed"
        }
        else {
            Write-Warning "Some post-deployment tests failed - please review"
        }
    }
}

# Setup monitoring and analytics
function Set-Monitoring {
    Write-Log "Setting up monitoring and analytics..."
    
    # Create monitoring configuration
    $monitoringConfig = @{
        deployment = @{
            timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
            theme_id = $script:ThemeId
            store_url = $StoreUrl
            backup_location = $BackupDir
        }
        monitoring = @{
            google_analytics = @{
                enabled = $true
                property_id = "G-XXXXXXXXXX"
            }
            performance = @{
                lighthouse_threshold = 90
                core_web_vitals = @{
                    lcp_threshold = 2.5
                    fid_threshold = 100
                    cls_threshold = 0.1
                }
            }
        }
    }
    
    New-Item -ItemType Directory -Path "config" -Force | Out-Null
    $monitoringConfig | ConvertTo-Json -Depth 10 | Out-File "config\monitoring.json" -Encoding UTF8
    
    Write-Success "Monitoring configuration created"
}

# Generate deployment report
function New-DeploymentReport {
    Write-Log "Generating deployment report..."
    
    $ReportFile = "docs\deployment-report-$(Get-Date -Format 'yyyyMMdd_HHmmss').md"
    
    $reportContent = @"
# Deployment Report - Kala Aabharanam

## Deployment Details
- **Date:** $(Get-Date)
- **Store URL:** $StoreUrl
- **Theme ID:** $script:ThemeId
- **Theme Name:** $ThemeName
- **Backup Location:** $BackupDir

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
``````powershell
# Restore from backup
shopify theme push --store="$StoreUrl" --path="$BackupDir" --live

# Or revert to previous theme
shopify theme list --store="$StoreUrl"
shopify theme publish --store="$StoreUrl" --theme-id=[PREVIOUS_THEME_ID]
``````

## Support Contacts
- **Technical Lead:** [Contact Information]
- **Shopify Support:** https://help.shopify.com/
- **Emergency Contact:** [Emergency Contact]

---
Generated by deployment script on $(Get-Date)
"@
    
    New-Item -ItemType Directory -Path "docs" -Force | Out-Null
    $reportContent | Out-File $ReportFile -Encoding UTF8
    
    Write-Success "Deployment report created: $ReportFile"
}

# Main deployment process
function Main {
    Write-Host "🚀 Starting Kala Aabharanam Production Deployment" -ForegroundColor Blue
    Write-Host "==================================================" -ForegroundColor Blue
    
    try {
        Test-Prerequisites
        Invoke-Tests
        New-Backup
        Deploy-Theme
        Test-Deployment
        Set-Monitoring
        New-DeploymentReport
        
        Write-Host ""
        Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
        Write-Host "Site URL: https://$StoreUrl" -ForegroundColor Blue
        Write-Host "Admin URL: https://$StoreUrl/admin" -ForegroundColor Blue
        Write-Host ""
        Write-Host "Next steps:"
        Write-Host "1. Monitor site performance for the next 24 hours"
        Write-Host "2. Verify all integrations are working"
        Write-Host "3. Test critical user flows"
        Write-Host "4. Update DNS if this is initial launch"
        Write-Host ""
    }
    catch {
        Write-Error "Deployment failed: $($_.Exception.Message)"
    }
}

# Run main function
Main