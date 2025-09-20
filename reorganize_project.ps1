# Script to reorganize the project structure
Write-Host "Reorganizing EduPlatform Project Structure..." -ForegroundColor Green
Write-Host ""

# Create new organized directory structure
$directories = @(
    "src",
    "src/pages",
    "src/pages/admin",
    "src/pages/admin/dashboard",
    "src/pages/admin/login",
    "src/pages/student",
    "src/pages/student/dashboard",
    "src/pages/student/profile",
    "src/pages/student/authentication",
    "src/pages/course",
    "src/pages/course/management",
    "src/pages/course/player",
    "src/pages/quiz",
    "src/pages/quiz/interface",
    "src/pages/quiz/management",
    "src/pages/order",
    "src/pages/order/management",
    "src/assets",
    "src/assets/images",
    "src/assets/icons",
    "src/scripts",
    "src/styles",
    "public",
    "docs",
    "deployment"
)

Write-Host "Creating directory structure..." -ForegroundColor Yellow
foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "  Created: $dir" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Project reorganization completed!" -ForegroundColor Green
Write-Host "New structure created with organized folders for better maintainability."