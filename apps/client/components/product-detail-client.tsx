"use client"
import { useState } from "react"
import Link from "next/link"

interface Props {
  tenant: { id: string; name: string; slug: string; primaryColor: string; logo: string | null }
  product: {
    id: string; name: string; slug: string; description: string
    price: number | null; images: string[]; brochureUrl: string | null
    specifications: Record<string, string> | null
    category: { name: string; slug: string } | null
  }
  related: {
    id: string; name: string; slug: string; price: number | null
    images: string[]; description: string
    category: { name: string; slug: string } | null
  }[]
}

export default function ProductDetailClient({ tenant, product, related }: Props) {
  const [activeImg, setActiveImg] = useState(0)
  const [inquirySent, setInquirySent] = useState(false)
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" })
  const [hovered, setHovered] = useState<string | null>(null)
  const c = tenant.primaryColor

  const specs = product.specifications
    ? Object.entries(product.specifications)
    : []

  async function sendInquiry(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tenantId: tenant.id,
          productId: product.id,
        }),
      })
      setInquirySent(true)
    } catch { }
    setSending(false)
  }

  return (
    <div style={{ fontFamily: "system-ui,sans-serif", background: "#fff" }}>

      {/* NAVBAR */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(12px)",
        borderBottom: "0.5px solid rgba(0,0,0,0.08)",
        padding: "0 clamp(1.5rem,5vw,4rem)",
        height: 64, display: "flex", alignItems: "center", gap: 16,
      }}>
        <Link href={`/?tenant=${tenant.slug}`} style={{
          fontSize: 13, color: "#6b7280", textDecoration: "none",
          display: "flex", alignItems: "center", gap: 6,
        }}>← Back</Link>
        <span style={{ color: "#e2e8f0" }}>|</span>
        <Link href={`/?tenant=${tenant.slug}`} style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>
            {tenant.name.split(" ").map((w, i) => (
              <span key={i} style={{ color: i > 0 ? c : "#0a0a0a" }}>{w}{" "}</span>
            ))}
          </span>
        </Link>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem clamp(1.5rem,5vw,3rem)" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "2rem", fontSize: 13, color: "#9ca3af" }}>
          <Link href={`/?tenant=${tenant.slug}`} style={{ color: "#9ca3af", textDecoration: "none" }}>Home</Link>
          <span>›</span>
          {product.category && (
            <>
              <Link href={`/?category=${product.category.slug}&tenant=${tenant.slug}`} style={{ color: "#9ca3af", textDecoration: "none" }}>{product.category.name}</Link>
              <span>›</span>
            </>
          )}
          <span style={{ color: "#374151" }}>{product.name.slice(0, 40)}{product.name.length > 40 ? "..." : ""}</span>
        </div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", marginBottom: "4rem" }}>

          {/* LEFT: Images */}
          <div>
            {/* Main image */}
            <div style={{
              width: "100%", aspectRatio: "1",
              background: product.images[activeImg]
                ? `url(${product.images[activeImg]}) center/contain no-repeat`
                : `linear-gradient(135deg, ${c}15, ${c}05)`,
              borderRadius: 20,
              border: "0.5px solid rgba(0,0,0,0.08)",
              marginBottom: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {!product.images[activeImg] && (
                <span style={{ fontSize: "4rem", opacity: 0.2 }}>📦</span>
              )}
            </div>

            {/* Thumbnail row */}
            {product.images.length > 1 && (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      width: 72, height: 72,
                      background: `url(${img}) center/cover`,
                      borderRadius: 10, cursor: "pointer",
                      border: `2px solid ${activeImg === i ? c : "transparent"}`,
                      outline: activeImg === i ? `1px solid ${c}` : "none",
                      transition: "all 0.2s ease",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Details */}
          <div>
            {product.category && (
              <Link href={`/?category=${product.category.slug}&tenant=${tenant.slug}`} style={{
                display: "inline-block", padding: "4px 12px",
                background: `${c}15`, color: c,
                borderRadius: 99, fontSize: 12, fontWeight: 500,
                textDecoration: "none", marginBottom: "1rem",
                border: `0.5px solid ${c}30`,
              }}>{product.category.name}</Link>
            )}

            <h1 style={{
              fontSize: "clamp(1.5rem,3vw,2rem)",
              fontWeight: 700, letterSpacing: "-0.02em",
              color: "#0a0a0a", marginBottom: "1rem", lineHeight: 1.2,
            }}>{product.name}</h1>

            {product.price && (
              <div style={{ marginBottom: "1.5rem" }}>
                <span style={{ fontSize: "2.5rem", fontWeight: 700, color: c }}>
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              </div>
            )}

            <p style={{
              fontSize: 15, color: "#475569", lineHeight: 1.8,
              marginBottom: "2rem",
            }}>{product.description}</p>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 12, marginBottom: "2rem" }}>
              <a href="#inquiry" style={{
                flex: 1, padding: "14px 24px",
                background: c, color: "#fff",
                border: "none", borderRadius: 12,
                fontSize: 15, fontWeight: 600,
                cursor: "pointer", textDecoration: "none",
                textAlign: "center",
              }}>Get best price →</a>
              {product.brochureUrl && (
                <a href={product.brochureUrl} target="_blank" rel="noopener noreferrer" style={{
                  padding: "14px 20px",
                  border: `1.5px solid ${c}`,
                  color: c, borderRadius: 12,
                  fontSize: 14, fontWeight: 500,
                  textDecoration: "none",
                }}>📄 Brochure</a>
              )}
            </div>

            {/* Specs table */}
            {specs.length > 0 && (
              <div style={{ background: "#f8fafc", borderRadius: 14, padding: "1.25rem", border: "0.5px solid #e2e8f0" }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: "1rem", color: "#374151" }}>Specifications</h3>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <tbody>
                    {specs.map(([k, v]) => (
                      <tr key={k} style={{ borderBottom: "0.5px solid #e2e8f0" }}>
                        <td style={{ padding: "8px 0", color: "#6b7280", fontWeight: 500, width: "45%" }}>{k}</td>
                        <td style={{ padding: "8px 0", color: "#0f172a" }}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* INQUIRY FORM */}
        <div id="inquiry" style={{
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          borderRadius: 24, padding: "3rem",
          marginBottom: "4rem",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem",
        }}>
          <div>
            <h2 style={{ fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>
              Get the best price for<br />
              <span style={{ color: c }}>{product.name.split(" ").slice(0, 3).join(" ")}</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, lineHeight: 1.7, marginBottom: "2rem" }}>
              Fill in your details and our team will contact you with the best offer within 24 hours.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { icon: "✓", text: "Best price guaranteed" },
                { icon: "✓", text: "Free delivery available" },
                { icon: "✓", text: "Expert installation support" },
                { icon: "✓", text: "1-year warranty included" },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: `${c}30`, display: "flex", alignItems: "center", justifyContent: "center", color: c, fontSize: 12, fontWeight: 700 }}>{icon}</div>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            {inquirySent ? (
              <div style={{
                background: "rgba(255,255,255,0.08)", borderRadius: 16,
                padding: "3rem", textAlign: "center",
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Inquiry sent!</h3>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14 }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={sendInquiry} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 16, padding: "2rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>Full Name</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Your name"
                      style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.1)", border: "0.5px solid rgba(255,255,255,0.15)", borderRadius: 10, fontSize: 14, color: "#fff", boxSizing: "border-box" as const, outline: "none" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>Phone</label>
                    <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210"
                      style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.1)", border: "0.5px solid rgba(255,255,255,0.15)", borderRadius: 10, fontSize: 14, color: "#fff", boxSizing: "border-box" as const, outline: "none" }} />
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="you@email.com"
                    style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.1)", border: "0.5px solid rgba(255,255,255,0.15)", borderRadius: 10, fontSize: 14, color: "#fff", boxSizing: "border-box" as const, outline: "none" }} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>Message</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={3} placeholder="I'm interested in this product..."
                    style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.1)", border: "0.5px solid rgba(255,255,255,0.15)", borderRadius: 10, fontSize: 14, color: "#fff", boxSizing: "border-box" as const, outline: "none", resize: "none" }} />
                </div>
                <button type="submit" disabled={sending} style={{
                  width: "100%", padding: "14px",
                  background: c, color: "#fff",
                  border: "none", borderRadius: 12,
                  fontSize: 15, fontWeight: 600,
                  cursor: sending ? "not-allowed" : "pointer",
                  opacity: sending ? 0.7 : 1,
                }}>
                  {sending ? "Sending..." : "Send Inquiry →"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {related.length > 0 && (
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Related Products</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
              {related.map(p => (
                <Link key={p.id} href={`/products/${p.slug}?tenant=${tenant.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div
                    onMouseEnter={() => setHovered(p.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      background: "#fff", borderRadius: 16, overflow: "hidden",
                      border: "0.5px solid rgba(0,0,0,0.08)",
                      transform: hovered === p.id ? "translateY(-5px)" : "translateY(0)",
                      boxShadow: hovered === p.id ? "0 20px 40px rgba(0,0,0,0.1)" : "0 2px 8px rgba(0,0,0,0.04)",
                      transition: "all 0.3s ease", cursor: "pointer",
                    }}
                  >
                    <div style={{
                      height: 180,
                      background: p.images[0] ? `url(${p.images[0]}) center/cover` : "linear-gradient(135deg, #0f172a, #1e293b)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {!p.images[0] && <span style={{ fontSize: "1.5rem", color: "rgba(255,255,255,0.5)" }}>{p.name.split(" ")[0]}</span>}
                    </div>
                    <div style={{ padding: "1rem" }}>
                      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: "#0f172a", lineHeight: 1.3 }}>{p.name}</h3>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        {p.price
                          ? <span style={{ fontWeight: 700, color: c }}>₹{p.price.toLocaleString("en-IN")}</span>
                          : <span style={{ fontSize: 13, color: "#9ca3af" }}>Contact for price</span>
                        }
                        <span style={{ color: c, fontSize: 18 }}>→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ background: "#0a0a0a", color: "#fff", padding: "3rem clamp(1.5rem,5vw,4rem) 2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontSize: 18, fontWeight: 700 }}>
            {tenant.name.split(" ").map((w, i) => (
              <span key={i} style={{ color: i > 0 ? c : "#fff" }}>{w}{" "}</span>
            ))}
          </span>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>© 2026 {tenant.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}