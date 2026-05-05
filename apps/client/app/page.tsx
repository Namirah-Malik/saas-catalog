import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { notFound } from "next/navigation"
import HeroSlider from "@/components/hero-slider"

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; tenant?: string }>
}) {
  const params = await searchParams
  const headersList = await headers()
  const slug = headersList.get("x-tenant-slug") ?? params.tenant ?? "acem"

  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    include: { categories: true },
  })

  if (!tenant || !tenant.isActive) notFound()

  const products = await prisma.product.findMany({
    where: {
      tenantId: tenant.id,
      isVisible: true,
      ...(params.category ? { category: { slug: params.category } } : {}),
      ...(params.search ? { name: { contains: params.search, mode: "insensitive" } } : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    
    <div>
      <nav style={{
        background: "#fff",
        borderBottom: "0.5px solid #e2e8f0",
        padding: "1rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: tenant.primaryColor }}>
          {tenant.name}
        </span>
        <span style={{ fontSize: 14, color: "#64748b" }}>Product Catalog</span>
        <HeroSlider />
      </nav>

      <section style={{
        background: tenant.primaryColor,
        padding: "4rem 2rem",
        textAlign: "center",
        color: "#fff",
      }}>
        <h1 style={{ fontSize: 40, fontWeight: 700, marginBottom: 16 }}>{tenant.name}</h1>
        <p style={{ fontSize: 18, opacity: 0.9, marginBottom: 32 }}>Explore our complete product catalog</p>
        <form method="GET" style={{ display: "flex", gap: 8, justifyContent: "center", maxWidth: 500, margin: "0 auto" }}>
          <input
            name="search"
            defaultValue={params.search}
            placeholder="Search products..."
            style={{ flex: 1, padding: "12px 16px", borderRadius: 8, border: "none", fontSize: 15, outline: "none" }}
          />
          <button type="submit" style={{
            padding: "12px 24px",
            background: "rgba(255,255,255,0.2)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.4)",
            borderRadius: 8,
            fontSize: 15,
            cursor: "pointer",
          }}>Search</button>
        </form>
      </section>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>
        {tenant.categories.length > 0 && (
          <div style={{ display: "flex", gap: 8, marginBottom: "2rem", flexWrap: "wrap" }}>
            <Link href={`/?tenant=${slug}`} style={{
              padding: "6px 16px", borderRadius: 99, fontSize: 14, textDecoration: "none",
              background: !params.category ? tenant.primaryColor : "#f1f5f9",
              color: !params.category ? "#fff" : "#64748b", fontWeight: 500,
            }}>All</Link>
            {tenant.categories.map((cat) => (
              <Link key={cat.id} href={`/?category=${cat.slug}&tenant=${slug}`} style={{
                padding: "6px 16px", borderRadius: 99, fontSize: 14, textDecoration: "none",
                background: params.category === cat.slug ? tenant.primaryColor : "#f1f5f9",
                color: params.category === cat.slug ? "#fff" : "#64748b", fontWeight: 500,
              }}>{cat.name}</Link>
            ))}
          </div>
        )}

        <p style={{ fontSize: 14, color: "#64748b", marginBottom: "1.5rem" }}>
          {products.length} product{products.length !== 1 ? "s" : ""} found
        </p>

        {products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#64748b" }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>📦</p>
            <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No products yet</p>
            <p style={{ fontSize: 14 }}>Products added in the admin will appear here.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}?tenant=${slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{
                  background: "#fff", border: "0.5px solid #e2e8f0",
                  borderRadius: 16, overflow: "hidden", cursor: "pointer",
                }}>
                  <div style={{
                    height: 200,
                    background: product.images[0] ? `url(${product.images[0]}) center/cover` : "#f1f5f9",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {!product.images[0] && <span style={{ fontSize: 48, opacity: 0.3 }}>📦</span>}
                  </div>
                  <div style={{ padding: "1.25rem" }}>
                    {product.category && (
                      <span style={{ fontSize: 11, fontWeight: 500, color: tenant.primaryColor, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>
                        {product.category.name}
                      </span>
                    )}
                    <h3 style={{ fontSize: 16, fontWeight: 600, margin: "6px 0 8px", color: "#0f172a" }}>{product.name}</h3>
                    <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, marginBottom: 12 }}>
                      {product.description.slice(0, 80)}{product.description.length > 80 ? "..." : ""}
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      {product.price
                        ? <span style={{ fontSize: 18, fontWeight: 700, color: tenant.primaryColor }}>${product.price}</span>
                        : <span style={{ fontSize: 13, color: "#94a3b8" }}>Contact for price</span>
                      }
                      <span style={{ fontSize: 13, color: tenant.primaryColor, fontWeight: 500 }}>View →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <footer style={{ marginTop: "4rem", borderTop: "0.5px solid #e2e8f0", padding: "2rem", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
        {tenant.name} — Powered by SaaS Catalog
      </footer>
    </div>
  )
}
