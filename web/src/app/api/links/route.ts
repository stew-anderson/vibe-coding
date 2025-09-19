import { NextResponse } from "next/server"
import { db, type LinkRow } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const stmt = category
    ? db.prepare<LinkRow>("SELECT * FROM links WHERE category = ? ORDER BY created_at DESC")
    : db.prepare<LinkRow>("SELECT * FROM links ORDER BY created_at DESC")
  const rows = category ? stmt.all(category) : stmt.all()
  return NextResponse.json({ links: rows })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body || !body.url || !body.category) {
    return NextResponse.json({ error: "Missing url or category" }, { status: 400 })
  }
  const url: string = String(body.url)
  const title: string | null = body.title ? String(body.title) : null
  const category: string = String(body.category)

  const insert = db.prepare("INSERT INTO links (url, title, category) VALUES (?, ?, ?)")
  const info = insert.run(url, title, category)
  const select = db.prepare<LinkRow>("SELECT * FROM links WHERE id = ?")
  const created = select.get(info.lastInsertRowid as number)
  return NextResponse.json({ link: created }, { status: 201 })
}

