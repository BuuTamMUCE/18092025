# 🤖 Hướng Dẫn Quy Trình Tự Động Kiểm Tra & Deploy

## 📋 Tổng Quan

Hệ thống tự động hóa hoàn chỉnh cho EduPlatform LMS, thực hiện kiểm tra và deploy theo quy trình chuẩn từ GitHub đến Vercel.

---

## 🚀 Quy Trình Tự Động (5 Bước)

### **Bước 1: Chuẩn bị**
```bash
git pull origin main
npm ci || yarn install
```

### **Bước 2: Kiểm tra cục bộ**
```bash
npm run lint
npm run format  
npm run test || echo "No tests"
npm run build || echo "No build step"
```

### **Bước 3: Deploy Preview trên Vercel**
- Push code lên GitHub
- Lấy PREVIEW_URL từ Vercel logs

### **Bước 4: Kiểm tra tự động trên Preview**
- **4.1 Smoke Test:** `curl -I $PREVIEW_URL`
- **4.2 Lighthouse:** `npx @lhci/cli autorun --url=$PREVIEW_URL`
- **4.3 Playwright:** `npx playwright test tests/e2e/no-404.spec.ts`
- **4.4 API Health:** Kiểm tra endpoints và forms

### **Bước 5: Triển khai Production**
- Merge main khi tất cả test PASS
- Vercel auto deploy production
- Kiểm tra lại domain chính

---

## 🛠️ Scripts Có Sẵn

### **Local Development**
```bash
npm run dev              # Start development server
npm run start            # Start production server
npm run build            # Build project
npm run clean            # Clean dependencies
npm run reinstall        # Reinstall dependencies
```

### **Testing & Quality**
```bash
npm run local-checks     # Run all local checks
npm run smoke-tests      # Run smoke tests
npm run api-health       # Run API health checks
npm run lighthouse       # Run Lighthouse CI
npm run playwright       # Run Playwright E2E tests
```

### **Deployment**
```bash
npm run deploy           # Deploy to production
npm run deploy:preview   # Deploy preview
npm run preview          # Vercel preview
npm run workflow         # Run full automated workflow
```

### **Monitoring**
```bash
npm run analytics        # Vercel analytics
npm run logs             # Vercel logs
npm run monitor          # Follow logs
npm run domains          # Domain management
npm run env              # Environment variables
```

---

## 🎯 Tiêu Chuẩn PASS

### **✅ Chỉ dừng khi đạt tất cả:**
- ✅ Trang chủ trả về 200 OK
- ✅ Không lỗi 404 / 500
- ✅ Không lỗi JS trong console
- ✅ Lighthouse: Perf ≥ 80, SEO ≥ 90, A11y ≥ 90
- ✅ API health check OK
- ✅ Forms hoạt động đúng
- ✅ CSS/JS/Assets load HTTPS
- ✅ Không lộ .env hoặc file nhạy cảm

---

## 🚀 Cách Sử Dụng

### **1. Chạy Quy Trình Tự Động Hoàn Chỉnh**
```bash
# Chạy toàn bộ quy trình tự động
npm run workflow
```

### **2. Chạy Từng Bước Riêng Lẻ**
```bash
# Bước 1: Chuẩn bị
git pull origin main
npm ci

# Bước 2: Kiểm tra cục bộ
npm run local-checks

# Bước 3: Deploy preview (manual)
git add .
git commit -m "🚀 Deploy preview"
git push origin main

# Bước 4: Kiểm tra preview
export PREVIEW_URL="https://your-preview-url.vercel.app"
npm run smoke-tests
npm run lighthouse
npm run playwright
npm run api-health

# Bước 5: Deploy production
npm run deploy:production
```

### **3. Sử Dụng GitHub Actions**
```yaml
# Tự động chạy khi push lên main branch
# Xem file: .github/workflows/automated-deployment.yml
```

---

## 🔧 Cấu Hình

### **Environment Variables**
```bash
# Vercel
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
VERCEL_TOKEN=your_vercel_token

# Testing
PREVIEW_URL=https://your-preview-url.vercel.app
PRODUCTION_URL=https://your-production-url.vercel.app
```

### **Lighthouse Configuration**
```javascript
// File: lighthouserc.js
// Cấu hình performance thresholds
```

### **Playwright Configuration**
```typescript
// File: playwright.config.ts
// Cấu hình E2E testing
```

---

## 📊 Monitoring & Analytics

### **Vercel Dashboard**
- 📈 **Analytics:** Traffic và performance
- 📊 **Speed Insights:** Core Web Vitals
- 🔍 **Function Logs:** API và serverless functions
- 🌍 **Edge Network:** Global performance

### **GitHub Actions**
- ✅ **Build Status:** CI/CD pipeline status
- 🧪 **Test Results:** All test results
- 📋 **Deployment History:** Track all deployments
- 🔒 **Security Scans:** Vulnerability scanning

---

## 🚨 Troubleshooting

### **Lỗi Thường Gặp**

#### **1. Local Checks Failed**
```bash
# Kiểm tra dependencies
npm ci

# Kiểm tra git status
git status

# Chạy lại local checks
npm run local-checks
```

#### **2. Smoke Tests Failed**
```bash
# Kiểm tra preview URL
echo $PREVIEW_URL

# Test manual
curl -I $PREVIEW_URL

# Chạy lại smoke tests
npm run smoke-tests
```

#### **3. Lighthouse Failed**
```bash
# Kiểm tra performance
npm run lighthouse

# Xem detailed report
cat lhci_reports/manifest.json
```

#### **4. Playwright Failed**
```bash
# Cài đặt browsers
npx playwright install

# Chạy với debug
npx playwright test --debug

# Xem report
npx playwright show-report
```

#### **5. API Health Failed**
```bash
# Kiểm tra API endpoints
npm run api-health

# Test manual API
curl -X POST $PREVIEW_URL/api/auth \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

---

## 🔄 Quy Trình Sửa Lỗi

### **Khi Test FAIL:**
1. **Xem logs chi tiết**
2. **Sửa code**
3. **Commit changes**
4. **Chạy lại workflow**
5. **Lặp lại cho đến khi PASS**

### **Khi Production FAIL:**
1. **Rollback trên Vercel Dashboard**
2. **Kiểm tra logs**
3. **Sửa lỗi**
4. **Redeploy**

---

## 📚 Tài Liệu Tham Khảo

### **Vercel Documentation**
- [Vercel CLI](https://vercel.com/docs/cli)
- [Vercel Analytics](https://vercel.com/docs/analytics)
- [Edge Functions](https://vercel.com/docs/functions/edge-functions)

### **Testing Tools**
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Playwright](https://playwright.dev/)
- [GitHub Actions](https://docs.github.com/en/actions)

### **Performance**
- [Core Web Vitals](https://web.dev/vitals/)
- [Web Performance](https://web.dev/performance/)

---

## 🎯 Best Practices

### **Development**
- ✅ Luôn chạy local checks trước khi push
- ✅ Sử dụng meaningful commit messages
- ✅ Test trên preview trước khi merge main
- ✅ Monitor performance metrics

### **Deployment**
- ✅ Chỉ deploy khi tất cả tests PASS
- ✅ Sử dụng feature branches cho development
- ✅ Merge main chỉ khi ready for production
- ✅ Monitor production deployment

### **Security**
- ✅ Không commit sensitive data
- ✅ Sử dụng environment variables
- ✅ Regular security scans
- ✅ Keep dependencies updated

---

**EduPlatform Team** - *Automated Deployment System*

**🤖 Quy trình tự động hoàn chỉnh cho deployment an toàn và hiệu quả!**
