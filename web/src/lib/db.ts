import Database from "better-sqlite3"
import path from "path"
import fs from "fs"

const customPath = process.env.DB_PATH
// Store the DB under .data in the project root by default
const dataDir = customPath ? path.dirname(customPath) : path.join(process.cwd(), ".data")
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const dbPath = customPath || path.join(dataDir, "app.db")
export const db = new Database(dbPath)

// Auto-migrate minimal schema
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

export function resetDatabase() {
  db.exec("DROP TABLE IF EXISTS links;")
  db.exec(createTableSql)
}

