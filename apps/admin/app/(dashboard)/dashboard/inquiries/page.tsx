"use client"
import { useState, useEffect } from "react"

interface Inquiry {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  isRead: boolean
  createdAt: string
  product: { name: string } | null
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/inquiries")
      .then((r) => r.json())
      .then((data) => { setInquiries(Array.isArray(data) ? data : []); setLoading(false) })
  }, [])

  async function markRead(id: string) {
    await fetch(`/api/inquiries/${id}`, { method: "PATCH" })
    setInquiries((prev) => prev.map((i) => i.id === id ? { ...i, isRead: true } : i))
  }

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>Inquiries</h1>
        <p style={{ color: "#64748b", fontSize: 14 }}>Customer messages and leads</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {loading ? (
          <p style={{ color: "#64748b" }}>Loading...</p>
        ) : inquiries.length === 0 ? (
          <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 12, padding: "3rem", textAlign: "center", color: "#64748b" }}>
            No inquiries yet.
          </div>
        ) : (
          inquiries.map((inq) => (
            <div key={inq.id} style={{
              background: "#fff",
              border: `0.5px solid ${inq.isRead ? "#e2e8f0" : "#a5b4fc"}`,
              borderRadius: 12,
              padding: "1.25rem",
              borderLeft: `3px solid ${inq.isRead ? "#e2e8f0" : "#6366f1"}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <span style={{ fontWeight: 600 }}>{inq.name}</span>
                  <span style={{ color: "#64748b", fontSize: 13, marginLeft: 8 }}>{inq.email}</span>
                  {inq.phone && <span style={{ color: "#64748b", fontSize: 13, marginLeft: 8 }}>{inq.phone}</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {!inq.isRead && (
                    <span style={{ padding: "2px 8px", background: "#eef2ff", color: "#6366f1", borderRadius: 99, fontSize: 11, fontWeight: 500 }}>
                      New
                    </span>
                  )}
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {inq.product && (
                <p style={{ fontSize: 12, color: "#6366f1", marginBottom: 6 }}>
                  Re: {inq.product.name}
                </p>
              )}
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, marginBottom: 12 }}>{inq.message}</p>
              {!inq.isRead && (
                <button onClick={() => markRead(inq.id)} style={{ fontSize: 12, color: "#6366f1", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  Mark as read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
