import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

export async function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? ""
  const subdomain = host.split(".")[0]
  const pathname = req.nextUrl.pathname

  const isVercel = host.includes("vercel.app") || host.includes("localhost")
  const slug = isVercel
    ? req.nextUrl.searchParams.get("tenant") ?? ""
    : subdomain

  const requestHeaders = new Headers(req.headers)
  requestHeaders.set("x-tenant-slug", slug)

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/login"
  ) {
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}