"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { productSchema, productDetailSchema, generateSlug } from "@/app/lib/validations";
import { requireRole } from "@/app/lib/auth";

// ============================================
// PRODUCT ACTIONS
// ============================================

export async function getProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  featured?: boolean;
}) {
  const { page = 1, limit = 20, search, categoryId, featured } = params || {};

  const where = {
    isActive: true,
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(categoryId && { categoryId }),
    ...(featured !== undefined && { isFeatured: featured }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { where: { isPrimary: true }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map((p) => ({
      ...p,
      primaryImage: p.images[0]?.url || p.imageUrl,
      images: undefined,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id, isActive: true },
    include: {
      category: true,
      images: { orderBy: [{ isPrimary: "desc" }, { orderIndex: "asc" }] },
      details: true,
    },
  });

  return product;
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: true,
      images: { orderBy: [{ isPrimary: "desc" }, { orderIndex: "asc" }] },
      details: true,
    },
  });

  return product;
}

export async function createProduct(data: {
  name: string;
  price: string;
  description?: string;
  specs?: string;
  imageUrl?: string;
  categoryId?: string;
  isFeatured?: boolean;
}) {
  await requireRole(["ADMIN", "STAFF"]);

  const slug = generateSlug(data.name);

  const product = await prisma.product.create({
    data: {
      ...data,
      slug,
    },
    include: { category: true, images: true },
  });

  revalidatePath("/admin/products");
  revalidatePath("/san-pham");

  return product;
}

export async function updateProduct(
  id: string,
  data: Partial<Parameters<typeof productSchema.parse>[0]>
) {
  await requireRole(["ADMIN", "STAFF"]);

  const product = await prisma.product.update({
    where: { id },
    data,
    include: { category: true, images: true },
  });

  revalidatePath("/admin/products");
  revalidatePath("/san-pham");
  revalidatePath(`/san-pham/${product.slug}`);

  return product;
}

export async function deleteProduct(id: string) {
  await requireRole(["ADMIN"]);

  await prisma.product.update({
    where: { id },
    data: { isActive: false },
  });

  revalidatePath("/admin/products");
  revalidatePath("/san-pham");
}

export async function updateProductDetails(
  productId: string,
  data: Partial<Parameters<typeof productDetailSchema.parse>[0]>
) {
  await requireRole(["ADMIN", "STAFF"]);

  const details = await prisma.productDetail.upsert({
    where: { productId },
    create: { productId, ...data },
    update: data,
  });

  revalidatePath(`/san-pham/${productId}`);

  return details;
}

// ============================================
// CATEGORY ACTIONS
// ============================================

export async function getCategories() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { orderIndex: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return categories;
}

export async function createCategory(data: {
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  orderIndex?: number;
}) {
  await requireRole(["ADMIN", "STAFF"]);

  const slug = data.slug || generateSlug(data.name);

  const category = await prisma.category.create({
    data: { ...data, slug },
  });

  revalidatePath("/admin/categories");

  return category;
}

export async function updateCategory(
  id: string,
  data: Partial<Parameters<typeof prisma.category.update>[0]["data"]>
) {
  await requireRole(["ADMIN", "STAFF"]);

  const category = await prisma.category.update({
    where: { id },
    data,
  });

  revalidatePath("/admin/categories");

  return category;
}

export async function deleteCategory(id: string) {
  await requireRole(["ADMIN"]);

  await prisma.category.update({
    where: { id },
    data: { isActive: false },
  });

  revalidatePath("/admin/categories");
}
