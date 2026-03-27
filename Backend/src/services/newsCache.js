import cron from 'node-cron'
import { parseAllFeeds } from './rssParser.js'
import { RSS_FEEDS } from '../constants/feeds.js'
import { config } from '../config/index.js'
import { readStore } from './dataStore.js'

/** @type {Map<string, NewsItem>} */
const itemMap = new Map()

/** All items sorted newest-first */
let sortedItems = []

let lastRefreshedAt = null
let isRefreshing = false

// ── Public API ───────────────────────────────────────────────────────────────

export function getPaginatedNews({ page = 1, limit = 12, category = 'all' }) {
  const filtered =
    category === 'all'
      ? sortedItems
      : sortedItems.filter((item) => item.category === category)

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * limit

  return { items: filtered.slice(start, start + limit), total, page: safePage, totalPages }
}

export function searchNews({ q = '', page = 1, limit = 12 }) {
  const lower = q.toLowerCase().trim()
  if (!lower) return { items: [], total: 0, page: 1, totalPages: 0 }

  const filtered = sortedItems.filter(
    (item) =>
      item.title?.toLowerCase().includes(lower) ||
      item.description?.toLowerCase().includes(lower) ||
      item.source?.name?.toLowerCase().includes(lower) ||
      item.category?.toLowerCase().includes(lower),
  )

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * limit

  return { items: filtered.slice(start, start + limit), total, page: safePage, totalPages, query: q }
}

export function getItemById(id) {
  return itemMap.get(id)
}

export function getLastRefreshedAt() {
  return lastRefreshedAt
}

/** Reload custom news from store and rebuild the sorted array. */
export function syncCustomNews() {
  const customItems = readStore('custom-news')
  for (const item of customItems) {
    itemMap.set(item.id, { ...item, isCustom: true })
  }
  sortedItems = Array.from(itemMap.values()).sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt),
  )
}

// ── Internal ─────────────────────────────────────────────────────────────────

export async function refresh() {
  if (isRefreshing) return
  isRefreshing = true

  console.log('[Cache] Refreshing feeds…')
  const start = Date.now()

  try {
    const freshItems = await parseAllFeeds(RSS_FEEDS)
    for (const item of freshItems) {
      itemMap.set(item.id, item)
    }

    // Merge custom admin-created news
    const customItems = readStore('custom-news')
    for (const item of customItems) {
      itemMap.set(item.id, { ...item, isCustom: true })
    }

    sortedItems = Array.from(itemMap.values()).sort(
      (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt),
    )

    lastRefreshedAt = new Date().toISOString()
    console.log(`[Cache] Refresh complete — ${sortedItems.length} items total (${Date.now() - start}ms)`)
  } catch (err) {
    console.error('[Cache] Refresh failed:', err.message)
  } finally {
    isRefreshing = false
  }
}

export function startScheduler() {
  refresh()
  const minutes = config.feedRefreshMinutes
  cron.schedule(`*/${minutes} * * * *`, () => refresh())
  console.log(`[Scheduler] Feed refresh scheduled every ${minutes} minute(s)`)
}
