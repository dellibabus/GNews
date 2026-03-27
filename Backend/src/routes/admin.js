/**
 * Admin routes — protected by requireAdmin middleware.
 *
 * POST   /api/admin/login            — authenticate, returns JWT
 * GET    /api/admin/news             — list custom news items
 * POST   /api/admin/news             — create custom news item
 * PUT    /api/admin/news/:id         — update custom news item
 * DELETE /api/admin/news/:id         — delete custom news item
 * GET    /api/admin/contacts         — list contact submissions
 * PATCH  /api/admin/contacts/:id/read — mark contact as read
 * DELETE /api/admin/contacts/:id     — delete contact submission
 */
import { Router } from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { config } from '../config/index.js'
import { requireAdmin } from '../middleware/authMiddleware.js'
import { readStore, writeStore } from '../services/dataStore.js'
import { syncCustomNews } from '../services/newsCache.js'

const router = Router()

// ── Auth ──────────────────────────────────────────────────────────────────────

router.post('/login', (req, res) => {
  const { username, password } = req.body || {}
  if (username !== config.adminUsername || password !== config.adminPassword) {
    return res.status(401).json({ message: 'Invalid credentials.' })
  }
  const token = jwt.sign({ role: 'admin', username }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  })
  return res.json({ token })
})

// ── Custom News CRUD ──────────────────────────────────────────────────────────

router.get('/news', requireAdmin, (_req, res) => {
  const items = readStore('custom-news')
  return res.json(items)
})

router.post('/news', requireAdmin, (req, res) => {
  const { title, description, content, imageUrl, category, sourceUrl, sourceName, link } = req.body || {}
  if (!title?.trim() || !link?.trim() || !sourceName?.trim()) {
    return res.status(400).json({ message: 'title, link and sourceName are required.' })
  }

  const items = readStore('custom-news')
  const id = crypto.randomBytes(8).toString('hex')
  const newItem = {
    id,
    title: title.trim(),
    description: description || '',
    content: content || description || '',
    imageUrl: imageUrl || null,
    category: category || 'india',
    source: { name: sourceName.trim(), url: sourceUrl || '' },
    publishedAt: new Date().toISOString(),
    link: link.trim(),
    isCustom: true,
  }

  items.unshift(newItem)
  writeStore('custom-news', items)
  syncCustomNews()

  return res.status(201).json(newItem)
})

router.put('/news/:id', requireAdmin, (req, res) => {
  const items = readStore('custom-news')
  const idx = items.findIndex((i) => i.id === req.params.id)
  if (idx === -1) return res.status(404).json({ message: 'Item not found.' })

  const { title, description, content, imageUrl, category, sourceUrl, sourceName, link } = req.body || {}
  items[idx] = {
    ...items[idx],
    ...(title && { title: title.trim() }),
    ...(description !== undefined && { description }),
    ...(content !== undefined && { content }),
    ...(imageUrl !== undefined && { imageUrl }),
    ...(category && { category }),
    ...(link && { link: link.trim() }),
    source: {
      name: sourceName?.trim() || items[idx].source?.name,
      url: sourceUrl ?? items[idx].source?.url,
    },
  }

  writeStore('custom-news', items)
  syncCustomNews()
  return res.json(items[idx])
})

router.delete('/news/:id', requireAdmin, (req, res) => {
  const items = readStore('custom-news')
  const filtered = items.filter((i) => i.id !== req.params.id)
  if (filtered.length === items.length) return res.status(404).json({ message: 'Item not found.' })

  writeStore('custom-news', filtered)
  syncCustomNews()
  return res.json({ message: 'Deleted.' })
})

// ── Contact Submissions ───────────────────────────────────────────────────────

router.get('/contacts', requireAdmin, (_req, res) => {
  const contacts = readStore('contacts')
  return res.json(contacts)
})

router.patch('/contacts/:id/read', requireAdmin, (req, res) => {
  const contacts = readStore('contacts')
  const idx = contacts.findIndex((c) => c.id === req.params.id)
  if (idx === -1) return res.status(404).json({ message: 'Not found.' })

  contacts[idx].read = true
  writeStore('contacts', contacts)
  return res.json(contacts[idx])
})

router.delete('/contacts/:id', requireAdmin, (req, res) => {
  const contacts = readStore('contacts')
  const filtered = contacts.filter((c) => c.id !== req.params.id)
  if (filtered.length === contacts.length) return res.status(404).json({ message: 'Not found.' })

  writeStore('contacts', filtered)
  return res.json({ message: 'Deleted.' })
})

export default router
