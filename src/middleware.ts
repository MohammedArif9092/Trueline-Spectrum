import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE = "tls_session";

function secret(): Uint8Array {
  return new TextEncoder().encode(process.env.AUTH_SECRET || "");
}

// Protect all /admin routes except the login page and its API.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isLogin = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";
  if (isLogin || isLoginApi) return NextResponse.next();

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = req.cookies.get(COOKIE)?.value;
    let valid = false;
    if (token) {
      try {
        await jwtVerify(token, secret());
        valid = true;
      } catch {
        valid = false;
      }
    }
    if (!valid) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
