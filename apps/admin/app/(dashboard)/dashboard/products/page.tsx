"use client"
import { useState, useEffect } from "react"

interface Product {
  id: string
  name: string
  slug: string
  price: number | null
  isVisible: boolean
  category: { name: string } | null
  createdAt: string
}

interface Tenant {
  id: string
  name: string
  slug: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<string>("")
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    isVisible: true,
    tenantId: "",
  })

  async function loadProducts() {
    const res = await fetch("/api/products")
    const data = await res.json()
    setProducts(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  async function loadTenants() {
    const res = await fetch("/api/tenants")
    if (res.ok) {
      const data = await res.json()
      setTenants(Array.isArray(data) ? data : [])
      setUserRole("SUPER_ADMIN")
    } else {
      setUserRole("CLIENT_ADMIN")
    }
  }

  useEffect(() => {
    loadProducts()
    loadTenants()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: form.price ? parseFloat(form.price) : null,
        images: [],
        tenantId: form.tenantId || undefined,
      }),
    })
    if (res.ok) {
      setShowForm(false)
      setForm({ name: "", description: "", price: "", isVisible: true, tenantId: "" })
      loadProducts()
    } else {
      const err = await res.json()
      alert(err.error || "Failed to create product")
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600 }}>Products</h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>Manage your product catalog</p>
        </div>
        <button onClick={() => setShowForm(true)} style={{
          padding: "10px 20px", background: "#6366f1", color: "#fff",
          border: "none", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer",
        }}>+ Add Product</button>
      </div>

      {showForm && (
        <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 12, padding: "1.5rem", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: "1.5rem" }}>New Product</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required placeholder="Product name"
                  style={{ width: "100%", padding: "9px 12px", border: "0.5px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" as const }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Price (optional)</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0.00"
                  style={{ width: "100%", padding: "9px 12px", border: "0.5px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" as const }} />
              </div>
            </div>

            {userRole === "SUPER_ADMIN" && tenants.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Tenant (Company)</label>
                <select value={form.tenantId} onChange={(e) => setForm({ ...form, tenantId: e.target.value })}
                  required
                  style={{ width: "100%", padding: "9px 12px", border: "0.5px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" as const }}>
                  <option value="">Select a company...</option>
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                required rows={3} placeholder="Product description..."
                style={{ width: "100%", padding: "9px 12px", border: "0.5px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" as const, resize: "vertical" }} />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <input type="checkbox" id="visible" checked={form.isVisible}
                onChange={(e) => setForm({ ...form, isVisible: e.target.checked })} />
              <label htmlFor="visible" style={{ fontSize: 13, fontWeight: 500 }}>Visible on catalog</label>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" style={{ padding: "9px 20px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, cursor: "pointer" }}>
                Create Product
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: "9px 20px", background: "#f1f5f9", color: "#374151", border: "none", borderRadius: 8, fontSize: 14, cursor: "pointer" }}>
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
              {["Name", "Category", "Price", "Visible", "Created"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 500, color: "#64748b", fontSize: 13 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>No products yet. Add your first one!</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} style={{ borderBottom: "0.5px solid #f1f5f9" }}>
                  <td style={{ padding: "14px 16px", fontWeight: 500 }}>{p.name}</td>
                  <td style={{ padding: "14px 16px", color: "#64748b" }}>{p.category?.name ?? "-"}</td>
                  <td style={{ padding: "14px 16px" }}>{p.price ? `$${p.price}` : "-"}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 500,
                      background: p.isVisible ? "#dcfce7" : "#fee2e2",
                      color: p.isVisible ? "#166534" : "#991b1b",
                    }}>{p.isVisible ? "Visible" : "Hidden"}</span>
                  </td>
                  <td style={{ padding: "14px 16px", color: "#64748b" }}>
                    {new Date(p.createdAt).toLocaleDateString()}
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