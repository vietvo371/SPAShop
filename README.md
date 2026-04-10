# Tâm An Energy Healing - Clone Project

## Giới thiệu

Đây là dự án clone website [chanan.vn](https://www.chanan.vn) - Trung tâm chăm sóc sức khỏe bằng công nghệ hồng ngoại xa (FIR) tại Quảng Ngãi.

## Công nghệ sử dụng

| Layer | Công nghệ |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Database | PostgreSQL |
| ORM | Prisma |
| Validation | Zod |
| Auth | JWT |
| Email | Nodemailer (SMTP) |
| Image Upload | Local / Cloudinary |
| Styling | CSS Modules |

## Cấu trúc dự án

```
├── app/
│   ├── (admin)/          # Admin Dashboard
│   │   └── admin/
│   │       ├── page.js           # Dashboard
│   │       ├── products/        # Quản lý sản phẩm
│   │       ├── services/         # Quản lý dịch vụ
│   │       ├── articles/         # Quản lý bài viết
│   │       ├── appointments/     # Quản lý lịch hẹn
│   │       └── contact/          # Quản lý liên hệ
│   ├── actions/           # Server Actions
│   ├── api/               # REST API Routes
│   │   ├── products/
│   │   ├── services/
│   │   ├── articles/
│   │   ├── contact/
│   │   ├── appointments/
│   │   ├── auth/
│   │   ├── categories/
│   │   └── upload/
│   ├── components/        # React Components
│   ├── lib/              # Utilities
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── email.ts      # Email Service
│   │   └── validations.ts
│   └── ...
├── prisma/
│   ├── schema.prisma     # Database Schema
│   └── seed.ts           # Seed Data
└── docs/
    └── API.md            # API Documentation
```

## Cài đặt

### 1. Yêu cầu

- Node.js 18+
- PostgreSQL 14+
- yarn

### 2. Cài đặt dependencies

```bash
yarn install
```

### 3. Thiết lập Database

#### Option A: PostgreSQL cục bộ

```bash
# Tạo database
createdb chanan_db
```

#### Option B: Supabase (Cloud - Khuyến nghị)

1. Đăng ký tại [supabase.com](https://supabase.com)
2. Tạo project mới
3. Copy connection string vào `.env`

### 4. Cấu hình Environment Variables

```bash
cp .env.example .env
```

Cập nhật các giá trị trong `.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key cho JWT
- `NEXT_PUBLIC_APP_URL` - URL website

### 5. Chạy Migration

```bash
yarn db:push
# Hoặc
yarn db:migrate
```

### 6. Seed Database

```bash
yarn db:seed
```

### 7. Chạy Development Server

```bash
yarn dev
```

Truy cập:
- Website: http://localhost:3000
- Admin: http://localhost:3000/admin
- API: http://localhost:3000/api

## Cài đặt Email

### Gmail SMTP

1. Bật 2FA trên tài khoản Google
2. Truy cập: https://myaccount.google.com/apppasswords
3. Tạo App Password (chọn App: Mail, Device: Other)
4. Copy App Password (16 ký tự) vào `.env`

```bash
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="xxxx xxxx xxxx xxxx"
SMTP_FROM="Tâm An <noreply@chanan.vn>"
```

### SendGrid

1. Đăng ký tại [sendgrid.com](https://sendgrid.com)
2. Tạo API Key trong Settings > API Keys
3. Cấu hình `.env`:

```bash
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="SG.your-api-key"
SMTP_FROM="Tâm An <noreply@chanan.vn>"
```

### Resend (Khuyến nghị - Free 3000 emails/tháng)

1. Đăng ký tại [resend.com](https://resend.com)
2. Tạo API Key
3. Cài đặt package:

```bash
yarn add resend
```

4. Thêm vào `.env`:
```bash
RESEND_API_KEY="re_xxxxxx"
```

5. Cập nhật `app/lib/email.ts` để sử dụng Resend

## Thông tin đăng nhập

```
Admin: admin@chanan.vn / admin123
Staff: staff@chanan.vn / staff123
```

## Scripts

```bash
yarn dev           # Development server
yarn build         # Production build
yarn start         # Production server
yarn lint          # ESLint

# Database
yarn db:generate   # Generate Prisma client
yarn db:migrate    # Chạy migrations
yarn db:push       # Push schema to database
yarn db:studio     # Prisma Studio (GUI)
yarn db:seed       # Seed database
yarn db:reset      # Reset database (cẩn thận!)
```

## API Endpoints

Xem chi tiết trong [docs/API.md](docs/API.md)

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | Danh sách sản phẩm |
| GET | /api/products/[id] | Chi tiết sản phẩm |
| GET | /api/services | Danh sách dịch vụ |
| GET | /api/articles | Danh sách bài viết |
| POST | /api/contact | Gửi tin nhắn |
| POST | /api/appointments | Đặt lịch hẹn |

### Authenticated Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Đăng nhập |
| POST | /api/auth/logout | Đăng xuất |
| POST | /api/products | Tạo sản phẩm |
| PUT | /api/products/[id] | Cập nhật sản phẩm |
| DELETE | /api/products/[id] | Xóa sản phẩm |
| POST | /api/upload | Upload hình ảnh |
| GET | /api/contact | Danh sách tin nhắn |
| GET | /api/appointments | Danh sách lịch hẹn |

## Email Notifications

Hệ thống tự động gửi email trong các trường hợp:

| Trigger | Người nhận | Nội dung |
|---------|-------------|----------|
| Gửi liên hệ | Admin | Thông tin khách hàng liên hệ |
| Đặt lịch hẹn | Admin | Thông tin lịch hẹn mới |

## Deployment

### Vercel (Khuyến nghị)

1. Push code lên GitHub
2. Import project trên [vercel.com](https://vercel.com)
3. Thêm Environment Variables
4. Deploy

### Railway

1. Tạo project tại [railway.app](https://railway.app)
2. Kết nối GitHub repository
3. Thêm PostgreSQL plugin
4. Set environment variables
5. Deploy

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build
CMD ["yarn", "start"]
```

## Troubleshooting

### Lỗi Prisma Client

```bash
yarn db:generate
```

### Lỗi kết nối Database

Kiểm tra `DATABASE_URL` trong `.env`

### Lỗi Email không gửi được

1. Kiểm tra SMTP credentials
2. Kiểm tra `SMTP_FROM` email domain verification
3. Với Gmail, đảm bảo đã tạo App Password

### Lỗi Port đã sử dụng

```bash
PORT=3001 yarn dev
```

## License

Dự án này chỉ用于 nghiên cứu và học tập.
