# 🌿 Kế Hoạch Cải Tiến — SPAShop (Tâm An Energy Healing Clone)

> **Dự án:** [github.com/vietvo371/SPAShop](https://github.com/vietvo371/SPAShop)  
> **Live:** [spa-shop-nu.vercel.app](https://spa-shop-nu.vercel.app)  
> **Bản gốc tham khảo:** [chanan.vn](https://www.chanan.vn)  
> **Ngày lập kế hoạch:** 13/04/2026  
> **Tech stack:** Next.js 16 · Prisma · PostgreSQL · CSS Modules · JWT · Nodemailer

---

## 📊 Đánh Giá Hiện Trạng

| Hạng mục | Điểm | Nhận xét |
|---|---|---|
| Hoàn thiện tổng thể | 7/10 | Trang chủ chạy được, API đầy đủ |
| Độ giống bản gốc (UI) | 5/10 | Thiếu nhiều section, ảnh phụ thuộc CDN ngoài |
| Admin panel | 4/10 | Route có nhưng chưa có UI/CRUD |
| Hiệu năng | 6/10 | Thiếu skeleton loader, ảnh chưa tối ưu |
| SEO | 3/10 | Chưa có metadata, sitemap, OG tags |

---

## 🚨 Vấn Đề Nghiêm Trọng (Fix Ngay)

1. **Ảnh phụ thuộc CDN ngoài** — toàn bộ ảnh sản phẩm đang link thẳng từ `chanan.vn/upload/...`. Nếu họ thêm CORS policy hoặc đổi URL, toàn bộ site sẽ vỡ ngay lập tức.
2. **Voucher banner duplicate 5 lần** — lỗi animation marquee tạo ra 5 bản sao DOM thay vì dùng CSS loop.
3. **Logo bị lỗi** — file `/public/images/logo.png` chưa được commit vào repo.
4. **Giá dịch vụ** — toàn bộ hiển thị "Đang cập nhật", thiếu dữ liệu trong seed.
5. **Nút Book lịch hẹn** — redirect về `/lien-he` thay vì form đặt lịch chuyên biệt.

---

## 🗓️ Sprint 1 — Bugfix & Nền Tảng

> **Thời gian:** 1 tuần | **Ưu tiên:** Cao nhất

### Mục tiêu
Ổn định những gì đang chạy, xóa bỏ mọi rủi ro sập site, hoàn thiện dữ liệu cơ bản.

---

### Task 1.1 — Host toàn bộ ảnh lên Cloudinary

**File liên quan:** `app/components/`, `prisma/seed.ts`, `next.config.mjs`

```bash
# Bước 1: Cài Cloudinary SDK
yarn add cloudinary

# Bước 2: Thêm vào .env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

```javascript
// app/lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Hàm upload
export async function uploadImage(filePath: string, folder: string) {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: `spashop/${folder}`,
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  });
  return result.secure_url;
}
```

```javascript
// next.config.mjs — thêm domain Cloudinary
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // Xóa bỏ: www.chanan.vn
    ],
  },
};
```

**Checklist:**
- [ ] Tải toàn bộ ảnh từ chanan.vn về local
- [ ] Upload lên Cloudinary, lưu URL mới vào spreadsheet/JSON
- [ ] Cập nhật seed data với URL Cloudinary
- [ ] Cập nhật `next.config.mjs` xóa domain `chanan.vn`
- [ ] Xóa domain `chanan.vn` khỏi whitelist

---

### Task 1.2 — Fix Voucher Banner

**File:** `app/components/VoucherBanner.jsx` (hoặc tương đương)

```css
/* CSS animation thay vì duplicate DOM */
@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 20s linear infinite;
}

.marquee-track:hover {
  animation-play-state: paused;
}

/* Chỉ cần 2 bản sao để loop mượt */
.marquee-content {
  display: flex;
  gap: 3rem;
  white-space: nowrap;
}
```

```jsx
// Component sạch — chỉ 2 bản sao để tạo vòng lặp liên tục
export default function VoucherBanner({ code, discount }) {
  const content = (
    <span className={styles.marqueeContent}>
      Mã Voucher Giảm {discount} độc quyền dành riêng cho bạn:
      <strong> {code} </strong> — Áp dụng cho tất cả sản phẩm!
    </span>
  );

  return (
    <div className={styles.bannerWrap}>
      <div className={styles.marqueeTrack}>
        {content}
        {content} {/* Chỉ 2 bản sao */}
      </div>
    </div>
  );
}
```

**Checklist:**
- [ ] Xóa 3 bản sao DOM thừa
- [ ] Chuyển sang CSS animation thuần
- [ ] Test trên mobile và tablet

---

### Task 1.3 — Upload Logo & Favicon

**File:** `public/images/`

- [ ] Xuất logo từ file gốc (SVG hoặc PNG, tối thiểu 400×120px)
- [ ] Đặt vào `public/images/logo.png` và `public/images/logo-white.png`
- [ ] Tạo `public/favicon.ico` và `public/favicon.svg`
- [ ] Cập nhật `app/layout.js` metadata:

```javascript
export const metadata = {
  title: 'Tâm An Energy Healing - Khỏe Từ Bên Trong',
  description: 'Trung tâm chăm sóc sức khỏe với công nghệ Hồng Ngoại Xa (FIR) tại Quảng Ngãi',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};
```

---

### Task 1.4 — Hoàn Thiện Seed Data

**File:** `prisma/seed.ts`

```typescript
// Dữ liệu dịch vụ với giá thực
const services = [
  {
    name: 'Phục hồi thận khí',
    slug: 'phuc-hoi-than-khi',
    priceMin: 350000,
    priceMax: 500000,
    unit: 'buổi',
    comboNote: 'Combo 5 buổi: 1.500.000₫ | Combo 10 buổi: 2.800.000₫',
    duration: '60-90 phút',
    // ...
  },
  {
    name: 'Cổ vai gáy',
    slug: 'co-vai-gay',
    priceMin: 280000,
    priceMax: 400000,
    // ...
  },
  // Điền đầy đủ 8 dịch vụ
];
```

**Checklist:**
- [ ] Điền giá cho 8 dịch vụ (giá lẻ + giá combo)
- [ ] Thêm ít nhất 5 bài viết mẫu cho section Kiến thức
- [ ] Thêm nội dung trang "Về Tâm An" (câu chuyện thương hiệu)
- [ ] Thêm nội dung trang "Hợp tác / Tư vấn liệu trình"

---

### Task 1.5 — Trang 404 Tùy Chỉnh

**File:** `app/not-found.jsx`

```jsx
export default function NotFound() {
  return (
    <div className={styles.wrap}>
      <h1>404</h1>
      <p>Trang bạn tìm kiếm không tồn tại</p>
      <Link href="/">Quay về trang chủ</Link>
      <Link href="/lien-he">Liên hệ hỗ trợ</Link>
    </div>
  );
}
```

---

### Task 1.6 — Loading Skeleton

**File:** `app/components/ProductSkeleton.jsx`, `app/components/ServiceSkeleton.jsx`

```jsx
// Skeleton cho product card
export function ProductCardSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonImage} />
      <div className={styles.skeletonTitle} />
      <div className={styles.skeletonPrice} />
      <div className={styles.skeletonBtn} />
    </div>
  );
}
```

```css
.skeleton {
  animation: shimmer 1.5s infinite;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

**Deliverables Sprint 1:**
- [ ] Toàn bộ ảnh trên Cloudinary, không còn link chanan.vn
- [ ] Banner voucher hoạt động đúng
- [ ] Logo hiển thị đúng
- [ ] Giá dịch vụ có dữ liệu thực
- [ ] Trang 404 custom
- [ ] Skeleton loader cho product/service

---

## 🎨 Sprint 2 — Hoàn Thiện UI Giống Bản Gốc

> **Thời gian:** 1–2 tuần | **Ưu tiên:** Cao

### Mục tiêu
Làm cho giao diện clone sát nhất có thể với chanan.vn, hoàn thiện các trang còn thiếu.

---

### Task 2.1 — Top Bar & Header

**File:** `app/components/Header.jsx`

Bản gốc có top bar chứa SĐT + icon mạng xã hội ở trên cùng.

```jsx
// Top bar (hiện clone đang thiếu)
function TopBar() {
  return (
    <div className={styles.topBar}>
      <div className={styles.container}>
        <div className={styles.social}>
          <a href="https://youtube.com" aria-label="YouTube"><YouTubeIcon /></a>
          <a href="https://facebook.com" aria-label="Facebook"><FacebookIcon /></a>
          <a href="https://tiktok.com" aria-label="TikTok"><TikTokIcon /></a>
          <a href="https://instagram.com" aria-label="Instagram"><InstagramIcon /></a>
        </div>
        <a href="tel:0356308211" className={styles.phone}>
          📞 035 630 8211
        </a>
      </div>
    </div>
  );
}
```

```css
/* Sticky header với backdrop blur */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background 0.3s, backdrop-filter 0.3s;
}

.header.scrolled {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  box-shadow: 0 1px 20px rgba(0,0,0,0.08);
}
```

```javascript
// Hook detect scroll
'use client';
import { useState, useEffect } from 'react';

export function useScrolled(threshold = 60) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, [threshold]);
  return scrolled;
}
```

**Checklist:**
- [ ] Thêm TopBar component với SĐT + social icons
- [ ] Sticky header với backdrop blur khi scroll
- [ ] Mobile menu với animation slide-in mượt
- [ ] Active state cho nav link theo route hiện tại

---

### Task 2.2 — Hover Effect Cho Cards

**File:** `app/components/ProductCard.module.css`, `app/components/ServiceCard.module.css`

```css
/* Product card hover */
.card {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.card:hover .cardImage {
  transform: scale(1.04);
}

.cardImage {
  transition: transform 0.35s ease;
  overflow: hidden;
}

/* Badge "Bán chạy" / "Mới" */
.badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.badgeNew  { background: #4CAF50; color: white; }
.badgeSale { background: #F44336; color: white; }
.badgePop  { background: #FF9800; color: white; }
```

---

### Task 2.3 — Trang Chi Tiết Dịch Vụ `/dich-vu/[slug]`

**File:** `app/dich-vu-cham-soc/[slug]/page.jsx`

```jsx
// Cấu trúc trang chi tiết dịch vụ
export default async function ServiceDetailPage({ params }) {
  const service = await getServiceBySlug(params.slug);

  return (
    <main>
      {/* Hero section */}
      <section className={styles.hero}>
        <Image src={service.heroImage} alt={service.name} fill />
        <div className={styles.heroContent}>
          <h1>{service.name}</h1>
          <p>{service.shortDesc}</p>
        </div>
      </section>

      {/* Mô tả chi tiết */}
      <section className={styles.description}>
        <h2>Liệu trình dành cho ai?</h2>
        <p>{service.targetAudience}</p>
        <h2>Công dụng</h2>
        <ul>{service.benefits.map(b => <li key={b}>{b}</li>)}</ul>
      </section>

      {/* Quy trình thực hiện */}
      <section className={styles.process}>
        <h2>Quy Trình Thực Hiện</h2>
        <div className={styles.steps}>
          {service.steps.map((step, i) => (
            <div key={i} className={styles.step}>
              <div className={styles.stepNum}>{i + 1}</div>
              <div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Giá & Liệu trình */}
      <section className={styles.pricing}>
        <h2>Giá Dịch Vụ</h2>
        <div className={styles.priceCard}>
          <p>Giá lẻ: <strong>{formatPrice(service.priceMin)}₫</strong></p>
          <p>{service.comboNote}</p>
        </div>
        <BookingButton serviceId={service.id} />
      </section>

      {/* Dịch vụ liên quan */}
      <RelatedServices currentSlug={params.slug} />
    </main>
  );
}
```

**Checklist:**
- [ ] Route `/dich-vu-cham-soc/[slug]/page.jsx`
- [ ] generateStaticParams cho SSG
- [ ] Schema Prisma: thêm field `steps`, `benefits`, `targetAudience`, `heroImage`
- [ ] Migration + seed data cho 8 dịch vụ
- [ ] Component `RelatedServices`

---

### Task 2.4 — Trang Kiến Thức / Blog `/kien-thuc`

**File:** `app/kien-thuc/page.jsx`, `app/kien-thuc/[slug]/page.jsx`

```jsx
// Trang list bài viết
export default async function KienThucPage({ searchParams }) {
  const { category, page = 1 } = searchParams;
  const articles = await getArticles({ category, page, limit: 9 });
  const categories = await getCategories();

  return (
    <main>
      <PageHero title="Kiến Thức Sức Khỏe" />

      {/* Filter theo danh mục */}
      <CategoryFilter categories={categories} active={category} />

      {/* Grid bài viết */}
      <ArticleGrid articles={articles} />

      {/* Pagination */}
      <Pagination total={articles.total} page={page} />
    </main>
  );
}
```

**Checklist:**
- [ ] Trang list với filter theo danh mục
- [ ] Trang chi tiết `/kien-thuc/[slug]` với rich text render
- [ ] Related articles ở cuối bài
- [ ] Breadcrumb navigation
- [ ] Metadata động cho SEO mỗi bài

---

### Task 2.5 — Form Đặt Lịch Hẹn Standalone

**File:** `app/dat-lich/page.jsx`, `app/components/BookingForm.jsx`

```jsx
'use client';

export default function BookingForm() {
  const [step, setStep] = useState(1); // 1: Chọn dịch vụ, 2: Chọn thời gian, 3: Thông tin

  return (
    <div className={styles.formWrap}>
      {/* Progress indicator */}
      <div className={styles.progress}>
        <Step num={1} label="Dịch vụ" active={step >= 1} />
        <Step num={2} label="Thời gian" active={step >= 2} />
        <Step num={3} label="Thông tin" active={step >= 3} />
      </div>

      {/* Step 1: Chọn dịch vụ */}
      {step === 1 && (
        <div className={styles.serviceSelect}>
          <h2>Chọn dịch vụ bạn muốn</h2>
          <ServiceGrid onSelect={(s) => { setService(s); setStep(2); }} />
        </div>
      )}

      {/* Step 2: Chọn ngày giờ */}
      {step === 2 && (
        <div className={styles.timeSelect}>
          <h2>Chọn thời gian</h2>
          <DatePicker value={date} onChange={setDate} minDate={new Date()} />
          <TimeSlots date={date} onSelect={(t) => { setTime(t); setStep(3); }} />
        </div>
      )}

      {/* Step 3: Thông tin cá nhân */}
      {step === 3 && (
        <div className={styles.infoForm}>
          <h2>Thông tin của bạn</h2>
          <input name="name" placeholder="Họ và tên *" required />
          <input name="phone" placeholder="Số điện thoại *" required />
          <input name="email" placeholder="Email" />
          <textarea name="note" placeholder="Ghi chú thêm..." />
          <button type="submit">Xác Nhận Đặt Lịch</button>
        </div>
      )}
    </div>
  );
}
```

**Checklist:**
- [ ] Route `/dat-lich/page.jsx` với form 3 bước
- [ ] Date picker (dùng `react-datepicker` hoặc native)
- [ ] Validate form phía client và server
- [ ] Gửi email xác nhận cho khách sau khi đặt
- [ ] Trang thành công sau khi đặt lịch

---

### Task 2.6 — SEO Cơ Bản

**File:** `app/layout.js`, `app/sitemap.js`, `app/robots.js`

```javascript
// app/layout.js
export const metadata = {
  title: {
    template: '%s | Tâm An Energy Healing',
    default: 'Tâm An Energy Healing - Khỏe Từ Bên Trong',
  },
  description: 'Trung tâm chăm sóc sức khỏe với công nghệ Hồng Ngoại Xa (FIR) tại Quảng Ngãi. Phục hồi sức khỏe tự nhiên, không xâm lấn.',
  openGraph: {
    title: 'Tâm An Energy Healing',
    description: 'Khỏe từ bên trong với công nghệ FIR',
    url: 'https://www.chanan.vn',
    siteName: 'Tâm An',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    locale: 'vi_VN',
    type: 'website',
  },
};

// app/sitemap.js
export default async function sitemap() {
  const products = await getProducts();
  const services = await getServices();
  const articles = await getArticles();

  return [
    { url: BASE_URL, lastModified: new Date() },
    { url: `${BASE_URL}/san-pham`, lastModified: new Date() },
    { url: `${BASE_URL}/dich-vu-cham-soc`, lastModified: new Date() },
    ...products.map(p => ({ url: `${BASE_URL}/san-pham/${p.slug}`, lastModified: p.updatedAt })),
    ...services.map(s => ({ url: `${BASE_URL}/dich-vu-cham-soc/${s.slug}`, lastModified: s.updatedAt })),
    ...articles.map(a => ({ url: `${BASE_URL}/kien-thuc/${a.slug}`, lastModified: a.updatedAt })),
  ];
}

// app/robots.js
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/admin/' },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
```

**Checklist:**
- [ ] Metadata layout tổng (title template, description, OG)
- [ ] Metadata động cho trang sản phẩm, dịch vụ, bài viết
- [ ] `sitemap.xml` tự động từ Prisma data
- [ ] `robots.txt` (ẩn /admin)
- [ ] Google Maps iframe trong footer và trang liên hệ

**Deliverables Sprint 2:**
- [ ] Top bar + sticky header với backdrop blur
- [ ] Hover effects trên card
- [ ] Trang chi tiết dịch vụ `/dich-vu-cham-soc/[slug]`
- [ ] Trang blog `/kien-thuc` với list + chi tiết
- [ ] Form đặt lịch 3 bước tại `/dat-lich`
- [ ] SEO cơ bản: sitemap, robots, OG tags

---

## 🛠️ Sprint 3 — Admin Panel Đầy Đủ

> **Thời gian:** 2–3 tuần | **Ưu tiên:** Cao (core feature)

### Mục tiêu
Xây dựng hệ thống quản trị đủ dùng cho nhân viên vận hành hàng ngày mà không cần technical.

---

### Task 3.1 — Layout & Sidebar Admin

**File:** `app/(admin)/admin/layout.jsx`

```jsx
// Sidebar admin với role-based menu
export default function AdminLayout({ children }) {
  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <div className={styles.mainArea}>
        <AdminHeader />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}

// Cấu trúc menu
const NAV_ITEMS = [
  { href: '/admin',              icon: <DashboardIcon />, label: 'Dashboard',    roles: ['admin', 'staff'] },
  { href: '/admin/appointments', icon: <CalendarIcon />,  label: 'Lịch hẹn',     roles: ['admin', 'staff'] },
  { href: '/admin/contact',      icon: <InboxIcon />,     label: 'Liên hệ',      roles: ['admin', 'staff'] },
  { href: '/admin/products',     icon: <BoxIcon />,       label: 'Sản phẩm',     roles: ['admin'] },
  { href: '/admin/services',     icon: <StarIcon />,      label: 'Dịch vụ',      roles: ['admin'] },
  { href: '/admin/articles',     icon: <FileTextIcon />,  label: 'Bài viết',     roles: ['admin'] },
  { href: '/admin/settings',     icon: <SettingsIcon />,  label: 'Cài đặt',      roles: ['admin'] },
];
```

```css
/* Layout sidebar + main */
.adminLayout {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #1a1a2e;
  color: white;
  padding: 1.5rem 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .adminLayout { grid-template-columns: 1fr; }
  .sidebar { display: none; } /* toggle bằng JS */
}
```

---

### Task 3.2 — Dashboard Tổng Quan

**File:** `app/(admin)/admin/page.jsx`

```jsx
export default async function DashboardPage() {
  const [stats, recentAppointments, recentContacts] = await Promise.all([
    getDashboardStats(),
    getRecentAppointments(5),
    getRecentContacts(5),
  ]);

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Stat cards hàng đầu */}
      <div className={styles.statGrid}>
        <StatCard label="Lịch hẹn hôm nay"  value={stats.todayAppointments}  icon="📅" color="blue" />
        <StatCard label="Liên hệ chưa đọc"   value={stats.unreadContacts}     icon="✉️" color="red" />
        <StatCard label="Tổng sản phẩm"       value={stats.totalProducts}      icon="📦" color="green" />
        <StatCard label="Dịch vụ đang hoạt động" value={stats.activeServices} icon="⭐" color="amber" />
      </div>

      {/* Lịch hẹn gần đây */}
      <div className={styles.grid2col}>
        <section>
          <h2>Lịch hẹn gần đây</h2>
          <AppointmentTable data={recentAppointments} compact />
          <Link href="/admin/appointments">Xem tất cả →</Link>
        </section>

        {/* Liên hệ mới */}
        <section>
          <h2>Liên hệ mới</h2>
          <ContactList data={recentContacts} compact />
          <Link href="/admin/contact">Xem tất cả →</Link>
        </section>
      </div>
    </div>
  );
}
```

**API cần thêm:**
```javascript
// app/api/admin/stats/route.js
export async function GET() {
  const [todayAppts, unreadContacts, totalProducts, activeServices] = await Promise.all([
    prisma.appointment.count({ where: { date: { gte: startOfDay, lte: endOfDay } } }),
    prisma.contact.count({ where: { isRead: false } }),
    prisma.product.count(),
    prisma.service.count({ where: { isActive: true } }),
  ]);
  return Response.json({ todayAppts, unreadContacts, totalProducts, activeServices });
}
```

---

### Task 3.3 — Quản Lý Sản Phẩm CRUD

**File:** `app/(admin)/admin/products/`

```
admin/products/
  ├── page.jsx          ← Danh sách + search + filter
  ├── create/page.jsx   ← Form tạo mới
  └── [id]/edit/page.jsx ← Form chỉnh sửa
```

```jsx
// Danh sách sản phẩm — page.jsx
export default function ProductsPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Quản lý sản phẩm</h1>
        <Link href="/admin/products/create" className={styles.btnPrimary}>
          + Thêm sản phẩm
        </Link>
      </div>

      {/* Search & Filter */}
      <div className={styles.toolbar}>
        <input placeholder="Tìm theo tên..." />
        <select>
          <option value="">Tất cả danh mục</option>
          {/* danh mục từ DB */}
        </select>
        <select>
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang hiển thị</option>
          <option value="hidden">Đã ẩn</option>
        </select>
      </div>

      {/* Bảng sản phẩm */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Danh mục</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td><Image src={p.image} width={60} height={60} alt={p.name} /></td>
              <td>{p.name}</td>
              <td>{formatPrice(p.price)}₫</td>
              <td>{p.category?.name}</td>
              <td><ToggleStatus id={p.id} active={p.isActive} /></td>
              <td>
                <Link href={`/admin/products/${p.id}/edit`}>Sửa</Link>
                <DeleteButton id={p.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

```jsx
// Form create/edit sản phẩm
function ProductForm({ product }) {
  return (
    <form action={saveProduct}>
      <div className={styles.formGrid}>
        {/* Cột trái */}
        <div>
          <label>Tên sản phẩm *</label>
          <input name="name" defaultValue={product?.name} required />

          <label>Slug (URL)</label>
          <input name="slug" defaultValue={product?.slug} />

          <label>Giá (₫) *</label>
          <input name="price" type="number" defaultValue={product?.price} required />

          <label>Giá gốc (trước khuyến mãi)</label>
          <input name="originalPrice" type="number" defaultValue={product?.originalPrice} />

          <label>Mô tả ngắn</label>
          <textarea name="shortDesc" rows={3} defaultValue={product?.shortDesc} />

          <label>Mô tả đầy đủ</label>
          <textarea name="description" rows={8} defaultValue={product?.description} />
        </div>

        {/* Cột phải */}
        <div>
          <label>Ảnh sản phẩm *</label>
          <ImageUpload name="image" current={product?.image} />

          <label>Danh mục</label>
          <select name="categoryId">
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <label>Trạng thái</label>
          <select name="isActive">
            <option value="true">Đang hiển thị</option>
            <option value="false">Ẩn</option>
          </select>

          <label>Badge</label>
          <select name="badge">
            <option value="">Không có</option>
            <option value="new">Mới</option>
            <option value="hot">Bán chạy</option>
            <option value="sale">Khuyến mãi</option>
          </select>
        </div>
      </div>

      <div className={styles.formActions}>
        <Link href="/admin/products">Hủy</Link>
        <button type="submit">Lưu sản phẩm</button>
      </div>
    </form>
  );
}
```

**ImageUpload component:**
```jsx
'use client';

function ImageUpload({ name, current }) {
  const [preview, setPreview] = useState(current);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const { url } = await res.json();
    setPreview(url);
    setUploading(false);
  };

  return (
    <div>
      {preview && <Image src={preview} width={200} height={200} alt="preview" />}
      <input type="hidden" name={name} value={preview} />
      <label className={styles.uploadBtn}>
        {uploading ? 'Đang tải...' : '📁 Chọn ảnh'}
        <input type="file" accept="image/*" onChange={handleFile} hidden />
      </label>
    </div>
  );
}
```

**Checklist:**
- [ ] Trang danh sách với search + filter danh mục + filter trạng thái
- [ ] Phân trang (pagination)
- [ ] Form create với validation
- [ ] Form edit điền sẵn dữ liệu cũ
- [ ] Upload ảnh Cloudinary
- [ ] Toggle hiển thị/ẩn không cần reload
- [ ] Xóa với confirm dialog
- [ ] Server Actions cho save/delete

---

### Task 3.4 — Quản Lý Dịch Vụ CRUD

**File:** `app/(admin)/admin/services/`

Tương tự sản phẩm + thêm các field đặc thù:

```javascript
// Schema Prisma mở rộng cho dịch vụ
model Service {
  id           String   @id @default(cuid())
  name         String
  slug         String   @unique
  shortDesc    String?
  description  String?  @db.Text
  image        String?
  heroImage    String?
  priceMin     Int?
  priceMax     Int?
  priceUnit    String?  @default("buổi")
  comboNote    String?
  duration     String?  // "60-90 phút"
  steps        Json?    // [{title, desc}]
  benefits     Json?    // [String]
  targetAudience String?
  isActive     Boolean  @default(true)
  order        Int      @default(0)  // Thứ tự hiển thị
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

**Checklist:**
- [ ] CRUD đầy đủ như sản phẩm
- [ ] Field giá lẻ + ghi chú combo
- [ ] JSON editor cho `steps` (quy trình) với UI thêm/xóa từng bước
- [ ] Drag-and-drop sắp xếp thứ tự hiển thị

---

### Task 3.5 — Quản Lý Bài Viết + Rich Text Editor

**File:** `app/(admin)/admin/articles/`

```bash
# Cài TipTap editor
yarn add @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link
```

```jsx
'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

function RichTextEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit, Image, Link],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  return (
    <div className={styles.editorWrap}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <button onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>•</button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</button>
        {/* Thêm image upload */}
      </div>
      <EditorContent editor={editor} className={styles.editor} />
    </div>
  );
}
```

**Checklist:**
- [ ] TipTap rich text editor
- [ ] Trang list bài viết với filter trạng thái (draft/published/archived)
- [ ] Form tạo/sửa với: tiêu đề, slug, excerpt, thumbnail, nội dung, danh mục, tags
- [ ] SEO fields: meta title, meta description
- [ ] Preview bài viết trước khi publish
- [ ] Publish/Unpublish toggle

---

### Task 3.6 — Quản Lý Lịch Hẹn

**File:** `app/(admin)/admin/appointments/`

```jsx
// Tabs: Calendar view | List view
export default function AppointmentsPage() {
  const [view, setView] = useState('list');

  return (
    <div>
      <div className={styles.header}>
        <h1>Lịch hẹn</h1>
        <div className={styles.viewSwitch}>
          <button onClick={() => setView('list')}   className={view === 'list' ? 'active' : ''}>Danh sách</button>
          <button onClick={() => setView('calendar')} className={view === 'calendar' ? 'active' : ''}>Lịch</button>
        </div>
      </div>

      {/* Filter */}
      <div className={styles.filters}>
        <input type="date" value={dateFilter} onChange={setDateFilter} />
        <select value={statusFilter} onChange={setStatusFilter}>
          <option value="">Tất cả trạng thái</option>
          <option value="pending">Chờ xác nhận</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="completed">Hoàn thành</option>
          <option value="cancelled">Đã hủy</option>
        </select>
        <select value={serviceFilter}>
          <option value="">Tất cả dịch vụ</option>
          {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {/* List View */}
      {view === 'list' && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Khách hàng</th><th>SĐT</th><th>Dịch vụ</th>
              <th>Ngày giờ</th><th>Trạng thái</th><th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(a => (
              <tr key={a.id}>
                <td>{a.customerName}</td>
                <td><a href={`tel:${a.phone}`}>{a.phone}</a></td>
                <td>{a.service?.name || a.serviceNote}</td>
                <td>{formatDateTime(a.appointmentDate)}</td>
                <td><StatusBadge status={a.status} /></td>
                <td>
                  <StatusActions id={a.id} status={a.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
```

**Schema Prisma cập nhật:**
```javascript
model Appointment {
  id              String   @id @default(cuid())
  customerName    String
  phone           String
  email           String?
  serviceId       String?
  serviceNote     String?  // Nếu chọn dịch vụ khác
  appointmentDate DateTime
  status          AppointmentStatus @default(PENDING)
  note            String?  // Ghi chú khách hàng
  adminNote       String?  // Ghi chú nội bộ (chỉ admin thấy)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  service         Service? @relation(fields: [serviceId], references: [id])
}

enum AppointmentStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELLED
}
```

**Checklist:**
- [ ] List view với filter ngày, trạng thái, dịch vụ
- [ ] Actions: Xác nhận / Hoàn thành / Hủy (cập nhật status)
- [ ] Ghi chú nội bộ cho từng lịch hẹn
- [ ] Export danh sách ra CSV
- [ ] Gửi email thông báo khi xác nhận/hủy lịch

---

### Task 3.7 — Quản Lý Liên Hệ / Inbox

**File:** `app/(admin)/admin/contact/`

```jsx
export default function ContactPage() {
  return (
    <div className={styles.inboxLayout}>
      {/* Sidebar list */}
      <aside className={styles.inbox}>
        <div className={styles.inboxHeader}>
          <h2>Liên hệ</h2>
          <select onChange={setFilter}>
            <option value="all">Tất cả</option>
            <option value="unread">Chưa đọc</option>
            <option value="replied">Đã trả lời</option>
          </select>
        </div>
        {contacts.map(c => (
          <div key={c.id}
               className={`${styles.inboxItem} ${!c.isRead ? styles.unread : ''}`}
               onClick={() => setSelected(c)}>
            <strong>{c.name}</strong>
            <span>{c.phone}</span>
            <p>{c.message.slice(0, 60)}...</p>
            <time>{formatRelative(c.createdAt)}</time>
          </div>
        ))}
      </aside>

      {/* Detail pane */}
      <main className={styles.detail}>
        {selected ? (
          <>
            <div className={styles.detailHeader}>
              <h2>{selected.name}</h2>
              <span>{selected.phone} · {selected.email}</span>
              <StatusBadge status={selected.status} />
            </div>
            <div className={styles.message}>{selected.message}</div>
            <div className={styles.adminNote}>
              <label>Ghi chú nội bộ:</label>
              <textarea defaultValue={selected.adminNote} onBlur={saveNote} />
            </div>
          </>
        ) : (
          <EmptyState text="Chọn một liên hệ để xem chi tiết" />
        )}
      </main>
    </div>
  );
}
```

**Checklist:**
- [ ] Inbox 2 cột: list bên trái, detail bên phải
- [ ] Đánh dấu đã đọc tự động khi mở
- [ ] Ghi chú nội bộ
- [ ] Filter: chưa đọc / tất cả / đã xử lý
- [ ] Tìm kiếm theo tên/SĐT

---

### Task 3.8 — Trang Cài Đặt

**File:** `app/(admin)/admin/settings/`

```jsx
// Tabs cài đặt
const SETTINGS_TABS = [
  'Thông tin cơ sở',
  'Tài khoản',
  'Banner & Voucher',
  'Email thông báo',
];

// Form thông tin cơ sở
function BusinessInfoForm() {
  return (
    <form action={saveBusinessInfo}>
      <label>Tên cơ sở</label>
      <input name="businessName" />

      <label>Địa chỉ</label>
      <input name="address" />

      <label>Số điện thoại</label>
      <input name="phone" />

      <label>Email</label>
      <input name="email" type="email" />

      <label>Giờ mở cửa</label>
      <input name="openHours" placeholder="Thứ 2 - Chủ nhật: 8:00 - 20:00" />

      <label>Google Maps Embed URL</label>
      <input name="mapsUrl" />

      <button type="submit">Lưu thay đổi</button>
    </form>
  );
}
```

**Checklist:**
- [ ] Form thông tin cơ sở (tên, địa chỉ, SĐT, giờ mở cửa)
- [ ] Quản lý tài khoản admin/staff (xem, đổi mật khẩu)
- [ ] Quản lý banner voucher (mã, % giảm, ngày hết hạn, bật/tắt)
- [ ] Cài đặt email thông báo (template, người nhận)

**Deliverables Sprint 3:**
- [ ] Admin layout sidebar responsive
- [ ] Dashboard với stat cards + data thực
- [ ] CRUD đầy đủ: sản phẩm, dịch vụ, bài viết
- [ ] Quản lý lịch hẹn với filter + actions
- [ ] Inbox liên hệ 2 cột
- [ ] Trang cài đặt cơ bản

---

## ✨ Sprint 4 — Nâng Cao (Tùy Chọn)

> **Thời gian:** 1–2 tuần | **Ưu tiên:** Thấp (nice to have)

### Task 4.1 — Zalo OA Widget

```jsx
// Float button Zalo góc phải dưới
export function ZaloWidget({ oaId }) {
  return (
    <a href={`https://zalo.me/${oaId}`}
       target="_blank"
       rel="noopener noreferrer"
       className={styles.zaloBtn}
       aria-label="Chat Zalo">
      <Image src="/icons/zalo.svg" width={40} height={40} alt="Zalo" />
      <span className={styles.tooltip}>Chat Zalo</span>
    </a>
  );
}
```

### Task 4.2 — Email Xác Nhận Lịch Hẹn

```javascript
// Template email xác nhận cho khách
export async function sendAppointmentConfirmation(appointment) {
  await sendEmail({
    to: appointment.email,
    subject: `[Tâm An] Xác nhận lịch hẹn ngày ${formatDate(appointment.appointmentDate)}`,
    html: `
      <h2>Xin chào ${appointment.customerName},</h2>
      <p>Tâm An đã xác nhận lịch hẹn của bạn:</p>
      <ul>
        <li><strong>Dịch vụ:</strong> ${appointment.service.name}</li>
        <li><strong>Ngày giờ:</strong> ${formatDateTime(appointment.appointmentDate)}</li>
        <li><strong>Địa chỉ:</strong> 02 Phan Long Bằng, Quảng Ngãi</li>
      </ul>
      <p>Nếu cần thay đổi, vui lòng liên hệ: <a href="tel:0356308211">035 630 8211</a></p>
    `,
  });
}
```

### Task 4.3 — Hệ Thống Đánh Giá

```javascript
// Schema Prisma
model Review {
  id        String   @id @default(cuid())
  name      String
  rating    Int      // 1-5
  content   String
  serviceId String?
  productId String?
  isApproved Boolean @default(false)
  createdAt DateTime @default(now())
  service   Service? @relation(...)
  product   Product? @relation(...)
}
```

### Task 4.4 — Export Báo Cáo Excel

```bash
yarn add xlsx
```

```javascript
// API export lịch hẹn
export async function GET(req) {
  const appointments = await prisma.appointment.findMany({ include: { service: true } });

  const ws = XLSX.utils.json_to_sheet(appointments.map(a => ({
    'Khách hàng': a.customerName,
    'SĐT': a.phone,
    'Dịch vụ': a.service?.name,
    'Ngày giờ': formatDateTime(a.appointmentDate),
    'Trạng thái': STATUS_LABELS[a.status],
  })));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Lịch hẹn');
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

  return new Response(buf, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="lich-hen.xlsx"',
    },
  });
}
```

---

## 📦 Cài Đặt Thêm Theo Sprint

```bash
# Sprint 1
yarn add cloudinary

# Sprint 2
yarn add react-datepicker
yarn add --dev @types/react-datepicker

# Sprint 3
yarn add @tiptap/react @tiptap/pm @tiptap/starter-kit
yarn add @tiptap/extension-image @tiptap/extension-link

# Sprint 4
yarn add xlsx
```

---

## 🗂️ Cấu Trúc File Sau Khi Hoàn Thiện

```
app/
├── (admin)/
│   └── admin/
│       ├── layout.jsx            ← Sidebar + header admin
│       ├── page.jsx              ← Dashboard
│       ├── products/
│       │   ├── page.jsx          ← Danh sách
│       │   ├── create/page.jsx   ← Form tạo mới
│       │   └── [id]/edit/page.jsx
│       ├── services/             ← Tương tự products
│       ├── articles/             ← + TipTap editor
│       ├── appointments/         ← Calendar + list view
│       ├── contact/              ← Inbox layout
│       └── settings/             ← Tabs cài đặt
│
├── (client)/                     ← Public pages
│   ├── page.jsx                  ← Trang chủ
│   ├── cau-chuyen-chan-an/        ← Về Tâm An
│   ├── dich-vu-cham-soc/
│   │   ├── page.jsx              ← List dịch vụ
│   │   └── [slug]/page.jsx       ← ✅ Cần thêm
│   ├── san-pham/
│   │   ├── page.jsx
│   │   └── [slug]/page.jsx
│   ├── kien-thuc/
│   │   ├── page.jsx              ← ✅ Cần hoàn thiện
│   │   └── [slug]/page.jsx       ← ✅ Cần thêm
│   ├── dat-lich/page.jsx         ← ✅ Cần tạo mới
│   ├── hop-tac-cung-chan-an/     ← Cần nội dung
│   └── lien-he/
│
├── api/
│   ├── admin/stats/route.js      ← ✅ Cần thêm
│   └── appointments/export/      ← ✅ Sprint 4
│
├── components/
│   ├── Header.jsx                ← Thêm TopBar
│   ├── VoucherBanner.jsx         ← Fix CSS animation
│   ├── ProductCard.jsx           ← Thêm hover + badge
│   ├── ImageUpload.jsx           ← ✅ Cần tạo
│   ├── RichTextEditor.jsx        ← ✅ Cần tạo
│   ├── BookingForm.jsx           ← ✅ Cần tạo
│   └── ZaloWidget.jsx            ← ✅ Sprint 4
│
├── not-found.jsx                 ← ✅ Cần tạo
├── sitemap.js                    ← ✅ Cần tạo
└── robots.js                     ← ✅ Cần tạo
```

---

## ✅ Checklist Tổng Hợp

### Sprint 1 — Bugfix & Nền tảng
- [ ] Ảnh toàn bộ lên Cloudinary, xóa link chanan.vn
- [ ] Fix voucher banner CSS animation
- [ ] Upload logo + favicon
- [ ] Điền giá dịch vụ và nội dung seed
- [ ] Trang 404 tùy chỉnh
- [ ] Loading skeleton

### Sprint 2 — UI
- [ ] Top bar + sticky header
- [ ] Hover effect cards
- [ ] Trang `/dich-vu-cham-soc/[slug]`
- [ ] Trang `/kien-thuc` + `/kien-thuc/[slug]`
- [ ] Form đặt lịch `/dat-lich`
- [ ] Google Maps footer
- [ ] SEO: sitemap, robots, Open Graph

### Sprint 3 — Admin Panel
- [ ] Layout sidebar admin responsive
- [ ] Dashboard stat cards
- [ ] CRUD sản phẩm + upload ảnh
- [ ] CRUD dịch vụ
- [ ] CRUD bài viết + TipTap editor
- [ ] Quản lý lịch hẹn
- [ ] Inbox liên hệ
- [ ] Trang cài đặt

### Sprint 4 — Nâng cao
- [ ] Zalo widget
- [ ] Email xác nhận lịch hẹn
- [ ] Hệ thống review
- [ ] Export Excel
- [ ] Google Analytics

---

## 📝 Ghi Chú Kỹ Thuật

- **CSS Modules** — tiếp tục dùng nhất quán, không mix với Tailwind
- **Server Actions** — ưu tiên dùng cho form submit thay vì API route riêng
- **Image** — luôn dùng `next/image`, chỉ host trên Cloudinary
- **Auth** — JWT hiện tại đủ dùng, chưa cần nâng cấp NextAuth
- **Deploy** — Vercel + Supabase (PostgreSQL) là setup ổn định nhất
- **Branch strategy** — `main` (production) → `develop` → `feature/sprint-X-task-Y`

---

*Kế hoạch này dự kiến hoàn thiện trong **6–8 tuần** với 1 developer.*  
*Cập nhật lần cuối: 13/04/2026*
