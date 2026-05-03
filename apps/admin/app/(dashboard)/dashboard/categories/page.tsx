"use client"
import { useState, useEffect } from "react"

interface Category {
  id: string
  name: string
  slug: string
  _count?: { products: number }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: "" })

  async function load() {
    const res = await fetch("/api/categories")
    const data = await res.json()
    setCategories(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setShowForm(false)
      setForm({ name: "" })
      load()
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600 }}>Categories</h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>Organize your products into categories</p>
        </div>
        <button onClick={() => setShowForm(true)} style={{ padding: "10px 20px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
          + Add Category
        </button>
      </div>

      {showForm && (
        <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 12, padding: "1.5rem", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: "1.5rem" }}>New Category</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Category Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ name: e.target.value })}
                required
                placeholder="e.g. Electronics"
                style={{ width: "100%", maxWidth: 400, padding: "9px 12px", border: "0.5px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" as const }}
              />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" style={{ padding: "9px 20px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, cursor: "pointer" }}>Create</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: "9px 20px", background: "#f1f5f9", color: "#374151", border: "none", borderRadius: 8, fontSize: 14, cursor: "pointer" }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
        {loading ? (
          <p style={{ color: "#64748b" }}>Loading...</p>
        ) : categories.length === 0 ? (
          <p style={{ color: "#64748b" }}>No categories yet.</p>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 12, padding: "1.25rem" }}>
              <div style={{ width: 40, height: 40, background: "#eef2ff", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 12 }}>
                📁
              </div>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>{cat.name}</p>
              <p style={{ fontSize: 13, color: "#64748b" }}>{cat._count?.products ?? 0} products</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
