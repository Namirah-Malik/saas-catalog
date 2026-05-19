"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number | null
  mrp?: number | null
  images: string[]
  isVisible: boolean
  category: { name: string; slug: string } | null
}
interface Category { id: string; name: string; slug: string }
interface Tenant {
  id: string; name: string; slug: string
  primaryColor: string; logo: string | null
  phone?: string; email?: string; address?: string
}
interface Props { tenant: Tenant; products: Product[]; categories: Category[] }

const HERO_SLIDES = [
  {
    eyebrow: "POWER THE",
    title: "future",
    desc: "Industrial-grade inverters & UPS systems engineered for uninterrupted performance across India.",
    label: "Inverters & UPS",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1400&auto=format&fit=crop&q=75",
    overlay: "rgba(8,6,24,0.70)",
  },
  {
    eyebrow: "HARNESS THE",
    title: "sun",
    desc: "High-efficiency solar panels & inverters maximizing energy harvest for homes and enterprises.",
    label: "Solar Solutions",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1400&auto=format&fit=crop&q=75",
    overlay: "rgba(4,18,6,0.65)",
  },
  {
    eyebrow: "STORE THE",
    title: "energy",
    desc: "Next-generation lithium & tubular batteries with industry-leading cycle life and smart BMS.",
    label: "Battery Storage",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&auto=format&fit=crop&q=75",
    overlay: "rgba(12,4,24,0.68)",
  },
  {
    eyebrow: "BUILT FOR",
    title: "trust",
    desc: "15+ years, 5000+ customers, 500+ dealers — India's most trusted power solutions partner.",
    label: "Expert Service",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1400&auto=format&fit=crop&q=75",
    overlay: "rgba(4,8,22,0.68)",
  },
]

const WHY_US = [
  { icon: "✅", title: "Genuine & Certified Products", desc: "We provide original UPS, inverters, batteries, and solar solutions from trusted brands." },
  { icon: "⚡", title: "Fast Delivery & Installation", desc: "Quick dispatch and professional installation support for homes and businesses." },
  { icon: "🛡️", title: "Reliable Warranty Support", desc: "Easy paperless warranty assistance with responsive after-sales service." },
  { icon: "🏆", title: "15+ Years of Experience", desc: "Trusted since 2009 by thousands of customers across India." },
  { icon: "💰", title: "Best Value Pricing", desc: "Competitive prices with quality products and special dealer offers." },
  { icon: "📞", title: "Dedicated Customer Support", desc: "Friendly support team ready to assist before and after your purchase." },
]

export default function ClientPage({ tenant, products, categories }: Props) {
  const c = tenant.primaryColor || "#22c55e"
  const [cur, setCur] = useState(0)
  const [anim, setAnim] = useState(true)
  const [progress, setProg] = useState(0)
  const [imgLoaded, setImgLoaded] = useState<boolean[]>(HERO_SLIDES.map(() => false))
  const [activeCat, setActiveCat] = useState("all")
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [inquiryProduct, setInquiryProduct] = useState<Product | null>(null)
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const progRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const DURATION = 6000

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  useEffect(() => {
    HERO_SLIDES.forEach((s, i) => {
      const img = new window.Image()
      img.src = s.image
      img.onload = () => setImgLoaded(p => { const n = [...p]; n[i] = true; return n })
    })
  }, [])

  function goTo(n: number) {
    if (n === cur) return
    setAnim(false)
    clearTimeout(timerRef.current!); clearInterval(progRef.current!)
    setTimeout(() => { setCur(n); setAnim(true); setProg(0) }, 80)
  }

  useEffect(() => {
    setProg(0)
    const start = Date.now()
    progRef.current = setInterval(() => {
      setProg(Math.min(((Date.now() - start) / DURATION) * 100, 100))
    }, 40)
    timerRef.current = setTimeout(() => {
      setCur(p => (p + 1) % HERO_SLIDES.length)
      setAnim(true); setProg(0)
    }, DURATION)
    return () => { clearTimeout(timerRef.current!); clearInterval(progRef.current!) }
  }, [cur])

  const filtered = activeCat === "all" ? products : products.filter(p => p.category?.slug === activeCat)
  const slide = HERO_SLIDES[cur]

  async function submitInquiry(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.phone) return
    setSending(true)
    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tenantId: tenant.id,
          productId: inquiryProduct?.id || null,
          message: form.message || `Enquiry about ${inquiryProduct?.name || tenant.name}`,
        }),
      })
      setSent(true)
    } catch {}
    setSending(false)
  }

  function openInquiry(p: Product | null = null) {
    setInquiryProduct(p)
    setForm({ name: "", phone: "", email: "", message: p ? `Hi, I'm interested in ${p.name}.` : "" })
    setSent(false)
    setInquiryOpen(true)
    setMenuOpen(false)
  }

  const iStyle = {
    width: "100%", padding: "11px 14px",
    border: "1.5px solid #e5e7eb", borderRadius: 10,
    fontSize: 14, outline: "none", boxSizing: "border-box" as const,
    fontFamily: "inherit", color: "#111",
  }

  return (
    <div style={{ fontFamily: "'Outfit', 'Segoe UI', system-ui, sans-serif", color: "#0f172a", background: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(32px); filter:blur(6px); } to { opacity:1; transform:translateY(0); filter:blur(0); } }
        @keyframes floatP { 0%,100%{transform:translateY(0) scale(1);opacity:.18} 50%{transform:translateY(-18px) scale(1.4);opacity:.5} }
        @keyframes scrollW { 0%,100%{transform:translateY(0);opacity:1} 50%{transform:translateY(7px);opacity:.2} }
        @keyframes ping { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.5)} }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-33.333%)} }
        @keyframes modalIn { from{opacity:0;transform:scale(.95) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        html { scroll-behavior: smooth; }
        img { display: block; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        height: 60,
        background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid #f1f5f9" : "none",
        transition: "all 0.35s ease",
        display: "flex", alignItems: "center",
        padding: "0 clamp(1rem,5vw,3rem)",
        justifyContent: "space-between",
      }}>
        {/* Logo */}
        <Link href={`/?tenant=${tenant.slug}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          {tenant.logo
            ? <img src={tenant.logo} alt={tenant.name} style={{ height: 32 }} />
            : <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: c, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 2px 12px ${c}55` }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#fff"/></svg>
                </div>
                <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.4px", color: scrolled ? "#0f172a" : "#fff" }}>
                  {tenant.name.split(" ")[0]}<span style={{ color: c }}>{tenant.name.includes(" ") ? " " + tenant.name.split(" ").slice(1).join(" ") : ""}</span>
                </span>
              </div>
          }
        </Link>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }} className="desktop-nav">
          {[
            { label: "Products", href: "#products" },
            { label: "Why Us", href: "#why-us" },
            { label: "Contact", href: "#contact" },
          ].map(l => (
            <a key={l.label} href={l.href} style={{
              padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500,
              color: scrolled ? "#374151" : "rgba(255,255,255,0.8)",
              textDecoration: "none", transition: "all 0.2s",
            }}>{l.label}</a>
          ))}
          <button onClick={() => openInquiry()} style={{
            padding: "9px 20px", background: c, color: "#fff",
            border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: `0 3px 12px ${c}55`,
          }}>Get Quote</button>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          background: "none", border: "none", cursor: "pointer", padding: 6,
          display: "flex", flexDirection: "column", gap: 5,
        }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: 22, height: 2, borderRadius: 2,
              background: scrolled ? "#0f172a" : "#fff",
              transition: "all 0.2s",
              transform: menuOpen
                ? i === 0 ? "rotate(45deg) translate(5px,5px)"
                : i === 2 ? "rotate(-45deg) translate(5px,-5px)"
                : "scaleX(0)"
                : "none",
            }} />
          ))}
        </button>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            position: "fixed", top: 60, left: 0, right: 0,
            background: "#fff", borderBottom: "1px solid #f1f5f9",
            padding: "1rem", zIndex: 190,
            animation: "slideDown 0.2s ease",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          }}>
            {[
              { label: "Products", href: "#products" },
              { label: "Why Us", href: "#why-us" },
              { label: "Contact", href: "#contact" },
            ].map(l => (
              <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} style={{
                display: "block", padding: "12px 16px", fontSize: 15, fontWeight: 500,
                color: "#374151", textDecoration: "none", borderRadius: 8,
                borderBottom: "1px solid #f8fafc",
              }}>{l.label}</a>
            ))}
            <button onClick={() => openInquiry()} style={{
              width: "100%", marginTop: 12, padding: "12px", background: c,
              color: "#fff", border: "none", borderRadius: 10,
              fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
            }}>📞 Get Free Quote</button>
          </div>
        )}
      </nav>

      {/* ── HERO SLIDER ── */}
      <section style={{ position: "relative", width: "100%", height: "100vh", minHeight: 580, overflow: "hidden" }}>
        {HERO_SLIDES.map((s, i) => (
          <div key={i} style={{
            position: "absolute", inset: 0,
            backgroundImage: imgLoaded[i] ? `url(${s.image})` : "none",
            backgroundSize: "cover", backgroundPosition: "center",
            backgroundColor: "#0a0a14",
            opacity: i === cur ? 1 : 0,
            transition: "opacity 1.1s ease",
          }}>
            <div style={{ position: "absolute", inset: 0, background: s.overlay }} />
          </div>
        ))}

        <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          background: "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)" }} />

        {/* Particles */}
        {[[12,18,0,3.2],[78,55,0.9,4],[42,82,1.6,3.6],[88,22,2.3,5],[22,68,3.1,4.4],[65,38,0.5,3.8]].map(([x,y,d,dur],i) => (
          <div key={i} style={{ position:"absolute", left:`${x}%`, top:`${y}%`, width:4, height:4, zIndex:2,
            borderRadius:"50%", background:"rgba(255,255,255,0.2)", pointerEvents:"none",
            animation:`floatP ${dur}s ease-in-out ${d}s infinite` }} />
        ))}

        {/* Content */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 10,
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "80px clamp(1.25rem,7vw,5rem) 3rem",
          maxWidth: 680,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16,
            opacity: anim?1:0, transform: anim?"translateY(0)":"translateY(20px)",
            transition:"all 0.6s ease 0.1s" }}>
            <div style={{ width:24, height:2, background:c, borderRadius:2 }}/>
            <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.22em", color:"rgba(255,255,255,0.5)" }}>
              {slide.eyebrow}
            </span>
          </div>

          <h1 style={{ fontSize:"clamp(3.5rem,12vw,8rem)", fontWeight:900, lineHeight:0.9,
            letterSpacing:"-0.05em", color:"#fff", marginBottom:20,
            opacity: anim?1:0, transform: anim?"translateY(0)":"translateY(36px)",
            filter: anim?"blur(0)":"blur(6px)",
            transition:"all 0.75s ease 0.2s" }}>
            {slide.title}
          </h1>

          <p style={{ fontSize:"clamp(14px,2vw,16px)", color:"rgba(255,255,255,0.65)",
            maxWidth:420, lineHeight:1.7, marginBottom:28,
            opacity: anim?1:0, transform: anim?"translateY(0)":"translateY(20px)",
            transition:"all 0.65s ease 0.35s" }}>
            {slide.desc}
          </p>

          <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap",
            opacity: anim?1:0, transform: anim?"translateY(0)":"translateY(16px)",
            transition:"all 0.6s ease 0.48s" }}>
            <button onClick={() => openInquiry()} style={{
              padding:"13px 28px", background:c, color:"#fff",
              border:"none", borderRadius:9, fontSize:14, fontWeight:700,
              cursor:"pointer", fontFamily:"inherit",
              boxShadow:`0 6px 20px ${c}55`,
            }}>Get Best Price →</button>
            <a href="#products" style={{
              padding:"13px 22px", background:"rgba(255,255,255,0.1)",
              backdropFilter:"blur(8px)", color:"#fff",
              border:"1px solid rgba(255,255,255,0.2)", borderRadius:9,
              fontSize:14, fontWeight:500, textDecoration:"none",
            }}>Browse Products</a>
          </div>

          {/* Accent label */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:28,
            opacity: anim?1:0, transition:"all 0.5s ease 0.65s" }}>
            <div style={{ width: anim?50:0, height:1, background:"rgba(255,255,255,0.3)", transition:"width 0.5s ease 0.7s" }}/>
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.4)", letterSpacing:"0.12em", fontWeight:600 }}>
              {slide.label.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Right slide indicators */}
        <div style={{ position:"absolute", right:"clamp(1rem,4vw,2.5rem)", top:"50%",
          transform:"translateY(-50%)", zIndex:15, display:"flex", flexDirection:"column", gap:8 }}>
          {HERO_SLIDES.map((_, i) => (
            <div key={i} onClick={() => goTo(i)} style={{
              width: cur===i ? 9 : 6, height: cur===i ? 9 : 6,
              borderRadius:"50%", cursor:"pointer",
              background: cur===i ? "#fff" : "rgba(255,255,255,0.28)",
              boxShadow: cur===i ? `0 0 0 3px rgba(255,255,255,0.18)` : "none",
              transition:"all 0.3s ease",
            }} />
          ))}
        </div>

        {/* Slide counter + scroll */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, zIndex:20,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"14px clamp(1.25rem,7vw,5rem)",
          background:"linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 100%)" }}>
          <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", letterSpacing:"0.12em", fontWeight:600 }}>
            {String(cur+1).padStart(2,"0")} / {String(HERO_SLIDES.length).padStart(2,"0")}
          </span>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, opacity:.35 }}>
            <div style={{ width:17, height:27, border:"1px solid rgba(255,255,255,0.5)", borderRadius:10,
              display:"flex", justifyContent:"center", paddingTop:5 }}>
              <div style={{ width:2, height:5, background:"#fff", borderRadius:2, animation:"scrollW 2s infinite" }}/>
            </div>
          </div>
          <div style={{ display:"flex", gap:14, alignItems:"center" }}>
            {[{t:"BIS Certified"},{t:"ISO Certified"},{t:"4.9★ Rated"}].map(b => (
              <span key={b.t} style={{ fontSize:10, color:"rgba(255,255,255,0.35)", fontWeight:500 }}>{b.t}</span>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2.5,
          background:"rgba(255,255,255,0.1)", zIndex:30 }}>
          <div style={{ height:"100%", width:`${progress}%`, background:c,
            transition:"width 0.04s linear", boxShadow:`0 0 6px ${c}80` }}/>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ background:"#0f172a", padding:"12px 0", overflow:"hidden" }}>
        <div style={{ display:"flex", animation:"marquee 28s linear infinite", width:"max-content" }}>
          {[...Array(3)].map((_,rep) => (
            <div key={rep} style={{ display:"flex", flexShrink:0 }}>
              {["✦ 15+ Years Experience","✦ Genuine Products","✦ Fast Installation","✦ Warranty Support","✦ 5000+ Customers","✦ Pan-India Delivery","✦ Best Value Pricing","✦ 24/7 Support"].map(t => (
                <span key={t} style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.4)",
                  letterSpacing:"0.08em", padding:"0 32px", whiteSpace:"nowrap" }}>{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA BANNER ── */}
      <div style={{ background:`linear-gradient(135deg, ${c}18, ${c}08)`,
        borderBottom:`1px solid ${c}20`, padding:"2rem clamp(1.25rem,5vw,3rem)" }}>
        <div style={{ maxWidth:900, margin:"0 auto", display:"flex",
          alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}>
          <div>
            <h2 style={{ fontSize:"clamp(1.1rem,3vw,1.5rem)", fontWeight:700, color:"#0f172a", marginBottom:4 }}>
              Power Backup Solutions You Can Trust
            </h2>
            <p style={{ fontSize:14, color:"#475569", lineHeight:1.6 }}>
              From small shops to offices and homes, we provide genuine products with fast delivery and service support.
            </p>
          </div>
          <button onClick={() => openInquiry()} style={{
            padding:"12px 28px", background:c, color:"#fff",
            border:"none", borderRadius:10, fontSize:14, fontWeight:700,
            cursor:"pointer", fontFamily:"inherit", flexShrink:0,
            boxShadow:`0 4px 14px ${c}45`,
          }}>📞 Contact Us</button>
        </div>
      </div>

      {/* ── PRODUCTS ── */}
      <section id="products" style={{ padding:"4rem clamp(1.25rem,5vw,3rem)", background:"#f8fafc" }}>
        <div style={{ maxWidth:1300, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"2.5rem" }}>
            <span style={{ display:"inline-block", padding:"4px 16px", borderRadius:99,
              background:`${c}15`, border:`1px solid ${c}30`, color:c,
              fontSize:12, fontWeight:700, marginBottom:10 }}>Our Collection</span>
            <h2 style={{ fontSize:"clamp(1.6rem,4vw,2.25rem)", fontWeight:800,
              letterSpacing:"-0.03em", marginBottom:8 }}>
              Browse <em style={{ color:c, fontStyle:"italic" }}>All Products</em>
            </h2>
            <p style={{ color:"#64748b", fontSize:14, maxWidth:440, margin:"0 auto", lineHeight:1.6 }}>
              Quality power solutions for homes, shops, and businesses across India.
            </p>
          </div>

          {/* Category pills */}
          {categories.length > 0 && (
            <div style={{ display:"flex", gap:8, justifyContent:"center",
              flexWrap:"wrap", marginBottom:"2.5rem" }}>
              {[{slug:"all",name:"All"}, ...categories].map(cat => (
                <button key={cat.slug} onClick={() => setActiveCat(cat.slug)} style={{
                  padding:"8px 20px", borderRadius:99, fontSize:13, fontWeight:500,
                  cursor:"pointer", border:"1.5px solid",
                  borderColor: activeCat===cat.slug ? c : "#e2e8f0",
                  background: activeCat===cat.slug ? c : "#fff",
                  color: activeCat===cat.slug ? "#fff" : "#374151",
                  boxShadow: activeCat===cat.slug ? `0 3px 10px ${c}40` : "none",
                  transition:"all 0.2s", fontFamily:"inherit",
                }}>{cat.name}</button>
              ))}
            </div>
          )}

          {/* Product grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"4rem", color:"#94a3b8" }}>
              <div style={{ fontSize:48, marginBottom:12 }}>📦</div>
              <p style={{ fontSize:17, fontWeight:600, color:"#374151", marginBottom:6 }}>No products yet</p>
              <p style={{ fontSize:13 }}>Products added in the admin will appear here.</p>
            </div>
          ) : (
            <div style={{ display:"grid",
              gridTemplateColumns:"repeat(auto-fill, minmax(min(100%, 260px), 1fr))",
              gap:16 }}>
              {filtered.map(p => (
                <ProductCard key={p.id} p={p} c={c} tenant={tenant} onInquiry={() => openInquiry(p)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section id="why-us" style={{ padding:"4rem clamp(1.25rem,5vw,3rem)", background:"#fff" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"2.5rem" }}>
            <span style={{ display:"inline-block", padding:"4px 16px", borderRadius:99,
              background:`${c}15`, border:`1px solid ${c}30`, color:c,
              fontSize:12, fontWeight:700, marginBottom:10 }}>Why Choose Us</span>
            <h2 style={{ fontSize:"clamp(1.6rem,4vw,2.25rem)", fontWeight:800,
              letterSpacing:"-0.03em", lineHeight:1.1 }}>
              Trusted by Customers<br/>Across India
            </h2>
          </div>
          <div style={{ display:"grid",
            gridTemplateColumns:"repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
            gap:16 }}>
            {WHY_US.map((item, i) => (
              <div key={i} style={{
                padding:"20px", borderRadius:14,
                border:"1.5px solid #f1f5f9", background:"#fafcff",
                display:"flex", alignItems:"flex-start", gap:14,
                transition:"all 0.2s",
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = c
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = `0 6px 20px ${c}15`
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#f1f5f9"
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = "none"
                }}
              >
                <div style={{ fontSize:28, flexShrink:0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:"#0f172a", marginBottom:5 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize:13, color:"#64748b", lineHeight:1.65 }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT / CTA SECTION ── */}
      <section id="contact" style={{ background:"#0f172a", padding:"4rem clamp(1.25rem,5vw,3rem)" }}>
        <div style={{ maxWidth:800, margin:"0 auto", textAlign:"center" }}>
          <h2 style={{ fontSize:"clamp(1.6rem,4vw,2.25rem)", fontWeight:800,
            letterSpacing:"-0.03em", color:"#fff", marginBottom:12 }}>
            Ready to Get Started?
          </h2>
          <p style={{ fontSize:15, color:"rgba(255,255,255,0.55)", lineHeight:1.7, marginBottom:32 }}>
            Contact us for the best price on power solutions for your home or business.<br/>
            Free consultation, fast delivery, and professional installation.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginBottom:"3rem" }}>
            <button onClick={() => openInquiry()} style={{
              padding:"14px 32px", background:c, color:"#fff",
              border:"none", borderRadius:10, fontSize:15, fontWeight:700,
              cursor:"pointer", fontFamily:"inherit",
              boxShadow:`0 6px 20px ${c}50`,
            }}>Get Free Quote →</button>
            <a href={`tel:${tenant.phone || "+919876543210"}`} style={{
              padding:"14px 28px", background:"rgba(255,255,255,0.08)",
              color:"#fff", border:"1px solid rgba(255,255,255,0.15)",
              borderRadius:10, fontSize:15, fontWeight:500,
              textDecoration:"none", display:"inline-flex", alignItems:"center", gap:8,
            }}>📞 Call Now</a>
          </div>
          <div style={{ display:"flex", gap:20, justifyContent:"center", flexWrap:"wrap" }}>
            {[
              { icon:"📞", val: tenant.phone || "+91 98765 43210" },
              { icon:"✉️", val: tenant.email || `info@${tenant.slug}.com` },
              { icon:"📍", val: tenant.address || "Hyderabad, Telangana" },
            ].map(({ icon, val }) => (
              <div key={val} style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span>{icon}</span>
                <span style={{ fontSize:13, color:"rgba(255,255,255,0.5)" }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:"#0a0a0a", padding:"3rem clamp(1.25rem,5vw,3rem) 1.5rem" }}>
        <div style={{ maxWidth:1300, margin:"0 auto" }}>
          <div style={{ display:"grid",
            gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))",
            gap:"2.5rem", marginBottom:"2.5rem" }}>
            <div>
              <div style={{ fontSize:17, fontWeight:800, color:"#fff", marginBottom:10, letterSpacing:"-0.3px" }}>
                {tenant.name.split(" ")[0]}<span style={{ color:c }}>{tenant.name.includes(" ") ? " "+tenant.name.split(" ").slice(1).join(" ") : ""}</span>
              </div>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.38)", lineHeight:1.7 }}>
                Genuine power solutions trusted since 2009. Fast delivery, professional installation, reliable warranty.
              </p>
            </div>
            <div>
              <p style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.25)", letterSpacing:"0.14em", marginBottom:12 }}>CATEGORIES</p>
              {categories.length > 0
                ? categories.map(cat => (
                    <a key={cat.slug} href={`/?category=${cat.slug}&tenant=${tenant.slug}`}
                      style={{ display:"block", color:"rgba(255,255,255,0.48)", fontSize:13, textDecoration:"none", marginBottom:8 }}>
                      {cat.name}
                    </a>
                  ))
                : <a href="#products" style={{ display:"block", color:"rgba(255,255,255,0.48)", fontSize:13, textDecoration:"none" }}>All Products</a>
              }
            </div>
            <div>
              <p style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.25)", letterSpacing:"0.14em", marginBottom:12 }}>QUICK LINKS</p>
              {["All Products","Why Choose Us","Contact Us"].map(l => (
                <a key={l} href={`#${l.toLowerCase().replace(/\s+/g,"-")}`}
                  style={{ display:"block", color:"rgba(255,255,255,0.48)", fontSize:13, textDecoration:"none", marginBottom:8 }}>
                  {l}
                </a>
              ))}
            </div>
            <div>
              <p style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.25)", letterSpacing:"0.14em", marginBottom:12 }}>CONTACT</p>
              {[
                { icon:"📞", val: tenant.phone || "+91 98765 43210" },
                { icon:"✉️", val: tenant.email || `info@${tenant.slug}.com` },
                { icon:"📍", val: tenant.address || "Hyderabad, Telangana 500032" },
              ].map(({ icon, val }) => (
                <div key={val} style={{ display:"flex", gap:8, marginBottom:10, alignItems:"flex-start" }}>
                  <span style={{ fontSize:13, flexShrink:0 }}>{icon}</span>
                  <span style={{ fontSize:13, color:"rgba(255,255,255,0.45)", lineHeight:1.5 }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:"1.5rem",
            display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
            <p style={{ color:"rgba(255,255,255,0.2)", fontSize:12 }}>
              © {new Date().getFullYear()} {tenant.name}. All rights reserved.
            </p>
            <div style={{ display:"flex", gap:16 }}>
              {["Privacy Policy","Terms","Refund Policy"].map(l => (
                <a key={l} href="#" style={{ color:"rgba(255,255,255,0.2)", fontSize:12, textDecoration:"none" }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ── INQUIRY MODAL ── */}
      {inquiryOpen && (
        <div style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.6)",
          zIndex:500, display:"flex", alignItems:"flex-end",
          justifyContent:"center", padding:"0 0 0 0",
          backdropFilter:"blur(4px)",
        }} onClick={e => e.target === e.currentTarget && setInquiryOpen(false)}>
          <div style={{
            background:"#fff", borderRadius:"20px 20px 0 0",
            width:"100%", maxWidth:540, maxHeight:"92vh",
            overflowY:"auto", animation:"modalIn 0.25s ease",
            boxShadow:"0 -8px 40px rgba(0,0,0,0.25)",
          }}>
            <div style={{ padding:"20px 24px 16px", borderBottom:"1px solid #f1f5f9",
              display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ fontSize:17, fontWeight:800, color:"#0f172a" }}>Send Enquiry</div>
                <div style={{ fontSize:13, color:"#94a3b8", marginTop:3 }}>
                  {inquiryProduct ? `Re: ${inquiryProduct.name}` : `To: ${tenant.name}`}
                </div>
              </div>
              <button onClick={() => setInquiryOpen(false)} style={{
                background:"none", border:"none", cursor:"pointer",
                fontSize:22, color:"#94a3b8", lineHeight:1, padding:4,
              }}>×</button>
            </div>

            {!sent ? (
              <form onSubmit={submitInquiry} style={{ padding:"20px 24px 28px" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
                  <div>
                    <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>Full Name *</label>
                    <input required value={form.name} onChange={e => setForm({...form, name:e.target.value})}
                      placeholder="Your name" style={iStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>Phone *</label>
                    <input required value={form.phone} onChange={e => setForm({...form, phone:e.target.value})}
                      placeholder="+91 98765 43210" type="tel" style={iStyle} />
                  </div>
                </div>
                <div style={{ marginBottom:12 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})}
                    placeholder="you@email.com" style={iStyle} />
                </div>
                <div style={{ marginBottom:20 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>Message</label>
                  <textarea rows={3} value={form.message} onChange={e => setForm({...form, message:e.target.value})}
                    placeholder="Tell us what you need..."
                    style={{ ...iStyle, resize:"vertical" as const }} />
                </div>
                <button type="submit" disabled={sending} style={{
                  width:"100%", padding:"14px", background: sending ? "#94a3b8" : c,
                  color:"#fff", border:"none", borderRadius:12, fontSize:15,
                  fontWeight:700, cursor: sending ? "not-allowed" : "pointer",
                  fontFamily:"inherit",
                }}>
                  {sending ? "Sending..." : "Submit Enquiry →"}
                </button>
                <p style={{ textAlign:"center", fontSize:12, color:"#94a3b8", marginTop:10 }}>
                  We'll respond within 24 hours. No spam.
                </p>
              </form>
            ) : (
              <div style={{ padding:"48px 24px", textAlign:"center" }}>
                <div style={{ fontSize:52, marginBottom:14 }}>✅</div>
                <div style={{ fontSize:20, fontWeight:800, color:"#16a34a", marginBottom:8 }}>Enquiry Sent!</div>
                <div style={{ color:"#64748b", fontSize:14 }}>We'll get back to you within 24 hours.</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── WHATSAPP BUTTON ── */}
      <a href={`https://wa.me/91${(tenant.phone || "9876543210").replace(/\D/g,"")}`}
        target="_blank" rel="noopener noreferrer"
        style={{
          position:"fixed", bottom:24, right:20, zIndex:99,
          width:52, height:52, borderRadius:"50%",
          background:"#25d366", display:"flex", alignItems:"center",
          justifyContent:"center", textDecoration:"none",
          boxShadow:"0 4px 20px rgba(37,211,102,0.5)",
          transition:"transform 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform="scale(1.1)")}
        onMouseLeave={e => (e.currentTarget.style.transform="scale(1)")}>
        <svg width="25" height="25" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  )
}

/* ── PRODUCT CARD ── */
function ProductCard({ p, c, tenant, onInquiry }: { p: Product; c: string; tenant: Tenant; onInquiry: () => void }) {
  const [hov, setHov] = useState(false)
  const hasImg = p.images && p.images.length > 0 && p.images[0]

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:"#fff", borderRadius:14, overflow:"hidden",
        border:`1.5px solid ${hov ? c+"55" : "#f1f5f9"}`,
        boxShadow: hov ? `0 12px 32px rgba(0,0,0,0.1), 0 0 0 1px ${c}25` : "0 1px 6px rgba(0,0,0,0.04)",
        transform: hov ? "translateY(-4px)" : "none",
        transition:"all 0.28s ease",
        display:"flex", flexDirection:"column",
      }}
    >
      {/* Image */}
      <div style={{
        height:195, position:"relative", overflow:"hidden",
        background: hasImg ? "#f8fafc" : "linear-gradient(135deg,#0f172a,#1e293b)",
        display:"flex", alignItems:"center", justifyContent:"center",
        flexShrink:0,
      }}>
        {hasImg
          ? <img src={p.images[0]} alt={p.name} style={{
              width:"100%", height:"100%", objectFit:"cover",
              transform: hov?"scale(1.04)":"scale(1)", transition:"transform 0.4s ease",
            }}/>
          : <span style={{ fontSize:"clamp(1rem,4vw,1.5rem)", fontWeight:700,
              color:"rgba(255,255,255,0.55)", textAlign:"center", padding:"1rem", lineHeight:1.3 }}>
              {p.name.split(" ").slice(0,3).join(" ")}
            </span>
        }
        {p.category && (
          <div style={{ position:"absolute", top:10, right:10, padding:"4px 10px",
            background:"rgba(255,255,255,0.92)", backdropFilter:"blur(4px)",
            borderRadius:99, fontSize:11, fontWeight:600, color:"#374151" }}>
            {p.category.name}
          </div>
        )}
        <div style={{ position:"absolute", bottom:10, left:12, display:"flex", gap:4 }}>
          <div style={{ width:20, height:3, borderRadius:2, background:c }}/>
          <div style={{ width:7, height:3, borderRadius:2, background:"rgba(255,255,255,0.3)" }}/>
          <div style={{ width:7, height:3, borderRadius:2, background:"rgba(255,255,255,0.3)" }}/>
        </div>
        {hov && (
          <div style={{ position:"absolute", inset:0, background:`${c}25`,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <button onClick={e => { e.preventDefault(); onInquiry() }} style={{
              padding:"9px 20px", background:c, color:"#fff",
              border:"none", borderRadius:8, fontSize:13, fontWeight:700,
              cursor:"pointer", fontFamily:"inherit",
              boxShadow:`0 4px 16px ${c}55`,
            }}>Quick Enquiry</button>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding:"14px 16px 16px", flex:1, display:"flex", flexDirection:"column" }}>
        <h3 style={{ fontSize:14, fontWeight:700, color:"#0f172a", marginBottom:6, lineHeight:1.35 }}>
          {p.name}
        </h3>
        <p style={{ fontSize:12.5, color:"#64748b", lineHeight:1.55, marginBottom:12, flex:1 }}>
          {p.description?.slice(0,72)}{(p.description?.length||0)>72?"…":""}
        </p>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          {p.price
            ? <span style={{ fontSize:18, fontWeight:800, color:c }}>₹{p.price.toLocaleString("en-IN")}</span>
            : <span style={{ fontSize:12.5, color:"#94a3b8", fontStyle:"italic" }}>Contact for price</span>
          }
          <Link href={`/products/${p.slug}?tenant=${tenant.slug}`} style={{
            width:34, height:34, borderRadius:"50%",
            background: hov ? c : "#f8fafc",
            border:`1.5px solid ${hov ? c : "#e2e8f0"}`,
            display:"flex", alignItems:"center", justifyContent:"center",
            color: hov ? "#fff" : "#64748b", fontSize:15,
            textDecoration:"none", transition:"all 0.2s",
          }}>→</Link>
        </div>
      </div>
    </div>
  )
}