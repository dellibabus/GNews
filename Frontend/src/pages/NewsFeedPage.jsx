import { useSEO } from '@/hooks/useSEO'
import { useNews } from '@/hooks/useNews'
import NewsList from '@/components/NewsList'
import CategoryTabs from '@/components/CategoryTabs'
import Pagination from '@/components/Pagination'
import AdSlot from '@/components/AdSlot'
import { APP_NAME } from '@/constants'

export default function NewsFeedPage() {
  useSEO({
    title: 'Latest News',
    description: `Stay up to date with the latest headlines on ${APP_NAME}.`,
  })

  const { items, page, totalPages, loading, error, goToPage } = useNews('all')

  return (
    <div>
      {/* Hero heading */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Top Stories</h1>
        <p className="text-sm text-gray-500 mt-1">
          Aggregated from trusted RSS sources — click any story to read the original.
        </p>
      </div>

      {/* Category tabs */}
      <div className="mb-5">
        <CategoryTabs activeCategory="all" />
      </div>

      {/* News grid */}
      <NewsList
        items={items}
        loading={loading}
        error={error}
        onRetry={() => goToPage(page)}
      />

      {/* Pagination */}
      <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />

      {/* Bottom banner ad */}
      <div className="mt-10">
        <AdSlot variant="banner" />
      </div>
    </div>
  )
}
