import { describe, it, expect, beforeEach, afterAll } from "vitest"
import { GET, POST } from "@/app/api/links/route"
import { resetDatabase } from "@/lib/db"
import { ALLOWED_CATEGORIES } from "@/lib/categories"
import fs from "fs"
import os from "os"
import path from "path"

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "links-test-"))
const tmpDb = path.join(tmpDir, "test.db")

process.env.DB_PATH = tmpDb

const CAT = ALLOWED_CATEGORIES[0]

describe("links API", () => {
  beforeEach(() => {
    resetDatabase()
  })

  afterAll(() => {
    try { fs.rmSync(tmpDir, { recursive: true, force: true }) } catch {}
  })

  it("creates a link and lists it", async () => {
    const payload = { url: "https://example.com", title: "Example", category: CAT }
    const reqPost = new Request("http://localhost/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    const resPost = await POST(reqPost)
    expect(resPost.status).toBe(201)
    const jsonPost = await resPost.json()
    expect(jsonPost.link.url).toBe(payload.url)
    expect(jsonPost.link.category).toBe(payload.category)

    const reqGet = new Request("http://localhost/api/links")
    const resGet = await GET(reqGet)
    expect(resGet.status).toBe(200)
    const jsonGet = await resGet.json()
    expect(jsonGet.links.length).toBe(1)
    expect(jsonGet.links[0].url).toBe(payload.url)
  })

  it("filters by category", async () => {
    const make = async (cat: string) => {
      const req = new Request("http://localhost/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: `https://example.com/${cat}`, category: cat })
      })
      await POST(req)
    }
    await make(CAT)

    const resA = await GET(new Request(`http://localhost/api/links?category=${CAT}`))
    const jsonA = await resA.json()
    expect(jsonA.links.length).toBe(1)
    expect(jsonA.links[0].category).toBe(CAT)
  })

  it("rejects invalid category on POST", async () => {
    const res = await POST(new Request("http://localhost/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: "https://invalid.com", category: "not-valid" })
    }))
    expect(res.status).toBe(400)
  })
})
