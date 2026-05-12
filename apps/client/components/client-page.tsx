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

const HERO_SLIDES = [
  { eyebrow: "POWER THE", title: "future", desc: "Industrial-grade inverters & UPS systems engineered for uninterrupted performance across India.", label: "Inverters & UPS", bg: ["#0f0c29", "#302b63"] },
  { eyebrow: "HARNESS THE", title: "sun", desc: "High-efficiency solar panels & inverters maximizing energy harvest for homes and enterprises.", label: "Solar Solutions", bg: ["#0a2e1f", "#0d5c3a"] },
  { eyebrow: "STORE THE", title: "energy", desc: "Next-generation lithium & tubular batteries with industry-leading cycle life and smart BMS.", label: "Battery Storage", bg: ["#1a0a2e", "#3d1a6e"] },
  { eyebrow: "BUILT FOR", title: "trust", desc: "15+ years, 5000+ customers, 500+ dealers — India's most trusted power solutions manufacturer.", label: "Expert Service", bg: ["#1a1a0a", "#4a3800"] },
]

const PARTICLES = [
  { x: 15, y: 20, delay: 0, dur: 3 },
  { x: 75, y: 60, delay: 0.8, dur: 3.5 },
  { x: 45, y: 80, delay: 1.5, dur: 4 },
  { x: 85, y: 25, delay: 2.2, dur: 3.2 },
  { x: 25, y: 70, delay: 3.0, dur: 4.5 },
  { x: 60, y: 40, delay: 0.4, dur: 3.8 },
]

export default function ClientPage({ tenant, products, categories }: Props) {
  const [cur, setCur] = useState(0)
  const [prev, setPrev] = useState(-1)
  const [active, setActive] = useState(true)
  const [progress, setProgress] = useState(0)
  const [activeCat, setActiveCat] = useState("all")
  const [hovered, setHovered] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const progRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const DURATION = 6000
  const c = tenant.primaryColor
  const slide = HERO_SLIDES[cur]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  function goTo(n: number) {
    if (n === cur) return
    setPrev(cur)
    setActive(false)
    clearTimeout(timerRef.current)
    clearInterval(progRef.current)
    setTimeout(() => { setCur(n); setActive(true); setProgress(0) }, 100)
  }

  useEffect(() => {
    setProgress(0)
    const start = Date.now()
    progRef.current = setInterval(() => {
      setProgress(Math.min(((Date.now() - start) / DURATION) * 100, 100))
    }, 40)
    timerRef.current = setTimeout(() => {
      setPrev(cur)
      setCur(p => (p + 1) % HERO_SLIDES.length)
      setActive(true)
      setProgress(0)
    }, DURATION)
    return () => { clearTimeout(timerRef.current); clearInterval(progRef.current) }
  }, [cur])

  const filtered = activeCat === "all" ? products : products.filter(p => p.category?.slug === activeCat)

  const ease = "cubic-bezier(0.25,0.46,0.45,0.94)"
  const reveal = (delay: number) => ({
    opacity: active ? 1 : 0,
    filter: active ? "blur(0px)" : "blur(10px)",
    transform: active ? "translateY(0)" : "translateY(60px)",
    transition: `all 0.8s ${ease} ${delay}s`,
  })

  return (
    <div style={{ fontFamily: "system-ui,sans-serif", background: "#fff" }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0)",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "0.5px solid rgba(0,0,0,0.08)" : "none",
        padding: "0 clamp(1.5rem,5vw,4rem)",
        height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "all 0.4s ease",
      }}>
        <Link href={`/?tenant=${tenant.slug}`} style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", color: scrolled ? "#0a0a0a" : "#fff" }}>
            {tenant.name.split(" ").map((w, i) => (
              <span key={i} style={{ color: i > 0 ? c : "inherit" }}>{w}{" "}</span>
            ))}
          </span>
        </Link>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["Home", "Products", "Categories"].map(l => (
            <a key={l} href={`/?tenant=${tenant.slug}`} style={{
              fontSize: 13, fontWeight: 500, textDecoration: "none",
              padding: "7px 16px", borderRadius: 99,
              color: scrolled ? "#374151" : "rgba(255,255,255,0.85)",
              border: `0.5px solid ${scrolled ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.25)"}`,
              transition: "all 0.3s ease",
            }}>{l}</a>
          ))}
        </div>
      </nav>

      {/* ── HERO SLIDER ── */}
      <section style={{
        position: "relative", width: "100%", height: "100vh", minHeight: 640,
        overflow: "hidden",
        background: `linear-gradient(135deg, ${slide.bg[0]} 0%, ${slide.bg[1]} 100%)`,
        transition: `background 1.2s ${ease}`,
      }}>

        {/* Giant bg word */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "clamp(6rem,22vw,18rem)",
          fontWeight: 700, letterSpacing: "-0.05em",
          color: "rgba(255,255,255,0.045)",
          userSelect: "none", pointerEvents: "none",
          transform: active ? "scale(1) translateY(0)" : "scale(1.08) translateY(80px)",
          opacity: active ? 1 : 0,
          transition: `all 1.2s ${ease} 0.05s`,
        }}>{slide.title}</div>

        {/* Floating particles */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {PARTICLES.map((p, i) => (
            <div key={i} style={{
              position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
              width: 5, height: 5, borderRadius: "50%",
              background: "rgba(255,255,255,0.3)",
              animation: `particle-float ${p.dur}s ease-in-out ${p.delay}s infinite`,
            }} />
          ))}
        </div>

        {/* Main content */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 2,
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "5rem clamp(2rem,8vw,5rem) 3rem",
          maxWidth: 700,
        }}>
          {/* Eyebrow */}
          <p style={{
            fontSize: 12, fontWeight: 600, letterSpacing: "0.22em",
            color: "rgba(255,255,255,0.5)", marginBottom: "1rem",
            ...reveal(0.1),
          }}>{slide.eyebrow}</p>

          {/* Giant title */}
          <h1 style={{
            fontSize: "clamp(5rem,15vw,12rem)",
            fontWeight: 700, lineHeight: 0.88,
            letterSpacing: "-0.05em", color: "#fff",
            marginBottom: "1.75rem",
            ...reveal(0.2),
          }}>{slide.title}</h1>

          {/* Description */}
          <p style={{
            fontSize: 16, color: "rgba(255,255,255,0.6)",
            lineHeight: 1.7, maxWidth: 440,
            marginBottom: "2.5rem",
            ...reveal(0.35),
          }}>{slide.desc}</p>

          {/* CTA row */}
          <div style={{
            display: "flex", alignItems: "center", gap: "1.5rem",
            ...reveal(0.5),
          }}>
            <button style={{
              padding: "14px 32px", background: "#fff", color: "#000",
              border: "none", borderRadius: 4, fontSize: 14, fontWeight: 500,
              cursor: "pointer", letterSpacing: "0.01em",
              transition: "transform 0.2s ease",
            }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              Get best price →
            </button>

            {/* Accent line */}
            <div style={{
              width: active ? 60 : 0, height: 1,
              background: "rgba(255,255,255,0.35)",
              transition: `width 0.5s ${ease} 0.7s`,
            }} />

            {/* Accent label */}
            <span style={{
              fontSize: 11, fontWeight: 500,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.12em",
              opacity: active ? 1 : 0,
              transition: "opacity 0.4s ease 0.8s",
            }}>{slide.label.toUpperCase()}</span>
          </div>
        </div>

        {/* Right dot indicators */}
        <div style={{
          position: "absolute", right: "2.5rem", top: "50%",
          transform: "translateY(-50%)",
          display: "flex", flexDirection: "column", gap: 12, zIndex: 10,
        }}>
          {HERO_SLIDES.map((_, i) => (
            <div key={i} onClick={() => goTo(i)} style={{
              position: "relative", cursor: "pointer",
              width: cur === i ? 10 : 7,
              height: cur === i ? 10 : 7,
              borderRadius: "50%",
              background: cur === i ? "#fff" : "rgba(255,255,255,0.3)",
              transition: "all 0.4s ease",
              boxShadow: cur === i ? `0 0 0 4px rgba(255,255,255,0.18)` : "none",
            }} />
          ))}
        </div>

        {/* Bottom progress bar */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: 2, background: "rgba(255,255,255,0.1)", zIndex: 10,
        }}>
          <div style={{
            height: "100%",
            width: `${progress}%`,
            background: "#fff",
            transition: "width 0.04s linear",
          }} />
        </div>

        {/* Slide counter bottom-left */}
        <div style={{
          position: "absolute", bottom: "2rem",
          left: "clamp(2rem,8vw,5rem)",
          fontSize: 11, color: "rgba(255,255,255,0.3)",
          letterSpacing: "0.12em", zIndex: 10,
        }}>
          {String(cur + 1).padStart(2, "0")} / {String(HERO_SLIDES.length).padStart(2, "0")}
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: "1.75rem", left: "50%",
          transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: 6, opacity: 0.4, zIndex: 10,
        }}>
          <div style={{
            width: 20, height: 30,
            border: "1.5px solid rgba(255,255,255,0.5)",
            borderRadius: 12,
            display: "flex", justifyContent: "center",
            paddingTop: 6,
          }}>
            <div style={{
              width: 2, height: 6, background: "#fff",
              borderRadius: 2,
              animation: "scroll-wheel 2s ease-in-out infinite",
            }} />
          </div>
        </div>
      </section>

      {/* ── PRODUCTS SECTION ── */}
      <section style={{ padding: "5rem clamp(1.5rem,5vw,4rem)", background: "#f9fafb" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span style={{
              display: "inline-block", padding: "4px 16px", borderRadius: 99,
              background: `${c}18`, border: `0.5px solid ${c}35`,
              color: c, fontSize: 12, fontWeight: 500, marginBottom: "1rem",
            }}>Our Collection</span>
            <h2 style={{
              fontSize: "clamp(1.75rem,4vw,2.75rem)",
              fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "0.75rem",
            }}>
              Browse <em style={{ color: c, fontStyle: "italic" }}>All Products</em>
            </h2>
            <p style={{ color: "#6b7280", fontSize: 15, lineHeight: 1.6, maxWidth: 480, margin: "0 auto" }}>
              Explore our complete range of quality products.
            </p>
          </div>

          {/* Category pills */}
          {categories.length > 0 && (
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "3rem" }}>
              {[{ slug: "all", name: "All" }, ...categories].map(cat => (
                <button key={cat.slug} onClick={() => setActiveCat(cat.slug)} style={{
                  padding: "8px 22px", borderRadius: 99, fontSize: 13, fontWeight: 500,
                  cursor: "pointer", transition: "all 0.2s ease",
                  border: "0.5px solid",
                  borderColor: activeCat === cat.slug ? c : "rgba(0,0,0,0.12)",
                  background: activeCat === cat.slug ? c : "#fff",
                  color: activeCat === cat.slug ? "#fff" : "#374151",
                }}>{cat.name}</button>
              ))}
            </div>
          )}

          {/* Grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "5rem", color: "#9ca3af" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
              <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No products yet</p>
              <p style={{ fontSize: 14 }}>Products will appear here once added from the admin panel.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
              {filtered.map(p => (
                <Link key={p.id} href={`/products/${p.slug}?tenant=${tenant.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div
                    onMouseEnter={() => setHovered(p.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      background: "#fff", borderRadius: 16, overflow: "hidden",
                      border: "0.5px solid rgba(0,0,0,0.07)",
                      transform: hovered === p.id ? "translateY(-7px)" : "translateY(0)",
                      boxShadow: hovered === p.id
                        ? "0 24px 48px rgba(0,0,0,0.13)"
                        : "0 2px 8px rgba(0,0,0,0.04)",
                      transition: "all 0.32s cubic-bezier(0.25,0.46,0.45,0.94)",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{
                      height: 210, position: "relative", overflow: "hidden",
                      background: p.images[0]
                        ? `url(${p.images[0]}) center/cover`
                        : "linear-gradient(135deg, #0f172a, #1e293b)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {!p.images[0] && (
                        <span style={{
                          fontSize: "clamp(1.2rem,5vw,2rem)", fontWeight: 700,
                          color: "rgba(255,255,255,0.65)", textAlign: "center", padding: "1rem",
                        }}>{p.name.split(" ").slice(0, 3).join(" ")}</span>
                      )}
                      {p.category && (
                        <div style={{
                          position: "absolute", top: 12, right: 12,
                          padding: "4px 10px", background: "rgba(255,255,255,0.92)",
                          borderRadius: 99, fontSize: 11, fontWeight: 500, color: "#374151",
                        }}>{p.category.name}</div>
                      )}
                      <div style={{ position: "absolute", bottom: 12, left: 14, display: "flex", gap: 4 }}>
                        <div style={{ width: 22, height: 3, borderRadius: 2, background: c }} />
                        <div style={{ width: 8, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.35)" }} />
                        <div style={{ width: 8, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.35)" }} />
                      </div>
                    </div>

                    <div style={{ padding: "1.25rem" }}>
                      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: "#0f172a", lineHeight: 1.3 }}>{p.name}</h3>
                      <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.55, marginBottom: 16 }}>
                        {p.description.slice(0, 78)}{p.description.length > 78 ? "..." : ""}
                      </p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        {p.price
                          ? <span style={{ fontSize: 19, fontWeight: 700, color: c }}>₹{p.price.toLocaleString("en-IN")}</span>
                          : <span style={{ fontSize: 13, color: "#9ca3af" }}>Contact for price</span>
                        }
                        <div style={{
                          width: 34, height: 34, borderRadius: "50%",
                          background: hovered === p.id ? c : "transparent",
                          border: `1.5px solid ${hovered === p.id ? c : "rgba(0,0,0,0.14)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: hovered === p.id ? "#fff" : "#374151",
                          fontSize: 15, transition: "all 0.22s ease",
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

      {/* ── FOOTER ── */}
      <footer style={{ background: "#0a0a0a", color: "#fff", padding: "4rem clamp(1.5rem,5vw,4rem) 2rem" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "3rem", marginBottom: "3rem" }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: "1rem", letterSpacing: "-0.02em" }}>
                {tenant.name.split(" ").map((w, i) => (
                  <span key={i} style={{ color: i > 0 ? c : "#fff" }}>{w}{" "}</span>
                ))}
              </div>
              <p style={{ color: "rgba(255,255,255,0.42)", fontSize: 14, lineHeight: 1.7, maxWidth: 260 }}>
                Leading provider of quality products. Trusted by thousands of customers across India.
              </p>
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.14em", marginBottom: "1rem" }}>CATEGORIES</p>
              {(categories.length > 0 ? categories : [{ slug: "", name: "All Products" }]).map(cat => (
                <a key={cat.slug} href={`/?category=${cat.slug}&tenant=${tenant.slug}`} style={{ display: "block", color: "rgba(255,255,255,0.52)", fontSize: 14, textDecoration: "none", marginBottom: "0.5rem" }}>{cat.name}</a>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.14em", marginBottom: "1rem" }}>QUICK LINKS</p>
              {["All Products", "New Arrivals", "Best Sellers", "Featured"].map(l => (
                <a key={l} href={`/?tenant=${tenant.slug}`} style={{ display: "block", color: "rgba(255,255,255,0.52)", fontSize: 14, textDecoration: "none", marginBottom: "0.5rem" }}>{l}</a>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.14em", marginBottom: "1rem" }}>CONTACT</p>
              {[
                { icon: "✆", text: "+91 98765 43210" },
                { icon: "✉", text: `info@${tenant.slug}.com` },
                { icon: "◎", text: "42, Industrial Area, Hyderabad, Telangana 500032" },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: "0.75rem" }}>
                  <span style={{ color: c, fontSize: 14, flexShrink: 0, marginTop: 2 }}>{icon}</span>
                  <span style={{ color: "rgba(255,255,255,0.52)", fontSize: 14, lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.07)", paddingTop: "2rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <p style={{ color: "rgba(255,255,255,0.22)", fontSize: 13 }}>© 2026 {tenant.name}. All rights reserved.</p>
            <p style={{ color: "rgba(255,255,255,0.22)", fontSize: 13 }}>https://{tenant.slug}.com</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes particle-float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.2; }
          50% { transform: translateY(-20px) scale(1.5); opacity: 0.6; }
        }
        @keyframes scroll-wheel {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(7px); opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}