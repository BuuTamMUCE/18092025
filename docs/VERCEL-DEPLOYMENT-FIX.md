# 🚀 Vercel Deployment Fix Guide

## ❌ Lỗi Hiện Tại
```
The specified Root Directory "deployment" does not exist. Please update your Project Settings.
```

## ✅ Giải Pháp

### Phương Pháp 1: Cập Nhật Vercel Dashboard (Khuyến nghị)

1. **Truy cập Vercel Dashboard**
   - Đăng nhập [vercel.com](https://vercel.com)
   - Chọn project "18092025"

2. **Vào Project Settings**
   - Click vào tab "Settings"
   - Tìm section "Build & Development Settings"

3. **Cập Nhật Cấu Hình**
   ```
   Framework Preset: Other
   Root Directory: . (để trống hoặc dấu chấm)
   Build Command: (để trống)
   Output Directory: public
   Install Command: (để trống)
   ```

4. **Save Changes**
   - Click "Save" để lưu thay đổi

### Phương Pháp 2: Sử Dụng Vercel CLI

```bash
# Cài đặt Vercel CLI
npm install -g vercel

# Deploy với cấu hình mới
vercel --prod

# Hoặc cấu hình lại project
vercel
```

### Phương Pháp 3: Xóa và Tạo Lại Project

1. **Xóa Project Cũ**
   - Vào Vercel Dashboard
   - Chọn project → Settings → Delete Project

2. **Import Lại từ GitHub**
   - Click "New Project"
   - Import repository "BuuTamMUCE/18092025"
   - Cấu hình:
     ```
     Framework Preset: Other
     Root Directory: . (để trống)
     Output Directory: public
     ```

## 📁 Cấu Trúc Dự Án Hiện Tại

```
18092025/
├── 📁 public/           # ← Output Directory cho Vercel
│   ├── index.html       # Trang chủ
│   ├── 404.html
│   ├── 500.html
│   └── ... (các trang khác)
├── 📁 src/             # Source code
│   ├── 📁 pages/       # Các trang được tổ chức
│   ├── 📁 scripts/     # JavaScript files
│   └── 📁 assets/      # Images, icons
├── 📁 docs/            # Documentation
├── 📁 deployment/      # Deployment configs (không phải root)
├── vercel.json         # Vercel configuration
├── package.json        # Project config
└── README.md
```

## ⚙️ Cấu Hình Vercel.json

File `vercel.json` đã được cấu hình đúng:

```json
{
  "version": 2,
  "name": "eduplatform-lms",
  "builds": [
    {
      "src": "public/**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/",
      "dest": "/public/index.html"
    }
  ]
}
```

## 🔧 Scripts Package.json

```json
{
  "scripts": {
    "dev": "npx http-server public -p 3000 -o",
    "start": "npx http-server public -p 3000 -o",
    "build": "echo 'Static site - no build required'",
    "deploy": "vercel --prod",
    "preview": "vercel"
  }
}
```

## 🚀 Test Deployment

Sau khi cập nhật settings:

1. **Trigger Manual Deploy**
   - Vào Vercel Dashboard
   - Click "Deployments"
   - Click "Redeploy" trên deployment mới nhất

2. **Kiểm Tra Logs**
   - Click vào deployment
   - Xem "Build Logs" để đảm bảo không có lỗi

3. **Test Website**
   - Truy cập URL được cung cấp
   - Kiểm tra các trang chính hoạt động

## 🎯 Kết Quả Mong Đợi

Sau khi sửa:
- ✅ Build thành công
- ✅ Website hoạt động bình thường
- ✅ Tất cả routes hoạt động
- ✅ Static files được serve đúng

## 📞 Hỗ Trợ

Nếu vẫn gặp vấn đề:
1. Kiểm tra Vercel Dashboard logs
2. Xem [Vercel Documentation](https://vercel.com/docs)
3. Tạo issue trên GitHub repository

---

**EduPlatform Team** - *Modern Learning Management System*
