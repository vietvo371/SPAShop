import { prisma } from "./prisma";
import productsData from "../data/products.json";
import productDetails from "../data/product_details.json";

async function main() {
    console.log("🚀 Bắt đầu migration dữ liệu từ JSON vào Database...");

    // 1. Lấy danh sách categories hiện có để map
    const categories = await prisma.category.findMany();
    const categoryMap = {
        "Máy hồng ngoại xa": categories.find(c => c.slug === "may-hong-ngoai-xa"),
        "Thiết bị FIR không dùng điện": categories.find(c => c.slug === "thiet-bi-fir-khong-dien"),
        "Trang sức hồng ngoại xa": categories.find(c => c.slug === "trang-suc-hong-ngoai-xa"),
    };

    for (const item of productsData) {
        console.log(`📦 Đang xử lý sản phẩm: ${item.name}`);

        // Xác định category (dựa trên keyword trong tên hoặc mặc định)
        let categoryId = categories[0]?.id; // Default to first category
        if (item.name.toLowerCase().includes("trang sức") || item.name.toLowerCase().includes("vòng") || item.name.toLowerCase().includes("lắc") || item.name.toLowerCase().includes("dây chuyền")) {
            categoryId = categoryMap["Trang sức hồng ngoại xa"]?.id || categoryId;
        } else if (item.name.toLowerCase().includes("máy") || item.name.toLowerCase().includes("đai màng")) {
            categoryId = categoryMap["Máy hồng ngoại xa"]?.id || categoryId;
        } else {
            categoryId = categoryMap["Thiết bị FIR không dùng điện"]?.id || categoryId;
        }

        // 1. Upsert Product
        const product = await prisma.product.upsert({
            where: { slug: item.slug },
            update: {
                name: item.name,
                price: item.price,
                description: item.description,
                imageUrl: item.image_url,
                categoryId: categoryId,
                isActive: true,
            },
            create: {
                name: item.name,
                slug: item.slug,
                price: item.price,
                description: item.description,
                imageUrl: item.image_url,
                categoryId: categoryId,
                isActive: true,
            },
        });

        // 2. Xử lý Images (Gallery)
        const details = (productDetails as any)[item.slug];
        if (details && details.gallery_images) {
            // Xóa ảnh cũ và tạo mới để đồng bộ
            await prisma.productImage.deleteMany({
                where: { productId: product.id },
            });

            await prisma.productImage.createMany({
                data: details.gallery_images.map((url: string, index: number) => ({
                    productId: product.id,
                    url: url,
                    isPrimary: index === 0,
                    orderIndex: index,
                })),
            });
        }

        // 3. Xử lý Product Details
        if (details) {
            await prisma.productDetail.upsert({
                where: { productId: product.id },
                update: {
                    galleryImages: details.gallery_images || [],
                    fullDescHtml: details.full_description || "",
                    specsDetailed: details.specs_detailed || {},
                    functionsHtml: details.functions_content || "",
                },
                create: {
                    productId: product.id,
                    galleryImages: details.gallery_images || [],
                    fullDescHtml: details.full_description || "",
                    specsDetailed: details.specs_detailed || {},
                    functionsHtml: details.functions_content || "",
                },
            });
        }
    }

    console.log("\n✅ Migration hoàn tất!");
}

main()
    .catch((e) => {
        console.error("❌ Migration error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
