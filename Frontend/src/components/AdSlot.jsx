/**
 * AdSlot – placeholder for ad placements.
 * Replace the inner content with your actual ad network tags.
 *
 * Variants: 'banner' | 'in-feed' | 'sidebar'
 */
export default function AdSlot({ variant = 'banner', className = '' }) {
  const sizes = {
    banner: 'h-20 sm:h-24',
    'in-feed': 'h-32 sm:h-40',
    sidebar: 'h-60 sm:h-80',
  }

  return (
    <div
      className={`w-full flex items-center justify-center bg-gray-100 border border-dashed border-gray-300 rounded-lg text-gray-400 text-xs font-medium ${sizes[variant]} ${className}`}
      aria-label="Advertisement"
      role="complementary"
    >
      Advertisement
    </div>
  )
}
