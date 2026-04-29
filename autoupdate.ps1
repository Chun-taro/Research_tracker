# Research Tracker - Automated Watch & Update Script
# This script runs in your terminal and keeps your system synced with GitHub.
# Test Version: 1.0.6 - Final Verification

$Interval = 10 # Seconds between checks
$Branch = "main"

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "  RESEARCH TRACKER AUTO-UPDATER STARTED       " -ForegroundColor Cyan
Write-Host "  Checking for updates every $Interval seconds   " -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

while ($true) {
    $CurrentTime = Get-Date -Format "HH:mm:ss"
    Write-Host "[$CurrentTime] Checking GitHub for changes..." -ForegroundColor Gray
    
    # Get current hash and tag before pull
    $OldHash = git rev-parse HEAD
    $OldTag = try { git describe --tags --abbrev=0 2>$null } catch { "none" }
    
    # Run git pull and fetch tags
    $PullOutput = git pull origin $Branch 2>&1
    git fetch --tags origin 2>$null
    
    # Get hash and tag after pull
    $NewHash = git rev-parse HEAD
    $NewTag = try { git describe --tags --abbrev=0 2>$null } catch { "none" }
    
    if ($OldHash -ne $NewHash -or $OldTag -ne $NewTag) {
        Write-Host "NEW UPDATE DETECTED!" -ForegroundColor Green
        Write-Host "Hash: $OldHash -> $NewHash" -ForegroundColor Yellow
        
        Write-Host "Step 1/4: Installing PHP dependencies..." -ForegroundColor Magenta
        composer install --no-interaction --prefer-dist
        
        Write-Host "Step 2/4: Running migrations..." -ForegroundColor Magenta
        php artisan migrate --database=landlord --path=database/migrations/landlord --force
        
        Write-Host "Step 3/4: Installing NPM dependencies..." -ForegroundColor Magenta
        npm install
        
        Write-Host "Step 4/4: Building assets (this may take a minute)..." -ForegroundColor Magenta
        npm run build

        Write-Host "Finalizing: Fetching tags and clearing cache..." -ForegroundColor Magenta
        git fetch --tags origin
        php artisan cache:clear
        php artisan view:clear
        
        Write-Host "==============================================" -ForegroundColor Green
        Write-Host "  SYSTEM UPDATED SUCCESSFULLY!                " -ForegroundColor Green
        Write-Host "==============================================" -ForegroundColor Green
    } else {
        if ($PullOutput -match "Already up to date") {
            # Silent if nothing new
        } else {
            Write-Host $PullOutput -ForegroundColor Red
        }
    }
    
    Start-Sleep -Seconds $Interval
}
