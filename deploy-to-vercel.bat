@echo off
echo ========================================
echo    EduPlatform - Vercel Deployment
echo ========================================
echo.

echo [1/4] Checking Vercel CLI...
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Vercel CLI...
    npm install -g vercel
    if %errorlevel% neq 0 (
        echo Error: Failed to install Vercel CLI
        pause
        exit /b 1
    )
)

echo [2/4] Checking project structure...
if not exist "public\index.html" (
    echo Error: public\index.html not found!
    echo Please make sure the project structure is correct.
    pause
    exit /b 1
)

echo [3/4] Deploying to Vercel...
vercel --prod

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo    Deployment Successful!
    echo ========================================
    echo.
    echo Your EduPlatform LMS is now live on Vercel!
    echo Check your Vercel dashboard for the URL.
    echo.
    echo Next steps:
    echo 1. Update Vercel project settings:
    echo    - Root Directory: . (leave empty)
    echo    - Output Directory: public
    echo    - Framework Preset: Other
    echo.
    echo 2. Redeploy if needed
    echo.
) else (
    echo.
    echo ========================================
    echo    Deployment Failed!
    echo ========================================
    echo.
    echo Please check the error messages above.
    echo.
    echo Common solutions:
    echo 1. Update Vercel project settings
    echo 2. Check vercel.json configuration
    echo 3. Ensure public folder exists
    echo.
)

pause
