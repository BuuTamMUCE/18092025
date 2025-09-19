# EduPlatform - Learning Management System

## Tổng quan
EduPlatform là một hệ thống quản lý học tập (LMS) hiện đại với giao diện đẹp mắt và đầy đủ tính năng. Hệ thống được xây dựng với HTML, CSS (Tailwind), và JavaScript thuần túy.

## 🚀 **Tính năng chính:**
- ✅ **Trang chủ điều hướng** với giao diện đẹp mắt
- ✅ **Hệ thống đăng nhập Admin** với validation đầy đủ
- ✅ **Đăng ký/Đăng nhập sinh viên** với kiểm tra dữ liệu
- ✅ **Course Player** với video player tương tác
- ✅ **Quiz System** với timer và chấm điểm tự động
- ✅ **Dark Mode** toàn bộ ứng dụng
- ✅ **Responsive Design** cho mọi thiết bị
- ✅ **SEO Optimization** với meta tags đầy đủ
- ✅ **Error Pages** (404, 500) chuyên nghiệp
- ✅ **Performance Optimization** với caching và compression

## 🤖 **Tính năng AI thông minh:**
- ✅ **AI Chatbot** với Gemini API - trò chuyện thông minh
- ✅ **AI Course Recommendations** - gợi ý khóa học cá nhân hóa
- ✅ **AI Quiz Generator** - tạo câu hỏi tự động
- ✅ **AI Study Tips** - lời khuyên học tập thông minh
- ✅ **AI Content Summarizer** - tóm tắt nội dung tự động
- ✅ **AI Translation** - dịch thuật đa ngôn ngữ
- ✅ **AI Analytics** - phân tích tiến độ học tập
- ✅ **AI Dashboard** - quản lý và test AI features

## Tính năng đã được bổ sung

### 🏠 Trang chủ (index.html)
- **Giao diện điều hướng chính**: Trang chủ với các card điều hướng đến các màn hình khác nhau
- **Dark mode toggle**: Chuyển đổi giữa chế độ sáng và tối
- **Responsive design**: Tương thích với mọi kích thước màn hình
- **Loading animations**: Hiệu ứng loading khi chuyển trang

### 🔐 Xác thực người dùng

#### Admin Login (admin_login_screen_1/code.html)
- **Form validation**: Kiểm tra dữ liệu đầu vào real-time
- **Session management**: Quản lý phiên đăng nhập với localStorage
- **Error handling**: Hiển thị lỗi chi tiết cho từng trường
- **Loading states**: Trạng thái loading khi xử lý đăng nhập
- **Auto-redirect**: Tự động chuyển hướng sau khi đăng nhập thành công
- **Credentials**: 
  - admin/admin123
  - superadmin/superadmin123
  - manager/manager123

#### Student Authentication (student_authentication_screens_1/code.html)
- **Đăng ký tài khoản**: Form đăng ký với validation đầy đủ
- **Password strength**: Kiểm tra độ mạnh mật khẩu
- **Email validation**: Kiểm tra định dạng email
- **Duplicate check**: Kiểm tra email đã tồn tại
- **Social login placeholders**: Nút đăng nhập mạng xã hội (UI only)

### 🎓 Course Player Interface (course_player_interface_1/code.html)
- **Interactive video player**: Trình phát video tương tác
- **Progress tracking**: Theo dõi tiến độ học tập
- **Lesson navigation**: Điều hướng giữa các bài học
- **Completion system**: Hệ thống đánh dấu hoàn thành bài học
- **Responsive sidebar**: Thanh bên có thể thu gọn trên mobile
- **Course data management**: Quản lý dữ liệu khóa học với localStorage

### 📝 Quiz Interface (quiz_interface_1/code.html)
- **Dynamic quiz system**: Hệ thống quiz động với nhiều câu hỏi
- **Timer functionality**: Đếm ngược thời gian làm bài
- **Real-time validation**: Kiểm tra câu trả lời real-time
- **Results display**: Hiển thị kết quả chi tiết với giải thích
- **Question review**: Xem lại từng câu hỏi và đáp án
- **Retake functionality**: Làm lại quiz
- **Score calculation**: Tính điểm tự động

### 🎨 UI/UX Features
- **Dark mode support**: Hỗ trợ chế độ tối toàn bộ ứng dụng
- **Consistent theming**: Chủ đề nhất quán với Tailwind CSS
- **Smooth animations**: Hiệu ứng chuyển động mượt mà
- **Notification system**: Hệ thống thông báo toast
- **Loading indicators**: Chỉ báo loading cho các thao tác
- **Error states**: Trạng thái lỗi được xử lý đẹp mắt

### 🔧 Technical Features
- **LocalStorage integration**: Lưu trữ dữ liệu cục bộ
- **Session management**: Quản lý phiên người dùng
- **Form validation**: Validation form toàn diện
- **Event handling**: Xử lý sự kiện JavaScript
- **Responsive design**: Thiết kế responsive
- **Cross-browser compatibility**: Tương thích đa trình duyệt

## Cấu trúc thư mục
```
├── index.html                          # Trang chủ chính
├── admin_login_screen_1/
│   └── code.html                      # Đăng nhập admin với JavaScript
├── student_authentication_screens_1/
│   └── code.html                      # Đăng ký/đăng nhập sinh viên
├── course_player_interface_1/
│   └── code.html                      # Giao diện phát khóa học
├── quiz_interface_1/
│   └── code.html                      # Giao diện làm quiz
├── admin_dashboard_1/                 # Dashboard admin
├── course_management_screen_1/        # Quản lý khóa học
├── student_management_screen_1/       # Quản lý sinh viên
├── quiz_management_screen_1/          # Quản lý quiz
├── order_management_screen_1/         # Quản lý đơn hàng
└── my_dashboard_(student)_1/          # Dashboard sinh viên
```

## Cách sử dụng

### 1. Truy cập trang chủ
Mở file `index.html` trong trình duyệt để xem trang chủ với các tùy chọn điều hướng.

### 2. Đăng nhập Admin
- Truy cập Admin Login từ trang chủ
- Sử dụng một trong các tài khoản:
  - Username: `admin`, Password: `admin123`
  - Username: `superadmin`, Password: `superadmin123`
  - Username: `manager`, Password: `manager123`

### 3. Đăng ký sinh viên
- Truy cập Student Authentication từ trang chủ
- Điền form đăng ký với thông tin hợp lệ
- Hệ thống sẽ tự động tạo tài khoản và chuyển hướng

### 4. Sử dụng Course Player
- Truy cập Course Player Interface
- Xem video bài học
- Đánh dấu hoàn thành bài học
- Theo dõi tiến độ học tập

### 5. Làm Quiz
- Truy cập Quiz Interface
- Trả lời các câu hỏi trong thời gian quy định
- Xem kết quả và giải thích chi tiết

## 🌟 Tính năng mới nhất

### 📹 Live Streaming & Video Conferencing (WebRTC)
- **Lớp học trực tuyến**: Video call chất lượng cao với nhiều người tham gia
- **Chia sẻ màn hình**: Chia sẻ màn hình để giảng dạy hiệu quả
- **Ghi lại buổi học**: Tự động ghi lại và lưu trữ các buổi học
- **Phòng thảo luận**: Chia nhóm thảo luận trong lớp học
- **Bảng trắng tương tác**: Vẽ và viết cùng nhau trong thời gian thực

### 📱 Progressive Web App (PWA)
- **Học offline**: Tiếp tục học ngay cả khi không có internet
- **Thông báo đẩy**: Nhận thông báo về bài học mới và sự kiện
- **Cài đặt như app**: Cài đặt webapp như ứng dụng native
- **Đồng bộ nền**: Tự động đồng bộ dữ liệu khi có mạng
- **Trải nghiệm app-like**: Giao diện và trải nghiệm như ứng dụng di động

### 🤝 Real-time Collaboration (WebSocket)
- **Chỉnh sửa tài liệu cùng lúc**: Nhiều người có thể chỉnh sửa cùng một tài liệu
- **Chat trực tiếp**: Trò chuyện trong thời gian thực
- **Bình chọn trực tiếp**: Tạo và tham gia các cuộc bình chọn
- **Ghi chú chung**: Chia sẻ ghi chú và ý tưởng
- **Quiz đồng thời**: Làm bài quiz cùng lúc với các học viên khác

### 🥽 AR/VR Learning Lab (WebXR)
- **Phòng thí nghiệm ảo**: Thực hiện thí nghiệm trong môi trường 3D
- **Mô hình 3D tương tác**: Khám phá các mô hình 3D chi tiết
- **Tham quan ảo**: Đi tham quan các địa điểm lịch sử và khoa học
- **Học tập trực quan**: Học qua các trải nghiệm AR/VR
- **Mô phỏng thực tế**: Mô phỏng các tình huống thực tế

### ⛓️ Blockchain Certificates
- **Chứng chỉ NFT**: Chứng chỉ không thể giả mạo trên blockchain
- **Hợp đồng thông minh**: Tự động xác minh và cấp chứng chỉ
- **Thanh toán crypto**: Thanh toán học phí bằng cryptocurrency
- **Lưu trữ phi tập trung**: Dữ liệu được lưu trữ an toàn và bảo mật
- **Danh tính số**: Quản lý danh tính học viên trên blockchain

### 🧠 Machine Learning & AI Analytics
- **Nhận diện khuôn mặt**: Điểm danh tự động bằng AI
- **Phát hiện cảm xúc**: Theo dõi tâm trạng và sự tập trung của học viên
- **Gợi ý nội dung**: Đề xuất nội dung học tập phù hợp
- **Dự đoán kết quả**: Dự đoán khả năng thành công của học viên
- **Phân tích mẫu học tập**: Hiểu rõ cách học của từng học viên

### 🎤 Voice AI Assistant
- **Điều khiển bằng giọng nói**: Điều khiển webapp bằng lệnh thoại
- **Chuyển giọng nói thành văn bản**: Ghi chú bằng giọng nói
- **Đọc nội dung bằng giọng nói**: Học bằng cách nghe
- **Ghi chú thoại**: Ghi lại ý tưởng bằng giọng nói
- **Học ngôn ngữ**: Luyện phát âm và giao tiếp

### 📊 Advanced Analytics
- **Bảng điều khiển tương tác**: Xem dữ liệu học tập trực quan
- **Phân tích lộ trình học**: Theo dõi tiến độ học tập
- **Bản đồ nhiệt hiệu suất**: Xem điểm mạnh và điểm yếu
- **Báo cáo tùy chỉnh**: Tạo báo cáo theo nhu cầu
- **Dự đoán xu hướng**: Dự đoán xu hướng học tập trong tương lai

## Tính năng nâng cao

### Dark Mode
- Tất cả các trang đều hỗ trợ dark mode
- Tùy chọn được lưu trong localStorage
- Chuyển đổi mượt mà giữa các chế độ

### Responsive Design
- Tương thích với desktop, tablet, và mobile
- Sidebar có thể thu gọn trên mobile
- Layout tự động điều chỉnh theo kích thước màn hình

### Data Persistence
- Dữ liệu được lưu trong localStorage
- Tiến độ học tập được lưu trữ
- Session được duy trì giữa các trang

## Công nghệ sử dụng

### Frontend Core
- **HTML5**: Cấu trúc trang web
- **CSS3**: Styling và layout
- **Tailwind CSS**: Framework CSS utility-first
- **JavaScript (ES6+)**: Logic và tương tác
- **LocalStorage**: Lưu trữ dữ liệu local

### AI & Machine Learning
- **Google Gemini AI**: Trí tuệ nhân tạo chính
- **TensorFlow.js**: Machine learning trong browser
- **Web Speech API**: Nhận diện và tổng hợp giọng nói
- **BlazeFace**: Nhận diện khuôn mặt
- **Chart.js**: Trực quan hóa dữ liệu

### Real-time & Communication
- **WebRTC**: Video call và live streaming
- **WebSocket**: Giao tiếp real-time
- **WebXR**: Thực tế ảo và tăng cường
- **MediaRecorder API**: Ghi âm và video

### Blockchain & Web3
- **Web3.js**: Tương tác với blockchain
- **Ethereum**: Smart contracts
- **IPFS**: Lưu trữ phi tập trung
- **MetaMask**: Ví cryptocurrency

### Progressive Web App
- **Service Worker**: Offline functionality
- **Web App Manifest**: Cài đặt app
- **Push API**: Thông báo đẩy
- **Background Sync**: Đồng bộ nền

### Development & Deployment
- **Git**: Version control
- **Node.js**: Build tools
- **Vercel/Netlify**: Hosting
- **HTTPS**: Bảo mật

## Tương lai phát triển
- [ ] Tích hợp backend API
- [ ] Hệ thống thanh toán
- [ ] Chat và messaging
- [ ] Video streaming thực tế
- [ ] Mobile app
- [ ] Analytics và reporting
- [ ] Multi-language support

## Lưu ý
- Đây là phiên bản demo với dữ liệu mẫu
- Tất cả dữ liệu được lưu trong localStorage
- Cần tích hợp backend để sử dụng production
- Mật khẩu chưa được mã hóa (chỉ dành demo)

## Liên hệ
Nếu có câu hỏi hoặc góp ý, vui lòng tạo issue hoặc liên hệ qua email.
