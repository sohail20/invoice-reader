// app/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const protectedPaths = ["/dashboard"];
  const pathname = req.nextUrl.pathname;

  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/signin";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Apply middleware only to certain routes
export const config = {
  matcher: ["/dashboard/:path*", "/dashboard/:path*"],
};
