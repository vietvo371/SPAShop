import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { consultationLeadSchema } from "@/app/lib/validations";
import { getCurrentUser } from "@/app/lib/auth";
// import { sendConsultationNotification } from "@/app/lib/email"; // Optional: Add later if needed

// ============================================
// GET /api/consultation - Lấy danh sách khách tư vấn (Admin)
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

    const [leads, total] = await Promise.all([
      prisma.consultationLead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.consultationLead.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Consultation GET error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi lấy danh sách khách tư vấn" },
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/consultation - Gửi kết quả Quiz (Public)
// ============================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = consultationLeadSchema.parse(body);

    const lead = await prisma.consultationLead.create({
      data: {
        name: validatedData.name,
        phone: validatedData.phone,
        email: validatedData.email || null,
        answers: validatedData.answers || {},
        status: "NEW",
      },
    });

    // Optional: Email notification
    // sendConsultationNotification({ ... }).catch(console.error);

    return NextResponse.json(
      {
        success: true,
        data: { id: lead.id },
        message: "Thông tin của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ sớm nhất.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Consultation POST error:", error);
    
    // Handle Zod validation errors
    if (error.name === "ZodError" || error.issues) {
      return NextResponse.json(
        { success: false, error: "Dữ liệu không hợp lệ: " + (error.issues?.[0]?.message || error.message) },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: "Lỗi hệ thống: " + error.message },
      { status: 500 }
    );
  }
}
