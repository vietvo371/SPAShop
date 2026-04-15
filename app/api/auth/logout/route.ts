import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Xóa cookie auth token
    cookieStore.delete("chanan_auth_token");

    // Redirect về trang login
    return NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}