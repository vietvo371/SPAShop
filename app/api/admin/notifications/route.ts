import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      pendingAppointments,
      pendingOrders,
      newMessages,
      newConsultations,
    ] = await Promise.all([
      prisma.appointment.count({
        where: {
          status: "PENDING",
        },
      }),
      prisma.order.count({
        where: {
          status: "PENDING",
        },
      }),
      prisma.contactMessage.count({
        where: {
          status: "NEW",
        },
      }),
      prisma.consultationLead.count({
        where: {
          status: "NEW",
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        appointments: pendingAppointments,
        orders: pendingOrders,
        contact: newMessages,
        consultations: newConsultations,
      },
    });
  } catch (error) {
    console.error("Notifications API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
