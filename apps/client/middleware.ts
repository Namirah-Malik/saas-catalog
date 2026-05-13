import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

export async function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? ""
  const subdomain = host.split(".")[0]
  const pathname = req.nextUrl.pathname

  const isLocal = subdomain === "localhost" || subdomain === "127"
  const isVercel = host === "saas-catalog-client.vercel.app"

  const slug = (!isLocal && !isVercel)
    ? subdomain
    : req.nextUrl.searchParams.get("tenant") ?? ""

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

  if (!slug) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const token = req.cookies.get("client-token")?.value

  if (!token) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("tenant", slug)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET ?? "fallback-secret"
    )
    await jwtVerify(token, secret)
    return NextResponse.next({ request: { headers: requestHeaders } })
  } catch {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("tenant", slug)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}