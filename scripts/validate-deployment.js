/**
 * Validate deployment configuration and files
 */

const fs = require('fs');
const path = require('path');

const requiredFiles = [
    'public/index.html',
    'public/scripts/navigation.js',
    'public/scripts/vercel-analytics.js',
    'vercel.json',
    'package.json'
];

const requiredDirs = [
    'public',
    'public/scripts',
    'api',
    'edge'
];

const apiEndpoints = [
    'api/auth.js',
    'api/analytics.js',
    'api/ai-chat.js'
];

const edgeFunctions = [
    'edge/geo.js',
    'edge/ab-test.js'
];

function validateDeployment() {
    console.log('🔍 Validating deployment configuration...\n');
    
    let hasErrors = false;
    
    // Check required files
    console.log('📁 Checking required files:');
    requiredFiles.forEach(file => {
        if (fs.existsSync(file)) {
            console.log(`  ✅ ${file}`);
        } else {
            console.log(`  ❌ ${file} - MISSING`);
            hasErrors = true;
        }
    });
    
    // Check required directories
    console.log('\n📂 Checking required directories:');
    requiredDirs.forEach(dir => {
        if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
            console.log(`  ✅ ${dir}`);
        } else {
            console.log(`  ❌ ${dir} - MISSING`);
            hasErrors = true;
        }
    });
    
    // Check API endpoints
    console.log('\n🔌 Checking API endpoints:');
    apiEndpoints.forEach(endpoint => {
        if (fs.existsSync(endpoint)) {
            console.log(`  ✅ ${endpoint}`);
        } else {
            console.log(`  ❌ ${endpoint} - MISSING`);
            hasErrors = true;
        }
    });
    
    // Check Edge functions
    console.log('\n⚡ Checking Edge functions:');
    edgeFunctions.forEach(func => {
        if (fs.existsSync(func)) {
            console.log(`  ✅ ${func}`);
        } else {
            console.log(`  ❌ ${func} - MISSING`);
            hasErrors = true;
        }
    });
    
    // Validate vercel.json
    console.log('\n⚙️  Validating vercel.json:');
    try {
        const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
        
        if (vercelConfig.version) {
            console.log(`  ✅ Version: ${vercelConfig.version}`);
        } else {
            console.log(`  ❌ Missing version`);
            hasErrors = true;
        }
        
        if (vercelConfig.builds && vercelConfig.builds.length > 0) {
            console.log(`  ✅ Builds configured: ${vercelConfig.builds.length}`);
        } else {
            console.log(`  ❌ No builds configured`);
            hasErrors = true;
        }
        
        if (vercelConfig.routes && vercelConfig.routes.length > 0) {
            console.log(`  ✅ Routes configured: ${vercelConfig.routes.length}`);
        } else {
            console.log(`  ❌ No routes configured`);
            hasErrors = true;
        }
        
    } catch (error) {
        console.log(`  ❌ Invalid vercel.json: ${error.message}`);
        hasErrors = true;
    }
    
    // Validate package.json
    console.log('\n📦 Validating package.json:');
    try {
        const packageConfig = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        
        if (packageConfig.name) {
            console.log(`  ✅ Name: ${packageConfig.name}`);
        } else {
            console.log(`  ❌ Missing name`);
            hasErrors = true;
        }
        
        if (packageConfig.version) {
            console.log(`  ✅ Version: ${packageConfig.version}`);
        } else {
            console.log(`  ❌ Missing version`);
            hasErrors = true;
        }
        
        if (packageConfig.scripts && packageConfig.scripts.build) {
            console.log(`  ✅ Build script configured`);
        } else {
            console.log(`  ❌ Missing build script`);
            hasErrors = true;
        }
        
    } catch (error) {
        console.log(`  ❌ Invalid package.json: ${error.message}`);
        hasErrors = true;
    }
    
    // Check file sizes
    console.log('\n📊 Checking file sizes:');
    const largeFiles = [];
    const publicFiles = fs.readdirSync('public', { withFileTypes: true })
        .filter(dirent => dirent.isFile())
        .map(dirent => dirent.name);
    
    publicFiles.forEach(file => {
        const filePath = path.join('public', file);
        const stats = fs.statSync(filePath);
        const sizeKB = Math.round(stats.size / 1024);
        
        if (sizeKB > 1000) {
            largeFiles.push({ file, sizeKB });
            console.log(`  ⚠️  ${file}: ${sizeKB}KB (large file)`);
        } else {
            console.log(`  ✅ ${file}: ${sizeKB}KB`);
        }
    });
    
    // Summary
    console.log('\n📋 Validation Summary:');
    if (hasErrors) {
        console.log('  ❌ Validation failed - please fix the errors above');
        process.exit(1);
    } else {
        console.log('  ✅ All validations passed!');
        console.log(`  📄 ${requiredFiles.length} required files found`);
        console.log(`  📂 ${requiredDirs.length} required directories found`);
        console.log(`  🔌 ${apiEndpoints.length} API endpoints configured`);
        console.log(`  ⚡ ${edgeFunctions.length} Edge functions configured`);
        
        if (largeFiles.length > 0) {
            console.log(`  ⚠️  ${largeFiles.length} large files detected (consider optimizing)`);
        }
        
        console.log('\n🚀 Ready for deployment!');
    }
}

if (require.main === module) {
    validateDeployment();
}

module.exports = validateDeployment;
