"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { serviceSchema, articleSchema, generateSlug } from "@/app/lib/validations";
import { requireRole } from "@/app/lib/auth";

// ============================================
// SERVICE ACTIONS
// ============================================

export async function getServices() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { orderIndex: "asc" },
  });

  return services;
}

export async function getServiceById(id: string) {
  const service = await prisma.service.findUnique({
    where: { id },
  });

  return service;
}

export async function createService(data: {
  name: string;
  description?: string;
  process?: string;
  duration?: string;
  price?: string;
  icon?: string;
  orderIndex?: number;
}) {
  await requireRole(["ADMIN", "STAFF"]);

  const slug = generateSlug(data.name);

  const service = await prisma.service.create({
    data: { ...data, slug },
  });

  revalidatePath("/admin/services");
  revalidatePath("/dich-vu-cham-soc");

  return service;
}

export async function updateService(
  id: string,
  data: Partial<Parameters<typeof prisma.service.update>[0]["data"]>
) {
  await requireRole(["ADMIN", "STAFF"]);

  const service = await prisma.service.update({
    where: { id },
    data,
  });

  revalidatePath("/admin/services");
  revalidatePath("/dich-vu-cham-soc");

  return service;
}

export async function deleteService(id: string) {
  await requireRole(["ADMIN"]);

  await prisma.service.update({
    where: { id },
    data: { isActive: false },
  });

  revalidatePath("/admin/services");
  revalidatePath("/dich-vu-cham-soc");
}

// ============================================
// ARTICLE ACTIONS
// ============================================

export async function getArticles(params?: {
  page?: number;
  limit?: number;
  category?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}) {
  const { page = 1, limit = 10, category, status } = params || {};

  const where: Record<string, unknown> = {};
  if (status) {
    where.status = status;
  } else {
    where.status = "PUBLISHED";
  }
  if (category) where.category = category;

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.article.count({ where }),
  ]);

  return {
    articles,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getArticleBySlug(slug: string) {
  const article = await prisma.article.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      author: { select: { id: true, name: true, avatarUrl: true } },
    },
  });

  if (article) {
    await prisma.article.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
    });
  }

  return article;
}

export async function createArticle(data: {
  title: string;
  excerpt?: string;
  contentHtml?: string;
  imageUrl?: string;
  category?: string;
  publishedAt?: Date;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}) {
  await requireRole(["ADMIN", "STAFF"]);

  const slug = generateSlug(data.title);
  const user = await requireRole(["ADMIN", "STAFF"]);

  const article = await prisma.article.create({
    data: {
      ...data,
      slug,
      authorId: user.id,
    },
  });

  revalidatePath("/admin/articles");
  revalidatePath("/kien-thuc");

  return article;
}

export async function updateArticle(
  id: string,
  data: Partial<Parameters<typeof prisma.article.update>[0]["data"]>
) {
  await requireRole(["ADMIN", "STAFF"]);

  if (data.title && typeof data.title === "string") {
    data.slug = generateSlug(data.title);
  }

  const article = await prisma.article.update({
    where: { id },
    data,
  });

  revalidatePath("/admin/articles");
  revalidatePath("/kien-thuc");
  revalidatePath(`/kien-thuc/${article.slug}`);

  return article;
}

export async function deleteArticle(id: string) {
  await requireRole(["ADMIN"]);

  await prisma.article.update({
    where: { id },
    data: { status: "ARCHIVED" },
  });

  revalidatePath("/admin/articles");
  revalidatePath("/kien-thuc");
}

// ============================================
// CONTACT MESSAGE ACTIONS
// ============================================

export async function getContactMessages(params?: {
  page?: number;
  limit?: number;
  status?: "NEW" | "READ" | "REPLIED";
}) {
  await requireRole(["ADMIN", "STAFF"]);

  const { page = 1, limit = 20, status } = params || {};

  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const [messages, total] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      include: {
        repliedBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.contactMessage.count({ where }),
  ]);

  return {
    messages,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function createContactMessage(data: {
  name: string;
  phone: string;
  email?: string;
  message: string;
}) {
  const message = await prisma.contactMessage.create({
    data: {
      ...data,
      status: "NEW",
    },
  });

  return message;
}

export async function updateContactMessageStatus(
  id: string,
  status: "NEW" | "READ" | "REPLIED",
  replyNote?: string
) {
  await requireRole(["ADMIN", "STAFF"]);

  const user = await requireRole(["ADMIN", "STAFF"]);

  const message = await prisma.contactMessage.update({
    where: { id },
    data: {
      status,
      repliedById: user.id,
      repliedAt: status === "REPLIED" ? new Date() : undefined,
      replyNote,
    },
  });

  revalidatePath("/admin/contact");

  return message;
}

// ============================================
// APPOINTMENT ACTIONS
// ============================================

export async function getAppointments(params?: {
  page?: number;
  limit?: number;
  status?: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  date?: string;
}) {
  await requireRole(["ADMIN", "STAFF"]);

  const { page = 1, limit = 20, status, date } = params || {};

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (date) {
    where.appointmentDate = {
      gte: new Date(`${date}T00:00:00`),
      lte: new Date(`${date}T23:59:59`),
    };
  }

  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      include: {
        service: true,
        staff: { select: { id: true, name: true } },
      },
      orderBy: [{ appointmentDate: "asc" }, { appointmentTime: "asc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.appointment.count({ where }),
  ]);

  return {
    appointments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function createAppointment(data: {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId?: string;
  appointmentDate: Date;
  appointmentTime?: string;
  notes?: string;
}) {
  const appointment = await prisma.appointment.create({
    data: {
      ...data,
      status: "PENDING",
    },
    include: { service: true },
  });

  revalidatePath("/admin/appointments");

  return appointment;
}

export async function updateAppointmentStatus(
  id: string,
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
) {
  await requireRole(["ADMIN", "STAFF"]);

  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status },
    include: { service: true, customer: true },
  });

  revalidatePath("/admin/appointments");

  return appointment;
}

// ============================================
// SLIDER ACTIONS
// ============================================

export async function getSliders() {
  const sliders = await prisma.slider.findMany({
    where: { isActive: true },
    orderBy: { orderIndex: "asc" },
  });

  return sliders;
}

export async function createSlider(data: {
  title?: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  buttonText?: string;
  orderIndex?: number;
}) {
  await requireRole(["ADMIN", "STAFF"]);

  const slider = await prisma.slider.create({ data });

  revalidatePath("/admin/sliders");

  return slider;
}

export async function updateSlider(
  id: string,
  data: Partial<Parameters<typeof prisma.slider.update>[0]["data"]>
) {
  await requireRole(["ADMIN", "STAFF"]);

  const slider = await prisma.slider.update({
    where: { id },
    data,
  });

  revalidatePath("/admin/sliders");

  return slider;
}

export async function deleteSlider(id: string) {
  await requireRole(["ADMIN"]);

  await prisma.slider.delete({ where: { id } });

  revalidatePath("/admin/sliders");
}

// ============================================
// TESTIMONIAL ACTIONS
// ============================================

export async function getTestimonials() {
  const testimonials = await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { orderIndex: "asc" },
  });

  return testimonials;
}

export async function createTestimonial(data: {
  customerName: string;
  content: string;
  rating?: number;
  avatarUrl?: string;
  orderIndex?: number;
}) {
  await requireRole(["ADMIN", "STAFF"]);

  const testimonial = await prisma.testimonial.create({ data });

  revalidatePath("/admin/testimonials");

  return testimonial;
}

export async function updateTestimonial(
  id: string,
  data: Partial<Parameters<typeof prisma.testimonial.update>[0]["data"]>
) {
  await requireRole(["ADMIN", "STAFF"]);

  const testimonial = await prisma.testimonial.update({
    where: { id },
    data,
  });

  revalidatePath("/admin/testimonials");

  return testimonial;
}

export async function deleteTestimonial(id: string) {
  await requireRole(["ADMIN"]);

  await prisma.testimonial.update({
    where: { id },
    data: { isActive: false },
  });

  revalidatePath("/admin/testimonials");
}
