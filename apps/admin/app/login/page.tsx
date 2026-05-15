"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Login failed"); return }
      router.push("/dashboard")
    } catch { setError("Something went wrong") }
    finally { setLoading(false) }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "#0f172a",
      fontFamily: "system-ui, sans-serif",
    }}>
      {/* Left panel */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "3rem",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "20%", right: "-10%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", left: "-5%",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "3rem" }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#fff"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>Satyajan</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.15em" }}>ADMIN PANEL</div>
            </div>
          </div>

          <h1 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: "1rem" }}>
            Manage your<br/>
            <span style={{ color: "#818cf8" }}>product catalog</span>
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 340 }}>
            The complete multi-tenant platform for managing products, tenants, and inquiries.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: "3rem" }}>
            {[
              { icon: "🏢", text: "Multi-tenant company management" },
              { icon: "📦", text: "Complete product catalog control" },
              { icon: "💬", text: "Customer inquiry tracking" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, flexShrink: 0,
                }}>{icon}</div>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - Login form */}
      <div style={{
        width: 480, display: "flex", alignItems: "center",
        justifyContent: "center", padding: "2rem",
        background: "#fff",
      }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
            Welcome back
          </h2>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: "2rem" }}>
            Sign in to your admin dashboard
          </p>

          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: 10, padding: "10px 14px",
              color: "#dc2626", fontSize: 14, marginBottom: "1.25rem",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
                Email address
              </label>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                required placeholder="super@admin.com"
                style={{
                  width: "100%", padding: "11px 14px",
                  border: "1.5px solid #e5e7eb", borderRadius: 10,
                  fontSize: 14, outline: "none", boxSizing: "border-box" as const,
                  transition: "border-color 0.15s",
                }}
                onFocus={e => e.target.style.borderColor = "#6366f1"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                required placeholder="••••••••"
                style={{
                  width: "100%", padding: "11px 14px",
                  border: "1.5px solid #e5e7eb", borderRadius: 10,
                  fontSize: 14, outline: "none", boxSizing: "border-box" as const,
                  transition: "border-color 0.15s",
                }}
                onFocus={e => e.target.style.borderColor = "#6366f1"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                width: "100%", padding: "13px",
                background: loading ? "#a5b4fc" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff", border: "none", borderRadius: 10,
                fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 4px 14px rgba(99,102,241,0.4)",
                transition: "all 0.2s",
              }}
            >
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </form>

          <div style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
            <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8, fontWeight: 500 }}>Demo credentials</p>
            <p style={{ fontSize: 12, color: "#374151" }}>Email: <strong>super@admin.com</strong></p>
            <p style={{ fontSize: 12, color: "#374151" }}>Password: <strong>admin123</strong></p>
          </div>
        </div>
      </div>
    </div>
  )
}