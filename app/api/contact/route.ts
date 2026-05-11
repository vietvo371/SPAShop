import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { contactSchema } from "@/app/lib/validations";
import { sendContactNotification } from "@/app/lib/email";
import { getCurrentUser } from "@/app/lib/auth";

// ============================================
// GET /api/contact - Lấy danh sách tin nhắn (Admin)
// ============================================
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const limitParam = parseInt(searchParams.get("limit") || "20", 10);
    const page = Number.isNaN(pageParam) ? 1 : Math.max(1, pageParam);
    const limit = Number.isNaN(limitParam) ? 20 : Math.min(100, Math.max(1, limitParam));
    const status = searchParams.get("status");

    const where = {
      ...(status && { status: status as "NEW" | "READ" | "REPLIED" }),
    };

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        include: {
          repliedBy: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contactMessage.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Contact GET error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi lấy danh sách tin nhắn" },
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/contact - Gửi tin nhắn liên hệ (Public)
// ============================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // Lưu vào database
    const message = await prisma.contactMessage.create({
      data: {
        name: validatedData.name,
        phone: validatedData.phone,
        email: validatedData.email || null,
        message: validatedData.message,
        status: "NEW",
      },
    });

    // Gửi email thông báo cho admin (chạy async, không block response)
    sendContactNotification({
      name: validatedData.name,
      phone: validatedData.phone,
      email: validatedData.email,
      message: validatedData.message,
    }).catch((err) => {
      console.error("Failed to send contact notification email:", err);
    });

    return NextResponse.json(
      {
        success: true,
        data: { id: message.id },
        message: "Gửi tin nhắn thành công. Chúng tôi sẽ liên hệ bạn sớm nhất.",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Contact POST error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Lỗi khi gửi tin nhắn" },
      { status: 500 }
    );
  }
}
