/**
 * Playwright E2E Test - Kiểm tra không có lỗi 404
 * Bước 4.3 trong quy trình tự động
 */

import { test, expect, Page } from '@playwright/test';

test.describe('No 404 Errors', () => {
  let previewUrl: string;
  let responses: Array<{ url: string; status: number }> = [];

  test.beforeEach(async ({ page }) => {
    previewUrl = process.env.PREVIEW_URL || 'http://localhost:3000';
    responses = [];
    
    // Listen for all responses
    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status()
      });
    });
  });

  test('Không có lỗi 404 trên trang chủ', async ({ page }) => {
    await page.goto(previewUrl);
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check for 404 errors
    const error404 = responses.filter(r => r.status === 404);
    
    expect(error404.length).toBe(0);
    
    if (error404.length > 0) {
      console.error('❌ Found 404 errors:');
      error404.forEach(error => {
        console.error(`   ${error.status}: ${error.url}`);
      });
    }
  });

  test('Kiểm tra tất cả navigation links không 404', async ({ page }) => {
    await page.goto(previewUrl);
    await page.waitForLoadState('networkidle');
    
    // Get all navigation links
    const navLinks = await page.locator('[onclick*="navigationManager.navigateTo"]').all();
    
    const linkErrors: Array<{ url: string; status: number }> = [];
    
    for (const link of navLinks) {
      // Reset responses for each link
      responses = [];
      
      // Click the navigation link
      await link.click();
      
      // Wait for navigation to complete
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Check for 404 errors
      const error404 = responses.filter(r => r.status === 404);
      if (error404.length > 0) {
        linkErrors.push(...error404);
      }
      
      // Go back to homepage for next test
      await page.goto(previewUrl);
      await page.waitForLoadState('networkidle');
    }
    
    expect(linkErrors.length).toBe(0);
    
    if (linkErrors.length > 0) {
      console.error('❌ Found 404 errors in navigation:');
      linkErrors.forEach(error => {
        console.error(`   ${error.status}: ${error.url}`);
      });
    }
  });

  test('Kiểm tra assets không 404', async ({ page }) => {
    await page.goto(previewUrl);
    await page.waitForLoadState('networkidle');
    
    const criticalAssets = [
      '/robots.txt',
      '/sitemap.xml',
      '/site.webmanifest',
      '/scripts/navigation.js',
      '/scripts/i18n.js',
      '/styles/i18n.css'
    ];
    
    const assetErrors: Array<{ url: string; status: number }> = [];
    
    for (const asset of criticalAssets) {
      responses = [];
      
      // Navigate to asset
      await page.goto(`${previewUrl}${asset}`);
      await page.waitForLoadState('networkidle');
      
      // Check for 404 errors
      const error404 = responses.filter(r => r.status === 404);
      if (error404.length > 0) {
        assetErrors.push(...error404);
      }
    }
    
    expect(assetErrors.length).toBe(0);
    
    if (assetErrors.length > 0) {
      console.error('❌ Found 404 errors in assets:');
      assetErrors.forEach(error => {
        console.error(`   ${error.status}: ${error.url}`);
      });
    }
  });

  test('Kiểm tra API endpoints không 404', async ({ page }) => {
    const apiEndpoints = [
      '/api/auth',
      '/api/analytics',
      '/api/ai-chat'
    ];
    
    const apiErrors: Array<{ url: string; status: number }> = [];
    
    for (const endpoint of apiEndpoints) {
      responses = [];
      
      // Make POST request to API endpoint
      const response = await page.request.post(`${previewUrl}${endpoint}`, {
        data: {}
      });
      
      // API should return 200 or 405 (Method Not Allowed), not 404
      if (response.status() === 404) {
        apiErrors.push({
          url: endpoint,
          status: response.status()
        });
      }
    }
    
    expect(apiErrors.length).toBe(0);
    
    if (apiErrors.length > 0) {
      console.error('❌ Found 404 errors in API endpoints:');
      apiErrors.forEach(error => {
        console.error(`   ${error.status}: ${error.url}`);
      });
    }
  });

  test('Kiểm tra redirects hoạt động đúng', async ({ page }) => {
    const redirectTests = [
      { from: '/admin', expectedStatus: 302 },
      { from: '/student', expectedStatus: 302 },
      { from: '/dashboard', expectedStatus: 302 },
      { from: '/courses', expectedStatus: 302 },
      { from: '/quiz', expectedStatus: 302 }
    ];
    
    const redirectErrors: Array<{ url: string; status: number; expected: number }> = [];
    
    for (const test of redirectTests) {
      const response = await page.goto(`${previewUrl}${test.from}`);
      
      if (response && response.status() !== test.expectedStatus) {
        redirectErrors.push({
          url: test.from,
          status: response.status(),
          expected: test.expectedStatus
        });
      }
    }
    
    expect(redirectErrors.length).toBe(0);
    
    if (redirectErrors.length > 0) {
      console.error('❌ Found redirect errors:');
      redirectErrors.forEach(error => {
        console.error(`   ${error.url}: Expected ${error.expected}, got ${error.status}`);
      });
    }
  });

  test('Kiểm tra console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto(previewUrl);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Filter out common non-critical errors
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('favicon.ico') && 
      !error.includes('404') &&
      !error.includes('net::ERR_')
    );
    
    expect(criticalErrors.length).toBe(0);
    
    if (criticalErrors.length > 0) {
      console.error('❌ Found console errors:');
      criticalErrors.forEach(error => {
        console.error(`   ${error}`);
      });
    }
  });
});

