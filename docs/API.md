# Tâm An Energy Healing - API Documentation

## Overview

API Base URL: `https://www.chanan.vn/api`

### Authentication

Some endpoints require authentication. Use JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

---

## Endpoints

### Authentication

#### POST /api/auth/login
**Description:** Đăng nhập vào hệ thống admin

**Request Body:**
```json
{
  "email": "admin@chanan.vn",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx123...",
      "email": "admin@chanan.vn",
      "name": "Admin",
      "role": "ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Đăng nhập thành công"
}
```

#### POST /api/auth/logout
**Description:** Đăng xuất

**Response:**
```json
{
  "success": true,
  "message": "Đăng xuất thành công"
}
```

---

### Products

#### GET /api/products
**Description:** Lấy danh sách sản phẩm (public)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Trang hiện tại (default: 1) |
| limit | number | Số items mỗi trang (default: 20) |
| search | string | Tìm kiếm theo tên/mô tả |
| categoryId | string | Lọc theo danh mục |
| featured | boolean | Chỉ sản phẩm nổi bật |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx123...",
      "name": "Máy Nén Nhiệt FIR",
      "slug": "may-nen-nhiet-anh-sang-sinh-hoc-hong-ngoai-xa",
      "price": "7.800.000₫",
      "description": "...",
      "imageUrl": "https://...",
      "category": { "id": "...", "name": "Máy hồng ngoại xa" }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 20,
    "totalPages": 1
  }
}
```

#### GET /api/products/[id]
**Description:** Lấy chi tiết sản phẩm

#### POST /api/products
**Description:** Tạo sản phẩm mới (admin)
**Auth:** Required

**Request Body:**
```json
{
  "name": "Tên sản phẩm",
  "price": "1.000.000₫",
  "description": "Mô tả sản phẩm",
  "imageUrl": "https://...",
  "categoryId": "clx123...",
  "isFeatured": false
}
```

#### PUT /api/products/[id]
**Description:** Cập nhật sản phẩm (admin)
**Auth:** Required

#### DELETE /api/products/[id]
**Description:** Xóa sản phẩm (soft delete) (admin)
**Auth:** Required

---

### Services

#### GET /api/services
**Description:** Lấy danh sách dịch vụ (public)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx123...",
      "name": "Soi Mạch Máu",
      "slug": "soi-mach-mau",
      "description": "Quan sát trực quan...",
      "process": "Quan sát qua kính hiển vi",
      "duration": "15 - 20 phút / lần",
      "price": "Đang cập nhật",
      "icon": "🔬"
    }
  ]
}
```

---

### Articles

#### GET /api/articles
**Description:** Lấy danh sách bài viết (public)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Trang hiện tại |
| limit | number | Số items mỗi trang |
| category | string | Lọc theo danh mục |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx123...",
      "title": "Hồng ngoại xa là gì?",
      "slug": "hong-ngoai-xa-fir-la-gi",
      "excerpt": "Tìm hiểu về công nghệ FIR...",
      "imageUrl": "/images/...",
      "category": "Kiến thức FIR",
      "publishedAt": "2026-03-25T00:00:00.000Z",
      "author": { "name": "Admin" }
    }
  ],
  "pagination": { ... }
}
```

---

### Contact Messages

#### GET /api/contact
**Description:** Lấy danh sách tin nhắn (admin)
**Auth:** Required

#### POST /api/contact
**Description:** Gửi tin nhắn liên hệ (public)

**Request Body:**
```json
{
  "name": "Nguyễn Văn A",
  "phone": "0356308211",
  "email": "email@example.com",
  "message": "Tôi muốn đặt lịch khám..."
}
```

**Response:**
```json
{
  "success": true,
  "data": { "id": "clx123..." },
  "message": "Gửi tin nhắn thành công. Chúng tôi sẽ liên hệ bạn sớm nhất."
}
```

---

### Appointments

#### GET /api/appointments
**Description:** Lấy danh sách lịch hẹn (admin)
**Auth:** Required

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Trang hiện tại |
| status | string | PENDING, CONFIRMED, CANCELLED, COMPLETED |
| date | string | Lọc theo ngày (YYYY-MM-DD) |

#### POST /api/appointments
**Description:** Đặt lịch hẹn mới (public)

**Request Body:**
```json
{
  "customerName": "Nguyễn Văn A",
  "customerPhone": "0356308211",
  "customerEmail": "email@example.com",
  "serviceId": "clx123...",
  "appointmentDate": "2026-04-15",
  "appointmentTime": "09:30",
  "notes": "Tôi bị đau lưng"
}
```

**Response:**
```json
{
  "success": true,
  "data": { "id": "clx123..." },
  "message": "Đặt lịch hẹn thành công. Chúng tôi sẽ xác nhận qua điện thoại."
}
```

---

## Error Responses

```json
{
  "success": false,
  "error": "Mô tả lỗi"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

Hiện tại không có rate limiting. Vui lòng không spam API.

---

## Future Endpoints

- [ ] `GET /api/categories` - Danh sách danh mục
- [ ] `GET /api/sliders` - Banner/Slider trang chủ
- [ ] `GET /api/testimonials` - Đánh giá khách hàng
- [ ] `POST /api/upload` - Upload hình ảnh
- [ ] `POST /api/contact/[id]/reply` - Trả lời tin nhắn
- [ ] `PUT /api/appointments/[id]/status` - Cập nhật trạng thái lịch hẹn
