#!/usr/bin/env node

/**
 * Script to update domain URLs in all files
 * Usage: node update-domain.js yourdomain.com
 */

const fs = require('fs');
const path = require('path');

const newDomain = process.argv[2];

if (!newDomain) {
    console.log('❌ Please provide a domain name');
    console.log('Usage: node update-domain.js yourdomain.com');
    process.exit(1);
}

console.log(`🔄 Updating domain to: ${newDomain}`);

// Files to update
const filesToUpdate = [
    'index.html',
    'sitemap.xml',
    'robots.txt',
    '404.html',
    '500.html',
    'site.webmanifest'
];

// Directories to scan
const dirsToScan = [
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

// Update single file
function updateFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${filePath}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Replace various domain patterns
    const patterns = [
        /yourdomain\.com/g,
        /https:\/\/yourdomain\.com/g,
        /http:\/\/yourdomain\.com/g
    ];

    patterns.forEach(pattern => {
        if (pattern.test(content)) {
            content = content.replace(pattern, newDomain);
            updated = true;
        }
    });

    if (updated) {
        fs.writeFileSync(filePath, content);
        console.log(`✅ Updated: ${filePath}`);
    } else {
        console.log(`⏭️  No changes needed: ${filePath}`);
    }
}

// Update files in directory
function updateDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        console.log(`⚠️  Directory not found: ${dirPath}`);
        return;
    }

    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        if (file.endsWith('.html')) {
            updateFile(path.join(dirPath, file));
        }
    });
}

// Update root files
console.log('\n📄 Updating root files...');
filesToUpdate.forEach(updateFile);

// Update files in directories
console.log('\n📁 Updating files in directories...');
dirsToScan.forEach(updateDirectory);

// Update build script
console.log('\n🔧 Updating build script...');
if (fs.existsSync('build.js')) {
    let buildContent = fs.readFileSync('build.js', 'utf8');
    buildContent = buildContent.replace(/yourdomain\.com/g, newDomain);
    fs.writeFileSync('build.js', buildContent);
    console.log('✅ Updated build.js');
}

// Update package.json
console.log('\n📦 Updating package.json...');
if (fs.existsSync('package.json')) {
    let packageContent = fs.readFileSync('package.json', 'utf8');
    packageContent = packageContent.replace(/yourdomain\.com/g, newDomain);
    fs.writeFileSync('package.json', packageContent);
    console.log('✅ Updated package.json');
}

console.log('\n🎉 Domain update completed!');
console.log(`🌐 New domain: ${newDomain}`);
console.log('\n📋 Next steps:');
console.log('1. Run: npm run build');
console.log('2. Upload files to your hosting');
console.log('3. Update DNS records');
console.log('4. Test the website');

