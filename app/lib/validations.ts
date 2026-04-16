import { z } from "zod";

// ============================================
// AUTH SCHEMAS
// ============================================
export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const registerSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  phone: z.string().optional(),
});

// ============================================
// PRODUCT SCHEMAS
// ============================================
export const productSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm không được trống"),
  slug: z.string().min(1, "Slug không được trống"),
  price: z.string().min(1, "Giá không được trống"),
  description: z.string().optional(),
  specs: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  categoryId: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  images: z.array(z.object({
    id: z.string().optional(),
    url: z.string().url("Đường dẫn hình ảnh không hợp lệ"),
    isPrimary: z.boolean().default(false),
    orderIndex: z.number().default(0),
  })).optional(),
});

export const productDetailSchema = z.object({
  galleryImages: z.array(z.string()).optional(),
  fullDescHtml: z.string().optional(),
  specsDetailed: z.record(z.string(), z.string()).optional(),
  functionsHtml: z.string().optional(),
});

// ============================================
// SERVICE SCHEMAS
// ============================================
export const serviceSchema = z.object({
  name: z.string().min(1, "Tên dịch vụ không được trống"),
  slug: z.string().min(1, "Slug không được trống"),
  description: z.string().optional(),
  process: z.string().optional(),
  duration: z.string().optional(),
  price: z.string().optional(),
  icon: z.string().optional(),
  orderIndex: z.number().optional(),
  isActive: z.boolean().optional(),
});

// ============================================
// ARTICLE SCHEMAS
// ============================================
export const articleSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được trống"),
  slug: z.string().min(1, "Slug không được trống"),
  excerpt: z.string().optional(),
  contentHtml: z.string().optional(),
  imageUrl: z.string().optional(),
  category: z.string().optional(),
  publishedAt: z.string().datetime().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

// ============================================
// CONTACT SCHEMAS
// ============================================
export const contactSchema = z.object({
  name: z.string().min(1, "Tên không được trống"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().min(10, "Tin nhắn phải có ít nhất 10 ký tự"),
});

// ============================================
// APPOINTMENT SCHEMAS
// ============================================
export const appointmentSchema = z.object({
  customerName: z.string().min(1, "Tên không được trống"),
  customerPhone: z.string().min(10, "Số điện thoại không hợp lệ"),
  customerEmail: z.string().email().optional().or(z.literal("")),
  serviceId: z.string().optional(),
  appointmentDate: z.string().min(1, "Ngày hẹn không được trống"),
  appointmentTime: z.string().optional(),
  notes: z.string().optional(),
});

// ============================================
// CATEGORY SCHEMAS
// ============================================
export const categorySchema = z.object({
  name: z.string().min(1, "Tên danh mục không được trống"),
  slug: z.string().min(1, "Slug không được trống"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  orderIndex: z.number().optional(),
  isActive: z.boolean().optional(),
});

// ============================================
// ORDER SCHEMAS
// ============================================
export const orderItemSchema = z.object({
  productId: z.string().optional(),
  productName: z.string().min(1, "Tên sản phẩm không được trống"),
  price: z.number().min(0),
  quantity: z.number().min(1),
  imageUrl: z.string().optional(),
});

export const orderSchema = z.object({
  customerName: z.string().min(1, "Tên khách hàng không được trống"),
  customerPhone: z.string().min(10, "Số điện thoại không hợp lệ"),
  customerEmail: z.string().email().optional().or(z.literal("")),
  customerAddress: z.string().min(1, "Địa chỉ không được trống"),
  province: z.string().min(1, "Tỉnh/Thành không được trống"),
  district: z.string().min(1, "Quận/Huyện không được trống"),
  ward: z.string().min(1, "Phường/Xã không được trống"),
  notes: z.string().optional(),
  paymentMethod: z.enum(["COD", "TRANSFER"]).default("COD"),
  items: z.array(orderItemSchema).min(1, "Giỏ hàng không được trống"),
  totalAmount: z.number().optional(),
});

// ============================================
// SLIDER SCHEMAS
// ============================================
export const sliderSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  imageUrl: z.string().min(1, "Hình ảnh không được trống"),
  linkUrl: z.string().optional(),
  buttonText: z.string().optional(),
  orderIndex: z.number().optional(),
  isActive: z.boolean().optional(),
});

// ============================================
// TESTIMONIAL SCHEMAS
// ============================================
export const testimonialSchema = z.object({
  customerName: z.string().min(1, "Tên khách hàng không được trống"),
  content: z.string().min(10, "Nội dung phải có ít nhất 10 ký tự"),
  rating: z.number().min(1).max(5).optional(),
  avatarUrl: z.string().optional(),
  orderIndex: z.number().optional(),
  isActive: z.boolean().optional(),
});

// ============================================
// UTILITY SCHEMAS
// ============================================
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

// ============================================
// API RESPONSE TYPES
// ============================================
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Slug generator
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, (match) => (match === "Đ" ? "d" : "d"))
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
