import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import Sidebar from "@/components/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect("/login")

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <Sidebar role={session.role} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header style={{
          background: "#fff",
          borderBottom: "0.5px solid #e2e8f0",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <span style={{ fontSize: 14, color: "#64748b" }}>
            {session.role === "SUPER_ADMIN" ? "Super Admin" : "Client Admin"}
          </span>
          <span style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>
            {session.email}
          </span>
        </header>
        <main style={{ flex: 1, padding: "2rem" }}>
          {children}
        </main>
      </div>
    </div>
  )
}
