"use client"
import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tenant = searchParams.get("tenant") ?? ""
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
      if (!res.ok) {
        setError(data.error || "Invalid email or password")
        return
      }
      router.push(`/?tenant=${data.tenantSlug}`)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0f0c29, #302b63)",
      fontFamily: "system-ui, sans-serif",
      padding: "2rem",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 20,
        padding: "2.5rem",
        width: "100%",
        maxWidth: 420,
        boxShadow: "0 32px 64px rgba(0,0,0,0.3)",
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, margin: "0 auto 1rem",
          }}>🏢</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6, color: "#0a0a0a" }}>
            Client Portal
          </h1>
          <p style={{ color: "#6b7280", fontSize: 14 }}>
            Sign in with your company credentials
          </p>
        </div>

        {error && (
          <div style={{
            background: "#fef2f2", border: "0.5px solid #fecaca",
            borderRadius: 8, padding: "10px 14px",
            color: "#dc2626", fontSize: 14, marginBottom: "1.25rem",
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{
              display: "block", fontSize: 13,
              fontWeight: 500, marginBottom: 6, color: "#374151",
            }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="admin@yourcompany.com"
              style={{
                width: "100%", padding: "11px 14px",
                border: "0.5px solid #d1d5db", borderRadius: 10,
                fontSize: 14, boxSizing: "border-box" as const,
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.75rem" }}>
            <label style={{
              display: "block", fontSize: 13,
              fontWeight: 500, marginBottom: 6, color: "#374151",
            }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: "100%", padding: "11px 14px",
                border: "0.5px solid #d1d5db", borderRadius: 10,
                fontSize: 14, boxSizing: "border-box" as const,
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "13px",
              background: loading
                ? "#a5b4fc"
                : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff", border: "none", borderRadius: 10,
              fontSize: 15, fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: "0.01em",
            }}
          >
            {loading ? "Signing in..." : "Sign in to my catalog →"}
          </button>
        </form>

        <p style={{
          textAlign: "center", marginTop: "1.5rem",
          fontSize: 13, color: "#9ca3af",
        }}>
          Contact your administrator if you need help logging in
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29, #302b63)" }} />}>
      <LoginForm />
    </Suspense>
  )
}