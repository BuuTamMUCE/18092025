# Script to move files to organized structure
Write-Host "Moving files to organized structure..." -ForegroundColor Yellow

# Move main pages to public
Write-Host "Moving main pages to public folder..."
$mainPages = @("index.html", "404.html", "500.html", "offline.html")
foreach ($page in $mainPages) {
    if (Test-Path $page) {
        Move-Item $page "public/" -Force
        Write-Host "  Moved: $page -> public/" -ForegroundColor Green
    }
}

# Move feature pages to public
Write-Host "Moving feature pages to public folder..."
$featurePages = @("ai-dashboard.html", "ai-analytics-dashboard.html", "certificate-manager.html", "collaborative-workspace.html", "features-showcase.html", "live-classroom.html", "vr-learning-lab.html")
foreach ($page in $featurePages) {
    if (Test-Path $page) {
        Move-Item $page "public/" -Force
        Write-Host "  Moved: $page -> public/" -ForegroundColor Green
    }
}

# Move admin pages
Write-Host "Moving admin pages..."
$adminPages = @("admin_login_screen_1.html", "admin_login_screen_2.html", "admin_login_screen_3.html", "admin_login_screen_4.html", "admin_login_screen_5.html", "admin_login_screen_6.html")
foreach ($page in $adminPages) {
    if (Test-Path $page) {
        Move-Item $page "src/pages/admin/login/" -Force
        Write-Host "  Moved: $page -> src/pages/admin/login/" -ForegroundColor Green
    }
}

$adminDashboardPages = @("admin_dashboard_4.html", "admin_dashboard_5.html", "admin_dashboard_6.html")
foreach ($page in $adminDashboardPages) {
    if (Test-Path $page) {
        Move-Item $page "src/pages/admin/dashboard/" -Force
        Write-Host "  Moved: $page -> src/pages/admin/dashboard/" -ForegroundColor Green
    }
}

# Move student pages
Write-Host "Moving student pages..."
$studentAuthPages = @("student_authentication_screens_2.html", "student_authentication_screens_3.html", "student_authentication_screens_4.html", "student_authentication_screens_5.html", "student_authentication_screens_6.html")
foreach ($page in $studentAuthPages) {
    if (Test-Path $page) {
        Move-Item $page "src/pages/student/authentication/" -Force
        Write-Host "  Moved: $page -> src/pages/student/authentication/" -ForegroundColor Green
    }
}

$studentDashboardPages = @("my_dashboard_(student)_1.html", "my_dashboard_(student)_2.html", "my_dashboard_(student)_3.html", "my_dashboard_(student)_4.html", "my_dashboard_(student)_5.html", "my_dashboard_(student)_6.html")
foreach ($page in $studentDashboardPages) {
    if (Test-Path $page) {
        Move-Item $page "src/pages/student/dashboard/" -Force
        Write-Host "  Moved: $page -> src/pages/student/dashboard/" -ForegroundColor Green
    }
}

$studentProfilePages = @("my_profile_(student)_1.html", "my_profile_(student)_2.html", "my_profile_(student)_3.html", "my_profile_(student)_4.html", "my_profile_(student)_5.html", "my_profile_(student)_6.html")
foreach ($page in $studentProfilePages) {
    if (Test-Path $page) {
        Move-Item $page "src/pages/student/profile/" -Force
        Write-Host "  Moved: $page -> src/pages/student/profile/" -ForegroundColor Green
    }
}

# Move course pages
Write-Host "Moving course pages..."
$courseManagementPages = @("course_management_screen_1.html", "course_management_screen_2.html", "course_management_screen_3.html", "course_management_screen_4.html", "course_management_screen_5.html", "course_management_screen_6.html")
foreach ($page in $courseManagementPages) {
    if (Test-Path $page) {
        Move-Item $page "src/pages/course/management/" -Force
        Write-Host "  Moved: $page -> src/pages/course/management/" -ForegroundColor Green
    }
}

$coursePlayerPages = @("course_player_interface_1.html", "course_player_interface_2.html", "course_player_interface_3.html", "course_player_interface_4.html", "course_player_interface_5.html", "course_player_interface_6.html")
foreach ($page in $coursePlayerPages) {
    if (Test-Path $page) {
        Move-Item $page "src/pages/course/player/" -Force
        Write-Host "  Moved: $page -> src/pages/course/player/" -ForegroundColor Green
    }
}

# Move quiz pages
Write-Host "Moving quiz pages..."
$quizInterfacePages = @("quiz_interface_1.html", "quiz_interface_2.html", "quiz_interface_3.html", "quiz_interface_4.html", "quiz_interface_5.html", "quiz_interface_6.html")
foreach ($page in $quizInterfacePages) {
    if (Test-Path $page) {
        Move-Item $page "src/pages/quiz/interface/" -Force
        Write-Host "  Moved: $page -> src/pages/quiz/interface/" -ForegroundColor Green
    }
}

$quizManagementPages = @("quiz_management_screen_1.html", "quiz_management_screen_2.html", "quiz_management_screen_3.html", "quiz_management_screen_4.html", "quiz_management_screen_5.html", "quiz_management_screen_6.html")
foreach ($page in $quizManagementPages) {
    if (Test-Path $page) {
        Move-Item $page "src/pages/quiz/management/" -Force
        Write-Host "  Moved: $page -> src/pages/quiz/management/" -ForegroundColor Green
    }
}

# Move order pages
Write-Host "Moving order pages..."
$orderManagementPages = @("order_management_screen_1.html", "order_management_screen_2.html", "order_management_screen_3.html", "order_management_screen_4.html", "order_management_screen_5.html", "order_management_screen_6.html")
foreach ($page in $orderManagementPages) {
    if (Test-Path $page) {
        Move-Item $page "src/pages/order/management/" -Force
        Write-Host "  Moved: $page -> src/pages/order/management/" -ForegroundColor Green
    }
}

# Move student management pages
Write-Host "Moving student management pages..."
$studentManagementPages = @("student_management_screen_1.html", "student_management_screen_2.html", "student_management_screen_3.html", "student_management_screen_4.html", "student_management_screen_5.html", "student_management_screen_6.html")
foreach ($page in $studentManagementPages) {
    if (Test-Path $page) {
        Move-Item $page "src/pages/admin/" -Force
        Write-Host "  Moved: $page -> src/pages/admin/" -ForegroundColor Green
    }
}

# Move JavaScript files
Write-Host "Moving JavaScript files..."
if (Test-Path "js") {
    Move-Item "js/*" "src/scripts/" -Force
    Write-Host "  Moved: js/* -> src/scripts/" -ForegroundColor Green
}

# Move remaining files
Write-Host "Moving remaining files..."
$remainingFiles = @("sw.js", "update-domain.js", "build.js")
foreach ($file in $remainingFiles) {
    if (Test-Path $file) {
        Move-Item $file "src/scripts/" -Force
        Write-Host "  Moved: $file -> src/scripts/" -ForegroundColor Green
    }
}

# Move documentation
Write-Host "Moving documentation..."
$docs = @("README.md", "AI-FEATURES.md", "deploy-guide.md", "DEPLOYMENT-READY.md")
foreach ($doc in $docs) {
    if (Test-Path $doc) {
        Move-Item $doc "docs/" -Force
        Write-Host "  Moved: $doc -> docs/" -ForegroundColor Green
    }
}

# Move deployment files
Write-Host "Moving deployment files..."
$deploymentFiles = @("quick-deploy.bat", "quick-deploy.sh", "netlify.toml")
foreach ($file in $deploymentFiles) {
    if (Test-Path $file) {
        Move-Item $file "deployment/" -Force
        Write-Host "  Moved: $file -> deployment/" -ForegroundColor Green
    }
}

# Move public assets
Write-Host "Moving public assets..."
$publicAssets = @("robots.txt", "sitemap.xml", "site.webmanifest")
foreach ($file in $publicAssets) {
    if (Test-Path $file) {
        Move-Item $file "public/" -Force
        Write-Host "  Moved: $file -> public/" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "File organization completed!" -ForegroundColor Green
