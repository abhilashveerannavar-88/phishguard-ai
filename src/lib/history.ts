import { useSyncExternalStore } from 'react'

import type { Kind, Level } from './analyze'
import { read, subscribe, write } from './storage'

// The last few checks, kept in this browser only. We never store the whole
// message, just enough of a label to recognise it again.
const KEY = 'side-eye:v1'
const LIMIT = 8

export type CheckRecord = { kind: Kind; label: string; score: number; level: Level; at: string }
export type History = { checks: CheckRecord[] }

const EMPTY: History = { checks: [] }

let cache: { raw: string; value: History } | null = null

function snapshot(): History {
  const value = read<History>(KEY, EMPTY)
  const raw = JSON.stringify(value)
  if (cache && cache.raw === raw) return cache.value
  const checks = Array.isArray(value.checks)
    ? value.checks
        .filter((c) => c && typeof c.label === 'string' && typeof c.score === 'number')
        .slice(0, LIMIT)
    : []
  const safe: History = { checks }
  cache = { raw, value: safe }
  return safe
}

export function useHistory(): History {
  return useSyncExternalStore(subscribe, snapshot, () => EMPTY)
}

export function addCheck(record: Omit<CheckRecord, 'at'>) {
  const current = snapshot()
  const next = [{ ...record, at: new Date().toISOString() }, ...current.checks].slice(0, LIMIT)
  write(KEY, { checks: next })
}

export function clearChecks() {
  write(KEY, EMPTY)
}

export function levelColor(level: Level) {
  return level === 'high' ? 'bg-alert' : level === 'caution' ? 'bg-butter' : 'bg-ok'
}
