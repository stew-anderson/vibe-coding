import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
    globals: false
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  }
})
