import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) return null

  const isSA = session.role === "SUPER_ADMIN"

  let tenantCount = 0
  let productCount = 0
  let inquiryCount = 0
  let categoryCount = 0
  let unreadCount = 0

  try {
    if (isSA) {
      tenantCount = await prisma.tenant.count()
      productCount = await prisma.product.count()
      inquiryCount = await prisma.inquiry.count()
      categoryCount = await prisma.category.count()
    } else if (session.tenantId) {
      productCount = await prisma.product.count({ where: { tenantId: session.tenantId } })
      inquiryCount = await prisma.inquiry.count({ where: { tenantId: session.tenantId } })
      unreadCount = await prisma.inquiry.count({ where: { tenantId: session.tenantId, isRead: false } })
      categoryCount = await prisma.category.count({ where: { tenantId: session.tenantId } })
    }
  } catch (e) {
    console.error("Dashboard stats error:", e)
  }

  const cards = isSA ? [
    { label: "Total Companies", value: tenantCount, icon: "🏢", color: "#6366f1", bg: "#eef2ff" },
    { label: "Total Products", value: productCount, icon: "📦", color: "#0ea5e9", bg: "#e0f2fe" },
    { label: "Categories", value: categoryCount, icon: "🗂", color: "#10b981", bg: "#d1fae5" },
    { label: "Total Inquiries", value: inquiryCount, icon: "💬", color: "#f59e0b", bg: "#fef3c7" },
  ] : [
    { label: "Your Products", value: productCount, icon: "📦", color: "#6366f1", bg: "#eef2ff" },
    { label: "Categories", value: categoryCount, icon: "🗂", color: "#10b981", bg: "#d1fae5" },
    { label: "Total Inquiries", value: inquiryCount, icon: "💬", color: "#f59e0b", bg: "#fef3c7" },
    { label: "Unread Inquiries", value: unreadCount, icon: "🔔", color: "#ef4444", bg: "#fee2e2" },
  ]

  const quickActions = [
    { label: "Add Product", href: "/dashboard/products", icon: "📦", color: "#6366f1" },
    { label: "Add Category", href: "/dashboard/categories", icon: "🗂", color: "#10b981" },
    { label: "View Inquiries", href: "/dashboard/inquiries", icon: "💬", color: "#f59e0b" },
    ...(isSA ? [{ label: "Manage Tenants", href: "/super/tenants", icon: "🏢", color: "#8b5cf6" }] : []),
  ]

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.5px", marginBottom: 4 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 14, color: "#64748b" }}>
          Welcome back! Here is your overview.
        </p>
      </div>

      {/* Stats grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 16,
        marginBottom: "2.5rem",
      }}>
        {cards.map(card => (
          <div key={card.label} style={{
            background: "#fff",
            border: "1px solid #f1f5f9",
            borderRadius: 16,
            padding: "1.5rem",
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: card.bg,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, flexShrink: 0,
            }}>{card.icon}</div>
            <div>
              <p style={{ fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 500 }}>{card.label}</p>
              <p style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{
        background: "#fff",
        border: "1px solid #f1f5f9",
        borderRadius: 16,
        padding: "1.5rem",
        marginBottom: "2rem",
      }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: "1.25rem", color: "#0f172a" }}>
          Quick Actions
        </h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {quickActions.map(action => (
            <Link key={action.label} href={action.href} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 18px", borderRadius: 10,
              background: `${action.color}12`,
              border: `1px solid ${action.color}25`,
              textDecoration: "none",
              fontSize: 13, fontWeight: 500, color: action.color,
            }}>
              <span>{action.icon}</span>{action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Info card */}
      <div style={{
        background: "linear-gradient(135deg, #eef2ff, #f5f3ff)",
        border: "1px solid #c7d2fe",
        borderRadius: 16, padding: "1.5rem",
        display: "flex", alignItems: "center", gap: 16,
      }}>
        <div style={{ fontSize: 32 }}>⚡</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#3730a3", marginBottom: 4 }}>
            Satyajan Admin Panel
          </div>
          <div style={{ fontSize: 13, color: "#6366f1", lineHeight: 1.5 }}>
            {isSA
              ? `Managing ${tenantCount} companies with ${productCount} products across the platform.`
              : `Your catalog has ${productCount} products and ${inquiryCount} customer inquiries.`
            }
          </div>
        </div>
      </div>
    </div>
  )
}