/**
 * dataStore.js — Lightweight JSON file-based persistence.
 * Each "store" is a named JSON file inside backend/data/.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, '../../data')

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })

function filePath(name) {
  return path.join(DATA_DIR, `${name}.json`)
}

export function readStore(name) {
  const file = filePath(name)
  if (!existsSync(file)) return []
  try {
    return JSON.parse(readFileSync(file, 'utf-8'))
  } catch {
    return []
  }
}

export function writeStore(name, data) {
  writeFileSync(filePath(name), JSON.stringify(data, null, 2), 'utf-8')
}
