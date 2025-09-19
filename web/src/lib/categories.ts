export const ALLOWED_CATEGORIES = [
  "design",
  "ai",
  "frontend",
  "backend",
  "startup",
  "product",
  "data",
  "devops"
] as const

export type AllowedCategory = typeof ALLOWED_CATEGORIES[number]

export function isAllowedCategory(value: string): value is AllowedCategory {
  return ALLOWED_CATEGORIES.includes(value as AllowedCategory)
}
