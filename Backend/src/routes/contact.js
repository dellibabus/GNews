/**
 * Contact / Become an Advertiser form submission.
 * POST /api/contact
 */
import { Router } from 'express'
import crypto from 'crypto'
import { readStore, writeStore } from '../services/dataStore.js'

const router = Router()

router.post('/', (req, res) => {
  const { name, email, company, phone, message } = req.body || {}

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ message: 'name, email and message are required.' })
  }

  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email address.' })
  }

  const contacts = readStore('contacts')
  const entry = {
    id: crypto.randomBytes(8).toString('hex'),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    company: company?.trim() || '',
    phone: phone?.trim() || '',
    message: message.trim(),
    createdAt: new Date().toISOString(),
    read: false,
  }

  contacts.unshift(entry)
  writeStore('contacts', contacts)

  return res.status(201).json({ message: 'Thank you! We will get back to you shortly.' })
})

export default router
