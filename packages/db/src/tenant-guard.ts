export async function getTenantContext(req: Request) {
  const tenantId = req.headers.get("x-tenant-id")
  const role = req.headers.get("x-user-role")
  const userId = req.headers.get("x-user-id")

  if (!role) throw new Error("Unauthorized")

  const isSuperAdmin = role === "SUPER_ADMIN"

  if (!isSuperAdmin && !tenantId) {
    throw new Error("Unauthorized: no tenant context")
  }

  return { tenantId, role, userId, isSuperAdmin }
}
