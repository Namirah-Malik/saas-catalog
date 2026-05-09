"use client"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"

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
        body: JSON.stringify({ email, password, tenant }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Invalid credentials"); return }
      router.push(`/?tenant=${data.tenant?.slug ?? tenant}`)
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#f8fafc",
      fontFamily: "system-ui, sans-serif",
    }}>
      <div style={{
        background: "#fff", border: "0.5px solid #e2e8f0",
        borderRadius: 16, padding: "2.5rem", width: "100%", maxWidth: 400,
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: 32, marginBottom: "0.5rem" }}>🏢</div>
          <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>Client Portal</h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>Sign in to view your product catalog</p>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "0.5px solid #fecaca", borderRadius: 8, padding: "10px 14px", color: "#dc2626", fontSize: 14, marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "#374151" }}>Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="you@company.com"
              style={{ width: "100%", padding: "10px 12px", border: "0.5px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" as const }}
            />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "#374151" }}>Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="••••••••"
              style={{ width: "100%", padding: "10px 12px", border: "0.5px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" as const }}
            />
          </div>
          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "11px", background: loading ? "#a5b4fc" : "#6366f1",
            color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer",
          }}>
            {loading ? "Signing in..." : "Sign in to catalog"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}