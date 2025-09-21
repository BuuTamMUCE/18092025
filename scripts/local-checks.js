/**
 * Local Checks Script - Bước 2 trong quy trình tự động
 * Thực hiện: Lint + Format + Test + Build
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class LocalChecks {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.checks = [];
        this.projectRoot = path.join(__dirname, '..');
    }

    async runAllChecks() {
        console.log('🔍 Running Local Checks...\n');
        
        try {
            await this.pullLatestCode();
            await this.installDependencies();
            await this.runLint();
            await this.runFormat();
            await this.runTests();
            await this.runBuild();
            
            this.generateReport();
            return this.errors.length === 0;
            
        } catch (error) {
            console.error('❌ Local checks failed:', error.message);
            return false;
        }
    }

    async pullLatestCode() {
        console.log('📥 Pulling latest code from GitHub...');
        
        try {
            const result = execSync('git pull origin main', { 
                cwd: this.projectRoot,
                encoding: 'utf8'
            });
            
            this.addCheck('✅', 'Code pulled successfully');
            console.log('✅ Code updated from GitHub');
            
        } catch (error) {
            this.addError('❌ Failed to pull code from GitHub');
            console.error('❌ Git pull failed:', error.message);
            throw error;
        }
    }

    async installDependencies() {
        console.log('📦 Installing dependencies...');
        
        try {
            // Try npm ci first, fallback to npm install
            try {
                execSync('npm ci', { 
                    cwd: this.projectRoot,
                    stdio: 'inherit'
                });
                this.addCheck('✅', 'Dependencies installed with npm ci');
            } catch (ciError) {
                console.log('⚠️  npm ci failed, trying npm install...');
                execSync('npm install', { 
                    cwd: this.projectRoot,
                    stdio: 'inherit'
                });
                this.addCheck('✅', 'Dependencies installed with npm install');
            }
            
        } catch (error) {
            this.addError('❌ Failed to install dependencies');
            console.error('❌ Dependency installation failed:', error.message);
            throw error;
        }
    }

    async runLint() {
        console.log('🔍 Running linting...');
        
        try {
            // Check if package.json has lint script
            const packageJson = JSON.parse(
                fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8')
            );
            
            if (packageJson.scripts && packageJson.scripts.lint) {
                execSync('npm run lint', { 
                    cwd: this.projectRoot,
                    stdio: 'inherit'
                });
                this.addCheck('✅', 'Linting passed');
            } else {
                this.addWarning('⚠️  No lint script found, skipping...');
                console.log('⚠️  No lint script in package.json');
            }
            
        } catch (error) {
            this.addError('❌ Linting failed');
            console.error('❌ Lint failed:', error.message);
            throw error;
        }
    }

    async runFormat() {
        console.log('🎨 Running formatting...');
        
        try {
            // Check if package.json has format script
            const packageJson = JSON.parse(
                fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8')
            );
            
            if (packageJson.scripts && packageJson.scripts.format) {
                execSync('npm run format', { 
                    cwd: this.projectRoot,
                    stdio: 'inherit'
                });
                this.addCheck('✅', 'Formatting completed');
            } else {
                this.addWarning('⚠️  No format script found, skipping...');
                console.log('⚠️  No format script in package.json');
            }
            
        } catch (error) {
            this.addError('❌ Formatting failed');
            console.error('❌ Format failed:', error.message);
            throw error;
        }
    }

    async runTests() {
        console.log('🧪 Running tests...');
        
        try {
            // Check if package.json has test script
            const packageJson = JSON.parse(
                fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8')
            );
            
            if (packageJson.scripts && packageJson.scripts.test) {
                execSync('npm run test', { 
                    cwd: this.projectRoot,
                    stdio: 'inherit'
                });
                this.addCheck('✅', 'Tests passed');
            } else {
                this.addWarning('⚠️  No test script found, skipping...');
                console.log('⚠️  No test script in package.json');
            }
            
        } catch (error) {
            this.addError('❌ Tests failed');
            console.error('❌ Tests failed:', error.message);
            throw error;
        }
    }

    async runBuild() {
        console.log('🏗️  Running build...');
        
        try {
            // Check if package.json has build script
            const packageJson = JSON.parse(
                fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8')
            );
            
            if (packageJson.scripts && packageJson.scripts.build) {
                execSync('npm run build', { 
                    cwd: this.projectRoot,
                    stdio: 'inherit'
                });
                this.addCheck('✅', 'Build completed successfully');
            } else {
                this.addWarning('⚠️  No build script found, skipping...');
                console.log('⚠️  No build script in package.json');
            }
            
        } catch (error) {
            this.addError('❌ Build failed');
            console.error('❌ Build failed:', error.message);
            throw error;
        }
    }

    addCheck(icon, message) {
        this.checks.push({ icon, message, type: 'success' });
    }

    addWarning(message) {
        this.warnings.push(message);
        this.checks.push({ icon: '⚠️', message, type: 'warning' });
    }

    addError(message) {
        this.errors.push(message);
        this.checks.push({ icon: '❌', message, type: 'error' });
    }

    generateReport() {
        console.log('\n📊 LOCAL CHECKS REPORT');
        console.log('='.repeat(50));
        
        // Summary
        const passed = this.checks.filter(c => c.type === 'success').length;
        console.log(`\n📈 SUMMARY:`);
        console.log(`✅ Passed: ${passed}`);
        console.log(`⚠️  Warnings: ${this.warnings.length}`);
        console.log(`❌ Errors: ${this.errors.length}`);
        
        // Detailed results
        console.log('\n📋 DETAILED RESULTS:');
        for (const check of this.checks) {
            console.log(`${check.icon} ${check.message}`);
        }
        
        // Result
        console.log('\n🚀 LOCAL CHECKS RESULT:');
        if (this.errors.length === 0) {
            console.log('✅ LOCAL CHECKS PASSED!');
            console.log('   Ready to proceed to preview deployment.');
        } else {
            console.log('❌ LOCAL CHECKS FAILED!');
            console.log('   Please fix errors before proceeding.');
            
            console.log('\n🔧 ERRORS TO FIX:');
            for (const error of this.errors) {
                console.log(`   ${error}`);
            }
        }
        
        console.log('\n' + '='.repeat(50));
        
        return this.errors.length === 0;
    }
}

// Run if this script is executed directly
if (require.main === module) {
    const checker = new LocalChecks();
    checker.runAllChecks().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('❌ Local checks failed:', error);
        process.exit(1);
    });
}

module.exports = LocalChecks;
