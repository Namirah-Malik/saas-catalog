import { jwtVerify } from "jose"
import { cookies } from "next/headers"

export interface JWTPayload {
  userId: string
  email: string
  role: "SUPER_ADMIN" | "CLIENT_ADMIN"
  tenantId: string | null
}

export async function getSession(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    if (!token) return null

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const { payload } = await jwtVerify(token, secret)

    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

export async function requireAuth(): Promise<JWTPayload> {
  const session = await getSession()
  if (!session) throw new Error("Unauthorized")
  return session
}

export async function requireSuperAdmin(): Promise<JWTPayload> {
  const session = await requireAuth()
  if (session.role !== "SUPER_ADMIN") throw new Error("Forbidden")
  return session
}
