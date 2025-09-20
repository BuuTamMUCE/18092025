# 🚀 Hướng Dẫn Deploy EduPlatform lên Vercel

## 📋 Yêu Cầu Hệ Thống

- Node.js phiên bản 18.0.0 trở lên
- Tài khoản Vercel (miễn phí)
- Git (để quản lý source code)

## 🔧 Cài Đặt Vercel CLI

### Bước 1: Cài đặt Vercel CLI
```bash
npm install -g vercel
```

### Bước 2: Đăng nhập vào Vercel
```bash
vercel login
```

## 📁 Cấu Trúc Folder "vercel deploy"

Folder này chứa tất cả file cần thiết để deploy:
- `index.html` - Trang chủ chính
- `vercel.json` - Cấu hình Vercel
- `package.json` - Cấu hình Node.js
- Tất cả các file HTML, CSS, JS
- Folder `js/` - Chứa các file JavaScript
- Các folder giao diện admin, student, etc.

## 🚀 Các Cách Deploy

### Phương Pháp 1: Deploy qua Vercel CLI (Khuyến nghị)

1. **Mở Terminal/Command Prompt**
   ```bash
   cd "vercel deploy"
   ```

2. **Deploy lần đầu**
   ```bash
   vercel
   ```
   - Chọn "Set up and deploy" 
   - Chọn "Link to existing project" hoặc tạo project mới
   - Đặt tên project: `eduplatform-lms`
   - Chọn framework: "Other" hoặc "Static Site"

3. **Deploy production**
   ```bash
   vercel --prod
   ```

### Phương Pháp 2: Deploy qua GitHub (Tự động)

1. **Push code lên GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Vercel deployment"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **Kết nối với Vercel**
   - Đăng nhập [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import repository từ GitHub
   - Cấu hình:
     - Framework Preset: "Other"
     - Root Directory: `vercel deploy`
     - Build Command: `echo "No build required"`
     - Output Directory: `.`

### Phương Pháp 3: Deploy qua Vercel Dashboard

1. **Truy cập [vercel.com](https://vercel.com)**
2. **Click "New Project"**
3. **Upload folder "vercel deploy"**
4. **Cấu hình project**
5. **Deploy**

## ⚙️ Cấu Hình Sau Khi Deploy

### 1. Cập nhật Domain
Sau khi deploy thành công, bạn sẽ nhận được URL dạng: `https://your-project.vercel.app`

### 2. Cấu hình Custom Domain (Tùy chọn)
- Vào Project Settings
- Tab "Domains"
- Thêm domain tùy chỉnh của bạn

### 3. Cấu hình Environment Variables
Nếu cần API keys hoặc config:
- Vào Project Settings
- Tab "Environment Variables"
- Thêm các biến môi trường cần thiết

## 🔍 Kiểm Tra Deployment

### 1. Kiểm tra trang chủ
Truy cập: `https://your-project.vercel.app`

### 2. Kiểm tra các trang con
- Admin Login: `https://your-project.vercel.app/admin_login_screen_1/code.html`
- Student Login: `https://your-project.vercel.app/student_authentication_screens_1/code.html`
- AI Dashboard: `https://your-project.vercel.app/ai-dashboard.html`

### 3. Kiểm tra tính năng
- Dark/Light mode toggle
- Responsive design
- AI chatbot (cần API key)

## 🛠️ Troubleshooting

### Lỗi thường gặp:

**1. Build failed**
```bash
# Giải pháp: Kiểm tra package.json
npm install
```

**2. 404 errors**
```bash
# Giải pháp: Kiểm tra vercel.json routes
# Đảm bảo file index.html tồn tại
```

**3. CORS errors**
```bash
# Giải pháp: Cấu hình headers trong vercel.json
```

**4. API không hoạt động**
```bash
# Giải pháp: Kiểm tra config.js và API keys
```

## 📱 PWA Features

Website đã được cấu hình PWA:
- Offline support
- App manifest
- Service worker
- Installable trên mobile

## 🔐 Bảo Mật

Các tính năng bảo mật đã được cấu hình:
- HTTPS enforced
- Security headers
- XSS protection
- Content type protection

## 📊 Monitoring

Vercel cung cấp:
- Analytics
- Performance monitoring
- Error tracking
- Real-time logs

## 🚀 Tips Tối Ưu

1. **Performance**
   - Enable compression
   - Optimize images
   - Use CDN (Vercel tự động)

2. **SEO**
   - Meta tags đã được cấu hình
   - Sitemap.xml
   - robots.txt

3. **Updates**
   ```bash
   # Deploy updates
   vercel --prod
   ```

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra Vercel dashboard logs
2. Xem documentation: [vercel.com/docs](https://vercel.com/docs)
3. Community: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

## 🎉 Chúc Mừng!

Sau khi hoàn thành các bước trên, website EduPlatform của bạn sẽ được deploy thành công lên Vercel với:
- ✅ HTTPS tự động
- ✅ CDN toàn cầu
- ✅ Auto-scaling
- ✅ Zero-downtime deployments
- ✅ Custom domains
- ✅ Analytics
