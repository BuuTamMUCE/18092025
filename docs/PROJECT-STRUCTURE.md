# 🏗️ EduPlatform Project Structure

## 📁 Cấu Trúc Thư Mục Mới

Dự án EduPlatform đã được cấu trúc lại theo chuẩn khoa học và dễ bảo trì:

```
eduplatform-lms/
├── 📁 public/                    # Files công khai, được serve trực tiếp
│   ├── index.html               # Trang chủ chính
│   ├── 404.html                 # Trang lỗi 404
│   ├── 500.html                 # Trang lỗi 500
│   ├── offline.html             # Trang offline (PWA)
│   ├── ai-dashboard.html        # AI Dashboard
│   ├── ai-analytics-dashboard.html
│   ├── certificate-manager.html
│   ├── collaborative-workspace.html
│   ├── features-showcase.html
│   ├── live-classroom.html
│   ├── vr-learning-lab.html
│   ├── robots.txt               # SEO robots
│   ├── sitemap.xml              # SEO sitemap
│   └── site.webmanifest         # PWA manifest
│
├── 📁 src/                       # Source code chính
│   ├── 📁 pages/                 # Tất cả các trang
│   │   ├── 📁 admin/             # Admin pages
│   │   │   ├── admin_login_screen_*.html
│   │   │   ├── admin_dashboard_*.html
│   │   │   └── student_management_screen_*.html
│   │   │   ├── 📁 dashboard/
│   │   │   │   └── admin_dashboard_*.html
│   │   │   └── 📁 login/
│   │   │       └── admin_login_screen_*.html
│   │   │
│   │   ├── 📁 student/           # Student pages
│   │   │   ├── 📁 authentication/
│   │   │   │   └── student_authentication_screens_*.html
│   │   │   ├── 📁 dashboard/
│   │   │   │   └── my_dashboard_(student)_*.html
│   │   │   └── 📁 profile/
│   │   │       └── my_profile_(student)_*.html
│   │   │
│   │   ├── 📁 course/            # Course pages
│   │   │   ├── 📁 management/
│   │   │   │   └── course_management_screen_*.html
│   │   │   └── 📁 player/
│   │   │       └── course_player_interface_*.html
│   │   │
│   │   ├── 📁 quiz/              # Quiz pages
│   │   │   ├── 📁 interface/
│   │   │   │   └── quiz_interface_*.html
│   │   │   └── 📁 management/
│   │   │       └── quiz_management_screen_*.html
│   │   │
│   │   └── 📁 order/             # Order pages
│   │       └── 📁 management/
│   │           └── order_management_screen_*.html
│   │
│   ├── 📁 scripts/               # JavaScript files
│   │   ├── ai-chatbot.js
│   │   ├── analytics-manager.js
│   │   ├── blockchain-manager.js
│   │   ├── config.js
│   │   ├── gemini-ai.js
│   │   ├── ml-manager.js
│   │   ├── pwa-manager.js
│   │   ├── voice-ai-manager.js
│   │   ├── webrtc-manager.js
│   │   ├── websocket-manager.js
│   │   ├── webxr-manager.js
│   │   ├── sw.js
│   │   ├── update-domain.js
│   │   └── build.js
│   │
│   ├── 📁 assets/                # Static assets
│   │   ├── 📁 images/            # Hình ảnh
│   │   └── 📁 icons/             # Icons
│   │
│   └── 📁 styles/                # CSS files (nếu có)
│
├── 📁 docs/                      # Tài liệu
│   ├── README.md
│   ├── AI-FEATURES.md
│   ├── deploy-guide.md
│   ├── DEPLOYMENT-READY.md
│   └── PROJECT-STRUCTURE.md      # File này
│
├── 📁 deployment/                # Deployment configs
│   ├── quick-deploy.bat
│   ├── quick-deploy.sh
│   └── netlify.toml
│
├── 📁 node_modules/              # Dependencies
├── .htaccess                     # Apache config
├── package.json                  # Project config
├── package-lock.json            # Lock file
├── vercel.json                   # Vercel config
└── .github/                      # GitHub workflows
```

## 🎯 Lợi Ích Của Cấu Trúc Mới

### ✅ Tổ Chức Khoa Học
- **Phân loại rõ ràng**: Mỗi loại trang được nhóm theo chức năng
- **Dễ tìm kiếm**: Cấu trúc thư mục logic, dễ navigate
- **Mở rộng dễ dàng**: Thêm trang mới vào đúng thư mục

### ✅ Bảo Trì Hiệu Quả
- **Tách biệt code**: Source code và public files riêng biệt
- **Module hóa**: JavaScript files được tổ chức theo chức năng
- **Documentation**: Tài liệu tập trung trong thư mục docs

### ✅ Deployment Tối Ưu
- **Public folder**: Chỉ serve files cần thiết
- **Static assets**: Tách riêng cho cache hiệu quả
- **Config files**: Tập trung trong deployment folder

## 🚀 Cách Sử Dụng

### Development
```bash
# Chạy local server
npm run dev

# Hoặc
npx http-server public -p 3000 -o
```

### Deployment
```bash
# Deploy lên Vercel
npm run deploy

# Hoặc sử dụng script
deployment/quick-deploy.bat    # Windows
deployment/quick-deploy.sh     # Linux/Mac
```

### Thêm Trang Mới
1. Tạo file HTML trong thư mục phù hợp (`src/pages/`)
2. Cập nhật links trong `public/index.html`
3. Test và deploy

## 📝 Quy Tắc Đặt Tên

### Files và Folders
- **Sử dụng snake_case**: `student_dashboard_1.html`
- **Mô tả rõ chức năng**: `course_management_screen_1.html`
- **Số thứ tự**: `_1`, `_2`, `_3` cho các phiên bản

### Thư Mục
- **Tên ngắn gọn**: `admin`, `student`, `course`
- **Phân cấp rõ ràng**: `admin/dashboard`, `student/profile`
- **Tiếng Anh**: Tất cả tên thư mục và file

## 🔧 Cấu Hình

### Vercel
- **Output Directory**: `public`
- **Build Command**: Không cần (static site)
- **Dev Command**: `npx http-server public -p 3000 -o`

### PWA
- **Manifest**: `public/site.webmanifest`
- **Service Worker**: `src/scripts/sw.js`
- **Offline Page**: `public/offline.html`

## 🎉 Kết Luận

Cấu trúc mới này giúp:
- **Dễ phát triển**: Code được tổ chức logic
- **Dễ bảo trì**: Tìm file nhanh chóng
- **Dễ mở rộng**: Thêm tính năng mới dễ dàng
- **Dễ deploy**: Cấu hình deployment đơn giản
- **Dễ hiểu**: Cấu trúc rõ ràng cho team mới

---

**EduPlatform Team** - *Modern Learning Management System*
