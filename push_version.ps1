# Research Tracker - Release & Push Script
# Use this script to push a new version to GitHub and trigger the auto-updater!

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "  RESEARCH TRACKER RELEASE TOOL               " -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

# 1. Ask for Version
$CurrentTags = git tag -l --sort=-v:refname
Write-Host "Latest tags:" -ForegroundColor Gray
Write-Host ($CurrentTags | Select-Object -First 5) -ForegroundColor Gray
$Version = Read-Host "Enter new version tag (e.g., v1.7.6)"

if (-not $Version.StartsWith("v")) {
    $Version = "v" + $Version
}

# 2. Ask for Message
$Message = Read-Host "Enter release message (e.g., Added new feature)"

Write-Host "`nPreparing release $Version..." -ForegroundColor Yellow

# 3. Git Operations
Write-Host "Staging changes..." -ForegroundColor Magenta
git add .

Write-Host "Committing..." -ForegroundColor Magenta
git commit -m "feat: release $Version - $Message"

Write-Host "Creating tag $Version..." -ForegroundColor Magenta
git tag $Version

Write-Host "Pushing to GitHub (main branch)..." -ForegroundColor Magenta
git push origin main

Write-Host "Pushing tag $Version to GitHub..." -ForegroundColor Magenta
git push origin $Version

Write-Host "`n==============================================" -ForegroundColor Green
Write-Host "  RELEASE $Version PUSHED SUCCESSFULLY!       " -ForegroundColor Green
Write-Host "  The other machine should update in 10s.    " -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
