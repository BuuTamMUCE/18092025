#!/bin/bash

echo "========================================"
echo "   EduPlatform LMS - Vercel Deploy"
echo "========================================"
echo

echo "[1/3] Checking Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
    if [ $? -ne 0 ]; then
        echo "Error: Failed to install Vercel CLI"
        exit 1
    fi
fi

echo "[2/3] Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo
    echo "========================================"
    echo "   ✅ Deployment Successful!"
    echo "========================================"
    echo
    echo "Your EduPlatform LMS is now live on Vercel!"
    echo "Check your Vercel dashboard for the URL."
    echo
else
    echo
    echo "========================================"
    echo "   ❌ Deployment Failed!"
    echo "========================================"
    echo
    echo "Please check the error messages above."
    echo
fi
