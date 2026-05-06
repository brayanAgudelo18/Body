export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`
}

export function nowIso() {
  return new Date().toISOString()
}

export function addDaysIso(iso: string, days: number) {
  const base = new Date(iso)
  base.setDate(base.getDate() + days)
  return base.toISOString()
}

export function daysLeft(fromIso: string, toIso: string) {
  const from = new Date(fromIso).getTime()
  const to = new Date(toIso).getTime()
  const diff = to - from
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

