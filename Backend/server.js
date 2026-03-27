/**
 * GNews Backend — Express server
 *
 * Fetches news from RSS feeds and exposes a clean REST API for the frontend.
 * All RSS feed requests use the SERVER identity (SERVER_SOURCE_NAME) —
 * this value is never exposed to the client.
 */
import express from 'express'
import cors from 'cors'
import { config } from './src/config/index.js'
import { validateClient } from './src/middleware/validateClient.js'
import newsRouter from './src/routes/news.js'
import adminRouter from './src/routes/admin.js'
import contactRouter from './src/routes/contact.js'
import { startScheduler } from './src/services/newsCache.js'

const app = express()

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || config.allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error(`CORS: Origin "${origin}" not allowed`))
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'X-Client-Source', 'Authorization'],
  }),
)

app.use(express.json())

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── API routes ────────────────────────────────────────────────────────────────
// All /api/* routes require a valid X-Client-Source header
app.use('/api/news', validateClient, newsRouter)
app.use('/api/admin', validateClient, adminRouter)
app.use('/api/contact', validateClient, contactRouter)

// ── 404 fallback ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found.' })
})

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[Error]', err.message)
  res.status(500).json({ message: 'Internal server error.' })
})

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(config.port, () => {
  console.log(`[Server] GNews backend running on http://localhost:${config.port}`)
  console.log(`[Server] Server identity: ${config.serverSourceName}`)
  startScheduler()
})
