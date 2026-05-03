"use client"
import { useState, useEffect } from "react"

export default function SettingsPage() {
  const [form, setForm] = useState({ name: "", primaryColor: "#6366f1", logo: "" })
  const [saved, setSaved] = useState(false)

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>Settings</h1>
        <p style={{ color: "#64748b", fontSize: 14 }}>Customize your catalog branding</p>
      </div>

      <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 12, padding: "2rem", maxWidth: 560 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: "1.5rem" }}>Brand Settings</h2>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Company Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your company name"
            style={{ width: "100%", padding: "9px 12px", border: "0.5px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" as const }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Primary Color</label>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <input
              type="color"
              value={form.primaryColor}
              onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
              style={{ width: 48, height: 40, border: "0.5px solid #d1d5db", borderRadius: 8, cursor: "pointer" }}
            />
            <span style={{ fontSize: 14, color: "#64748b" }}>{form.primaryColor}</span>
          </div>
        </div>

        <div style={{ marginBottom: 24, padding: "1rem", background: "#f8fafc", borderRadius: 8 }}>
          <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Preview</p>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ width: 32, height: 32, background: form.primaryColor, borderRadius: 8 }} />
            <button style={{ padding: "6px 16px", background: form.primaryColor, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>
              Sample Button
            </button>
          </div>
        </div>

        {saved && (
          <div style={{ padding: "10px 14px", background: "#dcfce7", border: "0.5px solid #bbf7d0", borderRadius: 8, color: "#166534", fontSize: 13, marginBottom: 16 }}>
            Settings saved successfully!
          </div>
        )}

        <button
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000) }}
          style={{ padding: "10px 24px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer" }}
        >
          Save Settings
        </button>
      </div>
    </div>
  )
}
