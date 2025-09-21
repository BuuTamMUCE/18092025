/**
 * Lighthouse CI Configuration
 * Bước 4.2 trong quy trình tự động
 * Thực hiện: npx @lhci/cli autorun --url=$PREVIEW_URL
 */

module.exports = {
  ci: {
    collect: {
      url: [
        process.env.PREVIEW_URL || 'http://localhost:3000',
        `${process.env.PREVIEW_URL || 'http://localhost:3000'}/admin-login.html`,
        `${process.env.PREVIEW_URL || 'http://localhost:3000'}/student-login.html`,
        `${process.env.PREVIEW_URL || 'http://localhost:3000'}/course-management.html`,
        `${process.env.PREVIEW_URL || 'http://localhost:3000'}/quiz-interface.html`
      ],
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        preset: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0
        }
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'speed-index': ['error', { maxNumericValue: 3000 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};

