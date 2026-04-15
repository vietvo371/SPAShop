import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login/register pages without auth
  if (pathname.includes("/admin/login") || pathname.includes("/admin/register")) {
    return NextResponse.next();
  }

  // Check auth for other admin pages
  const token = request.cookies.get("chanan_auth_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
