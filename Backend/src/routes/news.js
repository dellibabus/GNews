import { Router } from 'express'
import { getPaginatedNews, getItemById, getLastRefreshedAt, searchNews } from '../services/newsCache.js'

const router = Router()

// GET /api/news/search?q=query&page=1&limit=12
router.get('/search', (req, res) => {
  const q = req.query.q || ''
  const page = Math.max(1, parseInt(req.query.page, 10) || 1)
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 12))
  return res.json(searchNews({ q, page, limit }))
})

// GET /api/news/meta
router.get('/meta', (_req, res) => {
  const { total } = getPaginatedNews({ page: 1, limit: 1 })
  return res.json({ total, lastRefreshedAt: getLastRefreshedAt() })
})

// GET /api/news?page=1&limit=12&category=all
router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1)
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 12))
  const category = req.query.category || 'all'
  return res.json(getPaginatedNews({ page, limit, category }))
})

// GET /api/news/:id
router.get('/:id', (req, res) => {
  const item = getItemById(req.params.id)
  if (!item) return res.status(404).json({ message: 'Article not found.' })
  return res.json(item)
})

export default router
