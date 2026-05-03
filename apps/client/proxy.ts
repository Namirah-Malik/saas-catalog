import { NextRequest, NextResponse } from "next/server"

export function proxy(req: NextRequest) {
  const host = req.headers.get("host") ?? ""
  const subdomain = host.split(".")[0]

  const isLocal = subdomain === "localhost" || subdomain === "127"

  const slug = isLocal
    ? req.nextUrl.searchParams.get("tenant") ?? "acem"
    : subdomain

  const res = NextResponse.next()
  res.headers.set("x-tenant-slug", slug)
  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
