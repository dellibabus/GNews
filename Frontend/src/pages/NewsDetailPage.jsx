import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Clock } from 'lucide-react'
import { useSEO } from '@/hooks/useSEO'
import { getNewsById } from '@/services/newsService'
import { formatDate, stripHtml } from '@/utils/formatters'
import Loader from '@/components/Loader'
import ErrorState from '@/components/ErrorState'
import AdSlot from '@/components/AdSlot'
import { APP_NAME } from '@/constants'

export default function NewsDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getNewsById(id)
      .then((data) => {
        if (!cancelled) setItem(data)
      })
      .catch((err) => {
        if (!cancelled)
          setError(err?.response?.data?.message || 'Could not load this article.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  useSEO({
    title: item?.title,
    description: item?.description ? stripHtml(item.description).slice(0, 155) : undefined,
    image: item?.imageUrl,
  })

  if (loading) return <Loader label="Loading article…" />
  if (error)
    return <ErrorState message={error} onRetry={() => navigate(0)} />

  const { title, content, description, imageUrl, category, source, publishedAt, link } = item

  const bodyText = content || description || ''

  return (
    <article className="max-w-3xl mx-auto">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 mb-6 transition-colors"
      >
        <ArrowLeft size={15} /> Back to headlines
      </Link>

      {/* Category */}
      {category && (
        <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize mb-3">
          {category}
        </span>
      )}

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-4">
        {title}
      </h1>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3 mb-6 text-sm text-gray-500">
        {source?.name && (
          <span className="font-medium text-gray-700">
            Source:{' '}
            {source.url ? (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:underline"
              >
                {source.name}
              </a>
            ) : (
              source.name
            )}
          </span>
        )}
        {publishedAt && (
          <time className="flex items-center gap-1" dateTime={publishedAt}>
            <Clock size={13} /> {formatDate(publishedAt)}
          </time>
        )}
      </div>

      {/* Hero image */}
      {imageUrl && (
        <figure className="mb-6 rounded-xl overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full max-h-96 object-cover"
          />
        </figure>
      )}

      {/* Top sidebar ad (shown inline on mobile) */}
      <div className="mb-6">
        <AdSlot variant="in-feed" />
      </div>

      {/* Article body */}
      <div
        className="prose prose-gray prose-sm sm:prose max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: bodyText }}
      />

      {/* Attribution – mandatory for RSS content */}
      <aside className="mt-10 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
        <p>
          <strong>Attribution:</strong> This content is sourced from{' '}
          <strong>{source?.name || 'the original publisher'}</strong>. It is aggregated
          via RSS and displayed here for informational purposes only. {APP_NAME} does not
          claim ownership of this content.
        </p>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 font-semibold text-amber-900 hover:underline"
          >
            Read the original article <ExternalLink size={13} />
          </a>
        )}
      </aside>

      {/* Bottom ad */}
      <div className="mt-8">
        <AdSlot variant="banner" />
      </div>
    </article>
  )
}
