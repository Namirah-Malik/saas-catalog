import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const PUBLIC_PATHS = ["/login", "/api/auth/login"]

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  const token = req.cookies.get("token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const { payload } = await jwtVerify(token, secret)

    const headers = new Headers(req.headers)
    headers.set("x-user-id", payload.userId as string)
    headers.set("x-user-role", payload.role as string)
    headers.set("x-tenant-id", (payload.tenantId as string) ?? "")

    if (payload.role === "CLIENT_ADMIN" && pathname.startsWith("/super")) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next({ request: { headers } })
  } catch {
    return NextResponse.redirect(new URL("/login", req.url))
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
