import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? ""
  const subdomain = host.split(".")[0]

  const isLocal = subdomain === "localhost" || subdomain === "127" || subdomain === "saas-catalog-client"

  const slug = isLocal
    ? req.nextUrl.searchParams.get("tenant") ?? "acem"
    : subdomain

  const requestHeaders = new Headers(req.headers)
  requestHeaders.set("x-tenant-slug", slug)

  return NextResponse.next({
    request: { headers: requestHeaders }
  })
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}