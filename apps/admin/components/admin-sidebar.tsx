"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

const SUPER_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: "⬡" },
  { href: "/dashboard/products", label: "Products", icon: "📦" },
  { href: "/dashboard/categories", label: "Categories", icon: "🗂" },
  { href: "/dashboard/inquiries", label: "Inquiries", icon: "💬" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙" },
  { href: "/super/tenants", label: "Tenants", icon: "🏢", divider: true },
]

const CLIENT_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: "⬡" },
  { href: "/dashboard/products", label: "Products", icon: "📦" },
  { href: "/dashboard/categories", label: "Categories", icon: "🗂" },
  { href: "/dashboard/inquiries", label: "Inquiries", icon: "💬" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙" },
]

export default function AdminSidebar({ role, email }: { role: string; email: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const links = role === "SUPER_ADMIN" ? SUPER_LINKS : CLIENT_LINKS

  async function handleLogout() {
    setLoggingOut(true)
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  return (
    <aside style={{
      width: 240,
      background: "#0f172a",
      display: "flex",
      flexDirection: "column",
      position: "sticky",
      top: 0,
      height: "100vh",
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: "1.5rem 1.25rem",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#fff"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: "-0.3px", lineHeight: 1 }}>
              Satyajan
            </div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", marginTop: 2 }}>
              ADMIN PANEL
            </div>
          </div>
        </div>
      </div>

      {/* User info */}
      <div style={{
        padding: "1rem 1.25rem",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0,
        }}>
          {email[0].toUpperCase()}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {role === "SUPER_ADMIN" ? "Admin User" : "Client Admin"}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {email}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.25)", letterSpacing: "0.12em", padding: "0 0.5rem", marginBottom: 8 }}>
          WORKSPACE
        </div>
        {links.map((link) => {
          const active = pathname === link.href
          return (
            <div key={link.href}>
              {(link as any).divider && (
                <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "8px 0" }} />
              )}
              <Link href={link.href} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 10,
                textDecoration: "none",
                background: active ? "rgba(99,102,241,0.15)" : "transparent",
                border: active ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
                transition: "all 0.15s ease",
              }}>
                <span style={{ fontSize: 16, opacity: active ? 1 : 0.5 }}>{link.icon}</span>
                <span style={{
                  fontSize: 13, fontWeight: active ? 600 : 400,
                  color: active ? "#a5b4fc" : "rgba(255,255,255,0.55)",
                }}>
                  {link.label}
                </span>
                {active && (
                  <div style={{
                    marginLeft: "auto", width: 6, height: 6,
                    borderRadius: "50%", background: "#6366f1",
                  }} />
                )}
              </Link>
            </div>
          )
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          style={{
            width: "100%", padding: "10px 12px",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 10, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 10,
            transition: "all 0.15s",
          }}
        >
          <span style={{ fontSize: 16 }}>🚪</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#f87171" }}>
            {loggingOut ? "Signing out..." : "Sign out"}
          </span>
        </button>
      </div>
    </aside>
  )
}