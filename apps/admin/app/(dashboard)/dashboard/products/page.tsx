"use client"
import { useState, useEffect } from "react"

interface Product {
  id: string
  name: string
  slug: string
  price: number | null
  isVisible: boolean
  images: string[]
  category: { name: string; id: string } | null
  createdAt: string
  description: string
}

interface Category {
  id: string
  name: string
}

interface ProductForm {
  name: string
  sku: string
  price: string
  categoryId: string
  description: string
  images: string[]
  specifications: { key: string; value: string }[]
  salientFeatures: string[]
  features: string[]
  isVisible: boolean
}

const emptyForm: ProductForm = {
  name: "", sku: "", price: "", categoryId: "",
  description: "", images: [],
  specifications: [], salientFeatures: [], features: [],
  isVisible: true,
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tenants, setTenants] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ProductForm>(emptyForm)
  const [selectedTenant, setSelectedTenant] = useState("")
  const [search, setSearch] = useState("")
  const [filterCat, setFilterCat] = useState("")
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [newSpecKey, setNewSpecKey] = useState("")
  const [newSpecVal, setNewSpecVal] = useState("")
  const [newFeature, setNewFeature] = useState("")
  const [newSalient, setNewSalient] = useState("")
  const [newImage, setNewImage] = useState("")
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  async function load() {
    const [pRes, cRes, tRes] = await Promise.all([
      fetch("/api/products"),
      fetch("/api/categories"),
      fetch("/api/tenants"),
    ])
    if (pRes.ok) setProducts(await pRes.json())
    if (cRes.ok) setCategories(await cRes.json())
    if (tRes.ok) { setTenants(await tRes.json()); setIsSuperAdmin(true) }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openAdd() {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
  }

  function openEdit(p: Product) {
    setForm({
      name: p.name,
      sku: "",
      price: p.price?.toString() ?? "",
      categoryId: p.category?.id ?? "",
      description: p.description,
      images: p.images,
      specifications: [],
      salientFeatures: [],
      features: [],
      isVisible: p.isVisible,
    })
    setEditingId(p.id)
    setShowForm(true)
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
    if (res.ok) { setProducts(prev => prev.filter(p => p.id !== id)); setDeleteConfirm(null) }
  }

 async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  setSaving(true)

  const baseBody = {
    name: form.name,
    description: form.description,
    price: form.price ? parseFloat(form.price) : null,
    categoryId: form.categoryId || null,
    images: form.images,
    isVisible: form.isVisible,
    specifications: form.specifications.reduce(
      (acc, s) => ({ ...acc, [s.key]: s.value }), {}
    ),
  }

  try {
    if (editingId) {
      await fetch(`/api/products/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(baseBody),
      })
    } else if (selectedTenant === "ALL") {
      // Add to ALL tenants simultaneously
      await Promise.all(
        tenants.map(t =>
          fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...baseBody, tenantId: t.id }),
          })
        )
      )
    } else {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...baseBody, tenantId: selectedTenant }),
      })
    }

    setShowForm(false)
    setForm(emptyForm)
    setEditingId(null)
    setSelectedTenant("")
    load()
  } catch (err) {
    console.error(err)
  }

  setSaving(false)
}

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = !filterCat || p.category?.id === filterCat
    return matchSearch && matchCat
  })

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px",
    border: "0.5px solid #e2e8f0", borderRadius: 10,
    fontSize: 14, boxSizing: "border-box", outline: "none",
    background: "#fff",
  }

  const sectionStyle: React.CSSProperties = {
    background: "#fff", border: "0.5px solid #e2e8f0",
    borderRadius: 12, padding: "1.5rem", marginBottom: "1rem",
  }

  return (
    <div style={{ fontFamily: "system-ui,sans-serif" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600 }}>Products</h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>Manage your product catalog</p>
        </div>
        <button onClick={openAdd} style={{
          padding: "10px 22px", background: "#0f172a", color: "#fff",
          border: "none", borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: "pointer",
        }}>+ Add Product</button>
      </div>

      {/* Search + Filter */}
      <div style={{ display: "flex", gap: 12, marginBottom: "1.5rem" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 16 }}>🔍</span>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products, descriptions, or SKUs..."
            style={{ ...inputStyle, paddingLeft: 36 }}
          />
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ ...inputStyle, width: 200 }}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button style={{ padding: "10px 20px", background: "#0f172a", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, cursor: "pointer" }}>Apply</button>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#64748b" }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#64748b" }}>
          <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No products yet</p>
          <p style={{ fontSize: 14 }}>Click "+ Add Product" to add your first product.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {filtered.map(p => (
            <div key={p.id} style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 14, overflow: "hidden" }}>
              <div style={{
                height: 180,
                background: p.images[0] ? `url(${p.images[0]}) center/cover` : "#f1f5f9",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
              }}>
                {!p.images[0] && <span style={{ fontSize: 32, opacity: 0.3 }}>📦</span>}
                {p.category && (
                  <span style={{ position: "absolute", top: 10, left: 10, padding: "3px 10px", background: "#fff", borderRadius: 99, fontSize: 11, fontWeight: 500, color: "#374151" }}>
                    {p.category.name}
                  </span>
                )}
                <span style={{
                  position: "absolute", top: 10, right: 10,
                  width: 8, height: 8, borderRadius: "50%",
                  background: p.isVisible ? "#22c55e" : "#f59e0b",
                }} />
              </div>
              <div style={{ padding: "1rem" }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: "#0f172a", lineHeight: 1.3 }}>{p.name}</h3>
                <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 12, lineHeight: 1.4 }}>
                  {p.description.slice(0, 60)}{p.description.length > 60 ? "..." : ""}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 17, fontWeight: 700, color: "#0f172a" }}>
                    {p.price ? `₹${p.price.toLocaleString("en-IN")}` : "—"}
                  </span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => openEdit(p)}
                      style={{ width: 32, height: 32, borderRadius: 8, border: "0.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 14 }}
                      title="Edit"
                    >✏️</button>
                    <button
                      onClick={() => setDeleteConfirm(p.id)}
                      style={{ width: 32, height: 32, borderRadius: 8, border: "0.5px solid #fecaca", background: "#fef2f2", cursor: "pointer", fontSize: 14 }}
                      title="Delete"
                    >🗑️</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "2rem", maxWidth: 400, width: "90%" }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Delete Product?</h3>
            <p style={{ color: "#64748b", marginBottom: "1.5rem", fontSize: 14 }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: "10px", background: "#f1f5f9", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14 }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} style={{ flex: 1, padding: "10px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 500 }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 200, overflowY: "auto", padding: "2rem 1rem" }}>
          <div style={{ background: "#f8fafc", borderRadius: 20, width: "100%", maxWidth: 780, position: "relative" }}>

            {/* Modal Header */}
            <div style={{ padding: "1.5rem 2rem", borderBottom: "0.5px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", borderRadius: "20px 20px 0 0" }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>{editingId ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setShowForm(false)} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "#f1f5f9", cursor: "pointer", fontSize: 18 }}>×</button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: "1.5rem 2rem" }}>

              {/* Tenant selector (super admin only) */}
{isSuperAdmin && !editingId && (
  <div style={{ ...sectionStyle, marginBottom: "1rem" }}>
    <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Company *</label>
    <select value={selectedTenant} onChange={e => setSelectedTenant(e.target.value)} style={inputStyle}>
      <option value="">Select company...</option>
      <option value="ALL" style={{ fontWeight: 600, color: "#6366f1" }}>🌐 Add to ALL companies</option>
      <option disabled style={{ color: "#d1d5db" }}>──────────────</option>
      {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
    </select>
    {selectedTenant === "ALL" && (
      <div style={{
        marginTop: 8, padding: "8px 12px",
        background: "#eef2ff", border: "0.5px solid #a5b4fc",
        borderRadius: 8, fontSize: 13, color: "#4338ca",
      }}>
        This product will be added to all {tenants.length} companies simultaneously.
      </div>
    )}
  </div>
)}
              {/* Basic Info */}
              <div style={sectionStyle}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: "1rem" }}>Basic Information</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Product Name *</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Luminous Zelio 1100" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>SKU *</label>
                    <input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} placeholder="e.g. LUM-Z1100" style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Price *</label>
                    <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required placeholder="e.g. 6499" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Category *</label>
                    <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} style={inputStyle}>
                      <option value="">Select category...</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Description *</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required rows={4} placeholder="Product description..." style={{ ...inputStyle, resize: "vertical" }} />
                </div>
              </div>

              {/* Images */}
              <div style={sectionStyle}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: "1rem" }}>Images</h3>
                {form.images.map((img, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                    <input value={img} onChange={e => {
                      const imgs = [...form.images]
                      imgs[i] = e.target.value
                      setForm({ ...form, images: imgs })
                    }} placeholder="Image URL" style={{ ...inputStyle, flex: 1 }} />
                    {img && <img src={img} alt="" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6, border: "0.5px solid #e2e8f0" }} />}
                    <button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_, j) => j !== i) })} style={{ width: 32, height: 32, background: "#fef2f2", border: "0.5px solid #fecaca", borderRadius: 8, cursor: "pointer", color: "#dc2626", fontSize: 16 }}>×</button>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={newImage} onChange={e => setNewImage(e.target.value)} placeholder="Paste image URL..." style={{ ...inputStyle, flex: 1 }} />
                  <button type="button" onClick={() => { if (newImage.trim()) { setForm({ ...form, images: [...form.images, newImage.trim()] }); setNewImage("") } }} style={{ padding: "10px 16px", background: "#0f172a", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 13, whiteSpace: "nowrap" }}>+ Add Image</button>
                </div>
              </div>

              {/* Specifications */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: "1rem" }}>
                <div style={sectionStyle}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: "1rem" }}>Specifications</h3>
                  {form.specifications.map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                      <input value={s.key} readOnly style={{ ...inputStyle, flex: 1, fontSize: 13 }} />
                      <input value={s.value} readOnly style={{ ...inputStyle, flex: 1, fontSize: 13 }} />
                      <button type="button" onClick={() => setForm({ ...form, specifications: form.specifications.filter((_, j) => j !== i) })} style={{ width: 28, height: 28, background: "#fef2f2", border: "0.5px solid #fecaca", borderRadius: 6, cursor: "pointer", color: "#dc2626" }}>×</button>
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <input value={newSpecKey} onChange={e => setNewSpecKey(e.target.value)} placeholder="Label" style={{ ...inputStyle, flex: 1, fontSize: 13 }} />
                    <input value={newSpecVal} onChange={e => setNewSpecVal(e.target.value)} placeholder="Value" style={{ ...inputStyle, flex: 1, fontSize: 13 }} />
                  </div>
                  <button type="button" onClick={() => {
                    if (newSpecKey && newSpecVal) {
                      setForm({ ...form, specifications: [...form.specifications, { key: newSpecKey, value: newSpecVal }] })
                      setNewSpecKey(""); setNewSpecVal("")
                    }
                  }} style={{ width: "100%", padding: "8px", background: "#f8fafc", border: "0.5px solid #e2e8f0", borderRadius: 8, cursor: "pointer", fontSize: 13, color: "#374151" }}>+ Add Specification</button>
                </div>

                <div style={sectionStyle}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: "1rem" }}>Salient Features</h3>
                  {form.salientFeatures.map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                      <div style={{ flex: 1, padding: "8px 12px", background: "#f8fafc", borderRadius: 8, fontSize: 13, border: "0.5px solid #e2e8f0" }}>{f.slice(0, 35)}{f.length > 35 ? "..." : ""}</div>
                      <button type="button" onClick={() => setForm({ ...form, salientFeatures: form.salientFeatures.filter((_, j) => j !== i) })} style={{ width: 28, height: 28, background: "#fef2f2", border: "0.5px solid #fecaca", borderRadius: 6, cursor: "pointer", color: "#dc2626" }}>×</button>
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: 8 }}>
                    <input value={newSalient} onChange={e => setNewSalient(e.target.value)} placeholder="Add salient feature..." style={{ ...inputStyle, flex: 1, fontSize: 13 }} />
                    <button type="button" onClick={() => { if (newSalient.trim()) { setForm({ ...form, salientFeatures: [...form.salientFeatures, newSalient.trim()] }); setNewSalient("") } }} style={{ padding: "10px 12px", background: "#0f172a", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>+</button>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div style={sectionStyle}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: "1rem" }}>Features</h3>
                {form.features.map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                    <div style={{ flex: 1, padding: "8px 12px", background: "#f8fafc", borderRadius: 8, fontSize: 13, border: "0.5px solid #e2e8f0" }}>{f.slice(0, 60)}{f.length > 60 ? "..." : ""}</div>
                    <button type="button" onClick={() => setForm({ ...form, features: form.features.filter((_, j) => j !== i) })} style={{ width: 28, height: 28, background: "#fef2f2", border: "0.5px solid #fecaca", borderRadius: 6, cursor: "pointer", color: "#dc2626" }}>×</button>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={newFeature} onChange={e => setNewFeature(e.target.value)} placeholder="Add feature..." style={{ ...inputStyle, flex: 1, fontSize: 13 }} />
                  <button type="button" onClick={() => { if (newFeature.trim()) { setForm({ ...form, features: [...form.features, newFeature.trim()] }); setNewFeature("") } }} style={{ padding: "10px 12px", background: "#0f172a", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>+</button>
                </div>
              </div>

              {/* Visibility */}
              <div style={{ ...sectionStyle, display: "flex", alignItems: "center", gap: 12 }}>
                <input type="checkbox" id="visible" checked={form.isVisible} onChange={e => setForm({ ...form, isVisible: e.target.checked })} style={{ width: 18, height: 18, cursor: "pointer" }} />
                <label htmlFor="visible" style={{ fontSize: 14, fontWeight: 500, cursor: "pointer" }}>Visible on catalog</label>
              </div>

              {/* Submit */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: "1rem" }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: "13px", background: "#f1f5f9", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: 500 }}>Cancel</button>
               <button type="submit" disabled={saving} style={{
  padding: "13px", background: saving ? "#64748b" : "#0f172a",
  color: "#fff", border: "none", borderRadius: 12,
  cursor: saving ? "not-allowed" : "pointer",
  fontSize: 14, fontWeight: 500,
  display: "flex", alignItems: "center", justifyContent: "center", gap: 8
}}>
  💾 {saving
    ? "Saving..."
    : editingId
      ? "Update Product"
      : selectedTenant === "ALL"
        ? `Add to All ${tenants.length} Companies`
        : "Add Product"
  }
</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}