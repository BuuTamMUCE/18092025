# Hướng dẫn Deploy EduPlatform lên Internet

## 🚀 Tổng quan
Hướng dẫn chi tiết để deploy webapp EduPlatform lên hosting và tên miền của bạn.

## 📋 Chuẩn bị trước khi deploy

### 1. Thông tin cần thiết
- **Tên miền**: yourdomain.com (thay thế trong các file cấu hình)
- **Hosting provider**: cPanel, Vercel, Netlify, GitHub Pages, etc.
- **FTP credentials**: nếu sử dụng shared hosting
- **SSL Certificate**: để bật HTTPS

### 2. Files cần upload
```
📁 Root Directory
├── index.html
├── 404.html
├── 500.html
├── .htaccess
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── package.json
├── favicon.ico
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png
├── android-chrome-192x192.png
├── android-chrome-512x512.png
├── og-image.jpg
└── 📁 admin_login_screen_1/
    └── code.html
└── 📁 student_authentication_screens_1/
    └── code.html
└── 📁 course_player_interface_1/
    └── code.html
└── 📁 quiz_interface_1/
    └── code.html
└── 📁 admin_dashboard_1/
    └── code.html
└── 📁 course_management_screen_1/
    └── code.html
└── 📁 student_management_screen_1/
    └── code.html
└── 📁 quiz_management_screen_1/
    └── code.html
└── 📁 order_management_screen_1/
    └── code.html
└── 📁 my_dashboard_(student)_1/
    └── code.html
└── 📁 my_profile_(student)_1/
    └── code.html
```

## 🌐 Các phương pháp deploy

### Phương pháp 1: Shared Hosting (cPanel)

#### Bước 1: Chuẩn bị files
1. Tạo thư mục `public_html` trên máy tính
2. Copy tất cả files vào thư mục này
3. Thay thế `yourdomain.com` bằng tên miền thực của bạn trong:
   - `sitemap.xml`
   - `index.html` (meta tags)
   - `robots.txt`

#### Bước 2: Upload qua FTP
1. Sử dụng FileZilla hoặc FTP client
2. Kết nối với hosting qua FTP credentials
3. Upload toàn bộ thư mục `public_html` lên root directory
4. Đảm bảo file `.htaccess` được upload

#### Bước 3: Cấu hình
1. Đăng nhập cPanel
2. Vào **File Manager**
3. Kiểm tra files đã upload đúng
4. Vào **SSL/TLS** để bật HTTPS
5. Vào **Redirects** để redirect www về non-www

### Phương pháp 2: Vercel (Recommended)

#### Bước 1: Chuẩn bị
1. Tạo tài khoản Vercel
2. Cài đặt Vercel CLI: `npm i -g vercel`

#### Bước 2: Deploy
```bash
# Trong thư mục project
vercel login
vercel --prod
```

#### Bước 3: Cấu hình domain
1. Vào Vercel Dashboard
2. Chọn project
3. Vào **Settings** > **Domains**
4. Thêm custom domain
5. Cấu hình DNS records

### Phương pháp 3: Netlify

#### Bước 1: Deploy
1. Truy cập [netlify.com](https://netlify.com)
2. Kéo thả thư mục project vào Netlify
3. Hoặc connect với GitHub repository

#### Bước 2: Cấu hình
1. Vào **Site settings**
2. Thêm custom domain
3. Cấu hình redirects trong `_redirects` file

### Phương pháp 4: GitHub Pages

#### Bước 1: Tạo repository
1. Tạo repository mới trên GitHub
2. Upload tất cả files
3. Vào **Settings** > **Pages**
4. Chọn source branch

#### Bước 2: Cấu hình custom domain
1. Thêm file `CNAME` với tên miền
2. Cấu hình DNS records

## 🔧 Cấu hình sau khi deploy

### 1. Cập nhật URLs
Thay thế `yourdomain.com` trong các file:
- `sitemap.xml`
- `robots.txt`
- `index.html` (meta tags)
- Tất cả các file HTML khác

### 2. Cấu hình DNS
```
Type    Name    Value
A       @       [IP của hosting]
CNAME   www     yourdomain.com
```

### 3. Bật HTTPS
- **cPanel**: Vào **SSL/TLS** > **Force HTTPS Redirect**
- **Vercel/Netlify**: Tự động có HTTPS
- **Cloudflare**: Bật **Always Use HTTPS**

### 4. Cấu hình CDN (Optional)
- **Cloudflare**: Thêm domain vào Cloudflare
- **AWS CloudFront**: Tạo distribution
- **KeyCDN**: Cấu hình pull zone

## 📊 Monitoring & Analytics

### 1. Google Analytics
Thêm vào `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. Google Search Console
1. Thêm property
2. Verify ownership
3. Submit sitemap: `https://yourdomain.com/sitemap.xml`

### 3. Performance Monitoring
- **Google PageSpeed Insights**
- **GTmetrix**
- **WebPageTest**

## 🛠️ Troubleshooting

### Lỗi thường gặp:

#### 1. 404 Error
- Kiểm tra file `.htaccess` có được upload
- Kiểm tra đường dẫn files
- Kiểm tra cấu hình redirect

#### 2. CSS/JS không load
- Kiểm tra đường dẫn CDN
- Kiểm tra CORS policy
- Kiểm tra file permissions

#### 3. HTTPS không hoạt động
- Kiểm tra SSL certificate
- Kiểm tra redirect rules
- Kiểm tra mixed content

#### 4. Performance chậm
- Bật GZIP compression
- Optimize images
- Sử dụng CDN
- Minify CSS/JS

## 🔒 Security Checklist

- [ ] Bật HTTPS
- [ ] Cấu hình security headers
- [ ] Ẩn server information
- [ ] Cấu hình firewall
- [ ] Backup định kỳ
- [ ] Update dependencies
- [ ] Monitor logs

## 📈 SEO Checklist

- [ ] Meta tags đầy đủ
- [ ] Sitemap.xml
- [ ] Robots.txt
- [ ] Structured data
- [ ] Page speed optimization
- [ ] Mobile-friendly
- [ ] SSL certificate

## 🎯 Post-Deploy Tasks

1. **Test tất cả tính năng**
2. **Kiểm tra responsive design**
3. **Test trên các browser khác nhau**
4. **Submit sitemap lên Google**
5. **Cấu hình analytics**
6. **Setup monitoring**
7. **Tạo backup strategy**

## 📞 Support

Nếu gặp vấn đề trong quá trình deploy:
1. Kiểm tra logs của hosting provider
2. Sử dụng browser developer tools
3. Test với tools online (GTmetrix, PageSpeed)
4. Liên hệ support của hosting provider

## 🚀 Next Steps

Sau khi deploy thành công:
1. **Marketing**: Quảng bá website
2. **Content**: Thêm nội dung khóa học
3. **Features**: Phát triển thêm tính năng
4. **Analytics**: Theo dõi user behavior
5. **Optimization**: Tối ưu performance

---

**Lưu ý**: Thay thế `yourdomain.com` bằng tên miền thực của bạn trong tất cả các file trước khi deploy!

