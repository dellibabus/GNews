import { useEffect } from 'react'
import { APP_NAME } from '@/constants'

/**
 * Sets document title and key meta tags for SEO.
 * @param {{ title?: string, description?: string, image?: string, url?: string }} options
 */
export function useSEO({ title, description, image, url } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${APP_NAME}` : `${APP_NAME} – Latest News & Headlines`
    document.title = fullTitle

    setMeta('description', description || `${APP_NAME} – Stay informed with the latest news.`)

    // Open Graph
    setOgMeta('og:title', fullTitle)
    setOgMeta('og:description', description || '')
    setOgMeta('og:url', url || window.location.href)
    if (image) setOgMeta('og:image', image)
  }, [title, description, image, url])
}

function setMeta(name, content) {
  let tag = document.querySelector(`meta[name="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setOgMeta(property, content) {
  let tag = document.querySelector(`meta[property="${property}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('property', property)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}
