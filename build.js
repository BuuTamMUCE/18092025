#!/usr/bin/env node

/**
 * Build script for EduPlatform
 * Optimizes files for production deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Building EduPlatform for production...');

// Create build directory
const buildDir = 'dist';
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
}

// Files to copy
const filesToCopy = [
    'index.html',
    '404.html',
    '500.html',
    '.htaccess',
    'robots.txt',
    'sitemap.xml',
    'site.webmanifest',
    'package.json'
];

// Directories to copy
const dirsToCopy = [
    'admin_login_screen_1',
    'admin_dashboard_1',
    'student_authentication_screens_1',
    'course_player_interface_1',
    'quiz_interface_1',
    'course_management_screen_1',
    'student_management_screen_1',
    'quiz_management_screen_1',
    'order_management_screen_1',
    'my_dashboard_(student)_1',
    'my_profile_(student)_1'
];

// Copy files
filesToCopy.forEach(file => {
    if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join(buildDir, file));
        console.log(`✅ Copied ${file}`);
    } else {
        console.log(`⚠️  File not found: ${file}`);
    }
});

// Copy directories
dirsToCopy.forEach(dir => {
    if (fs.existsSync(dir)) {
        copyDir(dir, path.join(buildDir, dir));
        console.log(`✅ Copied directory ${dir}`);
    } else {
        console.log(`⚠️  Directory not found: ${dir}`);
    }
});

// Function to copy directory recursively
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Update URLs in files
function updateUrls(filePath) {
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace placeholder URLs
    content = content.replace(/yourdomain\.com/g, process.env.DOMAIN || 'yourdomain.com');
    
    fs.writeFileSync(filePath, content);
    console.log(`🔄 Updated URLs in ${filePath}`);
}

// Update URLs in key files
updateUrls(path.join(buildDir, 'sitemap.xml'));
updateUrls(path.join(buildDir, 'robots.txt'));
updateUrls(path.join(buildDir, 'index.html'));

// Create deployment info
const deployInfo = {
    buildTime: new Date().toISOString(),
    version: '1.0.0',
    files: filesToCopy.length + dirsToCopy.length,
    domain: process.env.DOMAIN || 'yourdomain.com'
};

fs.writeFileSync(
    path.join(buildDir, 'deploy-info.json'), 
    JSON.stringify(deployInfo, null, 2)
);

console.log('🎉 Build completed successfully!');
console.log(`📁 Build output: ${buildDir}/`);
console.log(`🌐 Domain: ${deployInfo.domain}`);
console.log(`📅 Build time: ${deployInfo.buildTime}`);

// Instructions
console.log('\n📋 Next steps:');
console.log('1. Upload the contents of the "dist" folder to your hosting');
console.log('2. Update DNS records to point to your hosting');
console.log('3. Configure SSL certificate');
console.log('4. Test all functionality');
console.log('5. Submit sitemap to Google Search Console');

