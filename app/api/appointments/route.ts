import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { appointmentSchema } from "@/app/lib/validations";
import { sendAppointmentAdminNotification } from "@/app/lib/email";

// ============================================
// GET /api/appointments - Lấy danh sách lịch hẹn (Admin)
// ============================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const date = searchParams.get("date");

    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
    }

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
          staff: {
            select: { id: true, name: true },
          },
        },
        orderBy: [{ appointmentDate: "asc" }, { appointmentTime: "asc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.appointment.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: appointments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Appointments GET error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi lấy danh sách lịch hẹn" },
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/appointments - Tạo lịch hẹn mới (Public)
// ============================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = appointmentSchema.parse(body);

    // Parse date
    const appointmentDate = new Date(validatedData.appointmentDate);
    if (isNaN(appointmentDate.getTime())) {
      return NextResponse.json(
        { success: false, error: "Ngày hẹn không hợp lệ" },
        { status: 400 }
      );
    }

    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (appointmentDate < today) {
      return NextResponse.json(
        { success: false, error: "Ngày hẹn không thể là ngày trong quá khứ" },
        { status: 400 }
      );
    }

    // Lấy thông tin dịch vụ
    let serviceName = "Không chọn dịch vụ";
    if (validatedData.serviceId) {
      const service = await prisma.service.findUnique({
        where: { id: validatedData.serviceId },
      });
      if (service) {
        serviceName = service.name;
      }
    }

    // Format date
    const formattedDate = appointmentDate.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Lưu vào database
    const appointment = await prisma.appointment.create({
      data: {
        customerName: validatedData.customerName,
        customerPhone: validatedData.customerPhone,
        customerEmail: validatedData.customerEmail || null,
        serviceId: validatedData.serviceId || null,
        appointmentDate,
        appointmentTime: validatedData.appointmentTime || null,
        notes: validatedData.notes || null,
        status: "PENDING",
      },
      include: {
        service: true,
      },
    });

    // Gửi email thông báo cho admin (chạy async)
    sendAppointmentAdminNotification({
      customerName: validatedData.customerName,
      customerPhone: validatedData.customerPhone,
      customerEmail: validatedData.customerEmail,
      serviceName,
      appointmentDate: formattedDate,
      appointmentTime: validatedData.appointmentTime || "Chưa chọn giờ",
      notes: validatedData.notes,
    }).catch((err) => {
      console.error("Failed to send appointment notification email:", err);
    });

    return NextResponse.json(
      {
        success: true,
        data: { id: appointment.id },
        message: "Đặt lịch hẹn thành công. Chúng tôi sẽ xác nhận qua điện thoại.",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Appointments POST error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Lỗi khi tạo lịch hẹn" },
      { status: 500 }
    );
  }
}
