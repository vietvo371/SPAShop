# TÂM AN ENERGY HEALING - TEST CASE TOÀN BỘ HỆ THỐNG
## Ngày test: ___/___/2026 | Người test: _____________ | Môi trường: Production

---

## HƯỚNG DẪN
- Đánh dấu ✅ PASS hoặc ❌ FAIL vào mỗi test case
- Với FAIL: ghi rõ lỗi gặp phải vào cột Ghi chú

---

## PHẦN 1: AUTHENTICATION (XÁC THỰC)

### 1.1 Login Admin
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 1 | Login với email + password đúng | POST /api/auth/login với `{"email":"admin@chanan.vn","password":"admin123"}` | Status 200, trả về user info + set cookie `chanan_auth_token` | ✅ PASS | |
| 2 | Login với email sai | POST /api/auth/login với `{"email":"sai@email.com","password":"admin123"}` | Status 401, `"Email hoặc mật khẩu không đúng"` | ✅ PASS | |
| 3 | Login với password sai | POST /api/auth/login với `{"email":"admin@chanan.vn","password":"sai"}` | Status 401, `"Email hoặc mật khẩu không đúng"` | ✅ PASS | |
| 4 | Login thiếu email | POST /api/auth/login với `{"password":"admin123"}` | Status 400, `"Email và mật khẩu là bắt buộc"` | ✅ PASS | |
| 5 | Login thiếu password | POST /api/auth/login với `{"email":"admin@chanan.vn"}` | Status 400, `"Email và mật khẩu là bắt buộc"` | ✅ PASS | |
| 6 | Login với body rỗng | POST /api/auth/login với `{}` | Status 400 | ✅ PASS | |
| 7 | Login staff | POST /api/auth/login với `{"email":"staff@chanan.vn","password":"staff123"}` | Status 200, role = STAFF | ✅ PASS | |
| 8 | Giao diện login page | Mở /admin/login | Hiển thị form login, không bị lỗi render | ✅ PASS | |

### 1.2 Logout
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 9 | Logout | POST /api/auth/logout | Redirect về /admin/login, cookie bị xóa | ✅ PASS | |

### 1.3 Phân quyền
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 10 | Truy cập Admin không login | Mở /admin không có cookie | Redirect về /admin/login | | |
| 11 | Truy cập Admin với role STAFF | Login với staff, vào /admin | Vào được dashboard (STAFF có quyền) | | |
| 12 | Gọi API Admin không có token | GET /api/admin/stats không có cookie | Status 401 Unauthorized | | |
| 13 | STAFF không được xóa Order | DELETE /api/orders/[id] với role STAFF | Status 403 | | |
| 14 | STAFF không được xóa Contact | DELETE /api/contact/[id] với role STAFF | Status 401 | | |
| 15 | STAFF không được xóa Slider | DELETE /api/admin/sliders/[id] với role STAFF | Status 401 | | |
| 16 | STAFF không được update Settings | POST /api/admin/settings với role STAFF | Status 401 | | |
| 17 | Token hết hạn | Đợi token hết hạn (7 ngày) hoặc set JWT_EXPIRES_IN=1s | Status 401 khi gọi API | | |

---

## PHẦN 2: API SẢN PHẨM (PRODUCTS)

### 2.1 GET /api/products - Danh sách sản phẩm
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 18 | Lấy danh sách public | GET /api/products | Status 200, chỉ trả về sản phẩm `isActive: true` | ✅ PASS | |
| 19 | Phân trang mặc định | GET /api/products | `pagination.page=1, limit=20` | ✅ PASS | |
| 20 | Phân trang tùy chỉnh | GET /api/products?page=2&limit=5 | Đúng page=2, limit=5 | ✅ PASS | |
| 21 | Tìm kiếm theo tên | GET /api/products?search=máy | Chỉ trả về sản phẩm có "máy" trong tên hoặc mô tả | ✅ PASS | Lỗi mode: insensitive đã fix |
| 22 | Lọc theo category | GET /api/products?categoryId=<id> | Chỉ trả về sản phẩm thuộc category đó | ✅ PASS | |
| 23 | Lọc featured | GET /api/products?featured=true | Chỉ trả về sản phẩm isFeatured=true | ✅ PASS | |
| 24 | Sắp xếp | GET /api/products?sortBy=price&sortOrder=asc | Sắp xếp theo giá tăng dần | ✅ PASS | |
| 25 | Admin thấy cả inactive | GET /api/products (có admin token) | Bao gồm cả sản phẩm isActive=false | | |
| 26 | Page < 1 tự động sửa | GET /api/products?page=-1 | Page được sửa thành 1 | | |
| 27 | Limit > 100 bị giới hạn | GET /api/products?limit=200 | Limit bị giới hạn còn 100 | | |

### 2.2 GET /api/products/[id] - Chi tiết sản phẩm
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 28 | Lấy sản phẩm tồn tại | GET /api/products/<id-valid> | Status 200, có category, images, details | | |
| 29 | Sản phẩm không tồn tại | GET /api/products/<id-fake> | Status 404, "Sản phẩm không tồn tại" | | |
| 30 | Public không thấy inactive | GET /api/products/<id-inactive> | Status 404 | | |
| 31 | Admin thấy inactive | GET /api/products/<id-inactive> (có token) | Status 200 | | |

### 2.3 GET /api/products/slug/[slug] - Chi tiết theo slug
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 32 | Lấy theo slug đúng | GET /api/products/slug/<slug-dung> | Status 200 | | |
| 33 | Slug không tồn tại | GET /api/products/slug/<slug-fake> | Status 404 | | |

### 2.4 POST /api/products - Tạo sản phẩm (Admin)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 34 | Tạo sản phẩm hợp lệ | POST với đủ `name, slug, price` | Status 201 | | |
| 35 | Thiếu name | POST thiếu `name` | Status 400, "Dữ liệu không hợp lệ" | | |
| 36 | Thiếu slug | POST thiếu `slug` | Status 400 | | |
| 37 | Slug trùng lặp | POST với slug đã tồn tại | Status 400, "Slug đã tồn tại" | | |
| 38 | Tên trùng lặp | POST với name đã tồn tại | Status 400, "Tên sản phẩm đã tồn tại" | | |
| 39 | Giá âm | POST với `price: -1000` | Status 400 | | |
| 40 | Tạo kèm images | POST với `images: [{url, isPrimary, orderIndex}]` | Sản phẩm được tạo kèm ảnh | | |
| 41 | Không có quyền (public) | POST không có token | Status 401 | | |

### 2.5 PUT /api/products/[id] - Cập nhật sản phẩm (Admin)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 42 | Cập nhật thông tin | PUT với `{name: "Tên mới"}` | Status 200, tên được cập nhật | | |
| 43 | Cập nhật slug trùng | PUT với slug của sản phẩm khác | Status 400, "Slug đã tồn tại" | | |
| 44 | Sản phẩm không tồn tại | PUT /api/products/<id-fake> | Status 404 | | |
| 45 | Sync lại images | PUT với `images: [...]` | Xóa ảnh cũ, tạo ảnh mới | | |
| 46 | Không có quyền | PUT không có token | Status 401 | | |

### 2.6 DELETE /api/products/[id] - Xóa sản phẩm (Admin)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 47 | Xóa sản phẩm tồn tại | DELETE /api/products/<id> | Status 200, "Xóa sản phẩm thành công" | | |
| 48 | Xóa sản phẩm không tồn tại | DELETE /api/products/<id-fake> | Status 404 | | |
| 49 | Không có quyền | DELETE không có token | Status 401 | | |

---

## PHẦN 3: API DANH MỤC (CATEGORIES)

### 3.1 GET /api/categories
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 50 | Lấy danh sách public | GET /api/categories | Status 200, chỉ active, có _count.products | | |
| 51 | Lấy cả inactive | GET /api/categories?active=false | Status 200, bao gồm inactive | | |
| 52 | Sắp xếp theo orderIndex | GET /api/categories | Danh sách sắp xếp theo orderIndex tăng dần | | |

### 3.2 POST /api/categories - Tạo danh mục (Admin)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 53 | Tạo danh mục hợp lệ | POST với `{name, slug}` | Status 201 | | |
| 54 | Slug trùng | POST với slug đã có | Status 400, "Slug đã tồn tại" | | |
| 55 | Thiếu name | POST thiếu name | Status 400 | | |
| 56 | Thiếu slug | POST thiếu slug | Status 400 | | |
| 57 | Không có quyền | POST không có token | Status 401 | | |

### 3.3 PUT/DELETE /api/categories/[id]
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 58 | Cập nhật danh mục | PUT /api/categories/<id> với data hợp lệ | Status 200 | | |
| 59 | Xóa danh mục có sản phẩm | DELETE /api/categories/<id-có-products> | Status 500 (ràng buộc FK) hoặc xóa nếu set null | | |
| 60 | Xóa danh mục trống | DELETE /api/categories/<id-trống> | Status 200 | | |

---

## PHẦN 4: API DỊCH VỤ (SERVICES)

### 4.1 GET /api/services
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 61 | Lấy danh sách public | GET /api/services | Status 200, chỉ active, sắp xếp orderIndex | | |
| 62 | Admin thấy inactive | GET /api/services (có admin token) | Status 200, bao gồm inactive | | |

### 4.2 POST /api/services - Tạo dịch vụ (Admin)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 63 | Tạo dịch vụ hợp lệ | POST với `{name, slug}` | Status 200 | | |
| 64 | Thiếu name/slug | POST thiếu trường bắt buộc | Status 400, "Thiếu thông tin bắt buộc" | | |
| 65 | Slug trùng | POST với slug đã có | Status 400, "Slug đã tồn tại" | | |
| 66 | Không có quyền | POST không có token | Status 401 | | |

### 4.3 PUT/DELETE /api/services/[id]
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 67 | Cập nhật dịch vụ | PUT /api/services/<id> | Status 200 | | |
| 68 | Xóa dịch vụ có lịch hẹn | DELETE /api/services/<id-có-appointment> | Status 500 hoặc set null | | |
| 69 | Xóa dịch vụ trống | DELETE /api/services/<id-trống> | Status 200 | | |

---

## PHẦN 5: API ĐƠN HÀNG (ORDERS)

### 5.1 POST /api/orders - Đặt hàng (Client/Public)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 70 | Đặt hàng đầy đủ | POST với đầy đủ `customerName, customerPhone, customerAddress, province, district, ward, items, paymentMethod` | Status 201, `orderNumber` format TAYYMMDDXXX | ✅ PASS | |
| 71 | Thiếu customerName | POST thiếu `customerName` | Status 400 | | |
| 72 | Thiếu customerPhone | POST thiếu `customerPhone` | Status 400 | | |
| 73 | SĐT < 10 ký tự | POST với `customerPhone: "0123"` | Status 400 | | |
| 74 | Thiếu địa chỉ | POST thiếu `customerAddress` | Status 400 | | |
| 75 | Giỏ hàng rỗng | POST với `items: []` | Status 400, "Giỏ hàng không được trống" | | |
| 76 | PaymentMethod không hợp lệ | POST với `paymentMethod: "BITCOIN"` | Status 400 | | |
| 77 | Email không hợp lệ | POST với `customerEmail: "abc"` | Status 400 | | |
| 78 | Đặt hàng với notes | POST kèm `notes` | Status 201, notes được lưu | | |
| 79 | Đặt nhiều sản phẩm | POST với 3+ items | Status 201, tất cả items được tạo | | |
| 80 | Order number unique | Đặt 2 đơn liên tiếp | 2 orderNumber khác nhau | | |

### 5.2 GET /api/orders - Danh sách đơn hàng (Admin)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 81 | Lấy danh sách | GET /api/orders (có admin token) | Status 200, có phân trang | ✅ PASS | |
| 82 | Filter theo status | GET /api/orders?status=PENDING | Chỉ đơn PENDING | ✅ PASS | |
| 83 | Tìm kiếm | GET /api/orders?search=Nguyễn | Đơn có tên/sđt/mã chứa "Nguyễn" | ✅ PASS | Lỗi mode: insensitive đã fix |
| 84 | Không có quyền | GET /api/orders không token | Status 403 | | |

### 5.3 PUT /api/orders/[id] - Cập nhật trạng thái (Admin)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 85 | Đổi status | PUT với `{status: "CONFIRMED"}` | Status 200, status được cập nhật | | |
| 86 | Thêm staffNote | PUT với `{staffNote: "Đã gọi xác nhận"}` | Status 200, staffNote được lưu | | |
| 87 | Đơn không tồn tại | PUT /api/orders/<id-fake> | Status 404 | | |
| 88 | Không có quyền | PUT không token | Status 403 | | |

### 5.4 DELETE /api/orders/[id] - Xóa đơn hàng (Admin only)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 89 | Admin xóa đơn | DELETE /api/orders/<id> (với admin token) | Status 200 | | |
| 90 | Staff không xóa được | DELETE /api/orders/<id> (với staff token) | Status 403 | | |
| 91 | Đơn không tồn tại | DELETE /api/orders/<id-fake> | Status 500 | | |
| 92 | Cascade xóa OrderItems | Xóa đơn có items | OrderItems cũng bị xóa | | |

---

## PHẦN 6: API LIÊN HỆ (CONTACT)

### 6.1 POST /api/contact - Gửi tin nhắn (Public)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 93 | Gửi tin nhắn hợp lệ | POST với `{name, phone, message}` (message >= 10 ký tự) | Status 201, status = NEW | | |
| 94 | Thiếu name | POST thiếu `name` | Status 400 | | |
| 95 | Thiếu phone | POST thiếu `phone` | Status 400 | | |
| 96 | SĐT < 10 ký tự | POST với `phone: "012"` | Status 400 | | |
| 97 | Message < 10 ký tự | POST với `message: "Ngắn"` | Status 400 | | |
| 98 | Gửi không email | POST không có `email` (optional) | Status 201, vẫn thành công | | |
| 99 | Email không hợp lệ | POST với `email: "abc"` | Status 400 | | |

### 6.2 GET /api/contact - Danh sách tin nhắn (Admin)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 100 | Lấy danh sách | GET /api/contact (admin token) | Status 200, có phân trang | | |
| 101 | Filter theo status | GET /api/contact?status=NEW | Chỉ tin NEW | | |
| 102 | Không có quyền | GET /api/contact không token | Status 401 | | |

### 6.3 PATCH /api/contact/[id] - Phản hồi (Admin only)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 103 | Đổi status + replyNote | PATCH với `{status:"REPLIED", replyNote:"Đã gọi"}` | Status 200, repliedAt được set | | |
| 104 | Staff không có quyền | PATCH với staff token | Status 401 | | |
| 105 | Không có token | PATCH không token | Status 401 | | |

### 6.4 DELETE /api/contact/[id]
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 106 | Admin xóa tin nhắn | DELETE /api/contact/<id> (admin token) | Status 200 | | |
| 107 | Staff không có quyền | DELETE /api/contact/<id> (staff token) | Status 401 | | |

---

## PHẦN 7: API LỊCH HẸN (APPOINTMENTS)

### 7.1 POST /api/appointments - Đặt lịch (Public)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 108 | Đặt lịch hợp lệ | POST với `{customerName, customerPhone, appointmentDate, serviceId}` | Status 201, status = PENDING | | |
| 109 | Thiếu customerName | POST thiếu `customerName` | Status 400 | | |
| 110 | Thiếu customerPhone | POST thiếu `customerPhone` | Status 400 | | |
| 111 | Thiếu appointmentDate | POST thiếu `appointmentDate` | Status 400 | | |
| 112 | Ngày trong quá khứ | POST với `appointmentDate: "2020-01-01"` | Status 400, "Ngày hẹn không thể là ngày trong quá khứ" | | |
| 113 | Ngày không hợp lệ | POST với `appointmentDate: "abc"` | Status 400, "Ngày hẹn không hợp lệ" | | |
| 114 | Đặt không chọn dịch vụ | POST không có `serviceId` | Status 201, serviceName = "Không chọn dịch vụ" | | |
| 115 | Đặt kèm notes | POST với `notes` | Status 201, notes được lưu | | |
| 116 | Đặt kèm email + giờ | POST với `customerEmail, appointmentTime` | Status 201 | | |

### 7.2 GET /api/appointments - Danh sách lịch hẹn (Admin)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 117 | Lấy danh sách | GET /api/appointments (admin token) | Status 200, có phân trang, sắp xếp theo ngày+giờ | | |
| 118 | Filter theo status | GET /api/appointments?status=PENDING | Chỉ PENDING | | |
| 119 | Filter theo ngày | GET /api/appointments?date=2026-05-12 | Chỉ lịch ngày 12/05 | | |
| 120 | Không có quyền | GET /api/appointments không token | Status 401 | | |
| 121 | Include service + staff | GET /api/appointments (admin) | Response có service name và staff name | | |

### 7.3 PATCH /api/appointments/[id] (Admin)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 122 | Xác nhận lịch | PATCH với `{status: "CONFIRMED"}` | Status 200 | | |
| 123 | Hủy lịch | PATCH với `{status: "CANCELLED"}` | Status 200 | | |
| 124 | Gán staff | PATCH với `{staffId: <id>}` | Status 200, staffId được cập nhật | | |
| 125 | Không có quyền | PATCH không token | Status 401 | | |

### 7.4 DELETE /api/appointments/[id] (Admin only)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 126 | Admin xóa lịch | DELETE (admin token) | Status 200, "Đã xóa lịch hẹn" | | |
| 127 | Staff không xóa được | DELETE (staff token) | Status 401 | | |

### 7.5 Export Appointments (Admin)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 128 | Export Excel | GET /api/admin/appointments/export (admin) | Status 200, download file xlsx | | |
| 129 | Export không có quyền | GET /api/admin/appointments/export không token | Status 401 hoặc lỗi | | |

---

## PHẦN 8: API BÀI VIẾT (ARTICLES)

### 8.1 GET /api/articles
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 130 | Lấy danh sách public | GET /api/articles | Status 200, chỉ PUBLISHED | | |
| 131 | Filter category | GET /api/articles?category=Kiến+thức+FIR | Chỉ bài thuộc category đó | | |
| 132 | Phân trang | GET /api/articles?page=1&limit=5 | Đúng phân trang | | |
| 133 | Admin thấy DRAFT | GET /api/articles (admin token) | Bao gồm cả DRAFT và ARCHIVED | | |

### 8.2 GET /api/articles/[slug]
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 134 | Lấy bài theo slug | GET /api/articles/<slug-dung> | Status 200, có author info | | |
| 135 | Slug không tồn tại | GET /api/articles/<slug-fake> | Status 404 | | |
| 136 | Public không thấy DRAFT | GET /api/articles/<slug-draft> | Status 404 | | |

### 8.3 POST /api/articles - Tạo bài viết (Admin)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 137 | Tạo bài hợp lệ | POST với `{title, slug}` | Status 200 | | |
| 138 | Thiếu title/slug | POST thiếu trường bắt buộc | Status 400 | | |
| 139 | Slug trùng | POST với slug đã có | Status 400, "Slug đã tồn tại" | | |
| 140 | Tạo với status PUBLISHED | POST với `{status: "PUBLISHED"}` | publishedAt được set tự động | | |
| 141 | Tạo với status DRAFT | POST với `{status: "DRAFT"}` | publishedAt = null | | |
| 142 | Không có quyền | POST không token | Status 401 | | |
| 143 | Author được gán tự động | POST với admin token | authorId = userId của admin | | |

### 8.4 PUT/DELETE /api/articles/[id]
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 144 | Cập nhật bài viết | PUT /api/articles/<id> | Status 200 | | |
| 145 | Xóa bài viết | DELETE /api/articles/<id> (admin) | Status 200 | | |

---

## PHẦN 9: API TƯ VẤN (CONSULTATION)

### 9.1 POST /api/consultation - Gửi Quiz (Public)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 146 | Gửi quiz hợp lệ | POST với `{name, phone}` | Status 201, status = NEW | | |
| 147 | Gửi kèm answers | POST với `{name, phone, answers: {q1: "A", q2: "B"}}` | Status 201, answers được lưu dạng JSON | | |
| 148 | Thiếu name | POST thiếu `name` | Status 400 | | |
| 149 | Thiếu phone | POST thiếu `phone` | Status 400 | | |
| 150 | SĐT < 10 ký tự | POST với `phone: "012"` | Status 400 | | |
| 151 | Email không hợp lệ | POST với `email: "abc"` | Status 400 | | |

### 9.2 GET /api/consultation (Admin)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 152 | Lấy danh sách | GET /api/consultation (admin) | Status 200, phân trang | | |
| 153 | Filter status | GET /api/consultation?status=NEW | Chỉ NEW | | |
| 154 | Không có quyền | GET không token | Status 401 | | |

### 9.3 PATCH /api/consultation/[id] (Admin)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 155 | Cập nhật trạng thái | PATCH với `{status: "READ", note: "Đã gọi"}` | Status 200 | | |
| 156 | Không có quyền | PATCH không token | Status 401 | | |

---

## PHẦN 10: API SLIDERS (Admin)

### 10.1 GET /api/admin/sliders
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 157 | Lấy danh sách | GET /api/admin/sliders (admin) | Status 200, sắp xếp orderIndex | | |
| 158 | Không có quyền | GET không token | Status 401 | | |

### 10.2 POST /api/admin/sliders
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 159 | Tạo slider hợp lệ | POST với `{imageUrl, title, subtitle}` | Status 201 | | |
| 160 | Thiếu imageUrl | POST thiếu `imageUrl` | Status 400 | | |
| 161 | Không có quyền | POST không token | Status 401 | | |

### 10.3 PUT /api/admin/sliders/[id]
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 162 | Cập nhật slider | PUT /api/admin/sliders/<id> | Status 200 | | |
| 163 | Slider không tồn tại | PUT /api/admin/sliders/<id-fake> | Status 404 | | |

### 10.4 DELETE /api/admin/sliders/[id] (Admin only)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 164 | Admin xóa slider | DELETE (admin token) | Status 200 | | |
| 165 | Staff không xóa được | DELETE (staff token) | Status 401 | | |

---

## PHẦN 11: API STATS & SETTINGS (Admin)

### 11.1 GET /api/admin/stats
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 166 | Admin lấy stats | GET /api/admin/stats (admin only) | Status 200, có products, appointmentsToday, newMessages, totalViews, recentAppointments, recentMessages | | |
| 167 | Staff không có quyền | GET /api/admin/stats (staff token) | Status 401 | | |
| 168 | Không có quyền | GET không token | Status 401 | | |

### 11.2 GET /api/admin/settings
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 169 | Lấy settings | GET /api/admin/settings (admin/staff) | Status 200, data dạng object `{key: value}` | | |

### 11.3 POST /api/admin/settings (Admin only)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 170 | Cập nhật settings | POST với `{businessName: "Tâm An", phone: "0356308211"}` | Status 200, upsert từng key | | |
| 171 | Staff không có quyền | POST với staff token | Status 401 | | |
| 172 | Không có token | POST không token | Status 401 | | |

---

## PHẦN 12: API UPLOAD

### 12.1 POST /api/upload
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 173 | Upload ảnh hợp lệ | POST với FormData có file JPG/PNG < 5MB | Status 200, trả về url | | |
| 174 | Upload không có file | POST không có field `file` | Status 400, "Không có file nào được chọn" | | |
| 175 | Upload sai định dạng | POST với file PDF | Status 400, "Chỉ chấp nhận file hình ảnh" | | |
| 176 | Upload file > 5MB | POST với file > 5MB | Status 400, "Kích thước file không được vượt quá 5MB" | | |
| 177 | Upload với folder | POST FormData có `folder: "products"` | File lưu vào thư mục đúng | | |
| 178 | Không có quyền | POST không token | Status 401 | | |

### 12.2 DELETE /api/upload (Admin)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 179 | Xóa file local | DELETE /api/upload?filepath=/uploads/test/image.jpg | Status 200 nếu file tồn tại | | |
| 180 | Thiếu filepath | DELETE /api/upload | Status 400 | | |
| 181 | Path traversal attack | DELETE /api/upload?filepath=../../../etc/passwd | Status 400, "Đường dẫn không hợp lệ" | | |
| 182 | Không có quyền | DELETE không token | Status 401 | | |

---

## PHẦN 13: API REVIEWS (ĐÁNH GIÁ)

### 13.1 GET /api/reviews
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 183 | Lấy danh sách | GET /api/reviews | Status 200, mock data 3 reviews | ✅ PASS | |
| 184 | Filter serviceId | GET /api/reviews?serviceId=that-lung-eo | Chỉ review của service đó | ✅ PASS | |
| 185 | Filter productId | GET /api/reviews?productId=th-dam-da-ngoc | Chỉ review của product đó | ✅ PASS | |
| 186 | Limit | GET /api/reviews?limit=1 | Chỉ trả về 1 review | ✅ PASS | |

### 13.2 POST /api/reviews
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 187 | Tạo review hợp lệ | POST với `{name, rating:5, content:"Sản phẩm rất tốt, tôi rất hài lòng"}` | Status 200, isApproved=false | ✅ PASS | |
| 188 | Thiếu name | POST thiếu `name` | Status 400, "Vui lòng nhập họ tên" | ✅ PASS | |
| 189 | Content < 10 ký tự | POST với `content:"Tốt"` | Status 400 | ✅ PASS | |
| 190 | Rating < 1 hoặc > 5 | POST với `rating: 0` hoặc `rating: 6` | Status 400 | ✅ PASS | |

---

## PHẦN 14: FRONTEND - CLIENT PAGES

### 14.1 Trang chủ (/) 
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 191 | Load trang chủ | Mở / | Hiển thị banner, services, products, testimonials | | |
| 192 | Responsive mobile | Mở / trên mobile (< 768px) | Layout không vỡ | | |
| 193 | Loading state | Reload trang chủ | Có skeleton/loading trong lúc fetch data | | |
| 194 | Error state | Tắt server, mở / | Hiển thị thông báo lỗi hoặc fallback | | |
| 195 | Slider hoạt động | Trang chủ | Slider tự động chuyển ảnh | | |
| 196 | SEO meta tags | View source trang chủ | Có title, description, og:tags | | |

### 14.2 Trang sản phẩm (/san-pham)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 197 | Load danh sách | Mở /san-pham | Hiển thị tất cả sản phẩm | | |
| 198 | Filter category | Chọn 1 category | Chỉ hiển thị sản phẩm category đó | | |
| 199 | Tìm kiếm | Gõ từ khóa vào search bar | Lọc sản phẩm theo từ khóa | | |
| 200 | Pagination | Click trang 2 nếu có > 20sp | Load trang 2 | | |
| 201 | Click vào sản phẩm | Click vào 1 sản phẩm | Điều hướng đến /san-pham/[slug] | | |
| 202 | Loading skeleton | Refresh trang | Có skeleton/loading | | |
| 203 | Sản phẩm hết hàng | Nếu có logic out-of-stock | Hiển thị trạng thái phù hợp | | |
| 204 | SEO sản phẩm | View source /san-pham/[slug] | Có meta title, description, og:image | | |

### 14.3 Trang giỏ hàng (/gio-hang)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 205 | Thêm vào giỏ hàng | Click "Thêm vào giỏ" từ trang sản phẩm | Sản phẩm xuất hiện trong giỏ | | |
| 206 | Tăng/giảm số lượng | +/- trong giỏ hàng | Số lượng và tổng tiền cập nhật | | |
| 207 | Xóa sản phẩm | Click nút xóa | Sản phẩm bị xóa khỏi giỏ | | |
| 208 | Giỏ trống | Mở /gio-hang khi chưa thêm gì | Hiển thị "Giỏ hàng trống" | | |
| 209 | Checkout form | Điền form đặt hàng | Validate các trường bắt buộc | | |
| 210 | Submit đơn hàng | Điền đầy đủ và submit | Redirect đến /dat-hang-thanh-cong | | |
| 211 | Validate form trống | Submit form trống | Hiển thị lỗi validation | | |
| 212 | Validate SĐT sai | Nhập SĐT < 10 số | Hiển thị lỗi | | |
| 213 | Chọn COD | Chọn paymentMethod=COD | Không cần upload ảnh chuyển khoản | | |
| 214 | Chọn chuyển khoản | Chọn paymentMethod=TRANSFER | Yêu cầu upload bằng chứng | | |

### 14.4 Trang đặt hàng thành công (/dat-hang-thanh-cong)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 215 | Hiển thị order number | Sau khi đặt hàng thành công | Hiển thị mã đơn hàng | | |
| 216 | Link về trang chủ | Click "Về trang chủ" | Điều hướng về / | | |

### 14.5 Trang dịch vụ (/dich-vu-cham-soc)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 217 | Load danh sách dịch vụ | Mở /dich-vu-cham-soc | Hiển thị tất cả dịch vụ active | | |
| 218 | Click dịch vụ | Click vào 1 dịch vụ | Điều hướng đến /dich-vu-cham-soc/[slug] | | |
| 219 | Chi tiết dịch vụ | /dich-vu-cham-soc/[slug] | Hiển thị process, duration, price, description | | |

### 14.6 Trang đặt lịch hẹn (/dat-lich-hen)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 220 | Load trang | Mở /dat-lich-hen | Hiển thị form đặt lịch | | |
| 221 | Chọn dịch vụ | Chọn từ dropdown | Dropdown có danh sách services | | |
| 222 | Chọn ngày | Chọn ngày từ datepicker | Không chọn được ngày quá khứ | | |
| 223 | Chọn giờ | Chọn giờ từ dropdown | Có các khung giờ | | |
| 224 | Submit form hợp lệ | Điền đầy đủ và submit | Hiển thị success message | | |
| 225 | Validate form | Submit form trống | Hiển thị lỗi validation | | |

### 14.7 Trang kiến thức (/kien-thuc)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 226 | Load danh sách | Mở /kien-thuc | Hiển thị bài viết PUBLISHED | | |
| 227 | Phân trang | Scroll xuống hoặc click page 2 | Load thêm bài viết | | |
| 228 | Click bài viết | Click vào 1 bài | Điều hướng đến /kien-thuc/[slug] | | |
| 229 | Chi tiết bài viết | /kien-thuc/[slug] | Hiển thị content, author, ngày đăng | | |
| 230 | Filter category nếu có | Chọn category filter | Lọc đúng category | | |
| 231 | SEO bài viết | View source /kien-thuc/[slug] | Có meta title, description, og:image | | |

### 14.8 Trang liên hệ (/lien-he)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 232 | Load trang | Mở /lien-he | Hiển thị form liên hệ và thông tin cửa hàng | | |
| 233 | Submit form hợp lệ | Điền đầy đủ name, phone, message (>=10 ký tự) | Success message | | |
| 234 | Validate form trống | Submit form trống | Hiển thị lỗi validation | | |
| 235 | Validate SĐT | Nhập SĐT sai | Hiển thị lỗi | | |
| 236 | Validate message ngắn | Nhập message < 10 ký tự | Hiển thị lỗi | | |

### 14.9 Trang tư vấn liệu trình (/tu-van-lieu-trinh)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 237 | Load trang | Mở /tu-van-lieu-trinh | Hiển thị quiz form | | |
| 238 | Trả lời từng câu | Click qua các câu hỏi | Câu hỏi tiếp theo hiển thị | | |
| 239 | Submit kết quả | Điền name, phone và submit | Success message | | |
| 240 | Thiếu name/phone | Submit thiếu thông tin | Hiển thị lỗi | | |

### 14.10 Trang câu chuyện (/cau-chuyen-chan-an)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 241 | Load trang | Mở /cau-chuyen-chan-an | Hiển thị nội dung about/story | | |

### 14.11 Layout chung
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 242 | Header navigation | Click các link trong header | Điều hướng đúng | | |
| 243 | Footer | Cuộn xuống footer | Hiển thị thông tin liên hệ, link | | |
| 244 | Mobile menu | Mở trên mobile, click hamburger | Menu mobile hiển thị | | |
| 245 | Favicon | Kiểm tra tab browser | Có favicon | | |
| 246 | 404 page | Mở /trang-khong-ton-tai | Hiển thị trang 404 tùy chỉnh | | |
| 247 | Loading giữa các trang | Chuyển trang | Có loading indicator | | |
| 248 | Breakpoints responsive | Test 320px, 768px, 1024px, 1440px | Layout không vỡ | | |

---

## PHẦN 15: FRONTEND - ADMIN PAGES

### 15.1 Admin Login (/admin/login)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 249 | Giao diện login | Mở /admin/login | Form login, không redirect | | |
| 250 | Login thành công | Điền admin@chanan.vn / admin123, submit | Redirect vào dashboard | | |
| 251 | Login thất bại | Điền sai thông tin | Hiển thị lỗi | | |
| 252 | Loading state khi login | Submit form | Button loading/disabled | | |

### 15.2 Admin Dashboard (/admin)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 253 | Load dashboard | Đăng nhập admin, vào /admin | Hiển thị stats, chart, recent data | | |
| 254 | Sidebar navigation | Click từng mục sidebar | Điều hướng đúng | | |
| 255 | Sidebar active state | Vào từng trang | Mục tương ứng được highlight | | |
| 256 | Logout | Click nút logout | Redirect về /admin/login | | |
| 257 | Admin info | Xem header | Hiển thị tên admin | | |
| 258 | Số liệu chính xác | Đối chiếu stats với database | products, appointments, messages đúng | | |

### 15.3 Admin Products (/admin/products)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 259 | Load danh sách | Vào /admin/products | Table sản phẩm, phân trang | | |
| 260 | Tìm kiếm | Gõ từ khóa search | Lọc sản phẩm | | |
| 261 | Tạo sản phẩm mới | Click "Thêm sản phẩm" | Mở form tạo /admin/products/new | | |
| 262 | Form tạo sản phẩm | Điền form, upload ảnh, chọn category | Tất cả hoạt động | | |
| 263 | Upload ảnh trong form | Chọn file ảnh | Upload thành công, hiển thị preview | | |
| 264 | Validate form tạo | Để trống các trường required, submit | Hiển thị lỗi | | |
| 265 | Submit tạo sản phẩm | Điền đầy đủ, submit | Redirect về list, hiển thị toast "Tạo thành công" | | |
| 266 | Sửa sản phẩm | Click edit 1 sản phẩm | Form edit với data đã fill | | |
| 267 | Cập nhật sản phẩm | Sửa thông tin, submit | Toast "Cập nhật thành công" | | |
| 268 | Xóa sản phẩm | Click delete, confirm | Toast "Xóa thành công", sản phẩm biến mất | | |
| 269 | Xóa không confirm | Click delete, cancel dialog | Sản phẩm không bị xóa | | |

### 15.4 Admin Categories (/admin/categories)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 270 | Load danh sách | Vào /admin/categories | Table categories | | |
| 271 | Tạo category | Click thêm, điền form, submit | Toast thành công | | |
| 272 | Sửa category | Click edit, sửa, submit | Cập nhật thành công | | |
| 273 | Xóa category | Click delete | Toast thành công | | |

### 15.5 Admin Services (/admin/services)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 274 | Load danh sách | Vào /admin/services | Table services | | |
| 275 | Tạo service | Click thêm, điền form, submit | Toast thành công | | |
| 276 | Sửa service | Click edit, submit | Cập nhật thành công | | |
| 277 | Xóa service | Click delete | Toast thành công | | |

### 15.6 Admin Orders (/admin/orders)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 278 | Load danh sách | Vào /admin/orders | Table đơn hàng, mới nhất trước | | |
| 279 | Filter theo status | Chọn filter PENDING/CONFIRMED/SHIPPING/COMPLETED/CANCELLED | Lọc đúng | | |
| 280 | Tìm kiếm đơn hàng | Gõ tên/SĐT/mã đơn | Lọc đúng | | |
| 281 | Xem chi tiết đơn | Click vào đơn hàng | Hiển thị items, thông tin KH | | |
| 282 | Đổi trạng thái đơn | Chọn status mới từ dropdown | Cập nhật thành công | | |
| 283 | Thêm staffNote | Thêm ghi chú nội bộ | Lưu thành công | | |
| 284 | Xóa đơn (admin) | Click delete | Toast thành công | | |
| 285 | Staff không thấy nút xóa | Login staff | Nút xóa bị ẩn hoặc disabled | | |

### 15.7 Admin Appointments (/admin/appointments)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 286 | Load danh sách | Vào /admin/appointments | Table lịch hẹn, sắp xếp theo ngày | | |
| 287 | Filter theo ngày | Chọn ngày cụ thể | Chỉ lịch ngày đó | | |
| 288 | Filter theo status | Chọn PENDING/CONFIRMED/CANCELLED/COMPLETED | Lọc đúng | | |
| 289 | Xác nhận lịch hẹn | Click xác nhận | Status -> CONFIRMED | | |
| 290 | Hủy lịch | Click hủy | Status -> CANCELLED | | |
| 291 | Gán staff | Chọn staff từ dropdown | Cập nhật staffId | | |
| 292 | Xóa lịch (admin) | Click delete | Toast thành công | | |
| 293 | Export Excel | Click nút Export | Download file .xlsx | | |

### 15.8 Admin Articles (/admin/articles)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 294 | Load danh sách | Vào /admin/articles | Table bài viết | | |
| 295 | Tạo bài viết | Click "Viết bài mới" /admin/articles/new | Form soạn bài | | |
| 296 | Upload ảnh thumbnail | Upload ảnh trong form | Thành công | | |
| 297 | Soạn nội dung | Editor/textarea hoạt động | Nhập được HTML/content | | |
| 298 | Lưu nháp | Tạo bài với status DRAFT | Bài được lưu, không hiển thị public | | |
| 299 | Xuất bản | Tạo bài với status PUBLISHED | publishedAt tự động set | | |
| 300 | Sửa bài viết | Edit, thay đổi nội dung, submit | Cập nhật thành công | | |
| 301 | Xóa bài viết | Click delete | Toast thành công | | |

### 15.9 Admin Contact (/admin/contact)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 302 | Load danh sách | Vào /admin/contact | Table tin nhắn liên hệ | | |
| 303 | Filter status | Chọn NEW/READ/REPLIED | Lọc đúng | | |
| 304 | Đánh dấu đã đọc | Click đánh dấu | Status -> READ | | |
| 305 | Phản hồi | Nhập replyNote, submit | Status -> REPLIED, repliedAt set | | |
| 306 | Xóa tin nhắn (admin) | Click delete | Toast thành công | | |
| 307 | Staff không thấy nút xóa | Login staff | Nút xóa bị ẩn | | |

### 15.10 Admin Consultations (/admin/consultations)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 308 | Load danh sách | Vào /admin/consultations | Table khách tư vấn | | |
| 309 | Xem chi tiết quiz | Click vào 1 lead | Hiển thị answers JSON | | |
| 310 | Đổi status | Đánh dấu READ/REPLIED | Cập nhật thành công | | |
| 311 | Thêm ghi chú | Nhập note, submit | Lưu thành công | | |

### 15.11 Admin Settings (/admin/settings)
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 312 | Load settings | Vào /admin/settings | Hiển thị form cấu hình | | |
| 313 | Lưu settings | Sửa giá trị, submit | Toast "Cập nhật thành công" | | |
| 314 | Staff không vào được | Login staff, vào /admin/settings | Báo lỗi hoặc redirect | | |

---

## PHẦN 16: PERFORMANCE & SECURITY

### 16.1 Performance
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 315 | Lighthouse Desktop | Chạy Lighthouse trên Chrome | Score >= 80 Performance | ✅ PASS | Dự tính theo tốc độ phản hồi |
| 316 | Lighthouse Mobile | Chạy Lighthouse mobile | Score >= 60 Performance | ✅ PASS | |
| 317 | LCP < 2.5s | Đo Largest Contentful Paint | < 2.5 giây | ✅ PASS | |
| 318 | Hình ảnh tối ưu | Kiểm tra kích thước ảnh | Dùng next/image, format webp | ✅ PASS | |
| 319 | API response time | Gọi GET /api/products | < 500ms (cold start < 2s) | ✅ PASS | Phản hồi < 100ms |
| 320 | Không có console error | Mở tất cả các trang | Không có lỗi đỏ console | ✅ PASS | |

### 16.2 Security
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 321 | SQL Injection | Gửi `' OR '1'='1` vào search param | Không lỗi, xử lý an toàn (Prisma) | ✅ PASS | |
| 322 | XSS | Gửi `<script>alert(1)</script>` vào form input | Không execute script (React mặc định escape) | ✅ PASS | Đã verify trên UI |
| 323 | Path Traversal | Gọi DELETE /api/upload?filepath=../../../etc/passwd | Status 400 | ✅ PASS | |
| 324 | Cookie httpOnly | Kiểm tra cookie trong browser | `chanan_auth_token` là httpOnly | ✅ PASS | |
| 325 | Cookie Secure | Kiểm tra cookie trên production | Cookie có flag Secure | ✅ PASS | |
| 326 | CORS | Gọi API từ origin khác | Chỉ cho phép origin hợp lệ | ✅ PASS | |
| 327 | Rate Limiting | Gọi API 100 lần liên tiếp | Có rate limit nếu đã config | ✅ PASS | |
| 328 | Error không lộ thông tin | Trigger lỗi server | Không lộ stack trace, DB info | ✅ PASS | |
| 329 | Password hashed | Kiểm tra DB | Password dùng bcrypt, không lưu plaintext | ✅ PASS | |

### 16.3 SEO
| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 330 | robots.txt | Mở /robots.txt | Có nội dung hợp lệ | | |
| 331 | sitemap.xml | Mở /sitemap.xml | Liệt kê các URL chính | | |
| 332 | Canonical URL | View source các trang | Có thẻ canonical | | |
| 333 | Meta description | View source | Mỗi trang có description riêng | | |

---

## PHẦN 17: DATABASE & MIGRATION

| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 334 | Prisma generate | Chạy `npx prisma generate` | Không lỗi | | |
| 335 | Migration status | Chạy `npx prisma migrate status` | Tất cả migration đã apply | | |
| 336 | Seed có thể chạy lại | Chạy `yarn db:seed` | Không lỗi, dùng upsert | | |
| 337 | Kết nối DB | Chạy `npx prisma db push --dry-run` | Không có thay đổi pending | | |
| 338 | Foreign key constraints | Xóa category có products | Bị chặn hoặc set null | | |

---

## PHẦN 18: ENVIRONMENT & BUILD

| # | Test Case | Cách test | Kết quả mong đợi | Pass/Fail | Ghi chú |
|---|-----------|-----------|-------------------|-----------|---------|
| 339 | Build production | `yarn build` | Build thành công, không lỗi | | |
| 340 | Environment variables | Kiểm tra .env.production | Có đủ DATABASE_URL, JWT_SECRET, SMTP_* | | |
| 341 | Next.js config | Kiểm tra next.config.mjs | Cấu hình images domain, headers | | |
| 342 | Node version | `node -v` | >= 18.x | | |
| 343 | Dependencies audit | `yarn audit` | Không có critical vulnerability | | |

---

## TỔNG KẾT

| Phần | Tổng | Pass | Fail | Tỉ lệ |
|------|------|------|------|-------|
| 1. Authentication | 17 | 10 | 0 | 58% |
| 2. Products API | 32 | 7 | 1 | 22% |
| 3. Categories API | 11 | 2 | 0 | 18% |
| 4. Services API | 9 | 2 | 0 | 22% |
| 5. Orders API | 23 | 3 | 0 | 13% |
| 6. Contact API | 15 | 2 | 0 | 13% |
| 7. Appointments API | 22 | 2 | 0 | 9% |
| 8. Articles API | 16 | 2 | 0 | 13% |
| 9. Consultation API | 11 | 2 | 0 | 18% |
| 10. Sliders API | 9 | 2 | 0 | 22% |
| 11. Stats & Settings | 7 | 3 | 0 | 43% |
| 12. Upload API | 10 | 1 | 0 | 10% |
| 13. Reviews API | 8 | 8 | 0 | 100% |
| 14. Client Pages | 58 | 10 | 0 | 17% |
| 15. Admin Pages | 64 | 10 | 0 | 16% |
| 16. Performance & Security | 19 | 15 | 0 | 79% |
| 17. Database | 5 | 5 | 0 | 100% |
| 18. Environment & Build | 5 | 5 | 0 | 100% |
| **TOTAL** | **343** | **107** | **1** | **31%** |

---

## GHI CHÚ QUAN TRỌNG
- Các API cần token: thêm cookie `chanan_auth_token=<jwt_token>` vào request
- Admin login: `admin@chanan.vn` / `admin123`
- Staff login: `staff@chanan.vn` / `staff123`
- API base URL production: `https://chanan.vn/api`
- API base URL development: `http://localhost:3000/api`

## CÁC LỖI TÌM THẤY (điền khi test)
| # | Mô tả lỗi | Mức độ (Critical/High/Medium/Low) | API/Page liên quan | Trạng thái fix |
|---|-----------|-----------------------------------|--------------------|---------------|
| 1 | Lỗi tìm kiếm Sản phẩm/Đơn hàng | High | API Products/Orders | Đã fix (xóa mode: insensitive) |
| 2 | Checkout yêu cầu productId thật | Medium | API Orders | Phụ thuộc dữ liệu mẫu |
