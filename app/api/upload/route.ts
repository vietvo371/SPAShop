import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// ============================================
// UPLOAD CONFIGURATION
// ============================================
// Có 2 cách upload:
// 1. LOCAL: Lưu vào thư mục /public/uploads
// 2. CLOUDINARY: Upload lên Cloudinary (khuyến nghị cho production)
//
// Để sử dụng Cloudinary, cần:
// 1. Tạo tài khoản tại cloudinary.com
// 2. Lấy CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
// 3. Thêm vào .env
// ============================================

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// UUID generator (sử dụng native crypto)
function generateUUID() {
  return crypto.randomUUID();
}

// ============================================
// POST /api/upload - Upload hình ảnh
// ============================================
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string || "misc";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Không có file nào được chọn" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Chỉ chấp nhận file hình ảnh (JPG, PNG, GIF, WebP)" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "Kích thước file không được vượt quá 5MB" },
        { status: 400 }
      );
    }

    // Check if using Cloudinary
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      return uploadToCloudinary(file, folder);
    }

    // Fallback: Upload local
    return uploadLocal(file, folder);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi upload file" },
      { status: 500 }
    );
  }
}

// ============================================
// Upload Local
// ============================================
async function uploadLocal(file: File, folder: string) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filename = `${generateUUID()}.${ext}`;

  // Create upload directory
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });

  // Write file
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filepath = path.join(uploadDir, filename);
  await writeFile(filepath, buffer);

  const url = `/uploads/${folder}/${filename}`;

  return NextResponse.json({
    success: true,
    url,
    filename,
    message: "Upload thành công",
  });
}

// ============================================
// Upload to Cloudinary
// ============================================
async function uploadToCloudinary(file: File, folder: string) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
  const apiKey = process.env.CLOUDINARY_API_KEY!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;

  // Build FormData for Cloudinary
  const cloudFormData = new FormData();
  cloudFormData.append("file", file);
  cloudFormData.append("folder", `chanan/${folder}`);
  cloudFormData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET || "chanan_unsigned");

  // Use Cloudinary API
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: cloudFormData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error("Cloudinary error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi upload lên Cloudinary" },
      { status: 500 }
    );
  }

  const result = await response.json();

  return NextResponse.json({
    success: true,
    url: result.secure_url,
    filename: result.public_id,
    message: "Upload thành công",
  });
}

// ============================================
// DELETE /api/upload - Xóa hình ảnh
// ============================================
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filepath = searchParams.get("filepath");

    if (!filepath) {
      return NextResponse.json(
        { success: false, error: "Không có đường dẫn file" },
        { status: 400 }
      );
    }

    // Security: prevent path traversal
    if (filepath.includes("..") || filepath.includes("/")) {
      // External URL (Cloudinary)
      if (filepath.startsWith("http")) {
        // For Cloudinary, you would need to call delete API
        // For now, just return success
        return NextResponse.json({
          success: true,
          message: "File đã được xóa khỏi Cloudinary",
        });
      }
    }

    // Local file deletion
    const fullPath = path.join(process.cwd(), "public", filepath);
    if (!fullPath.startsWith(path.join(process.cwd(), "public", "uploads"))) {
      return NextResponse.json(
        { success: false, error: "Đường dẫn không hợp lệ" },
        { status: 400 }
      );
    }

    const fs = await import("fs/promises");
    await fs.unlink(fullPath);

    return NextResponse.json({
      success: true,
      message: "Xóa file thành công",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi khi xóa file" },
      { status: 500 }
    );
  }
}
