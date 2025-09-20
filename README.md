# 🎓 EduPlatform LMS

> **Modern Learning Management System** - Tổ chức khoa học, dễ bảo trì, sẵn sàng deploy

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/yourusername/eduplatform-lms)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Deploy](https://img.shields.io/badge/deploy-Vercel-black.svg)](https://vercel.com)

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/yourusername/eduplatform-lms.git
cd eduplatform-lms

# Install dependencies
npm install

# Start development server
npm run dev

# Deploy to production
npm run deploy
```

## 📁 Project Structure

Dự án đã được **cấu trúc lại hoàn toàn** theo chuẩn khoa học:

```
eduplatform-lms/
├── 📁 public/           # Public files (HTML, assets)
├── 📁 src/             # Source code
│   ├── 📁 pages/       # All pages organized by feature
│   ├── 📁 scripts/     # JavaScript modules
│   └── 📁 assets/      # Images, icons
├── 📁 docs/            # Documentation
├── 📁 deployment/      # Deployment configs
└── 📁 node_modules/    # Dependencies
```

**📖 Xem chi tiết**: [PROJECT-STRUCTURE.md](docs/PROJECT-STRUCTURE.md)

## ✨ Features

### 🎯 Core Features
- **Admin Dashboard** - Quản lý hệ thống toàn diện
- **Student Portal** - Giao diện học sinh thân thiện
- **Course Management** - Quản lý khóa học chuyên nghiệp
- **Quiz System** - Hệ thống quiz tương tác
- **Order Management** - Quản lý đơn hàng hiệu quả

### 🤖 AI Features
- **AI Chatbot** - Hỗ trợ học tập với Gemini AI
- **AI Analytics** - Phân tích thông minh
- **Voice AI** - Hỗ trợ giọng nói
- **ML Manager** - Machine learning integration

### 🚀 Advanced Features
- **PWA Support** - Progressive Web App
- **WebRTC** - Video/audio streaming
- **WebXR** - Virtual Reality support
- **Blockchain** - Certificate management
- **Real-time** - WebSocket connections

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm hoặc yarn

### Available Scripts
```bash
npm run dev        # Start development server
npm run start      # Start production server
npm run build      # Build project (static site)
npm run deploy     # Deploy to Vercel
npm run preview    # Preview deployment
npm run clean      # Clean dependencies
npm run reinstall  # Clean and reinstall
```

### Local Development
```bash
# Start local server on port 3000
npm run dev

# Custom port
npx http-server public -p 8080 -o
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Other Platforms
- **Netlify**: Use `deployment/netlify.toml`
- **GitHub Pages**: Push to `gh-pages` branch
- **Custom Server**: Upload `public/` folder

## 📱 PWA Features

- ✅ **Offline Support** - Hoạt động khi mất mạng
- ✅ **Installable** - Cài đặt như app native
- ✅ **Push Notifications** - Thông báo real-time
- ✅ **Background Sync** - Đồng bộ dữ liệu

## 🔐 Security

- ✅ **HTTPS Enforced** - Bảo mật giao thức
- ✅ **XSS Protection** - Chống tấn công XSS
- ✅ **Content Security Policy** - Chính sách bảo mật
- ✅ **CORS Handling** - Xử lý cross-origin

## 📊 Performance

- ✅ **CDN Ready** - Tối ưu cho CDN
- ✅ **Cache Optimization** - Cache hiệu quả
- ✅ **Image Optimization** - Tối ưu hình ảnh
- ✅ **Code Splitting** - Chia nhỏ code

## 🌐 Multi-language

- 🇻🇳 **Tiếng Việt** (chính)
- 🇺🇸 **English** (support)
- 🌏 **Dễ dàng thêm** ngôn ngữ khác

## 📚 Documentation

- [📖 Project Structure](docs/PROJECT-STRUCTURE.md)
- [🤖 AI Features](docs/AI-FEATURES.md)
- [🚀 Deployment Guide](docs/deploy-guide.md)
- [✅ Deployment Ready](docs/DEPLOYMENT-READY.md)

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

## 📞 Support

- 📧 **Email**: support@eduplatform.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/eduplatform-lms/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/eduplatform-lms/discussions)

## 🎉 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Vercel](https://vercel.com) - Deployment platform
- [Gemini AI](https://ai.google.dev) - AI integration
- [PWA](https://web.dev/progressive-web-apps) - Progressive Web App

---

**Made with ❤️ by EduPlatform Team**

*Modern Learning Management System for the Future*
