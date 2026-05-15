import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function getStats(role: string, tenantId: string | null) {
  if (role === "SUPER_ADMIN") {
    const [tenants, products, inquiries, categories] = await Promise.all([
      prisma.tenant.count(),
      prisma.product.count(),
      prisma.inquiry.count(),
      prisma.category.count(),
    ])
    return { tenants, products, inquiries, categories }
  }
  const where = { tenantId: tenantId! }
  const [products, inquiries, unread, categories] = await Promise.all([
    prisma.product.count({ where }),
    prisma.inquiry.count({ where }),
    prisma.inquiry.count({ where: { ...where, isRead: false } }),
    prisma.category.count({ where }),
  ])
  return { products, inquiries, unread, categories }
}

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) return null
  const stats = await getStats(session.role, session.tenantId)
  const isSA = session.role === "SUPER_ADMIN"

  const cards = isSA ? [
    { label: "Total Companies", value: stats.tenants, icon: "🏢", color: "#6366f1", bg: "#eef2ff" },
    { label: "Total Products", value: stats.products, icon: "📦", color: "#0ea5e9", bg: "#e0f2fe" },
    { label: "Categories", value: stats.categories, icon: "🗂", color: "#10b981", bg: "#d1fae5" },
    { label: "Total Inquiries", value: stats.inquiries, icon: "💬", color: "#f59e0b", bg: "#fef3c7" },
  ] : [
    { label: "Your Products", value: stats.products, icon: "📦", color: "#6366f1", bg: "#eef2ff" },
    { label: "Categories", value: stats.categories, icon: "🗂", color: "#10b981", bg: "#d1fae5" },
    { label: "Total Inquiries", value: stats.inquiries, icon: "💬", color: "#f59e0b", bg: "#fef3c7" },
    { label: "Unread Inquiries", value: stats.unread, icon: "🔔", color: "#ef4444", bg: "#fee2e2" },
  ]

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.5px", marginBottom: 4 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 14, color: "#64748b" }}>
          Welcome back! Here's your overview for today.
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: "2.5rem" }}>
        {cards.map(card => (
          <div key={card.label} style={{
            background: "#fff",
            border: "1px solid #f1f5f9",
            borderRadius: 16,
            padding: "1.5rem",
            display: "flex", alignItems: "flex-start", gap: 14,
            transition: "box-shadow 0.2s, transform 0.2s",
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"
              ;(e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = "none"
              ;(e.currentTarget as HTMLDivElement).style.transform = "none"
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: card.bg,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, flexShrink: 0,
            }}>{card.icon}</div>
            <div>
              <p style={{ fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 500 }}>{card.label}</p>
              <p style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{card.value ?? 0}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ background: "#fff", border: "1px solid #f1f5f9", borderRadius: 16, padding: "1.5rem" }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: "1.25rem", color: "#0f172a" }}>Quick Actions</h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "Add Product", href: "/dashboard/products", icon: "📦", color: "#6366f1" },
            { label: "Add Category", href: "/dashboard/categories", icon: "🗂", color: "#10b981" },
            { label: "View Inquiries", href: "/dashboard/inquiries", icon: "💬", color: "#f59e0b" },
            ...(isSA ? [{ label: "Manage Tenants", href: "/super/tenants", icon: "🏢", color: "#8b5cf6" }] : []),
          ].map(action => (
            <a key={action.label} href={action.href} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 18px", borderRadius: 10,
              background: `${action.color}10`,
              border: `1px solid ${action.color}25`,
              textDecoration: "none",
              fontSize: 13, fontWeight: 500, color: action.color,
              transition: "all 0.15s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = `${action.color}20` }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = `${action.color}10` }}
            >
              <span>{action.icon}</span>{action.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}