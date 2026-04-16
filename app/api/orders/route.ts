import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { orderSchema } from "@/app/lib/validations";
import { getCurrentUser } from "@/app/lib/auth";

// Helper to generate a unique order number
async function generateOrderNumber() {
    const date = new Date();
    const dateStr = date.getFullYear().toString().slice(-2) +
        (date.getMonth() + 1).toString().padStart(2, '0') +
        date.getDate().toString().padStart(2, '0');

    // Get count of orders today to increment
    const todayCount = await prisma.order.count({
        where: {
            createdAt: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),
                lte: new Date(new Date().setHours(23, 59, 59, 999))
            }
        }
    });

    const sequence = (todayCount + 1).toString().padStart(3, '0');
    return `TA${dateStr}${sequence}`; // TA = Tâm An
}

// ============================================
// POST /api/orders - Tạo đơn hàng mới (Client)
// ============================================
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = orderSchema.parse(body);

        const orderNumber = await generateOrderNumber();

        // Create order and its items in a transaction
        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    orderNumber,
                    customerName: validatedData.customerName,
                    customerPhone: validatedData.customerPhone,
                    customerEmail: validatedData.customerEmail,
                    customerAddress: validatedData.customerAddress,
                    province: validatedData.province,
                    district: validatedData.district,
                    ward: validatedData.ward,
                    notes: validatedData.notes,
                    paymentMethod: validatedData.paymentMethod,
                    totalAmount: validatedData.totalAmount || 0,
                    status: "PENDING",
                    items: {
                        create: validatedData.items.map(item => ({
                            productId: item.productId,
                            productName: item.productName,
                            price: item.price,
                            quantity: item.quantity,
                            imageUrl: item.imageUrl
                        }))
                    }
                },
                include: {
                    items: true
                }
            });
            return newOrder;
        });

        return NextResponse.json(
            { success: true, orderId: order.id, orderNumber: order.orderNumber, message: "Đặt hàng thành công!" },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Order POST error:", error);
        if (error.name === "ZodError") {
            return NextResponse.json(
                { success: false, error: "Dữ liệu không hợp lệ", details: error.errors },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, error: "Lỗi khi xử lý đơn hàng" },
            { status: 500 }
        );
    }
}

// ============================================
// GET /api/orders - Lấy danh sách đơn hàng (Admin)
// ============================================
export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
            return NextResponse.json(
                { success: false, error: "Không có quyền truy cập" },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const status = searchParams.get("status");
        const search = searchParams.get("search") || "";

        const where = {
            ...(status && { status: status as any }),
            ...(search && {
                OR: [
                    { customerName: { contains: search, mode: "insensitive" as const } },
                    { customerPhone: { contains: search, mode: "insensitive" as const } },
                    { orderNumber: { contains: search, mode: "insensitive" as const } },
                ],
            }),
        };

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    items: true
                },
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.order.count({ where }),
        ]);

        return NextResponse.json({
            success: true,
            data: orders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Orders GET error:", error);
        return NextResponse.json(
            { success: false, error: "Lỗi khi lấy danh sách đơn hàng" },
            { status: 500 }
        );
    }
}
