"use client"
import { useState, useEffect, useRef } from "react"

/* ─────────────────────────────────────────────────────────────────────────────
   SATYAJAN ELECTRONICS — Professional Hero Slider
   Real Unsplash images + polished B2B content
───────────────────────────────────────────────────────────────────────────── */

const GREEN = "#22c55e"
const GREEN_DARK = "#15803d"

const slides = [
  {
    eyebrow:  "INDIA'S #1 POWER SOLUTIONS BRAND",
    headline: ["Uninterrupted", "Power.", "Always."],
    accent:   "Power.",
    desc:     "Industrial-grade inverters & UPS systems trusted by 50,000+ customers across India. Zero downtime, zero compromise.",
    label:    "INVERTERS & UPS SYSTEMS",
    cta:      "Explore Inverters",
    ctaSub:   "Starting ₹4,999",
    stats:    [{ val: "50K+", label: "Customers" }, { val: "15+", label: "Years" }, { val: "500+", label: "Dealers" }],
    image:    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1600&auto=format&fit=crop&q=80",
    // Electrical engineer working with industrial UPS/power systems
    overlay:  "rgba(10,10,20,0.72)",
    badge:    "🔋 New: 5kVA Lithium UPS Available",
  },
  {
    eyebrow:  "CLEAN ENERGY FOR EVERY ROOFTOP",
    headline: ["Solar Energy,", "Simplified", "for You."],
    accent:   "Simplified",
    desc:     "High-efficiency monocrystalline solar panels with 25-year performance warranty. Cut your electricity bill by up to 90%.",
    label:    "SOLAR PANELS & SOLUTIONS",
    cta:      "Get Solar Quote",
    ctaSub:   "Free site survey",
    stats:    [{ val: "540W", label: "Max Wattage" }, { val: "25yr", label: "Warranty" }, { val: "21.5%", label: "Efficiency" }],
    image:    "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&auto=format&fit=crop&q=80",
    // Rooftop solar panels golden hour
    overlay:  "rgba(5,25,10,0.68)",
    badge:    "☀️ Subsidy Available: PM Surya Ghar Yojana",
  },
  {
    eyebrow:  "STORE MORE. WASTE LESS. LIVE BETTER.",
    headline: ["Next-Gen", "Battery", "Storage."],
    accent:   "Battery",
    desc:     "Lithium & tall-tubular batteries with smart BMS, 6000+ cycle life, and 7-year warranty. Never lose power again.",
    label:    "BATTERY STORAGE SYSTEMS",
    cta:      "Compare Batteries",
    ctaSub:   "Expert guidance free",
    stats:    [{ val: "6000+", label: "Cycle Life" }, { val: "7yr", label: "Warranty" }, { val: "150Ah", label: "Max Capacity" }],
    image:    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&auto=format&fit=crop&q=80",
    // Battery storage / energy storage
    overlay:  "rgba(15,5,30,0.70)",
    badge:    "⚡ New: LiFePO4 Lithium Series Launched",
  },
  {
    eyebrow:  "KEEP YOUR HOME COOL. EFFICIENTLY.",
    headline: ["5-Star ACs &", "Smart Home", "Appliances."],
    accent:   "Smart Home",
    desc:     "Premium inverter ACs, BLDC fans, and smart appliances engineered for Indian summers. Highest energy savings guaranteed.",
    label:    "ELECTRICAL APPLIANCES",
    cta:      "Browse Appliances",
    ctaSub:   "EMI from ₹999/mo",
    stats:    [{ val: "5★", label: "Energy Rating" }, { val: "28W", label: "BLDC Power" }, { val: "R32", label: "Eco Refrigerant" }],
    image:    "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1600&auto=format&fit=crop&q=80",
    // Modern smart home / AC
    overlay:  "rgba(5,10,25,0.70)",
    badge:    "🏠 New: Smart Home Range Now Available",
  },
]

// Nav items that appear at top of hero
const NAV_ITEMS = ["Home", "Products", "Solar", "Batteries", "About", "Contact"]

export default function HeroSlider() {
  const [cur, setCur]           = useState(0)
  const [animating, setAnimating] = useState(true)
  const [progress, setProgress] = useState(0)
  const [imgLoaded, setImgLoaded] = useState<boolean[]>(slides.map(() => false))
  const [menuOpen, setMenuOpen] = useState(false)
  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const DURATION    = 6500

  function goTo(n: number) {
    if (n === cur) return
    setAnimating(false)
    setTimeout(() => { setCur(n); setAnimating(true); setProgress(0) }, 80)
  }

  useEffect(() => {
    setProgress(0)
    const start = Date.now()
    progressRef.current = setInterval(() => {
      setProgress(Math.min(((Date.now() - start) / DURATION) * 100, 100))
    }, 40)
    timerRef.current = setTimeout(() => {
      setCur(p => (p + 1) % slides.length)
      setAnimating(true)
      setProgress(0)
    }, DURATION)
    return () => {
      clearTimeout(timerRef.current!)
      clearInterval(progressRef.current!)
    }
  }, [cur])

  // Preload all slide images
  useEffect(() => {
    slides.forEach((s, i) => {
      const img = new window.Image()
      img.src = s.image
      img.onload = () =>
        setImgLoaded(prev => { const n = [...prev]; n[i] = true; return n })
    })
  }, [])

  const slide = slides[cur]

  return (
    <div style={{
      position: "relative", width: "100%", height: "100vh", minHeight: 640,
      overflow: "hidden", fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
    }}>

      {/* ── Background Images (crossfade) ── */}
      {slides.map((s, i) => (
        <div key={i} style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: imgLoaded[i] ? `url(${s.image})` : "none",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: i === cur ? 1 : 0,
          transition: "opacity 1.1s cubic-bezier(0.4,0,0.2,1)",
          backgroundColor: i === cur ? "#0a0a14" : "transparent",
        }}>
          {/* Per-slide color overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: s.overlay,
            backdropFilter: "brightness(0.85)",
          }} />
        </div>
      ))}

      {/* ── Global dark gradient overlay ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: "linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)",
      }} />
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)",
      }} />

      {/* ── Decorative grid lines ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }} />

      {/* ── Floating Particles ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}>
        {[[12,18,0,3],[78,55,0.9,4],[42,82,1.6,3.5],[88,22,2.3,5],[22,68,3.1,4.5],[65,38,0.5,3.8],[50,15,1.2,4.2],[35,90,2.8,3.2]].map(([x,y,delay,dur],i) => (
          <div key={i} style={{
            position: "absolute", left: `${x}%`, top: `${y}%`,
            width: i % 3 === 0 ? 5 : 3, height: i % 3 === 0 ? 5 : 3,
            borderRadius: "50%", background: "rgba(255,255,255,0.25)",
            animation: `floatP ${dur}s ease-in-out ${delay}s infinite`,
          }} />
        ))}
        {/* Green accent orbs */}
        <div style={{
          position: "absolute", right: "8%", top: "30%",
          width: 300, height: 300, borderRadius: "50%",
          background: `radial-gradient(circle, ${GREEN}18 0%, transparent 70%)`,
          animation: "pulseOrb 4s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", left: "5%", bottom: "20%",
          width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
        }} />
      </div>

      {/* ═════════════════ TOP NAV ═════════════════ */}
      <nav style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 20,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px clamp(1.5rem,6vw,4rem)",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: GREEN, display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 20px ${GREEN}60`,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#fff" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: "-0.3px", lineHeight: 1 }}>
              Satya<span style={{ color: GREEN }}>jan</span>
            </div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", marginTop: 1 }}>ELECTRONICS</div>
          </div>
        </div>

        {/* Desktop Nav */}
        <div style={{
          display: "flex", gap: 2, alignItems: "center",
          background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.1)", borderRadius: 50, padding: "6px 8px",
        }}>
          {NAV_ITEMS.map((n, i) => (
            <button key={n} style={{
              padding: "7px 16px", borderRadius: 50, border: "none", cursor: "pointer",
              fontFamily: "inherit", fontSize: 12, fontWeight: i === 0 ? 600 : 400,
              background: i === 0 ? "rgba(255,255,255,0.12)" : "transparent",
              color: i === 0 ? "#fff" : "rgba(255,255,255,0.55)",
              transition: "all .2s", letterSpacing: "0.01em",
            }}>
              {n}
            </button>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button style={{
            padding: "9px 18px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)",
            background: "transparent", color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 500,
            cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.01em",
          }}>
            Login
          </button>
          <button style={{
            padding: "9px 20px", borderRadius: 8, border: "none",
            background: GREEN, color: "#fff", fontSize: 12, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.01em",
            boxShadow: `0 4px 16px ${GREEN}50`,
          }}>
            Get Quote →
          </button>
        </div>
      </nav>

      {/* ═════════════════ BADGE (top-center) ═════════════════ */}
      <div style={{
        position: "absolute", top: 90, left: "50%", transform: "translateX(-50%)", zIndex: 10,
        opacity: animating ? 1 : 0, transition: "opacity .5s ease .1s",
      }}>
        <div style={{
          padding: "6px 18px", borderRadius: 50,
          background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.35)",
          backdropFilter: "blur(8px)", fontSize: 11.5, fontWeight: 600, color: GREEN,
          letterSpacing: "0.02em", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: GREEN, display: "inline-block", animation: "ping 2s infinite" }}/>
          {slide.badge}
        </div>
      </div>

      {/* ═════════════════ MAIN CONTENT ═════════════════ */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 10,
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "0 clamp(1.5rem,8vw,5rem)",
        paddingTop: 100,
      }}>
        {/* Eyebrow */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12, marginBottom: 20,
          opacity: animating ? 1 : 0,
          transform: animating ? "translateY(0)" : "translateY(24px)",
          transition: "all 0.65s cubic-bezier(0.4,0,0.2,1) 0.1s",
        }}>
          <div style={{ width: 28, height: 1.5, background: GREEN, borderRadius: 2 }} />
          <div style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.5)", textTransform: "uppercase",
          }}>
            {slide.eyebrow}
          </div>
        </div>

        {/* Headline */}
        <div style={{ marginBottom: 24 }}>
          {slide.headline.map((line, i) => (
            <div key={i} style={{
              fontSize: "clamp(2.8rem,8vw,6.5rem)",
              fontWeight: 800, lineHeight: 1.0,
              letterSpacing: "-0.04em", color: "#fff",
              opacity: animating ? 1 : 0,
              transform: animating ? "translateY(0)" : "translateY(40px)",
              transition: `all 0.7s cubic-bezier(0.4,0,0.2,1) ${0.2 + i * 0.08}s`,
            }}>
              {line === slide.accent
                ? <span style={{ color: GREEN, WebkitTextStroke: "0px transparent" }}>{line}</span>
                : line}
            </div>
          ))}
        </div>

        {/* Description */}
        <div style={{
          fontSize: "clamp(14px,1.6vw,16px)", color: "rgba(255,255,255,0.6)",
          maxWidth: 480, lineHeight: 1.75, marginBottom: 32,
          opacity: animating ? 1 : 0,
          transform: animating ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.65s cubic-bezier(0.4,0,0.2,1) 0.38s",
        }}>
          {slide.desc}
        </div>

        {/* CTA row */}
        <div style={{
          display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 48,
          opacity: animating ? 1 : 0,
          transform: animating ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.65s cubic-bezier(0.4,0,0.2,1) 0.5s",
        }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "14px 28px", background: GREEN, color: "#fff",
            border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit", letterSpacing: "-0.01em",
            boxShadow: `0 6px 24px ${GREEN}55`, transition: "transform .2s, box-shadow .2s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 10px 32px ${GREEN}70` }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 6px 24px ${GREEN}55` }}
          >
            {slide.cta}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9,18 15,12 9,6"/></svg>
          </button>
          <button style={{
            padding: "14px 24px", background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(8px)", color: "#fff",
            border: "1px solid rgba(255,255,255,0.18)", borderRadius: 8,
            fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
          }}>
            View Catalogue
          </button>
          <div style={{
            fontSize: 12, color: "rgba(255,255,255,0.35)", fontWeight: 500,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.67 4.18 2 2 0 012.48 2H5.5a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.9a16 16 0 006.29 6.29l1.26-1.26a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            {slide.ctaSub}
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          display: "flex", gap: 32, alignItems: "center",
          opacity: animating ? 1 : 0,
          transform: animating ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.65s cubic-bezier(0.4,0,0.2,1) 0.6s",
        }}>
          {slide.stats.map((s, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "clamp(1.4rem,2.5vw,1.9rem)", fontWeight: 800, color: "#fff", lineHeight: 1, letterSpacing: "-0.03em" }}>
                {s.val}
              </span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 500, marginTop: 3, letterSpacing: "0.05em" }}>
                {s.label}
              </span>
            </div>
          )).reduce<React.ReactNode[]>((acc, el, i) => {
            if (i > 0) acc.push(
              <div key={`sep${i}`} style={{ width: 1, height: 32, background: "rgba(255,255,255,0.12)" }} />
            )
            acc.push(el)
            return acc
          }, [])}
        </div>
      </div>

      {/* ═════════════════ RIGHT SIDE — Slide cards ═════════════════ */}
      <div style={{
        position: "absolute", right: "clamp(1.5rem,5vw,4rem)", top: "50%",
        transform: "translateY(-50%)", zIndex: 15,
        display: "flex", flexDirection: "column", gap: 10,
      }}>
        {slides.map((s, i) => {
          const isActive = i === cur
          return (
            <div key={i} onClick={() => goTo(i)} style={{
              width: isActive ? 200 : 44, height: 56,
              borderRadius: 10, overflow: "hidden", cursor: "pointer",
              transition: "width 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease",
              opacity: isActive ? 1 : 0.45, flexShrink: 0, position: "relative",
              border: `1px solid ${isActive ? GREEN : "rgba(255,255,255,0.15)"}`,
              boxShadow: isActive ? `0 0 20px ${GREEN}40` : "none",
            }}>
              {/* Thumbnail bg image */}
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage: `url(${s.image})`,
                backgroundSize: "cover", backgroundPosition: "center",
                filter: isActive ? "none" : "grayscale(60%)",
              }} />
              <div style={{
                position: "absolute", inset: 0,
                background: isActive ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.6)",
              }} />
              {isActive && (
                <div style={{
                  position: "absolute", inset: 0, padding: "0 12px",
                  display: "flex", alignItems: "center",
                  fontSize: 10, fontWeight: 700, color: "#fff",
                  letterSpacing: "0.08em", whiteSpace: "nowrap", overflow: "hidden",
                }}>
                  {s.label}
                </div>
              )}
              {/* Active indicator dot */}
              {isActive && (
                <div style={{
                  position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                  width: 6, height: 6, borderRadius: "50%", background: GREEN,
                  boxShadow: `0 0 8px ${GREEN}`,
                }} />
              )}
            </div>
          )
        })}
      </div>

      {/* ═════════════════ BOTTOM BAR ═════════════════ */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 20,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px clamp(1.5rem,6vw,4rem)",
        background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)",
      }}>
        {/* Slide counter */}
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", fontWeight: 600 }}>
          {String(cur + 1).padStart(2, "0")}
          <span style={{ color: "rgba(255,255,255,0.15)", margin: "0 6px" }}>/</span>
          {String(slides.length).padStart(2, "0")}
        </div>

        {/* Scroll hint */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, opacity: 0.35 }}>
          <div style={{
            width: 18, height: 30, border: "1px solid rgba(255,255,255,0.5)",
            borderRadius: 10, display: "flex", justifyContent: "center", paddingTop: 6,
          }}>
            <div style={{ width: 2, height: 6, background: "#fff", borderRadius: 2, animation: "scrollWheel 2s infinite" }} />
          </div>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em", fontWeight: 600 }}>SCROLL</span>
        </div>

        {/* Trust badges */}
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {[
            { icon: "🔒", text: "BIS Certified" },
            { icon: "✓", text: "ISO 9001:2015" },
            { icon: "⭐", text: "4.9/5 Rated" },
          ].map(b => (
            <div key={b.text} style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 500,
            }}>
              <span style={{ fontSize: 13 }}>{b.icon}</span>{b.text}
            </div>
          ))}
        </div>
      </div>

      {/* ═════════════════ PROGRESS BAR ═════════════════ */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.08)", zIndex: 30 }}>
        <div style={{
          height: "100%", width: `${progress}%`, background: GREEN,
          transition: "width 0.04s linear",
          boxShadow: `0 0 8px ${GREEN}80`,
        }} />
      </div>

      {/* ═════════════════ CSS ANIMATIONS ═════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        @keyframes floatP {
          0%,100% { transform: translateY(0) scale(1); opacity: 0.15; }
          50% { transform: translateY(-22px) scale(1.6); opacity: 0.55; }
        }
        @keyframes pulseOrb {
          0%,100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes scrollWheel {
          0%,100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(8px); opacity: 0.2; }
        }
        @keyframes ping {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
      `}</style>
    </div>
  )
}