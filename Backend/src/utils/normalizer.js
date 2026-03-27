import crypto from 'crypto'
import { CATEGORY_MAP } from '../constants/feeds.js'

/**
 * Generate a stable 16-char hex ID from a URL/guid string.
 */
export function generateId(link) {
  return crypto.createHash('sha256').update(link || String(Date.now())).digest('hex').slice(0, 16)
}

/**
 * Resolve the best available image URL from a parsed RSS item.
 * Priority: media:content → media:thumbnail → enclosure → first <img> in HTML
 */
export function extractImage(item) {
  // rss-parser exposes these when the feed declares media namespace
  const mediaContent = item['media:content'] || item.mediaContent
  if (mediaContent?.$ ?.url) return mediaContent.$.url
  if (typeof mediaContent === 'string') return mediaContent

  const mediaThumbnail = item['media:thumbnail'] || item.mediaThumbnail
  if (mediaThumbnail?.$ ?.url) return mediaThumbnail.$.url

  if (item.enclosure?.url) return item.enclosure.url

  // Fallback: scrape first <img src> from description or content HTML
  const html = item.content || item.description || ''
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i)
  return match?.[1] || null
}

/**
 * Map raw RSS category strings → our standard category key.
 * Falls back to feedDefaultCategory.
 */
export function resolveCategory(rawCategories = [], feedDefaultCategory = 'india') {
  for (const raw of rawCategories) {
    const lower = raw.toLowerCase()
    for (const { keywords, key } of CATEGORY_MAP) {
      if (keywords.some((kw) => lower.includes(kw))) return key
    }
  }
  return feedDefaultCategory
}

/**
 * Normalize a raw rss-parser item + feed metadata into the NewsItem shape.
 *
 * Output shape (matches frontend NewsCard / NewsDetailPage expectations):
 * {
 *   id, title, description, content, imageUrl,
 *   category, source: { name, url }, publishedAt, link
 * }
 */
export function normalizeItem(item, feed) {
  const link = item.link || item.guid || ''
  const id = generateId(link)

  const rawCategories = Array.isArray(item.categories) ? item.categories : []
  const category = resolveCategory(rawCategories, feed.defaultCategory)

  return {
    id,
    title: (item.title || '').trim(),
    description: item.description || item.contentSnippet || '',
    content: item['content:encoded'] || item.content || item.description || '',
    imageUrl: extractImage(item),
    category,
    source: {
      name: feed.sourceName,
      url: feed.sourceUrl,
    },
    publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
    link,
  }
}
