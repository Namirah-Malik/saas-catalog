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
  discount?: number | null
  isHero?: boolean
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
  tagline?: string
  description?: string
  phone?: string
  email?: string
  address?: string
  website?: string
}
interface Props { tenant: Tenant; products: Product[]; categories: Category[] }

/* ─────────────────────────────────────────────────────────────────────────────
   HERO SLIDES  (real Unsplash images per slide)
───────────────────────────────────────────────────────────────────────────── */
const HERO_SLIDES = [
  {
    eyebrow:  "INDIA'S TRUSTED POWER BRAND",
    headline: ["Uninterrupted", "Power.", "Always."],
    accent:   "Power.",
    desc:     "Industrial-grade inverters & UPS systems trusted by 50,000+ customers. Zero downtime, zero compromise.",
    label:    "INVERTERS & UPS",
    cta:      "Explore Inverters",
    ctaSub:   "Starting ₹4,999",
    stats:    [{ val: "50K+", label: "Customers" }, { val: "15+", label: "Years" }, { val: "500+", label: "Dealers" }],
    image:    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1600&auto=format&fit=crop&q=80",
    overlay:  "rgba(10,8,28,0.72)",
    badge:    "🔋 New: 5kVA Lithium UPS Now Available",
  },
  {
    eyebrow:  "CLEAN ENERGY FOR EVERY ROOFTOP",
    headline: ["Solar Energy,", "Simplified", "for You."],
    accent:   "Simplified",
    desc:     "High-efficiency monocrystalline solar panels with 25-year performance warranty. Cut your electricity bill by up to 90%.",
    label:    "SOLAR PANELS",
    cta:      "Get Solar Quote",
    ctaSub:   "Free site survey",
    stats:    [{ val: "540W", label: "Max Wattage" }, { val: "25yr", label: "Warranty" }, { val: "21.5%", label: "Efficiency" }],
    image:    "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&auto=format&fit=crop&q=80",
    overlay:  "rgba(4,20,8,0.68)",
    badge:    "☀️ Subsidy: PM Surya Ghar Yojana — Apply Now",
  },
  {
    eyebrow:  "STORE MORE. WASTE LESS.",
    headline: ["Next-Gen", "Battery", "Storage."],
    accent:   "Battery",
    desc:     "Lithium & tall-tubular batteries with smart BMS, 6000+ cycle life, and 7-year warranty. Never lose power again.",
    label:    "BATTERY STORAGE",
    cta:      "Compare Batteries",
    ctaSub:   "Expert guidance free",
    stats:    [{ val: "6000+", label: "Cycle Life" }, { val: "7yr", label: "Warranty" }, { val: "150Ah", label: "Max Capacity" }],
    image:    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&auto=format&fit=crop&q=80",
    overlay:  "rgba(14,4,28,0.70)",
    badge:    "⚡ New: LiFePO4 Lithium Series Launched",
  },
  {
    eyebrow:  "BUILT FOR INDIAN HOMES",
    headline: ["5-Star ACs &", "Smart Home", "Appliances."],
    accent:   "Smart Home",
    desc:     "Premium inverter ACs, BLDC fans, and smart appliances engineered for Indian summers. Highest energy savings guaranteed.",
    label:    "HOME APPLIANCES",
    cta:      "Browse Appliances",
    ctaSub:   "EMI from ₹999/mo",
    stats:    [{ val: "5★", label: "Energy Rating" }, { val: "28W", label: "BLDC Fan" }, { val: "R32", label: "Eco Coolant" }],
    image:    "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1600&auto=format&fit=crop&q=80",
    overlay:  "rgba(4,8,24,0.70)",
    badge:    "🏠 New: Smart Home Range Now Available",
  },
]

/* ─────────────────────────────────────────────────────────────────────────────
   WHY CHOOSE US  DATA
───────────────────────────────────────────────────────────────────────────── */
const WHY_US = [
  { icon: "🏆", title: "15+ Years Experience", desc: "Trusted across India since 2009, serving homes, businesses, and industry with certified power solutions." },
  { icon: "🔒", title: "BIS & ISO Certified", desc: "All products meet Bureau of Indian Standards and ISO 9001:2015 quality management requirements." },
  { icon: "🚚", title: "Pan-India Delivery", desc: "500+ dealer network across 28 states with fast dispatch and professional installation support." },
  { icon: "🛡️", title: "Warranty Assured", desc: "Industry-leading warranties — up to 25 years on solar panels, 7 years on batteries, 2 years on UPS." },
  { icon: "📞", title: "24/7 Service Support", desc: "Dedicated after-sales team available round the clock. Same-day service in major metros." },
  { icon: "💰", title: "Best Price Guarantee", desc: "We match any authorized dealer price. Flexible EMI options starting ₹999/month on all orders." },
]

/* ─────────────────────────────────────────────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  { name: "Rajesh Kumar", role: "Factory Owner, Pune", text: "Installed 4 Microtek inverters across our plant. Zero downtime in 2 years. The team was professional and after-sales support is excellent.", stars: 5, avatar: "R" },
  { name: "Priya Nair", role: "Homeowner, Hyderabad", text: "Cut my electricity bill from ₹4,200 to ₹480/month with their 6kW solar setup. ROI in under 3 years. Highly recommend!", stars: 5, avatar: "P" },
  { name: "Amit Sharma", role: "IT Manager, Bengaluru", text: "We've been using their UPS systems for our server room for 5 years. Flawless performance, even during extended power cuts.", stars: 5, avatar: "A" },
]

/* ─────────────────────────────────────────────────────────────────────────────
   NAV LINKS
───────────────────────────────────────────────────────────────────────────── */
const NAV_LINKS = ["Home", "Products", "Solar", "Batteries", "About", "Contact"]

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function ClientPage({ tenant, products, categories }: Props) {
  const c = tenant.primaryColor || "#22c55e"

  /* ── state ── */
  const [cur, setCur]       = useState(0)
  const [anim, setAnim]     = useState(true)
  const [progress, setProg] = useState(0)
  const [activeCat, setActiveCat] = useState("all")
  const [hovered, setHovered]     = useState<string | null>(null)
  const [scrolled, setScrolled]   = useState(false)
  const [imgLoaded, setImgLoaded] = useState<boolean[]>(HERO_SLIDES.map(() => false))
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [inquiryProduct, setInquiryProduct] = useState<Product | null>(null)
  const [formData, setFormData]   = useState({ name: "", email: "", phone: "", message: "", quantity: "" })
  const [formSent, setFormSent]   = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const progRef  = useRef<ReturnType<typeof setInterval> | null>(null)
  const DURATION = 6500
  const slide    = HERO_SLIDES[cur]

  /* ── scroll detection ── */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  /* ── image preload ── */
  useEffect(() => {
    HERO_SLIDES.forEach((s, i) => {
      const img = new window.Image()
      img.src = s.image
      img.onload = () => setImgLoaded(prev => { const n = [...prev]; n[i] = true; return n })
    })
  }, [])

  /* ── auto-advance slider ── */
  function goTo(n: number) {
    if (n === cur) return
    setAnim(false)
    clearTimeout(timerRef.current!); clearInterval(progRef.current!)
    setTimeout(() => { setCur(n); setAnim(true); setProg(0) }, 90)
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

  /* ── filtered products ── */
  const filtered = activeCat === "all"
    ? products
    : products.filter(p => p.category?.slug === activeCat)

  const heroProducts = products.filter(p => p.isHero).slice(0, 4)

  /* ── helpers ── */
  const ease = "cubic-bezier(0.25,0.46,0.45,0.94)"
  const reveal = (delay: number) => ({
    opacity: anim ? 1 : 0,
    filter:  anim ? "blur(0px)" : "blur(8px)",
    transform: anim ? "translateY(0)" : "translateY(48px)",
    transition: `all 0.75s ${ease} ${delay}s`,
  })

  const handleInquiry = (product: Product | null = null) => {
    setInquiryProduct(product)
    setFormData({ name: "", email: "", phone: "", message: product ? `Hi, I'm interested in ${product.name}.` : "", quantity: "" })
    setFormSent(false)
    setInquiryOpen(true)
  }

  const submitInquiry = () => {
    if (!formData.name || !formData.email) return
    setFormSent(true)
    setTimeout(() => setInquiryOpen(false), 2000)
  }

  /* ══════════════════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════════════════ */
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans','Inter',system-ui,sans-serif", background: "#fff", color: "#0f172a" }}>

      {/* ════════════════════ NAVBAR ════════════════════ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: 64,
        background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.07)" : "none",
        padding: "0 clamp(1.5rem,5vw,4rem)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "all 0.4s ease",
      }}>
        {/* Logo */}
        <Link href={`/${tenant.slug}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          {tenant.logo
            ? <img src={tenant.logo} alt={tenant.name} style={{ height: 32, width: "auto" }}/>
            : (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: c, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 16px ${c}60` }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#fff" strokeWidth="1"/>
                  </svg>
                </div>
                <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.3px", color: scrolled ? "#0f172a" : "#fff" }}>
                  {tenant.name.split(" ")[0]}
                  <span style={{ color: c }}> {tenant.name.split(" ").slice(1).join(" ")}</span>
                </span>
              </div>
            )
          }
        </Link>

        {/* Desktop nav */}
        <div style={{
          display: "flex", gap: 2, alignItems: "center",
          background: scrolled ? "#f8fafc" : "rgba(255,255,255,0.08)",
          border: `1px solid ${scrolled ? "#e2e8f0" : "rgba(255,255,255,0.15)"}`,
          borderRadius: 50, padding: "5px 6px",
          backdropFilter: "blur(8px)",
        }}>
          {NAV_LINKS.map((n, i) => (
            <button key={n} style={{
              padding: "7px 14px", borderRadius: 50, border: "none", cursor: "pointer",
              fontFamily: "inherit", fontSize: 12, fontWeight: i === 0 ? 600 : 400,
              background: i === 0 ? (scrolled ? c : "rgba(255,255,255,0.15)") : "transparent",
              color: i === 0 ? (scrolled ? "#fff" : "#fff") : (scrolled ? "#64748b" : "rgba(255,255,255,0.65)"),
              transition: "all .2s",
            }}>
              {n}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={() => handleInquiry()}
            style={{
              padding: "9px 20px", borderRadius: 8,
              background: c, color: "#fff",
              border: "none", fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: `0 4px 14px ${c}50`,
              transition: "transform .15s, box-shadow .15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 6px 20px ${c}65`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 14px ${c}50`; }}
          >
            Get Free Quote
          </button>
        </div>
      </nav>

      {/* ════════════════════ HERO SLIDER ════════════════════ */}
      <section style={{ position: "relative", width: "100%", height: "100vh", minHeight: 640, overflow: "hidden" }}>

        {/* Background images (crossfade) */}
        {HERO_SLIDES.map((s, i) => (
          <div key={i} style={{
            position: "absolute", inset: 0,
            backgroundImage: imgLoaded[i] ? `url(${s.image})` : "none",
            backgroundSize: "cover", backgroundPosition: "center",
            backgroundColor: "#0a0a14",
            opacity: i === cur ? 1 : 0,
            transition: "opacity 1.2s cubic-bezier(0.4,0,0.2,1)",
          }}>
            <div style={{ position: "absolute", inset: 0, background: s.overlay }} />
          </div>
        ))}

        {/* Gradient overlays */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          background: "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)" }} />

        {/* Grid texture */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
          backgroundSize: "80px 80px" }} />

        {/* Particles */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}>
          {[[12,18,0,3.2],[78,55,0.9,4],[42,82,1.6,3.6],[88,22,2.3,5],[22,68,3.1,4.4],[65,38,0.5,3.8]].map(([x,y,d,dur],i) => (
            <div key={i} style={{ position: "absolute", left:`${x}%`, top:`${y}%`, width:4, height:4, borderRadius:"50%", background:"rgba(255,255,255,0.22)", animation:`floatP ${dur}s ease-in-out ${d}s infinite` }} />
          ))}
          <div style={{ position:"absolute", right:"10%", top:"25%", width:280, height:280, borderRadius:"50%", background:`radial-gradient(circle,${c}18 0%,transparent 70%)`, animation:"pulseOrb 5s ease-in-out infinite" }} />
        </div>

        {/* Live badge */}
        <div style={{ position:"absolute", top:80, left:"50%", transform:"translateX(-50%)", zIndex:10, opacity:anim?1:0, transition:"opacity .5s ease .1s", whiteSpace:"nowrap" }}>
          <div style={{ padding:"6px 18px", borderRadius:50, background:`rgba(34,197,94,0.12)`, border:`1px solid ${c}55`, backdropFilter:"blur(8px)", fontSize:11.5, fontWeight:600, color:c, display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:c, display:"inline-block", animation:"pingDot 2s infinite" }}/>
            {slide.badge}
          </div>
        </div>

        {/* Main content */}
        <div style={{ position:"absolute", inset:0, zIndex:10, display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 clamp(1.5rem,8vw,5rem)", paddingTop:80 }}>

          {/* Eyebrow */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20, ...reveal(0.1) }}>
            <div style={{ width:28, height:2, background:c, borderRadius:2 }}/>
            <span style={{ fontSize:10.5, fontWeight:700, letterSpacing:"0.22em", color:"rgba(255,255,255,0.5)" }}>{slide.eyebrow}</span>
          </div>

          {/* Headline */}
          <div style={{ marginBottom:24 }}>
            {slide.headline.map((line, i) => (
              <div key={i} style={{ fontSize:"clamp(2.8rem,8vw,6.5rem)", fontWeight:800, lineHeight:1.0, letterSpacing:"-0.04em", color:"#fff", ...reveal(0.2 + i * 0.09) }}>
                {line === slide.accent ? <span style={{ color:c }}>{line}</span> : line}
              </div>
            ))}
          </div>

          {/* Description */}
          <p style={{ fontSize:"clamp(14px,1.5vw,16px)", color:"rgba(255,255,255,0.62)", maxWidth:460, lineHeight:1.75, marginBottom:32, ...reveal(0.42) }}>
            {slide.desc}
          </p>

          {/* CTAs */}
          <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap", marginBottom:44, ...reveal(0.52) }}>
            <button
              onClick={() => handleInquiry()}
              style={{ display:"flex", alignItems:"center", gap:8, padding:"13px 26px", background:c, color:"#fff", border:"none", borderRadius:8, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit", boxShadow:`0 6px 22px ${c}55`, transition:"transform .2s,box-shadow .2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform="translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow=`0 10px 30px ${c}70`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform=""; (e.currentTarget as HTMLButtonElement).style.boxShadow=`0 6px 22px ${c}55`; }}
            >
              {slide.cta}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9,18 15,12 9,6"/></svg>
            </button>
            <button style={{ padding:"13px 22px", background:"rgba(255,255,255,0.09)", backdropFilter:"blur(8px)", color:"#fff", border:"1px solid rgba(255,255,255,0.18)", borderRadius:8, fontSize:14, fontWeight:500, cursor:"pointer", fontFamily:"inherit" }}>
              View Catalogue
            </button>
            <span style={{ fontSize:12, color:"rgba(255,255,255,0.35)", display:"flex", alignItems:"center", gap:6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.67 4.18 2 2 0 012.48 2H5.5a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.9a16 16 0 006.29 6.29l1.26-1.26a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              {slide.ctaSub}
            </span>
          </div>

          {/* Stats */}
          <div style={{ display:"flex", gap:28, alignItems:"center", ...reveal(0.62) }}>
            {slide.stats.map((s,i) => (
              <div key={i} style={{ display:"flex", flexDirection:"column", gap:2 }}>
                <span style={{ fontSize:"clamp(1.3rem,2.2vw,1.7rem)", fontWeight:800, color:"#fff", letterSpacing:"-0.03em" }}>{s.val}</span>
                <span style={{ fontSize:10.5, color:"rgba(255,255,255,0.4)", fontWeight:500, letterSpacing:"0.06em" }}>{s.label}</span>
              </div>
            )).reduce<React.ReactNode[]>((acc,el,i) => {
              if (i > 0) acc.push(<div key={`d${i}`} style={{ width:1, height:28, background:"rgba(255,255,255,0.12)" }}/>)
              acc.push(el); return acc
            }, [])}
          </div>
        </div>

        {/* Slide thumbnail switcher (right) */}
        <div style={{ position:"absolute", right:"clamp(1.5rem,4vw,3rem)", top:"50%", transform:"translateY(-50%)", zIndex:15, display:"flex", flexDirection:"column", gap:10 }}>
          {HERO_SLIDES.map((s,i) => {
            const isAct = i === cur
            return (
              <div key={i} onClick={() => goTo(i)} style={{ width:isAct?195:44, height:54, borderRadius:10, overflow:"hidden", cursor:"pointer", transition:"width 0.5s cubic-bezier(0.4,0,0.2,1),opacity .3s", opacity:isAct?1:0.45, position:"relative", border:`1px solid ${isAct?c:"rgba(255,255,255,0.14)"}`, boxShadow:isAct?`0 0 18px ${c}40`:"none", flexShrink:0 }}>
                <div style={{ position:"absolute", inset:0, backgroundImage:`url(${s.image})`, backgroundSize:"cover", backgroundPosition:"center", filter:isAct?"none":"grayscale(60%)" }}/>
                <div style={{ position:"absolute", inset:0, background:isAct?"rgba(0,0,0,0.38)":"rgba(0,0,0,0.58)" }}/>
                {isAct && <div style={{ position:"absolute", inset:0, padding:"0 12px", display:"flex", alignItems:"center", fontSize:9.5, fontWeight:700, color:"#fff", letterSpacing:"0.09em", whiteSpace:"nowrap" }}>{s.label}</div>}
                {isAct && <div style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", width:6, height:6, borderRadius:"50%", background:c, boxShadow:`0 0 8px ${c}` }}/>}
              </div>
            )
          })}
        </div>

        {/* Bottom bar */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, zIndex:20, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px clamp(1.5rem,6vw,4rem)", background:"linear-gradient(to top,rgba(0,0,0,0.5) 0%,transparent 100%)" }}>
          <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", letterSpacing:"0.12em", fontWeight:600 }}>
            {String(cur+1).padStart(2,"0")} <span style={{ color:"rgba(255,255,255,0.12)",margin:"0 5px" }}>/</span> {String(HERO_SLIDES.length).padStart(2,"0")}
          </span>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5, opacity:.35 }}>
            <div style={{ width:18, height:28, border:"1px solid rgba(255,255,255,0.5)", borderRadius:10, display:"flex", justifyContent:"center", paddingTop:6 }}>
              <div style={{ width:2, height:6, background:"#fff", borderRadius:2, animation:"scrollWheel 2s infinite" }}/>
            </div>
            <span style={{ fontSize:9, color:"rgba(255,255,255,0.5)", letterSpacing:"0.15em", fontWeight:600 }}>SCROLL</span>
          </div>
          <div style={{ display:"flex", gap:18, alignItems:"center" }}>
            {[{ icon:"🔒", text:"BIS Certified" },{ icon:"✓", text:"ISO 9001:2015" },{ icon:"⭐", text:"4.9 Rated" }].map(b => (
              <div key={b.text} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"rgba(255,255,255,0.38)", fontWeight:500 }}>
                <span>{b.icon}</span>{b.text}
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2.5, background:"rgba(255,255,255,0.08)", zIndex:30 }}>
          <div style={{ height:"100%", width:`${progress}%`, background:c, transition:"width .04s linear", boxShadow:`0 0 8px ${c}80` }}/>
        </div>
      </section>

      {/* ════════════════════ MARQUEE TRUST STRIP ════════════════════ */}
      <div style={{ background:"#0f172a", padding:"14px 0", overflow:"hidden", position:"relative" }}>
        <div style={{ display:"flex", gap:0, animation:"marquee 30s linear infinite", width:"max-content" }}>
          {[...Array(3)].map((_, rep) => (
            <div key={rep} style={{ display:"flex", gap:0, flexShrink:0 }}>
              {["✦ 50,000+ Happy Customers","✦ 500+ Dealer Network","✦ BIS & ISO Certified","✦ 15+ Years Experience","✦ 25-Year Solar Warranty","✦ 7-Year Battery Warranty","✦ Pan-India Delivery","✦ 24/7 Service Support"].map(t => (
                <span key={t} style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.45)", letterSpacing:"0.08em", padding:"0 36px", whiteSpace:"nowrap" }}>{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════ FEATURED PRODUCTS ════════════════════ */}
      {heroProducts.length > 0 && (
        <section style={{ padding:"5rem clamp(1.5rem,5vw,4rem)", background:"#fff" }}>
          <div style={{ maxWidth:1400, margin:"0 auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"2.5rem" }}>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:c, letterSpacing:"0.15em", marginBottom:8 }}>⭐ FEATURED PICKS</div>
                <h2 style={{ fontSize:"clamp(1.6rem,3.5vw,2.5rem)", fontWeight:800, letterSpacing:"-0.03em", lineHeight:1.1 }}>
                  Editor's Choice
                </h2>
              </div>
              <button onClick={() => {}} style={{ fontSize:13, fontWeight:600, color:c, background:"none", border:`1.5px solid ${c}`, borderRadius:8, padding:"9px 18px", cursor:"pointer", fontFamily:"inherit" }}>
                View All →
              </button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:20 }}>
              {heroProducts.map(p => <ProductCard key={p.id} p={p} c={c} tenant={tenant} onInquiry={() => handleInquiry(p)}/>)}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════ ALL PRODUCTS ════════════════════ */}
      <section id="products" style={{ padding:"5rem clamp(1.5rem,5vw,4rem)", background:"#f8fafc" }}>
        <div style={{ maxWidth:1400, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"3rem" }}>
            <span style={{ display:"inline-block", padding:"5px 18px", borderRadius:50, background:`${c}15`, border:`1px solid ${c}35`, color:c, fontSize:12, fontWeight:700, marginBottom:14 }}>Our Collection</span>
            <h2 style={{ fontSize:"clamp(1.75rem,4vw,2.75rem)", fontWeight:800, letterSpacing:"-0.03em", marginBottom:10 }}>
              Browse <em style={{ color:c, fontStyle:"italic" }}>All Products</em>
            </h2>
            <p style={{ color:"#64748b", fontSize:15, lineHeight:1.65, maxWidth:480, margin:"0 auto" }}>
              {tenant.tagline || "Explore our complete range of quality power products."}
            </p>
          </div>

          {/* Category pills */}
          {categories.length > 0 && (
            <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap", marginBottom:"3rem" }}>
              {[{ slug:"all", name:"All" }, ...categories].map(cat => (
                <button key={cat.slug} onClick={() => setActiveCat(cat.slug)} style={{
                  padding:"9px 22px", borderRadius:50, fontSize:13, fontWeight:500,
                  cursor:"pointer", transition:"all .2s", border:"1.5px solid",
                  borderColor: activeCat===cat.slug ? c : "#e2e8f0",
                  background: activeCat===cat.slug ? c : "#fff",
                  color: activeCat===cat.slug ? "#fff" : "#374151",
                  boxShadow: activeCat===cat.slug ? `0 4px 12px ${c}40` : "none",
                  fontFamily:"inherit",
                }}>{cat.name}</button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"5rem", color:"#94a3b8" }}>
              <div style={{ fontSize:52, marginBottom:16 }}>📦</div>
              <p style={{ fontSize:18, fontWeight:600, color:"#374151", marginBottom:8 }}>No products yet</p>
              <p style={{ fontSize:14 }}>Products will appear here once added from the admin panel.</p>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))", gap:20 }}>
              {filtered.map(p => <ProductCard key={p.id} p={p} c={c} tenant={tenant} onInquiry={() => handleInquiry(p)}/>)}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════ WHY CHOOSE US ════════════════════ */}
      <section style={{ padding:"6rem clamp(1.5rem,5vw,4rem)", background:"#fff" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"3.5rem" }}>
            <div style={{ fontSize:12, fontWeight:700, color:c, letterSpacing:"0.15em", marginBottom:10 }}>WHY CHOOSE US</div>
            <h2 style={{ fontSize:"clamp(1.6rem,3.5vw,2.5rem)", fontWeight:800, letterSpacing:"-0.03em", lineHeight:1.1 }}>
              Trusted by 50,000+ Customers
            </h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:24 }}>
            {WHY_US.map((item, i) => (
              <div key={i} style={{ display:"flex", gap:18, padding:"24px", borderRadius:16, border:"1px solid #f1f5f9", background:"#fafcff", transition:"all .2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = c; (e.currentTarget as HTMLDivElement).style.boxShadow=`0 8px 24px ${c}18`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor="#f1f5f9"; (e.currentTarget as HTMLDivElement).style.boxShadow="none"; }}>
                <div style={{ fontSize:28, flexShrink:0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:"#0f172a", marginBottom:6 }}>{item.title}</div>
                  <div style={{ fontSize:13.5, color:"#64748b", lineHeight:1.65 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ TESTIMONIALS ════════════════════ */}
      <section style={{ padding:"6rem clamp(1.5rem,5vw,4rem)", background:"#0f172a" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"3.5rem" }}>
            <div style={{ fontSize:12, fontWeight:700, color:c, letterSpacing:"0.15em", marginBottom:10 }}>TESTIMONIALS</div>
            <h2 style={{ fontSize:"clamp(1.6rem,3.5vw,2.5rem)", fontWeight:800, letterSpacing:"-0.03em", color:"#fff", lineHeight:1.1 }}>
              What Our Customers Say
            </h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:20 }}>
            {TESTIMONIALS.map((t,i) => (
              <div key={i} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"28px" }}>
                <div style={{ display:"flex", gap:3, marginBottom:16 }}>
                  {[...Array(t.stars)].map((_,j) => <span key={j} style={{ color:"#fbbf24", fontSize:16 }}>★</span>)}
                </div>
                <p style={{ fontSize:14.5, color:"rgba(255,255,255,0.7)", lineHeight:1.7, marginBottom:20, fontStyle:"italic" }}>"{t.text}"</p>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:40, height:40, borderRadius:"50%", background:c, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:700 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:"#fff" }}>{t.name}</div>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ CTA BANNER ════════════════════ */}
      <section style={{ padding:"5rem clamp(1.5rem,5vw,4rem)", background:`linear-gradient(135deg, ${c}18 0%, ${c}08 100%)`, borderTop:`1px solid ${c}25`, borderBottom:`1px solid ${c}25` }}>
        <div style={{ maxWidth:800, margin:"0 auto", textAlign:"center" }}>
          <div style={{ fontSize:12, fontWeight:700, color:c, letterSpacing:"0.15em", marginBottom:12 }}>FREE CONSULTATION</div>
          <h2 style={{ fontSize:"clamp(1.8rem,4vw,3rem)", fontWeight:800, letterSpacing:"-0.03em", marginBottom:16, lineHeight:1.1 }}>
            Ready to save on your energy bills?
          </h2>
          <p style={{ fontSize:16, color:"#475569", lineHeight:1.7, marginBottom:32, maxWidth:520, margin:"0 auto 32px" }}>
            Get a free site survey and custom quote from our expert team. No obligation, no spam.
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={() => handleInquiry()} style={{ padding:"14px 32px", background:c, color:"#fff", border:"none", borderRadius:10, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit", boxShadow:`0 6px 20px ${c}50` }}>
              Get Free Quote →
            </button>
            <a href={`tel:${tenant.phone||"+919876543210"}`} style={{ padding:"14px 28px", background:"#fff", color:"#0f172a", border:"1.5px solid #e2e8f0", borderRadius:10, fontSize:15, fontWeight:600, cursor:"pointer", fontFamily:"inherit", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:8 }}>
              📞 Call Now
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════ FOOTER ════════════════════ */}
      <footer style={{ background:"#0a0a0a", color:"#fff", padding:"5rem clamp(1.5rem,5vw,4rem) 2rem" }}>
        <div style={{ maxWidth:1400, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1.4fr", gap:"3.5rem", marginBottom:"3.5rem" }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:c, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#fff"/></svg>
                </div>
                <span style={{ fontSize:17, fontWeight:800, letterSpacing:"-0.3px" }}>
                  {tenant.name.split(" ")[0]}<span style={{ color:c }}> {tenant.name.split(" ").slice(1).join(" ")}</span>
                </span>
              </div>
              <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13.5, lineHeight:1.7, maxWidth:260 }}>
                {tenant.description || "Leading provider of quality power solutions. Trusted by thousands of customers across India."}
              </p>
              <div style={{ display:"flex", gap:10, marginTop:20 }}>
                {["instagram","facebook","linkedin","twitter"].map(s => (
                  <div key={s} style={{ width:34, height:34, borderRadius:8, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:13, color:"rgba(255,255,255,0.5)" }}>
                    {s[0].toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize:10.5, fontWeight:700, color:"rgba(255,255,255,0.28)", letterSpacing:"0.16em", marginBottom:16 }}>CATEGORIES</p>
              {categories.length > 0
                ? categories.map(cat => <a key={cat.slug} href={`/${tenant.slug}?category=${cat.slug}`} style={{ display:"block", color:"rgba(255,255,255,0.5)", fontSize:13.5, textDecoration:"none", marginBottom:10, transition:"color .15s" }}
                    onMouseEnter={e=>(e.currentTarget.style.color="#fff")} onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.5)")}>{cat.name}</a>)
                : <a href="#" style={{ display:"block", color:"rgba(255,255,255,0.5)", fontSize:13.5, textDecoration:"none" }}>All Products</a>
              }
            </div>
            <div>
              <p style={{ fontSize:10.5, fontWeight:700, color:"rgba(255,255,255,0.28)", letterSpacing:"0.16em", marginBottom:16 }}>QUICK LINKS</p>
              {["All Products","Featured","New Arrivals","Best Sellers","About Us","Contact"].map(l => (
                <a key={l} href={`/${tenant.slug}`} style={{ display:"block", color:"rgba(255,255,255,0.5)", fontSize:13.5, textDecoration:"none", marginBottom:10 }}
                  onMouseEnter={e=>(e.currentTarget.style.color="#fff")} onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.5)")}>{l}</a>
              ))}
            </div>
            <div>
              <p style={{ fontSize:10.5, fontWeight:700, color:"rgba(255,255,255,0.28)", letterSpacing:"0.16em", marginBottom:16 }}>CONTACT</p>
              {[
                { icon:"📞", label:"Phone", val: tenant.phone||"+91 98765 43210" },
                { icon:"✉️", label:"Email", val: tenant.email||`info@${tenant.slug}.com` },
                { icon:"📍", label:"Address", val: tenant.address||"42, Industrial Area Phase II, Hyderabad, Telangana 500032" },
                { icon:"🌐", label:"Website", val: tenant.website||`https://${tenant.slug}.com` },
              ].map(({ icon, label, val }) => (
                <div key={label} style={{ display:"flex", gap:10, marginBottom:14, alignItems:"flex-start" }}>
                  <span style={{ fontSize:14, flexShrink:0, marginTop:1 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.25)", fontWeight:600, letterSpacing:"0.1em", marginBottom:2 }}>{label.toUpperCase()}</div>
                    <div style={{ color:"rgba(255,255,255,0.55)", fontSize:13, lineHeight:1.5 }}>{val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:"2rem", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
            <p style={{ color:"rgba(255,255,255,0.2)", fontSize:12 }}>© {new Date().getFullYear()} {tenant.name}. All rights reserved.</p>
            <div style={{ display:"flex", gap:20 }}>
              {["Privacy Policy","Terms of Use","Refund Policy"].map(l => (
                <a key={l} href="#" style={{ color:"rgba(255,255,255,0.2)", fontSize:12, textDecoration:"none" }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ════════════════════ INQUIRY MODAL ════════════════════ */}
      {inquiryOpen && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20, backdropFilter:"blur(4px)" }}
          onClick={e => e.target === e.currentTarget && setInquiryOpen(false)}>
          <div style={{ background:"#fff", borderRadius:20, width:"100%", maxWidth:520, maxHeight:"92vh", overflowY:"auto", boxShadow:"0 32px 80px rgba(0,0,0,0.3)", animation:"modalIn .25s ease" }}>
            <div style={{ padding:"24px 28px", borderBottom:"1px solid #f1f5f9", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ fontSize:18, fontWeight:800, color:"#0f172a" }}>Send Enquiry</div>
                <div style={{ fontSize:13, color:"#94a3b8", marginTop:3 }}>{inquiryProduct ? `Re: ${inquiryProduct.name}` : `To: ${tenant.name}`}</div>
              </div>
              <button onClick={() => setInquiryOpen(false)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:22, color:"#94a3b8", lineHeight:1 }}>×</button>
            </div>
            {!formSent ? (
              <div style={{ padding:"24px 28px" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                  {[
                    { key:"name",  label:"Full Name *",     type:"text",  placeholder:"Your full name" },
                    { key:"email", label:"Email Address *", type:"email", placeholder:"you@company.com" },
                    { key:"phone", label:"Phone Number",    type:"tel",   placeholder:"+91 98765 43210" },
                    { key:"quantity", label:"Quantity / Units", type:"text", placeholder:"e.g. 10 units" },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:6, letterSpacing:"0.02em" }}>{f.label}</label>
                      <input type={f.type} placeholder={f.placeholder} value={(formData as Record<string,string>)[f.key]}
                        onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}
                        style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:"1.5px solid #e5e7eb", fontSize:14, color:"#111827", background:"#fff", outline:"none", fontFamily:"inherit" }}/>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom:20 }}>
                  <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:6 }}>Message</label>
                  <textarea rows={4} value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                    placeholder="Describe your requirements, preferred specifications, etc."
                    style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:"1.5px solid #e5e7eb", fontSize:14, color:"#111827", background:"#fff", outline:"none", resize:"vertical", fontFamily:"inherit" }}/>
                </div>
                <button onClick={submitInquiry} style={{ width:"100%", padding:"14px", borderRadius:12, background:c, color:"#fff", fontSize:15, fontWeight:700, border:"none", cursor:"pointer", fontFamily:"inherit", boxShadow:`0 6px 20px ${c}50` }}>
                  Submit Enquiry →
                </button>
                <p style={{ textAlign:"center", fontSize:12, color:"#94a3b8", marginTop:12 }}>We'll respond within 24 hours. No spam, ever.</p>
              </div>
            ) : (
              <div style={{ padding:"56px 28px", textAlign:"center" }}>
                <div style={{ fontSize:56, marginBottom:16 }}>✅</div>
                <div style={{ fontSize:20, fontWeight:800, color:"#16a34a", marginBottom:8 }}>Enquiry Sent!</div>
                <div style={{ color:"#64748b", fontSize:14 }}>Our team will contact you within 24 hours.</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating WhatsApp */}
      <a href={`https://wa.me/91${(tenant.phone||"9876543210").replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer"
        style={{ position:"fixed", bottom:28, right:28, zIndex:99, width:54, height:54, borderRadius:"50%", background:"#25d366", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 6px 24px rgba(37,211,102,0.5)", textDecoration:"none", transition:"transform .2s" }}
        onMouseEnter={e=>(e.currentTarget.style.transform="scale(1.1)")} onMouseLeave={e=>(e.currentTarget.style.transform="")}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* ════════════════════ CSS ════════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes floatP { 0%,100%{transform:translateY(0) scale(1);opacity:.18} 50%{transform:translateY(-22px) scale(1.5);opacity:.55} }
        @keyframes pulseOrb { 0%,100%{transform:scale(1);opacity:.65} 50%{transform:scale(1.07);opacity:1} }
        @keyframes scrollWheel { 0%,100%{transform:translateY(0);opacity:1} 50%{transform:translateY(8px);opacity:.2} }
        @keyframes pingDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.5)} }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-33.333%)} }
        @keyframes modalIn { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
      `}</style>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   PRODUCT CARD  — extracted as a sub-component for reuse
───────────────────────────────────────────────────────────────────────────── */
function ProductCard({ p, c, tenant, onInquiry }: { p: Product; c: string; tenant: Tenant; onInquiry: () => void }) {
  const [hov, setHov] = useState(false)
  const hasImg = p.images && p.images.length > 0 && p.images[0]
  const discountPct = p.discount ?? (p.mrp && p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : null)

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ background:"#fff", borderRadius:18, overflow:"hidden", border:`1px solid ${hov ? c+"50" : "rgba(0,0,0,0.07)"}`, boxShadow: hov ? `0 20px 48px rgba(0,0,0,0.12), 0 0 0 1px ${c}30` : "0 2px 8px rgba(0,0,0,0.04)", transform: hov ? "translateY(-6px)" : "none", transition:"all 0.3s cubic-bezier(0.25,0.46,0.45,0.94)", cursor:"pointer" }}
    >
      {/* Image area */}
      <div style={{ height:215, position:"relative", overflow:"hidden", background: hasImg ? "transparent" : "linear-gradient(135deg,#0f172a,#1e293b)", display:"flex", alignItems:"center", justifyContent:"center" }}>
        {hasImg
          ? <img src={p.images[0]} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover", transform: hov?"scale(1.05)":"scale(1)", transition:"transform .5s ease" }}/>
          : <span style={{ fontSize:"clamp(1rem,4vw,1.6rem)", fontWeight:700, color:"rgba(255,255,255,0.6)", textAlign:"center", padding:"1rem", lineHeight:1.3 }}>{p.name.split(" ").slice(0,3).join(" ")}</span>
        }
        {/* Category tag */}
        {p.category && (
          <div style={{ position:"absolute", top:12, right:12, padding:"4px 11px", background:"rgba(255,255,255,0.93)", backdropFilter:"blur(4px)", borderRadius:50, fontSize:11, fontWeight:600, color:"#374151" }}>
            {p.category.name}
          </div>
        )}
        {/* Discount badge */}
        {discountPct && discountPct > 0 && (
          <div style={{ position:"absolute", top:12, left:12, padding:"4px 10px", background:"#ef4444", borderRadius:50, fontSize:11, fontWeight:700, color:"#fff" }}>
            {discountPct}% OFF
          </div>
        )}
        {/* Progress dots */}
        <div style={{ position:"absolute", bottom:12, left:16, display:"flex", gap:4 }}>
          <div style={{ width:22, height:3, borderRadius:2, background:c }}/>
          <div style={{ width:8, height:3, borderRadius:2, background:"rgba(255,255,255,0.35)" }}/>
          <div style={{ width:8, height:3, borderRadius:2, background:"rgba(255,255,255,0.35)" }}/>
        </div>
        {/* Hover overlay with quick-action */}
        <div style={{ position:"absolute", inset:0, background:`${c}22`, opacity: hov ? 1 : 0, transition:"opacity .25s", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <button onClick={e => { e.preventDefault(); onInquiry(); }}
            style={{ padding:"10px 22px", background:c, color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transform: hov?"translateY(0)":"translateY(10px)", transition:"transform .25s", boxShadow:`0 6px 20px ${c}60` }}>
            Quick Enquiry
          </button>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding:"18px 20px 20px" }}>
        <h3 style={{ fontSize:15, fontWeight:700, color:"#0f172a", marginBottom:7, lineHeight:1.3 }}>{p.name}</h3>
        <p style={{ fontSize:13, color:"#64748b", lineHeight:1.6, marginBottom:16 }}>
          {p.description?.slice(0,82)}{(p.description?.length||0) > 82 ? "…" : ""}
        </p>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            {p.price
              ? <>
                  <span style={{ fontSize:19, fontWeight:800, color:c }}>₹{p.price.toLocaleString("en-IN")}</span>
                  {p.mrp && p.mrp > p.price && (
                    <span style={{ fontSize:13, color:"#94a3b8", textDecoration:"line-through", marginLeft:8 }}>₹{p.mrp.toLocaleString("en-IN")}</span>
                  )}
                </>
              : <span style={{ fontSize:13, color:"#94a3b8", fontStyle:"italic" }}>Contact for price</span>
            }
          </div>
          
          <Link href={`/products/${p.slug}?tenant=${tenant.slug}`} style={{ width:36, height:36, borderRadius:"50%", background: hov ? c : "transparent", border:`1.5px solid ${hov ? c : "rgba(0,0,0,0.15)"}`, display:"flex", alignItems:"center", justifyContent:"center", color: hov ? "#fff" : "#374151", fontSize:16, textDecoration:"none", transition:"all .22s" }}>
            →
          </Link>
        </div>
      </div>
    </div>
  )
}