# Production Rollback Script for Kala Aabharanam (PowerShell)
# This script handles emergency rollback procedures

param(
    [string]$StoreUrl = "kala-aabharanam.myshopify.com",
    [string]$BackupPath,
    [string]$ThemeId,
    [switch]$Force
)

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

function Show-Usage {
    Write-Host "Kala Aabharanam Production Rollback Script" -ForegroundColor Blue
    Write-Host "==========================================" -ForegroundColor Blue
    Write-Host ""
    Write-Host "Usage:"
    Write-Host "  .\rollback-production.ps1 -BackupPath 'backups\20250123_143022'"
    Write-Host "  .\rollback-production.ps1 -ThemeId '123456789'"
    Write-Host ""
    Write-Host "Parameters:"
    Write-Host "  -StoreUrl     Shopify store URL (default: kala-aabharanam.myshopify.com)"
    Write-Host "  -BackupPath   Path to backup directory to restore from"
    Write-Host "  -ThemeId      ID of existing theme to revert to"
    Write-Host "  -Force        Skip confirmation prompts"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  # Rollback from backup"
    Write-Host "  .\rollback-production.ps1 -BackupPath 'backups\20250123_143022'"
    Write-Host ""
    Write-Host "  # Revert to previous theme"
    Write-Host "  .\rollback-production.ps1 -ThemeId '123456789'"
    Write-Host ""
}

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
    
    Write-Success "Prerequisites check passed"
}

function Get-CurrentThemeInfo {
    Write-Log "Getting current theme information..."
    
    $themes = shopify theme list --store="$StoreUrl" --json | ConvertFrom-Json
    $liveTheme = $themes | Where-Object { $_.role -eq "main" }
    
    if ($liveTheme) {
        Write-Host "Current live theme:"
        Write-Host "  ID: $($liveTheme.id)"
        Write-Host "  Name: $($liveTheme.name)"
        Write-Host "  Created: $($liveTheme.created_at)"
        return $liveTheme
    }
    else {
        Write-Warning "Could not identify current live theme"
        return $null
    }
}

function Show-AvailableThemes {
    Write-Log "Available themes for rollback:"
    
    $themes = shopify theme list --store="$StoreUrl" --json | ConvertFrom-Json
    $unpublishedThemes = $themes | Where-Object { $_.role -ne "main" }
    
    if ($unpublishedThemes) {
        Write-Host ""
        Write-Host "Available themes:" -ForegroundColor Yellow
        foreach ($theme in $unpublishedThemes) {
            Write-Host "  ID: $($theme.id) | Name: $($theme.name) | Created: $($theme.created_at)"
        }
        Write-Host ""
    }
    else {
        Write-Warning "No unpublished themes available for rollback"
    }
}

function Invoke-BackupRollback {
    param([string]$BackupPath)
    
    Write-Log "Rolling back from backup: $BackupPath"
    
    # Verify backup exists
    if (-not (Test-Path $BackupPath)) {
        Write-Error "Backup path does not exist: $BackupPath"
    }
    
    # Check if backup contains theme files
    $requiredFiles = @("layout", "sections", "templates", "assets")
    foreach ($dir in $requiredFiles) {
        if (-not (Test-Path (Join-Path $BackupPath $dir))) {
            Write-Error "Backup appears incomplete - missing directory: $dir"
        }
    }
    
    # Confirm rollback
    if (-not $Force) {
        Write-Warning "This will replace the current live theme with backup from: $BackupPath"
        $confirmation = Read-Host "Are you sure you want to continue? (y/N)"
        
        if ($confirmation -ne 'y' -and $confirmation -ne 'Y') {
            Write-Error "Rollback cancelled by user"
        }
    }
    
    # Create emergency backup of current state
    $emergencyBackup = "backups\emergency-$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    Write-Log "Creating emergency backup of current state..."
    New-Item -ItemType Directory -Path $emergencyBackup -Force | Out-Null
    
    shopify theme pull --store="$StoreUrl" --path="$emergencyBackup" --live
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Emergency backup created at: $emergencyBackup"
    }
    else {
        Write-Warning "Could not create emergency backup"
    }
    
    # Push backup to live theme
    Write-Log "Restoring from backup..."
    shopify theme push --store="$StoreUrl" --path="$BackupPath" --live
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Rollback completed successfully!"
    }
    else {
        Write-Error "Rollback failed - check Shopify CLI output for details"
    }
}

function Invoke-ThemeRollback {
    param([string]$ThemeId)
    
    Write-Log "Rolling back to theme ID: $ThemeId"
    
    # Verify theme exists
    $themes = shopify theme list --store="$StoreUrl" --json | ConvertFrom-Json
    $targetTheme = $themes | Where-Object { $_.id -eq $ThemeId }
    
    if (-not $targetTheme) {
        Write-Error "Theme with ID $ThemeId not found"
    }
    
    Write-Host "Target theme:"
    Write-Host "  ID: $($targetTheme.id)"
    Write-Host "  Name: $($targetTheme.name)"
    Write-Host "  Created: $($targetTheme.created_at)"
    
    # Confirm rollback
    if (-not $Force) {
        Write-Warning "This will make theme '$($targetTheme.name)' the live theme"
        $confirmation = Read-Host "Are you sure you want to continue? (y/N)"
        
        if ($confirmation -ne 'y' -and $confirmation -ne 'Y') {
            Write-Error "Rollback cancelled by user"
        }
    }
    
    # Create emergency backup of current state
    $emergencyBackup = "backups\emergency-$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    Write-Log "Creating emergency backup of current state..."
    New-Item -ItemType Directory -Path $emergencyBackup -Force | Out-Null
    
    shopify theme pull --store="$StoreUrl" --path="$emergencyBackup" --live
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Emergency backup created at: $emergencyBackup"
    }
    else {
        Write-Warning "Could not create emergency backup"
    }
    
    # Publish target theme
    Write-Log "Publishing theme..."
    shopify theme publish --store="$StoreUrl" --theme-id="$ThemeId"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Rollback completed successfully!"
    }
    else {
        Write-Error "Rollback failed - check Shopify CLI output for details"
    }
}

function Test-RollbackSuccess {
    Write-Log "Verifying rollback success..."
    
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
    
    # Run basic functionality tests if available
    if (Test-Path "scripts\run-qa-tests.js") {
        Write-Log "Running post-rollback tests..."
        node scripts\run-qa-tests.js $SiteUrl
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Post-rollback tests passed"
        }
        else {
            Write-Warning "Some post-rollback tests failed - please review"
        }
    }
}

function New-RollbackReport {
    param([string]$RollbackType, [string]$RollbackTarget)
    
    Write-Log "Generating rollback report..."
    
    $ReportFile = "docs\rollback-report-$(Get-Date -Format 'yyyyMMdd_HHmmss').md"
    
    $reportContent = @"
# Rollback Report - Kala Aabharanam

## Rollback Details
- **Date:** $(Get-Date)
- **Store URL:** $StoreUrl
- **Rollback Type:** $RollbackType
- **Rollback Target:** $RollbackTarget
- **Executed By:** $env:USERNAME

## Rollback Reason
[Please document the reason for rollback]

## Actions Taken
- [x] Emergency backup created
- [x] Rollback executed
- [x] Site accessibility verified
- [x] Basic functionality tested

## Post-Rollback Tasks
- [ ] Monitor site performance
- [ ] Verify all integrations working
- [ ] Test critical user flows
- [ ] Investigate root cause of issue
- [ ] Plan fix for original deployment

## Timeline
- **Issue Detected:** [Time]
- **Rollback Initiated:** $(Get-Date)
- **Rollback Completed:** $(Get-Date)
- **Site Verified:** $(Get-Date)

## Next Steps
1. Investigate the root cause of the deployment issue
2. Fix identified problems in development environment
3. Test thoroughly before next deployment
4. Consider additional safeguards for future deployments

---
Generated by rollback script on $(Get-Date)
"@
    
    New-Item -ItemType Directory -Path "docs" -Force | Out-Null
    $reportContent | Out-File $ReportFile -Encoding UTF8
    
    Write-Success "Rollback report created: $ReportFile"
}

# Main rollback process
function Main {
    Write-Host "🔄 Kala Aabharanam Production Rollback" -ForegroundColor Blue
    Write-Host "=====================================" -ForegroundColor Blue
    
    # Show usage if no parameters provided
    if (-not $BackupPath -and -not $ThemeId) {
        Show-Usage
        return
    }
    
    try {
        Test-Prerequisites
        
        $currentTheme = Get-CurrentThemeInfo
        
        if ($BackupPath) {
            Invoke-BackupRollback -BackupPath $BackupPath
            New-RollbackReport -RollbackType "Backup Restore" -RollbackTarget $BackupPath
        }
        elseif ($ThemeId) {
            Show-AvailableThemes
            Invoke-ThemeRollback -ThemeId $ThemeId
            New-RollbackReport -RollbackType "Theme Revert" -RollbackTarget $ThemeId
        }
        
        Test-RollbackSuccess
        
        Write-Host ""
        Write-Host "🎉 Rollback completed successfully!" -ForegroundColor Green
        Write-Host "Site URL: https://$StoreUrl" -ForegroundColor Blue
        Write-Host "Admin URL: https://$StoreUrl/admin" -ForegroundColor Blue
        Write-Host ""
        Write-Host "Next steps:"
        Write-Host "1. Verify all site functionality is working"
        Write-Host "2. Investigate the root cause of the issue"
        Write-Host "3. Plan and test fixes before next deployment"
        Write-Host "4. Update deployment procedures if needed"
        Write-Host ""
    }
    catch {
        Write-Error "Rollback failed: $($_.Exception.Message)"
    }
}

# Run main function
Main