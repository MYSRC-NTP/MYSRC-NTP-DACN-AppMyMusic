# DoAnMusicApp - Ứng Dụng Nghe Nhạc

## Tổng Quan Dự Án

**DoAnMusicApp** là một ứng dụng web nghe nhạc hiện đại được xây dựng với kiến trúc full-stack, cho phép người dùng nghe nhạc, tạo playlist, quản lý nghệ sĩ và album. Ứng dụng được thiết kế với giao diện thân thiện và trải nghiệm người dùng mượt mà.

### Tính Năng Chính

- 🎵 **Nghe nhạc**: Phát nhạc với điều khiển đầy đủ (play, pause, next, previous)
- 🎧 **Quản lý Playlist**: Tạo, chỉnh sửa và quản lý playlist cá nhân
- 👨‍🎤 **Nghệ sĩ**: Xem thông tin chi tiết về nghệ sĩ và các bài hát của họ
- 💿 **Album**: Duyệt và nghe nhạc theo album
- 🔍 **Tìm kiếm**: Tìm kiếm bài hát, nghệ sĩ, album
- 👤 **Xác thực người dùng**: Đăng nhập/đăng ký với Clerk
- 🛡️ **Admin Panel**: Quản lý nội dung (bài hát, album, nghệ sĩ) cho admin
- 📊 **Thống kê**: Dashboard thống kê cho admin

### Công Nghệ Sử Dụng

#### Backend

- **Node.js** với **Express.js**
- **PostgreSQL** database với **Prisma ORM**
- **Clerk** cho xác thực người dùng
- **Cloudinary** cho lưu trữ file media
- **CORS** cho cross-origin requests

#### Frontend

- **React 18** với **Vite**
- **React Router** cho routing
- **Tailwind CSS** cho styling
- **Radix UI** cho components
- **Zustand** cho state management
- **Axios** cho API calls
- **React Hot Toast** cho notifications

## Cấu Trúc Dự Án

```
DoAnMusicApp/
├── backend/                 # Backend API server
│   ├── src/
│   │   ├── controller/      # API controllers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   └── lib/            # Utilities và config
│   ├── prisma/             # Database schema và migrations
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── layout/         # Layout components
│   │   ├── stores/         # Zustand stores
│   │   └── lib/           # Utilities
│   └── package.json
└── package.json           # Root package.json
```

## Hướng Dẫn Cài Đặt và Chạy Dự Án

### Yêu Cầu Hệ Thống

- **Node.js** (phiên bản 16 trở lên)
- **PostgreSQL** database
- **Git**

### Bước 1: Clone Repository

```bash
git clone <repository-url>
cd DoAnMusicApp
```

### Bước 2: Cài Đặt Dependencies

```bash
# Cài đặt dependencies cho toàn bộ project
npm install

# Hoặc cài đặt riêng cho từng phần
npm install --prefix backend
npm install --prefix frontend
```

### Bước 3: Cấu Hình Database

1. **Tạo PostgreSQL database**:

   ```sql
   CREATE DATABASE musicapp;
   ```

2. **Tạo file `.env` trong thư mục `backend/`**:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/musicapp"

   # Clerk Authentication
   CLERK_SECRET_KEY=your_clerk_secret_key
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

   # Cloudinary (cho upload file)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Server
   PORT=4000
   NODE_ENV=development

   #tk  admin
   ADMIN_EMAIL= your_admin_email
   ```

3. **Chạy database migrations**:
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

### Bước 4: Cấu Hình Frontend

1. **Tạo file `.env` trong thư mục `frontend/`**:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_API_URL=http://localhost:4000
   ```

### Bước 5: Chạy Ứng Dụng

#### Chạy Development Mode

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

#### Chạy Production Mode

```bash
# Build frontend
npm run build

# Start production server
npm start
```

### Bước 6: Truy Cập Ứng Dụng

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **Admin Panel**: http://localhost:5173/admin

## Cấu Hình Clerk Authentication

1. Tạo tài khoản tại [Clerk](https://clerk.com)
2. Tạo một ứng dụng mới
3. Lấy `Publishable Key` và `Secret Key`
4. Cấu hình trong file `.env` như hướng dẫn trên

## Cấu Hình Cloudinary

1. Tạo tài khoản tại [Cloudinary](https://cloudinary.com)
2. Lấy thông tin từ Dashboard:
   - Cloud Name
   - API Key
   - API Secret
3. Cấu hình trong file `.env` backend

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Đăng ký người dùng
- `POST /api/auth/signin` - Đăng nhập

### Songs

- `GET /api/songs` - Lấy danh sách bài hát
- `GET /api/songs/:id` - Lấy thông tin bài hát
- `POST /api/songs` - Tạo bài hát mới (Admin)

### Albums

- `GET /api/albums` - Lấy danh sách album
- `GET /api/albums/:id` - Lấy thông tin album
- `POST /api/albums` - Tạo album mới (Admin)

### Artists

- `GET /api/artists` - Lấy danh sách nghệ sĩ
- `GET /api/artists/:id` - Lấy thông tin nghệ sĩ
- `POST /api/artists` - Tạo nghệ sĩ mới (Admin)

### Playlists

- `GET /api/playlists` - Lấy playlist của user
- `POST /api/playlists` - Tạo playlist mới
- `PUT /api/playlists/:id` - Cập nhật playlist
- `DELETE /api/playlists/:id` - Xóa playlist

### Admin

- `GET /api/admin/stats` - Thống kê tổng quan
- `GET /api/admin/songs` - Quản lý bài hát
- `GET /api/admin/albums` - Quản lý album
- `GET /api/admin/artists` - Quản lý nghệ sĩ

## Scripts Có Sẵn

### Root Level

```bash
npm run build    # Build toàn bộ project
npm start        # Start production server
```

### Backend

```bash
npm run dev      # Chạy development server
npm start        # Chạy production server
npm run seed:songs    # Seed dữ liệu bài hát mẫu
npm run seed:albums   # Seed dữ liệu album mẫu
```

### Frontend

```bash
npm run dev      # Chạy development server
npm run build    # Build cho production
npm run preview  # Preview build
npm run lint     # Chạy ESLint
```

## Troubleshooting

### Lỗi Database Connection

- Kiểm tra PostgreSQL đã chạy chưa
- Kiểm tra thông tin kết nối trong `.env`
- Chạy `npx prisma migrate dev` để tạo bảng

### Lỗi CORS

- Kiểm tra cấu hình CORS trong `backend/src/index.js`
- Đảm bảo frontend chạy trên port 5173

### Lỗi Authentication

- Kiểm tra Clerk keys trong `.env`
- Đảm bảo domain được cấu hình trong Clerk dashboard
