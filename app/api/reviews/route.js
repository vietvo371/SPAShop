import { NextResponse } from "next/server";
// import prisma from "@/prisma/prisma";

const mockReviews = [
  {
    id: "1",
    name: "Nguyễn Thị Lan",
    phone: "0912345678",
    rating: 5,
    content: "Tôi đã sử dụng sản phẩm thảm đá ngọc được 3 tháng và thấy sức khỏe cải thiện rõ rệt. Giấc ngủ ngon hơn, body nhẹ nhõm hơn rất nhiều.",
    serviceId: null,
    productId: "th-dam-da-ngoc",
    isApproved: true,
    createdAt: "2026-04-10T10:30:00Z",
  },
  {
    id: "2",
    name: "Trần Văn Minh",
    phone: "0987654321",
    rating: 5,
    content: "Sau khi trị liệu tại Tâm An, tôi thấy đỡ đau lưng hơn nhiều. Đội ngũ nhân viên rất chuyên nghiệp và tận tâm.",
    serviceId: "that-lung-eo",
    productId: null,
    isApproved: true,
    createdAt: "2026-04-08T14:20:00Z",
  },
  {
    id: "3",
    name: "Lê Thị Hương",
    phone: "0934567890",
    rating: 4,
    content: "Sản phẩm đai lưng FIR rất tốt, điều hòa đường huyết hiệu quả. Giá cả hợp lý, chất lượng tuyệt vời.",
    serviceId: null,
    productId: "dai-lung-fir",
    isApproved: true,
    createdAt: "2026-04-05T09:15:00Z",
  },
];

// GET: Lấy danh sách reviews đã duyệt
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get("serviceId");
    const productId = searchParams.get("productId");
    const limit = parseInt(searchParams.get("limit") || "10");

    // TODO: Thay bằng query thật khi kết nối database
    // const reviews = await prisma.review.findMany({
    //   where: {
    //     isApproved: true,
    //     ...(serviceId && { serviceId }),
    //     ...(productId && { productId }),
    //   },
    //   orderBy: { createdAt: "desc" },
    //   take: limit,
    // });

    let reviews = mockReviews.filter(r => r.isApproved);
    
    if (serviceId) {
      reviews = reviews.filter(r => r.serviceId === serviceId);
    }
    if (productId) {
      reviews = reviews.filter(r => r.productId === productId);
    }

    reviews = reviews.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: reviews,
      total: reviews.length,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi lấy danh sách đánh giá" },
      { status: 500 }
    );
  }
}

// POST: Tạo review mới
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, rating, content, serviceId, productId } = body;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập họ tên" },
        { status: 400 }
      );
    }

    if (!content || !content.trim() || content.length < 10) {
      return NextResponse.json(
        { success: false, error: "Nội dung đánh giá phải có ít nhất 10 ký tự" },
        { status: 400 }
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: "Đánh giá phải từ 1 đến 5 sao" },
        { status: 400 }
      );
    }

    // TODO: Thay bằng tạo record thật khi kết nối database
    // const review = await prisma.review.create({
    //   data: {
    //     name: name.trim(),
    //     phone: phone?.trim() || null,
    //     rating,
    //     content: content.trim(),
    //     serviceId: serviceId || null,
    //     productId: productId || null,
    //     isApproved: false, // Cần admin duyệt
    //   },
    // });

    // Mock response
    const newReview = {
      id: `temp-${Date.now()}`,
      name: name.trim(),
      phone: phone?.trim() || null,
      rating,
      content: content.trim(),
      serviceId: serviceId || null,
      productId: productId || null,
      isApproved: false,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Cảm ơn bạn đã đánh giá! Đánh giá sẽ được hiển thị sau khi duyệt.",
      data: newReview,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi tạo đánh giá" },
      { status: 500 }
    );
  }
}