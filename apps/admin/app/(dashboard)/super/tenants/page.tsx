"use client"
import { useState, useEffect } from "react"

interface Tenant {
  id: string
  name: string
  slug: string
  plan: string
  isActive: boolean
  primaryColor: string
  _count: { products: number; users: number; inquiries: number }
}

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    name: "",
    slug: "",
    primaryColor: "#6366f1",
  })

  async function loadTenants() {
    const res = await fetch("/api/tenants")
    const data = await res.json()
    setTenants(data)
    setLoading(false)
  }

  useEffect(() => { loadTenants() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/tenants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setShowForm(false)
      setForm({ name: "", slug: "", primaryColor: "#6366f1" })
      loadTenants()
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600 }}>Tenants</h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>Manage all client companies</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: "10px 20px",
            background: "#6366f1",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          + Add Tenant
        </button>
      </div>

      {showForm && (
        <div style={{
          background: "#fff",
          border: "0.5px solid #e2e8f0",
          borderRadius: 12,
          padding: "1.5rem",
          marginBottom: "2rem",
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: "1.5rem" }}>
            Create New Tenant
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>
                  Company Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Acme Corp"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: "0.5px solid #d1d5db",
                    borderRadius: 8,
                    fontSize: 14,
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>
                  Slug (subdomain)
                </label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                  required
                  placeholder="acme"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: "0.5px solid #d1d5db",
                    borderRadius: 8,
                    fontSize: 14,
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>
                  Brand Color
                </label>
                <input
                  type="color"
                  value={form.primaryColor}
                  onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                  style={{
                    width: "100%",
                    height: 38,
                    border: "0.5px solid #d1d5db",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="submit"
                style={{
                  padding: "9px 20px",
                  background: "#6366f1",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Create Tenant
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  padding: "9px 20px",
                  background: "#f1f5f9",
                  color: "#374151",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "0.5px solid #e2e8f0", background: "#f8fafc" }}>
              {["Company", "Slug", "Products", "Inquiries", "Status", "Actions"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 500, color: "#64748b", fontSize: 13 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
                  Loading...
                </td>
              </tr>
            ) : tenants.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
                  No tenants yet. Create your first one!
                </td>
              </tr>
            ) : (
              tenants.map((tenant) => (
                <tr key={tenant.id} style={{ borderBottom: "0.5px solid #f1f5f9" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: tenant.primaryColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 600,
                      }}>
                        {tenant.name[0]}
                      </div>
                      <span style={{ fontWeight: 500 }}>{tenant.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", color: "#64748b" }}>{tenant.slug}</td>
                  <td style={{ padding: "14px 16px" }}>{tenant._count.products}</td>
                  <td style={{ padding: "14px 16px" }}>{tenant._count.inquiries}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{
                      padding: "3px 10px",
                      borderRadius: 99,
                      fontSize: 12,
                      fontWeight: 500,
                      background: tenant.isActive ? "#dcfce7" : "#fee2e2",
                      color: tenant.isActive ? "#166534" : "#991b1b",
                    }}>
                      {tenant.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <button style={{ fontSize: 13, color: "#6366f1", background: "none", border: "none", cursor: "pointer" }}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
