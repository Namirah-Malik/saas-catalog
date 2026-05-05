"use client"
import { useState, useEffect, useRef } from "react"

const slides = [
  {
    eyebrow: "POWER THE",
    title: "future",
    desc: "Industrial-grade inverters & UPS systems engineered for uninterrupted performance across India.",
    label: "INVERTERS & UPS",
    bg: "linear-gradient(135deg, #0f0c29, #302b63)",
  },
  {
    eyebrow: "HARNESS THE",
    title: "sun",
    desc: "High-efficiency solar panels & inverters maximizing energy harvest for homes and enterprises.",
    label: "SOLAR SOLUTIONS",
    bg: "linear-gradient(135deg, #0a2e1f, #0d5c3a)",
  },
  {
    eyebrow: "STORE THE",
    title: "energy",
    desc: "Next-generation lithium & tubular batteries with industry-leading cycle life and smart BMS.",
    label: "BATTERY STORAGE",
    bg: "linear-gradient(135deg, #1a0a2e, #3d1a6e)",
  },
  {
    eyebrow: "BUILT FOR",
    title: "trust",
    desc: "15+ years, 5000+ customers, 500+ dealers — India's most trusted power solutions manufacturer.",
    label: "EXPERT SERVICE",
    bg: "linear-gradient(135deg, #1a1a0a, #4a3800)",
  },
]

export default function HeroSlider() {
  const [cur, setCur] = useState(0)
  const [animating, setAnimating] = useState(true)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)
  const DURATION = 6000

  function goTo(n: number) {
    setAnimating(false)
    setTimeout(() => {
      setCur(n)
      setAnimating(true)
      setProgress(0)
    }, 50)
  }

  useEffect(() => {
    setProgress(0)
    const start = Date.now()
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - start
      setProgress(Math.min((elapsed / DURATION) * 100, 100))
    }, 50)
    timerRef.current = setTimeout(() => {
      setCur((prev) => (prev + 1) % slides.length)
      setAnimating(true)
      setProgress(0)
    }, DURATION)
    return () => {
      clearTimeout(timerRef.current!)
      clearInterval(progressRef.current!)
    }
  }, [cur])

  const slide = slides[cur]

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "100vh",
      minHeight: 600,
      overflow: "hidden",
      background: slide.bg,
      transition: "background 0.8s ease",
      fontFamily: "system-ui, sans-serif",
    }}>
      {/* Giant background text */}
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "clamp(8rem, 25vw, 18rem)",
        fontWeight: 700,
        letterSpacing: "-0.05em",
        color: "rgba(255,255,255,0.06)",
        userSelect: "none",
        pointerEvents: "none",
      }}>
        {slide.title}
      </div>

      {/* Particles */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {[
          [15, 20, 0], [75, 60, 0.8], [45, 80, 1.5],
          [85, 25, 2.2], [25, 70, 3.0], [60, 40, 0.4],
        ].map(([x, y, delay], i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${x}%`,
            top: `${y}%`,
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.3)",
            animation: `float ${3 + i * 0.5}s ease-in-out ${delay}s infinite`,
          }} />
        ))}
      </div>

      {/* Main content */}
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "3rem clamp(2rem, 8vw, 5rem)",
        zIndex: 2,
      }}>
        <div style={{
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.5)",
          marginBottom: "0.75rem",
          opacity: animating ? 1 : 0,
          transform: animating ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.6s ease 0.1s",
        }}>
          {slide.eyebrow}
        </div>

        <div style={{
          fontSize: "clamp(3.5rem, 12vw, 9rem)",
          fontWeight: 700,
          color: "#fff",
          lineHeight: 0.9,
          letterSpacing: "-0.04em",
          marginBottom: "1.5rem",
          opacity: animating ? 1 : 0,
          transform: animating ? "translateY(0)" : "translateY(40px)",
          transition: "all 0.7s ease 0.2s",
        }}>
          {slide.title}
        </div>

        <div style={{
          fontSize: 15,
          color: "rgba(255,255,255,0.6)",
          maxWidth: 420,
          lineHeight: 1.7,
          marginBottom: "2.5rem",
          opacity: animating ? 1 : 0,
          transform: animating ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.6s ease 0.35s",
        }}>
          {slide.desc}
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          opacity: animating ? 1 : 0,
          transform: animating ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.6s ease 0.5s",
        }}>
          <button style={{
            padding: "13px 32px",
            background: "#fff",
            color: "#000",
            border: "none",
            borderRadius: 4,
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            letterSpacing: "0.02em",
          }}>
            Get best price →
          </button>
          <div style={{
            width: animating ? 50 : 0,
            height: 1,
            background: "rgba(255,255,255,0.4)",
            transition: "width 0.5s ease 0.7s",
          }} />
          <div style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.1em",
            opacity: animating ? 1 : 0,
            transition: "opacity 0.4s ease 0.8s",
          }}>
            {slide.label}
          </div>
        </div>
      </div>

      {/* Dot navigation */}
      <div style={{
        position: "absolute",
        right: "2rem",
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        zIndex: 10,
      }}>
        {slides.map((_, i) => (
          <div key={i} onClick={() => goTo(i)} style={{
            width: cur === i ? 8 : 6,
            height: cur === i ? 8 : 6,
            borderRadius: "50%",
            background: cur === i ? "#fff" : "rgba(255,255,255,0.25)",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: cur === i ? "0 0 0 3px rgba(255,255,255,0.15)" : "none",
          }} />
        ))}
      </div>

      {/* Progress bar */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: 2,
        background: "rgba(255,255,255,0.15)",
        zIndex: 10,
      }}>
        <div style={{
          height: "100%",
          width: `${progress}%`,
          background: "#fff",
          transition: "width 0.05s linear",
        }} />
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute",
        bottom: "1.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        opacity: 0.4,
        zIndex: 10,
      }}>
        <div style={{
          width: 18,
          height: 28,
          border: "1px solid rgba(255,255,255,0.5)",
          borderRadius: 10,
          display: "flex",
          justifyContent: "center",
          paddingTop: 5,
        }}>
          <div style={{
            width: 2,
            height: 5,
            background: "#fff",
            borderRadius: 2,
            animation: "scrollWheel 2s infinite",
          }} />
        </div>
      </div>

      {/* Slide number */}
      <div style={{
        position: "absolute",
        bottom: "1.5rem",
        left: "clamp(2rem, 8vw, 5rem)",
        fontSize: 11,
        color: "rgba(255,255,255,0.3)",
        letterSpacing: "0.1em",
        zIndex: 10,
      }}>
        {String(cur + 1).padStart(2, "0")} / 04
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.2; }
          50% { transform: translateY(-20px) scale(1.5); opacity: 0.6; }
        }
        @keyframes scrollWheel {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(6px); opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}