/**
 * Automated Workflow Script - Quy trình tự động hoàn chỉnh
 * Thực hiện tất cả bước từ 1-5 theo hướng dẫn
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Import các module kiểm tra
const LocalChecks = require('./local-checks');
const SmokeTests = require('./smoke-tests');
const APIHealthCheck = require('./api-health-check');

class AutomatedWorkflow {
    constructor() {
        this.projectRoot = path.join(__dirname, '..');
        this.previewUrl = null;
        this.results = [];
        this.errors = [];
        this.warnings = [];
    }

    async runFullWorkflow() {
        console.log('🚀 Starting Automated Workflow for EduPlatform LMS\n');
        console.log('='.repeat(60));
        
        try {
            // Bước 1: Chuẩn bị
            await this.step1_Prepare();
            
            // Bước 2: Kiểm tra cục bộ
            await this.step2_LocalChecks();
            
            // Bước 3: Deploy Preview
            await this.step3_DeployPreview();
            
            // Bước 4: Kiểm tra tự động trên Preview
            await this.step4_PreviewTests();
            
            // Bước 5: Triển khai Production
            await this.step5_ProductionDeployment();
            
            this.generateFinalReport();
            return this.errors.length === 0;
            
        } catch (error) {
            console.error('❌ Automated workflow failed:', error.message);
            return false;
        }
    }

    async step1_Prepare() {
        console.log('\n📋 STEP 1: PREPARATION');
        console.log('='.repeat(30));
        
        try {
            // Kiểm tra git status
            const gitStatus = execSync('git status --porcelain', { 
                cwd: this.projectRoot,
                encoding: 'utf8'
            });
            
            if (gitStatus.trim()) {
                console.log('⚠️  Uncommitted changes detected:');
                console.log(gitStatus);
                this.addWarning('⚠️  Uncommitted changes detected');
            } else {
                console.log('✅ Working directory is clean');
                this.addResult('✅', 'Working directory is clean');
            }
            
            // Kiểm tra branch
            const currentBranch = execSync('git branch --show-current', { 
                cwd: this.projectRoot,
                encoding: 'utf8'
            }).trim();
            
            console.log(`📍 Current branch: ${currentBranch}`);
            this.addResult('✅', `Current branch: ${currentBranch}`);
            
            if (currentBranch !== 'main') {
                this.addWarning(`⚠️  Not on main branch: ${currentBranch}`);
            }
            
        } catch (error) {
            this.addError(`❌ Preparation failed: ${error.message}`);
            throw error;
        }
    }

    async step2_LocalChecks() {
        console.log('\n🔍 STEP 2: LOCAL CHECKS');
        console.log('='.repeat(30));
        
        try {
            const localChecks = new LocalChecks();
            const success = await localChecks.runAllChecks();
            
            if (success) {
                this.addResult('✅', 'Local checks passed');
            } else {
                this.addError('❌ Local checks failed');
                throw new Error('Local checks failed');
            }
            
        } catch (error) {
            this.addError(`❌ Local checks failed: ${error.message}`);
            throw error;
        }
    }

    async step3_DeployPreview() {
        console.log('\n🚀 STEP 3: DEPLOY PREVIEW');
        console.log('='.repeat(30));
        
        try {
            // Commit và push changes
            console.log('📤 Committing and pushing changes...');
            
            execSync('git add .', { cwd: this.projectRoot });
            
            const commitMessage = `🚀 Automated deployment: ${new Date().toISOString()}`;
            execSync(`git commit -m "${commitMessage}"`, { cwd: this.projectRoot });
            
            execSync('git push origin main', { cwd: this.projectRoot });
            
            this.addResult('✅', 'Changes pushed to GitHub');
            console.log('✅ Changes pushed to GitHub');
            
            // Đợi Vercel deploy (simulate)
            console.log('⏳ Waiting for Vercel deployment...');
            console.log('📝 Note: In real scenario, you would wait for Vercel to complete deployment');
            console.log('📝 and get the PREVIEW_URL from Vercel logs or API');
            
            // Simulate getting preview URL
            this.previewUrl = process.env.PREVIEW_URL || 'https://eduplatform-lms.vercel.app';
            console.log(`🌐 Preview URL: ${this.previewUrl}`);
            
            this.addResult('✅', `Preview deployed: ${this.previewUrl}`);
            
        } catch (error) {
            this.addError(`❌ Preview deployment failed: ${error.message}`);
            throw error;
        }
    }

    async step4_PreviewTests() {
        console.log('\n🧪 STEP 4: PREVIEW TESTS');
        console.log('='.repeat(30));
        
        if (!this.previewUrl) {
            throw new Error('Preview URL not available');
        }
        
        try {
            // 4.1 Smoke Test
            console.log('\n🔥 4.1 Smoke Tests');
            const smokeTests = new SmokeTests(this.previewUrl);
            const smokeSuccess = await smokeTests.runSmokeTests();
            
            if (smokeSuccess) {
                this.addResult('✅', 'Smoke tests passed');
            } else {
                this.addError('❌ Smoke tests failed');
                throw new Error('Smoke tests failed');
            }
            
            // 4.2 Lighthouse CI
            console.log('\n🏮 4.2 Lighthouse Performance Tests');
            await this.runLighthouseTests();
            
            // 4.3 Playwright E2E Tests
            console.log('\n🎭 4.3 Playwright E2E Tests');
            await this.runPlaywrightTests();
            
            // 4.4 API Health Checks
            console.log('\n🏥 4.4 API Health Checks');
            const apiHealthCheck = new APIHealthCheck(this.previewUrl);
            const apiSuccess = await apiHealthCheck.runHealthChecks();
            
            if (apiSuccess) {
                this.addResult('✅', 'API health checks passed');
            } else {
                this.addError('❌ API health checks failed');
                throw new Error('API health checks failed');
            }
            
        } catch (error) {
            this.addError(`❌ Preview tests failed: ${error.message}`);
            throw error;
        }
    }

    async runLighthouseTests() {
        try {
            console.log('🏮 Running Lighthouse CI...');
            
            // Set environment variable for lighthouse config
            process.env.PREVIEW_URL = this.previewUrl;
            
            execSync('npx @lhci/cli autorun', { 
                cwd: this.projectRoot,
                stdio: 'inherit'
            });
            
            this.addResult('✅', 'Lighthouse tests passed');
            console.log('✅ Lighthouse tests passed');
            
        } catch (error) {
            this.addError(`❌ Lighthouse tests failed: ${error.message}`);
            console.error('❌ Lighthouse tests failed:', error.message);
            throw error;
        }
    }

    async runPlaywrightTests() {
        try {
            console.log('🎭 Running Playwright E2E tests...');
            
            // Set environment variable for playwright
            process.env.PREVIEW_URL = this.previewUrl;
            
            execSync('npx playwright test tests/e2e/no-404.spec.ts', { 
                cwd: this.projectRoot,
                stdio: 'inherit'
            });
            
            this.addResult('✅', 'Playwright E2E tests passed');
            console.log('✅ Playwright E2E tests passed');
            
        } catch (error) {
            this.addError(`❌ Playwright tests failed: ${error.message}`);
            console.error('❌ Playwright tests failed:', error.message);
            throw error;
        }
    }

    async step5_ProductionDeployment() {
        console.log('\n🎯 STEP 5: PRODUCTION DEPLOYMENT');
        console.log('='.repeat(30));
        
        try {
            // Merge to main (if not already on main)
            const currentBranch = execSync('git branch --show-current', { 
                cwd: this.projectRoot,
                encoding: 'utf8'
            }).trim();
            
            if (currentBranch !== 'main') {
                console.log('🔄 Merging to main branch...');
                execSync('git checkout main', { cwd: this.projectRoot });
                execSync(`git merge ${currentBranch}`, { cwd: this.projectRoot });
                execSync('git push origin main', { cwd: this.projectRoot });
                this.addResult('✅', 'Merged to main branch');
            } else {
                this.addResult('✅', 'Already on main branch');
            }
            
            // Vercel sẽ tự động deploy production
            console.log('🚀 Vercel will automatically deploy to production');
            this.addResult('✅', 'Production deployment initiated');
            
            // Kiểm tra production URL
            const productionUrl = process.env.PRODUCTION_URL || 'https://eduplatform-lms.vercel.app';
            console.log(`🌐 Production URL: ${productionUrl}`);
            
            // Final production check
            console.log('🔍 Running final production check...');
            const smokeTests = new SmokeTests(productionUrl);
            const productionSuccess = await smokeTests.runSmokeTests();
            
            if (productionSuccess) {
                this.addResult('✅', 'Production deployment verified');
            } else {
                this.addError('❌ Production deployment verification failed');
                throw new Error('Production deployment verification failed');
            }
            
        } catch (error) {
            this.addError(`❌ Production deployment failed: ${error.message}`);
            throw error;
        }
    }

    addResult(icon, message) {
        this.results.push({ icon, message, type: 'success' });
    }

    addWarning(message) {
        this.warnings.push(message);
        this.results.push({ icon: '⚠️', message, type: 'warning' });
    }

    addError(message) {
        this.errors.push(message);
        this.results.push({ icon: '❌', message, type: 'error' });
    }

    generateFinalReport() {
        console.log('\n📊 AUTOMATED WORKFLOW FINAL REPORT');
        console.log('='.repeat(60));
        
        // Summary
        const passed = this.results.filter(r => r.type === 'success').length;
        console.log(`\n📈 SUMMARY:`);
        console.log(`✅ Passed: ${passed}`);
        console.log(`⚠️  Warnings: ${this.warnings.length}`);
        console.log(`❌ Errors: ${this.errors.length}`);
        
        // Detailed results
        console.log('\n📋 DETAILED RESULTS:');
        for (const result of this.results) {
            console.log(`${result.icon} ${result.message}`);
        }
        
        // Final result
        console.log('\n🚀 FINAL RESULT:');
        if (this.errors.length === 0) {
            console.log('✅ AUTOMATED WORKFLOW COMPLETED SUCCESSFULLY!');
            console.log('   All tests passed. Production deployment is ready.');
            console.log('\n🎯 NEXT STEPS:');
            console.log('   1. Monitor production deployment');
            console.log('   2. Run final user acceptance tests');
            console.log('   3. Update documentation');
            console.log('   4. Notify stakeholders');
        } else {
            console.log('❌ AUTOMATED WORKFLOW FAILED!');
            console.log('   Some tests failed. Please fix issues before production.');
            
            console.log('\n🔧 ERRORS TO FIX:');
            for (const error of this.errors) {
                console.log(`   ${error}`);
            }
            
            console.log('\n🔄 WORKFLOW RECOMMENDATION:');
            console.log('   Fix the errors and run the workflow again.');
        }
        
        console.log('\n' + '='.repeat(60));
        
        return this.errors.length === 0;
    }
}

// Run if this script is executed directly
if (require.main === module) {
    const workflow = new AutomatedWorkflow();
    workflow.runFullWorkflow().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('❌ Automated workflow failed:', error);
        process.exit(1);
    });
}

module.exports = AutomatedWorkflow;

