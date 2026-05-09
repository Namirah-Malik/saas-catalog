import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

export async function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? ""
  const subdomain = host.split(".")[0]
  const pathname = req.nextUrl.pathname

  const isLocal = subdomain === "localhost" || subdomain === "127" || subdomain === "saas-catalog-client"
  const slug = isLocal
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

  const token = req.cookies.get("client-token")?.value

  if (!token) {
    const loginUrl = new URL("/login", req.url)
    if (slug) loginUrl.searchParams.set("tenant", slug)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "fallback-secret")
    const { payload } = await jwtVerify(token, secret)
    requestHeaders.set("x-user-id", payload.userId as string)
    requestHeaders.set("x-user-role", payload.role as string)
    return NextResponse.next({ request: { headers: requestHeaders } })
  } catch {
    const loginUrl = new URL("/login", req.url)
    if (slug) loginUrl.searchParams.set("tenant", slug)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}