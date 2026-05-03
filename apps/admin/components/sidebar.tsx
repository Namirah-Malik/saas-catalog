"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const adminLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/products", label: "Products" },
  { href: "/dashboard/categories", label: "Categories" },
  { href: "/dashboard/inquiries", label: "Inquiries" },
  { href: "/dashboard/settings", label: "Settings" },
]

const superLinks = [
  { href: "/super/tenants", label: "Tenants" },
]

export default function Sidebar({ role }: { role: string }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  const links = role === "SUPER_ADMIN"
    ? [...adminLinks, ...superLinks]
    : adminLinks

  return (
    <aside style={{
      width: 220,
      background: "#fff",
      borderRight: "0.5px solid #e2e8f0",
      padding: "1.5rem 1rem",
      display: "flex",
      flexDirection: "column",
      gap: 2,
    }}>
      <div style={{
        fontSize: 18,
        fontWeight: 700,
        color: "#6366f1",
        marginBottom: "2rem",
        padding: "0 0.5rem",
      }}>
        SaaS Catalog
      </div>

      {links.map((link) => {
        const active = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            style={{
              padding: "0.6rem 0.75rem",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: active ? 500 : 400,
              background: active ? "#eef2ff" : "transparent",
              color: active ? "#6366f1" : "#64748b",
              textDecoration: "none",
              display: "block",
            }}
          >
            {link.label}
          </Link>
        )
      })}

      <div style={{ flex: 1 }} />

      <button
        onClick={handleLogout}
        style={{
          padding: "0.6rem 0.75rem",
          borderRadius: 8,
          fontSize: 14,
          color: "#ef4444",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        Logout
      </button>
    </aside>
  )
}
