import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function getStats(role: string, tenantId: string | null) {
  if (role === "SUPER_ADMIN") {
    const [tenants, products, inquiries] = await Promise.all([
      prisma.tenant.count(),
      prisma.product.count(),
      prisma.inquiry.count(),
    ])
    return { tenants, products, inquiries }
  }

  const where = { tenantId: tenantId! }
  const [products, inquiries, unread] = await Promise.all([
    prisma.product.count({ where }),
    prisma.inquiry.count({ where }),
    prisma.inquiry.count({ where: { ...where, isRead: false } }),
  ])
  return { products, inquiries, unread }
}

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) return null

  const stats = await getStats(session.role, session.tenantId)

  const cards = session.role === "SUPER_ADMIN"
    ? [
        { label: "Total Tenants", value: stats.tenants },
        { label: "Total Products", value: stats.products },
        { label: "Total Inquiries", value: stats.inquiries },
      ]
    : [
        { label: "Your Products", value: stats.products },
        { label: "Total Inquiries", value: stats.inquiries },
        { label: "Unread Inquiries", value: stats.unread },
      ]

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: "0.5rem" }}>
        Dashboard
      </h1>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: "2rem" }}>
        Welcome back! Here is your overview.
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 16,
      }}>
        {cards.map((card) => (
          <div
            key={card.label}
            style={{
              background: "#fff",
              border: "0.5px solid #e2e8f0",
              borderRadius: 12,
              padding: "1.5rem",
            }}
          >
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>
              {card.label}
            </p>
            <p style={{ fontSize: 36, fontWeight: 700, color: "#0f172a" }}>
              {card.value ?? 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
