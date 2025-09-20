@echo off
echo ========================================
echo    EduPlatform LMS - Vercel Deploy
echo ========================================
echo.

echo [1/3] Checking Vercel CLI...
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

echo [2/3] Deploying to Vercel...
vercel --prod

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo    ✅ Deployment Successful!
    echo ========================================
    echo.
    echo Your EduPlatform LMS is now live on Vercel!
    echo Check your Vercel dashboard for the URL.
    echo.
) else (
    echo.
    echo ========================================
    echo    ❌ Deployment Failed!
    echo ========================================
    echo.
    echo Please check the error messages above.
    echo.
)

pause
