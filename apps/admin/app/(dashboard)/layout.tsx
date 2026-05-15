import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import AdminSidebar from "@/components/admin-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect("/login")

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui,sans-serif" }}>
      <AdminSidebar role={session.role} email={session.email} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{
          background: "#fff",
          borderBottom: "1px solid #f1f5f9",
          padding: "0 2rem",
          height: 64,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}>
          <div style={{ fontSize: 13, color: "#94a3b8" }}>
            {session.role === "SUPER_ADMIN" ? "Super Administrator" : "Client Administrator"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{session.email}</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>{session.role === "SUPER_ADMIN" ? "Super Admin" : "Client Admin"}</div>
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 14, fontWeight: 700,
            }}>
              {session.email[0].toUpperCase()}
            </div>
          </div>
        </header>
        <main style={{ flex: 1, padding: "2rem" }}>
          {children}
        </main>
      </div>
    </div>
  )
}