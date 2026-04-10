import { PrismaClient } from "../app/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Bắt đầu seed database...");

  // ============================================
  // 1. Tạo Admin User
  // ============================================
  console.log("👤 Tạo admin user...");
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@chanan.vn" },
    update: {},
    create: {
      email: "admin@chanan.vn",
      passwordHash: adminPassword,
      name: "Admin",
      role: "ADMIN" as any,
      phone: "0356308211",
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // ============================================
  // 2. Tạo Staff User
  // ============================================
  const staffPassword = await bcrypt.hash("staff123", 12);
  const staff = await prisma.user.upsert({
    where: { email: "staff@chanan.vn" },
    update: {},
    create: {
      email: "staff@chanan.vn",
      passwordHash: staffPassword,
      name: "Nhân viên",
      role: "STAFF",
      phone: "0356308212",
    },
  });
  console.log(`✅ Staff created: ${staff.email}`);

  // ============================================
  // 3. Tạo Categories
  // ============================================
  console.log("📂 Tạo categories...");
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "may-hong-ngoai-xa" },
      update: {},
      create: {
        name: "Máy hồng ngoại xa",
        slug: "may-hong-ngoai-xa",
        description: "Các loại máy hồng ngoại xa có điện",
        orderIndex: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "thiet-bi-fir-khong-dien" },
      update: {},
      create: {
        name: "Thiết bị FIR không dùng điện",
        slug: "thiet-bi-fir-khong-dien",
        description: "Các thiết bị FIR không cần nguồn điện",
        orderIndex: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "trang-suc-hong-ngoai-xa" },
      update: {},
      create: {
        name: "Trang sức hồng ngoại xa",
        slug: "trang-suc-hong-ngoai-xa",
        description: "Trang sức kết hợp công nghệ FIR",
        orderIndex: 3,
      },
    }),
  ]);
  console.log(`✅ Created ${categories.length} categories`);

  // ============================================
  // 4. Tạo Products
  // ============================================
  console.log("📦 Tạo products...");
  const products = [
    {
      name: "Cây Trâm Ánh Sáng Sinh Học Hồng Ngoại Xa",
      slug: "cay-tram-anh-sang-sinh-hoc-hong-ngoai-xa",
      price: "3.800.000₫",
      description: "Cây trâm massage thông kinh lạc, hỗ trợ tuần hoàn máu vùng đầu và cổ.",
      category: { connect: { id: categories[1].id } },
      isFeatured: true,
      imageUrl: "https://www.chanan.vn/upload/product/screenshot-2026-02-22-at-095708-5542.png",
    },
    {
      name: "Mặt Gốm Ánh Sáng Sinh Học Hồng Ngoại Xa",
      slug: "mat-gom-anh-sang-sinh-hoc-hong-ngoai-xa",
      price: "2.600.000₫",
      description: "Miếng gốm massage thông kinh lạc, ứng dụng công nghệ Nano phát tia hồng ngoại xa.",
      category: { connect: { id: categories[1].id } },
      isFeatured: true,
      imageUrl: "https://www.chanan.vn/upload/product/screenshot-2026-02-22-at-100131-7118.png",
    },
    {
      name: "Máy Nén Nhiệt Ánh Sáng Sinh Học Hồng Ngoại Xa",
      slug: "may-nen-nhiet-anh-sang-sinh-hoc-hong-ngoai-xa",
      price: "7.800.000₫",
      description: "Máy nén nhiệt công nghệ nano bán dẫn tia hồng ngoại xa là giải pháp hiện đại cho việc chăm sóc sức khỏe tại nhà.",
      category: { connect: { id: categories[0].id } },
      isFeatured: true,
      imageUrl: "https://www.chanan.vn/upload/product/screenshot-2026-02-22-at-102941-9735.png",
    },
    {
      name: "Đai Mắt Nhiệt Ánh Sáng Sinh Học Hồng Ngoại Xa",
      slug: "dai-mat-nhiet-anh-sang-sinh-hoc-hong-ngoai-xa",
      price: "5.800.000₫",
      description: "Giải pháp thư giãn mắt, giảm mệt mỏi và quầng thâm bằng nhiệt hồng ngoại xa.",
      category: { connect: { id: categories[0].id } },
      isFeatured: false,
      imageUrl: "https://www.chanan.vn/upload/product/screenshot-2026-02-22-at-102105-4919.png",
    },
    {
      name: "Vòng Tay Ánh Sáng Sinh Học Hồng Ngoại Xa",
      slug: "vong-tay-anh-sang-sinh-hoc-hong-ngoai-xa",
      price: "3.400.000₫",
      description: "Sản phẩm trang sức kết hợp công nghệ hiện đại giúp cân bằng năng lượng.",
      category: { connect: { id: categories[2].id } },
      isFeatured: false,
      imageUrl: "https://www.chanan.vn/upload/product/z73361033731347f36862839737f29aea22d16400563ee-4548.jpg",
    },
    {
      name: "Đai Lưng Ánh Sáng Sinh Học Hồng Ngoại Xa",
      slug: "dai-lung-anh-sang-sinh-hoc-hong-ngoai-xa",
      price: "16.800.000₫",
      description: "Đai lưng hồng ngoại xa hỗ trợ giảm đau lưng và cải thiện cột sống.",
      category: { connect: { id: categories[0].id } },
      isFeatured: false,
      imageUrl: "https://www.chanan.vn/upload/product/screenshot-2026-02-22-at-100254-2575.png",
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }
  console.log(`✅ Created ${products.length} products`);

  // ============================================
  // 5. Tạo Services
  // ============================================
  console.log("🛠️ Tạo services...");
  const services = [
    {
      name: "Soi Mạch Máu",
      slug: "soi-mach-mau",
      description: "Quan sát trực quan tình trạng tuần hoàn máu, hình thái mạch và lưu thông.",
      process: "Quan sát qua kính hiển vi công nghệ cao",
      duration: "15 - 20 phút / lần",
      icon: "🔬",
      orderIndex: 1,
    },
    {
      name: "Đo 12 Đường Kinh Lạc",
      slug: "do-12-duong-kinh-lac",
      description: "Phân tích năng lượng cơ thể, tìm nguyên nhân gốc rễ vấn đề sức khỏe.",
      process: "Sử dụng máy phân tích năng lượng Đài Loan",
      duration: "15 phút / lần",
      icon: "⚡",
      orderIndex: 2,
    },
    {
      name: "Thải Độc Đầu – Mặt",
      slug: "thai-doc-dau-mat",
      description: "Nâng cơ trẻ hóa da mặt, giải độc tố vùng da đầu chuyên sâu.",
      process: "Massage ấn huyệt kết hợp ánh sáng sinh học",
      duration: "60 phút / liệu trình",
      icon: "✨",
      orderIndex: 3,
    },
    {
      name: "Bài Hàn Tử Cung",
      slug: "bai-han-tu-cung",
      description: "Đào thải độc tố, cải thiện tình trạng kinh nguyệt và phục hồi tử cung.",
      process: "Xông đá muối và chiếu đèn hồng ngoại xa",
      duration: "45 phút / liệu trình",
      icon: "🌸",
      orderIndex: 4,
    },
    {
      name: "Hỗ Trợ Vấn Đề Về Mắt",
      slug: "ho-tro-van-de-ve-mat",
      description: "Cải thiện mỏi mắt, khô mắt và các vấn đề thị lực.",
      process: "Đai mắt nhiệt FIR kết hợp thảo dược",
      duration: "20 phút / lần",
      icon: "👁️",
      orderIndex: 5,
    },
    {
      name: "Chuyên Điều Trị Gout",
      slug: "chuyen-dieu-tri-gout",
      description: "Giảm đau, giảm viêm và hỗ trợ đào thải acid uric hiệu quả.",
      process: "Chiếu đèn hồng ngoại xa kết hợp nén nhiệt",
      duration: "30 - 45 phút / lần",
      icon: "💪",
      orderIndex: 6,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    });
  }
  console.log(`✅ Created ${services.length} services`);

  // ============================================
  // 6. Tạo Articles
  // ============================================
  console.log("📝 Tạo articles...");
  const articles = [
    {
      title: "Hồng ngoại xa (FIR) là gì? Tác dụng đối với sức khỏe",
      slug: "hong-ngoai-xa-fir-la-gi",
      excerpt: "Tìm hiểu về công nghệ hồng ngoại xa và những lợi ích tuyệt vời mà FIR mang lại cho sức khỏe con người...",
      contentHtml: "<p>Nội dung bài viết về FIR...</p>",
      imageUrl: "/images/hero-banner.png",
      category: "Kiến thức FIR",
      status: "PUBLISHED" as any,
      publishedAt: new Date("2026-03-25"),
      author: { connect: { id: admin.id } },
    },
    {
      title: "5 cách chăm sóc sức khỏe tại nhà với hồng ngoại xa",
      slug: "5-cach-cham-soc-suc-khoe-tai-nha-voi-hong-ngoai-xa",
      excerpt: "Hướng dẫn chi tiết cách sử dụng các thiết bị FIR tại nhà để cải thiện sức khỏe toàn diện...",
      contentHtml: "<p>Nội dung bài viết...</p>",
      imageUrl: "/images/hero-banner.png",
      category: "Hướng dẫn",
      status: "PUBLISHED" as any,
      publishedAt: new Date("2026-03-22"),
      author: { connect: { id: admin.id } },
    },
    {
      title: "Điều trị Gout bằng hồng ngoại xa: Giải pháp từ thiên nhiên",
      slug: "dieu-tri-gout-bang-hong-ngoai-xa",
      excerpt: "Liệu pháp hồng ngoại xa đã được chứng minh hiệu quả trong việc hỗ trợ điều trị bệnh Gout...",
      contentHtml: "<p>Nội dung bài viết...</p>",
      imageUrl: "/images/service-blood.png",
      category: "Sức khỏe",
      status: "PUBLISHED" as any,
      publishedAt: new Date("2026-03-20"),
      author: { connect: { id: admin.id } },
    },
  ];

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    });
  }
  console.log(`✅ Created ${articles.length} articles`);

  // ============================================
  // 7. Tạo Testimonials
  // ============================================
  console.log("⭐ Tạo testimonials...");
  const testimonials = [
    {
      customerName: "Nguyễn Thị Hương",
      content: "Tôi bị Gout nhiều năm, sau khi sử dụng liệu trình hồng ngoại xa tại Tâm An, các cơn đau giảm rõ rệt. Đội ngũ tư vấn rất nhiệt tình.",
      rating: 5,
      orderIndex: 1,
    },
    {
      customerName: "Trần Văn Minh",
      content: "Máy nén nhiệt FIR của Tâm An thật sự hiệu quả. Tôi dùng hàng ngày và thấy sức khỏe cải thiện đáng kể.",
      rating: 5,
      orderIndex: 2,
    },
    {
      customerName: "Lê Thị Mai",
      content: "Dịch vụ soi mạch máu tại đây rất chuyên nghiệp. Bác sĩ tư vấn kỹ và đưa ra lộ trình điều trị phù hợp.",
      rating: 5,
      orderIndex: 3,
    },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({
      data: testimonial,
    });
  }
  console.log(`✅ Created ${testimonials.length} testimonials`);

  // ============================================
  // 8. Tạo Sliders
  // ============================================
  console.log("🎠 Tạo sliders...");
  const sliders = [
    {
      title: "Chăm sóc sức khỏe bằng công nghệ FIR",
      subtitle: "Khỏe Từ Bên Trong",
      imageUrl: "/images/hero-banner.png",
      buttonText: "Tìm hiểu thêm",
      linkUrl: "/dich-vu-cham-soc",
      orderIndex: 1,
    },
  ];

  for (const slider of sliders) {
    await prisma.slider.create({
      data: slider,
    });
  }
  console.log(`✅ Created ${sliders.length} sliders`);

  console.log("\n🎉 Seed hoàn tất!");
  console.log("\n📋 Thông tin đăng nhập:");
  console.log("   Admin: admin@chanan.vn / admin123");
  console.log("   Staff: staff@chanan.vn / staff123");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
