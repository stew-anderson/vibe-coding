"use client"
import { useEffect, useState } from "react"

type LinkRow = {
  id: number
  url: string
  title: string | null
  category: string
  created_at: string
}

export default function Home() {
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [filter, setFilter] = useState("")
  const [links, setLinks] = useState<LinkRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const loadLinks = async (categoryFilter?: string) => {
    setLoading(true)
    setError("")
    try {
      const params = new URLSearchParams()
      if (categoryFilter && categoryFilter.trim()) params.set("category", categoryFilter.trim())
      const res = await fetch(`/api/links?${params.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch")
      const j = await res.json()
      setLinks(j.links ?? [])
    } catch (e) {
      setError("Failed to load links")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLinks()
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim() || !category.trim()) return
    try {
      const res = await fetch(`/api/links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), title: title.trim() || undefined, category: category.trim() })
      })
      if (!res.ok) throw new Error("Failed to create")
      setUrl("")
      setTitle("")
      setCategory("")
      loadLinks(filter)
    } catch (e) {
      // ignore simple errors for MVP
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1>Link Bookmarks</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8, marginBottom: 24 }}>
        <input placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} style={{ padding: 8 }} />
        <input placeholder="Optional title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: 8 }} />
        <input placeholder="Category (e.g. design, ai)" value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: 8 }} />
        <button type="submit" style={{ padding: 10 }}>Submit</button>
      </form>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <input placeholder="Filter by category" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: 8 }} />
        <button onClick={() => loadLinks(filter)} style={{ padding: 10 }}>Apply</button>
        <button onClick={() => { setFilter(""); loadLinks("") }} style={{ padding: 10 }}>Clear</button>
      </div>

      {loading && <div>Loading…</div>}
      {error && <div style={{ color: "crimson" }}>{error}</div>}

      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8 }}>
        {links.map((l) => (
          <li key={l.id} style={{ border: "1px solid #e5e5e5", padding: 12, borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: "#666" }}>{(() => { try { return new URL(l.url).hostname } catch { return l.url } })()}</div>
            <a href={l.url} target="_blank" rel="noreferrer" style={{ fontWeight: 600 }}>{l.title || l.url}</a>
            <div style={{ fontSize: 12, color: "#666" }}>Category: <button onClick={() => { setFilter(l.category); loadLinks(l.category) }} style={{ padding: 2 }}>{l.category}</button></div>
          </li>
        ))}
      </ul>
    </main>
  )
}
