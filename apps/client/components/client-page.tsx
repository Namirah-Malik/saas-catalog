"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number | null
  images: string[]
  isVisible: boolean
  category: { name: string; slug: string } | null
}

interface Category { id: string; name: string; slug: string }

interface Tenant {
  id: string
  name: string
  slug: string
  primaryColor: string
  logo: string | null
}

interface Props {
  tenant: Tenant
  products: Product[]
  categories: Category[]
}

export default function ClientPage({ tenant, products, categories }: Props) {
  const [activeCat, setActiveCat] = useState("all")
  const [hovered, setHovered] = useState<string | null>(null)
  const [heroIdx, setHeroIdx] = useState(0)
  const [heroActive, setHeroActive] = useState(true)
  const [progress, setProgress] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const timerRef = useRef<NodeJS.Timeout>()
  const progRef = useRef<NodeJS.Timeout>()
  const DURATION = 6000
  const c = tenant.primaryColor

  const heroProducts = products.slice(0, 4)
  const filtered = activeCat === "all" ? products : products.filter(p => p.category?.slug === activeCat)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  function goHero(n: number) {
    setHeroActive(false)
    clearTimeout(timerRef.current)
    clearInterval(progRef.current)
    setTimeout(() => { setHeroIdx(n); setHeroActive(true); setProgress(0) }, 80)
  }

  useEffect(() => {
    if (heroProducts.length === 0) return
    setProgress(0)
    const start = Date.now()
    progRef.current = setInterval(() => {
      setProgress(Math.min(((Date.now() - start) / DURATION) * 100, 100))
    }, 50)
    timerRef.current = setTimeout(() => {
      setHeroIdx(p => (p + 1) % Math.max(heroProducts.length, 1))
      setHeroActive(true)
      setProgress(0)
    }, DURATION)
    return () => { clearTimeout(timerRef.current); clearInterval(progRef.current) }
  }, [heroIdx, heroProducts.length])

  const hp = heroProducts[heroIdx]
  const tr = (d: number) => `all 0.7s cubic-bezier(0.25,0.46,0.45,0.94) ${d}s`

  return (
    <div style={{ fontFamily: "system-ui,sans-serif", background: "#fff" }}>

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: scrolled ? "0.5px solid rgba(0,0,0,0.08)" : "0.5px solid transparent",
        padding: "0 clamp(1.5rem,5vw,4rem)",
        height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "all 0.3s ease",
      }}>
        <Link href={`/?tenant=${tenant.slug}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          {tenant.logo && <img src={tenant.logo} alt={tenant.name} style={{ height: 36 }} />}
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>
            {tenant.name.split(" ").map((w, i) => (
              <span key={i} style={{ color: i > 0 ? c : "#0a0a0a" }}>{w}{" "}</span>
            ))}
          </span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {["Home", "Products", "Categories"].map(l => (
            <a key={l} href={`/?tenant=${tenant.slug}`} style={{
              fontSize: 13, fontWeight: 500,
              color: "#374151", textDecoration: "none",
              padding: "6px 16px", borderRadius: 99,
              border: "0.5px solid rgba(0,0,0,0.12)",
              transition: "all 0.2s",
            }}>{l}</a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      {heroProducts.length > 0 ? (
        <section style={{
          position: "relative", width: "100%", height: "100vh", minHeight: 600,
          overflow: "hidden", paddingTop: 64,
          background: `linear-gradient(135deg, ${c}18 0%, ${c}05 50%, #f0fdf4 100%)`,
        }}>
          <div style={{
            maxWidth: 1400, margin: "0 auto", height: "100%",
            display: "grid", gridTemplateColumns: "1fr 1fr",
            alignItems: "center", padding: "0 clamp(2rem,8vw,5rem)", gap: "4rem",
          }}>
            {/* Left content */}
            <div>
              {hp?.category && (
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "6px 14px", borderRadius: 99,
                  background: `${c}15`, border: `0.5px solid ${c}30`,
                  marginBottom: "1.25rem",
                  opacity: heroActive ? 1 : 0,
                  transform: heroActive ? "translateY(0)" : "translateY(12px)",
                  transition: tr(0.1),
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: c }} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: c }}>{hp.category.name}</span>
                </div>
              )}

              <h1 style={{
                fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 700,
                letterSpacing: "-0.03em", lineHeight: 1.1,
                color: "#0a0a0a", marginBottom: "1.25rem",
                opacity: heroActive ? 1 : 0,
                transform: heroActive ? "translateY(0)" : "translateY(24px)",
                transition: tr(0.2),
              }}>{hp?.name ?? tenant.name}</h1>

              <p style={{
                fontSize: 15, color: "#6b7280", lineHeight: 1.7,
                marginBottom: "2rem", maxWidth: 420,
                opacity: heroActive ? 1 : 0,
                transform: heroActive ? "translateY(0)" : "translateY(16px)",
                transition: tr(0.3),
              }}>{hp?.description?.slice(0, 120)}{(hp?.description?.length ?? 0) > 120 ? "..." : ""}</p>

              <div style={{
                display: "flex", alignItems: "center", gap: "1rem",
                opacity: heroActive ? 1 : 0,
                transform: heroActive ? "translateY(0)" : "translateY(16px)",
                transition: tr(0.4),
              }}>
                {hp?.price && (
                  <div>
                    <span style={{ fontSize: "2rem", fontWeight: 700, color: c }}>
                      ₹{hp.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                <Link href={`/products/${hp?.slug}?tenant=${tenant.slug}`} style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "13px 28px", borderRadius: 99,
                  background: "#0a0a0a", color: "#fff",
                  textDecoration: "none", fontSize: 14, fontWeight: 500,
                }}>
                  View Product
                  <span style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: c, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14,
                  }}>→</span>
                </Link>
              </div>

              {/* Dot nav */}
              {heroProducts.length > 1 && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "3rem" }}>
                  <button onClick={() => goHero((heroIdx - 1 + heroProducts.length) % heroProducts.length)} style={{ width: 36, height: 36, borderRadius: "50%", border: "0.5px solid rgba(0,0,0,0.15)", background: "#fff", cursor: "pointer", fontSize: 14 }}>‹</button>
                  {heroProducts.map((_, i) => (
                    <div key={i} onClick={() => goHero(i)} style={{
                      width: heroIdx === i ? 28 : 8, height: 8, borderRadius: 99,
                      background: heroIdx === i ? c : "rgba(0,0,0,0.15)",
                      cursor: "pointer", transition: "all 0.3s ease",
                    }} />
                  ))}
                  <button onClick={() => goHero((heroIdx + 1) % heroProducts.length)} style={{ width: 36, height: 36, borderRadius: "50%", border: "0.5px solid rgba(0,0,0,0.15)", background: "#fff", cursor: "pointer", fontSize: 14 }}>›</button>
                </div>
              )}
            </div>

            {/* Right image */}
            <div style={{
              height: "70vh", maxHeight: 520,
              background: hp?.images[0] ? `url(${hp.images[0]}) center/cover` : `linear-gradient(135deg, #0f172a, #1e293b)`,
              borderRadius: 24, overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: heroActive ? 1 : 0,
              transform: heroActive ? "scale(1)" : "scale(0.97)",
              transition: "all 0.8s cubic-bezier(0.25,0.46,0.45,0.94) 0.1s",
            }}>
              {!hp?.images[0] && (
                <span style={{ fontSize: "clamp(2rem,8vw,4rem)", fontWeight: 700, color: "rgba(255,255,255,0.7)", textAlign: "center", padding: "2rem" }}>
                  {hp?.name?.split(" ").slice(0, 3).join(" ")}
                </span>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 2, background: "rgba(0,0,0,0.06)" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: c, transition: "width 0.05s linear" }} />
          </div>
        </section>
      ) : (
        /* Empty hero when no products */
        <section style={{
          height: "60vh", minHeight: 400, paddingTop: 64,
          background: `linear-gradient(135deg, ${c}15, ${c}05)`,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "64px 2rem 2rem",
        }}>
          <h1 style={{ fontSize: "clamp(2rem,6vw,4rem)", fontWeight: 700, color: "#0a0a0a", marginBottom: "1rem" }}>{tenant.name}</h1>
          <p style={{ fontSize: 16, color: "#6b7280", maxWidth: 500 }}>Our product catalog is being set up. Check back soon!</p>
        </section>
      )}

      {/* PRODUCTS SECTION */}
      <section style={{ padding: "5rem clamp(1.5rem,5vw,4rem)", background: "#f9fafb" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span style={{
              display: "inline-block", padding: "4px 16px",
              background: `${c}15`, color: c, borderRadius: 99,
              fontSize: 12, fontWeight: 500, marginBottom: "1rem",
              border: `0.5px solid ${c}30`,
            }}>Our Collection</span>
            <h2 style={{ fontSize: "clamp(1.75rem,4vw,2.5rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>
              Browse <em style={{ color: c, fontStyle: "italic" }}>All Products</em>
            </h2>
            <p style={{ color: "#6b7280", fontSize: 15, lineHeight: 1.6 }}>
              Explore our complete range of quality products.
            </p>
          </div>

          {/* Category filters */}
          {categories.length > 0 && (
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginBottom: "3rem", flexWrap: "wrap" }}>
              {[{ slug: "all", name: "All" }, ...categories].map(cat => (
                <button key={cat.slug} onClick={() => setActiveCat(cat.slug)} style={{
                  padding: "8px 20px", borderRadius: 99,
                  border: "0.5px solid",
                  borderColor: activeCat === cat.slug ? c : "rgba(0,0,0,0.12)",
                  background: activeCat === cat.slug ? c : "#fff",
                  color: activeCat === cat.slug ? "#fff" : "#374151",
                  fontSize: 13, fontWeight: 500, cursor: "pointer",
                  transition: "all 0.2s ease",
                }}>{cat.name}</button>
              ))}
            </div>
          )}

          {/* Product grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem", color: "#9ca3af" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
              <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No products yet</p>
              <p style={{ fontSize: 14 }}>Products will appear here once added.</p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 20,
            }}>
              {filtered.map(p => (
                <Link key={p.id} href={`/products/${p.slug}?tenant=${tenant.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div
                    onMouseEnter={() => setHovered(p.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      background: "#fff",
                      borderRadius: 16,
                      overflow: "hidden",
                      border: "0.5px solid rgba(0,0,0,0.07)",
                      transform: hovered === p.id ? "translateY(-6px)" : "translateY(0)",
                      boxShadow: hovered === p.id
                        ? "0 20px 40px rgba(0,0,0,0.12)"
                        : "0 2px 8px rgba(0,0,0,0.04)",
                      transition: "all 0.3s cubic-bezier(0.25,0.46,0.45,0.94)",
                      cursor: "pointer",
                    }}
                  >
                    {/* Image area */}
                    <div style={{
                      height: 200, position: "relative",
                      background: p.images[0]
                        ? `url(${p.images[0]}) center/cover`
                        : "linear-gradient(135deg, #0f172a, #1e293b)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      overflow: "hidden",
                    }}>
                      {!p.images[0] && (
                        <span style={{
                          fontSize: "clamp(1.25rem,5vw,2rem)", fontWeight: 700,
                          color: "rgba(255,255,255,0.7)", textAlign: "center", padding: "1rem",
                        }}>{p.name.split(" ").slice(0, 3).join(" ")}</span>
                      )}
                      {p.category && (
                        <div style={{
                          position: "absolute", top: 12, right: 12,
                          padding: "4px 10px", background: "rgba(255,255,255,0.92)",
                          borderRadius: 99, fontSize: 11, fontWeight: 500, color: "#374151",
                        }}>{p.category.name}</div>
                      )}
                      <div style={{ position: "absolute", bottom: 12, left: 12, display: "flex", gap: 4 }}>
                        <div style={{ width: 20, height: 3, borderRadius: 2, background: c }} />
                        <div style={{ width: 8, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.4)" }} />
                        <div style={{ width: 8, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.4)" }} />
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: "1.25rem" }}>
                      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: "#0f172a", lineHeight: 1.3 }}>{p.name}</h3>
                      <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5, marginBottom: 16 }}>
                        {p.description.slice(0, 75)}{p.description.length > 75 ? "..." : ""}
                      </p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        {p.price ? (
                          <span style={{ fontSize: 18, fontWeight: 700, color: c }}>
                            ₹{p.price.toLocaleString("en-IN")}
                          </span>
                        ) : (
                          <span style={{ fontSize: 13, color: "#9ca3af" }}>Contact for price</span>
                        )}
                        <div style={{
                          width: 32, height: 32, borderRadius: "50%",
                          background: hovered === p.id ? c : "transparent",
                          border: `1.5px solid ${hovered === p.id ? c : "rgba(0,0,0,0.15)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.2s ease",
                          color: hovered === p.id ? "#fff" : "#374151",
                          fontSize: 14,
                        }}>→</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: "#0a0a0a", color: "#fff",
        padding: "4rem clamp(1.5rem,5vw,4rem) 2rem",
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "3rem", marginBottom: "3rem" }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: "1rem", letterSpacing: "-0.02em" }}>
                {tenant.name.split(" ").map((w, i) => (
                  <span key={i} style={{ color: i > 0 ? c : "#fff" }}>{w}{" "}</span>
                ))}
              </div>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.7, maxWidth: 260 }}>
                Leading provider of quality products. Trusted by thousands of customers across India.
              </p>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", marginBottom: "1rem" }}>CATEGORIES</p>
              {categories.length > 0 ? categories.map(cat => (
                <a key={cat.slug} href={`/?category=${cat.slug}&tenant=${tenant.slug}`} style={{ display: "block", color: "rgba(255,255,255,0.55)", fontSize: 14, textDecoration: "none", marginBottom: "0.5rem" }}>{cat.name}</a>
              )) : (
                <a href={`/?tenant=${tenant.slug}`} style={{ display: "block", color: "rgba(255,255,255,0.55)", fontSize: 14, textDecoration: "none" }}>All Products</a>
              )}
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", marginBottom: "1rem" }}>QUICK LINKS</p>
              {["All Products", "New Arrivals", "Best Sellers", "Featured"].map(l => (
                <a key={l} href={`/?tenant=${tenant.slug}`} style={{ display: "block", color: "rgba(255,255,255,0.55)", fontSize: 14, textDecoration: "none", marginBottom: "0.5rem" }}>{l}</a>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", marginBottom: "1rem" }}>CONTACT</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  { icon: "✆", text: "+91 98765 43210" },
                  { icon: "✉", text: `info@${tenant.slug}.com` },
                  { icon: "◎", text: "42, Industrial Area, Hyderabad, Telangana 500032" },
                ].map(({ icon, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ color: c, fontSize: 14, flexShrink: 0, marginTop: 2 }}>{icon}</span>
                    <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.5 }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.08)", paddingTop: "2rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 13 }}>© 2026 {tenant.name}. All rights reserved.</p>
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 13 }}>https://{tenant.slug}.com</p>
          </div>
        </div>
      </footer>
    </div>
  )
}