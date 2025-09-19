import Database from "better-sqlite3"
import path from "path"
import fs from "fs"

// Store the DB under .data in the project root
const dataDir = path.join(process.cwd(), ".data")
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const dbPath = path.join(dataDir, "app.db")
export const db = new Database(dbPath)

// Auto-migrate minimal schema
// Links: id, url, title (optional), category, created_at
// Note: keep it simple, no foreign keys
const createTableSql = `
  CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    title TEXT,
    category TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
  );
`

db.exec(createTableSql)

export type LinkRow = {
  id: number
  url: string
  title: string | null
  category: string
  created_at: string
}

