#!/bin/bash

# EduPlatform Quick Deploy Script
# Usage: ./quick-deploy.sh yourdomain.com

set -e

DOMAIN=$1

if [ -z "$DOMAIN" ]; then
    echo "❌ Please provide a domain name"
    echo "Usage: ./quick-deploy.sh yourdomain.com"
    exit 1
fi

echo "🚀 Starting EduPlatform deployment for: $DOMAIN"

# Update domain in files
echo "🔄 Updating domain URLs..."
node update-domain.js $DOMAIN

# Build for production
echo "🔨 Building for production..."
node build.js

# Create deployment package
echo "📦 Creating deployment package..."
cd dist
tar -czf ../eduplatform-deploy.tar.gz .
cd ..

echo "✅ Deployment package created: eduplatform-deploy.tar.gz"
echo ""
echo "📋 Next steps:"
echo "1. Upload eduplatform-deploy.tar.gz to your hosting"
echo "2. Extract files to public_html or root directory"
echo "3. Update DNS records to point to your hosting"
echo "4. Configure SSL certificate"
echo "5. Test your website at https://$DOMAIN"
echo ""
echo "🎉 Ready to deploy!"

