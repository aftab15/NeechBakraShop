import ProductCard from './ProductCard'
import LoadingSpinner from '../common/LoadingSpinner'
import EmptyState from '../common/EmptyState'

function SkeletonCard() {
  return (
    <div className="flex flex-col glass rounded-2xl overflow-hidden animate-pulse" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="aspect-square bg-white/5" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 bg-white/5 rounded w-1/3" />
        <div className="h-4 bg-white/5 rounded w-2/3" />
        <div className="h-3 bg-white/5 rounded w-1/2 mt-auto" />
      </div>
    </div>
  )
}

export default function ProductGrid({ products, loading, cols = 4 }) {
  const colClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[cols] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

  if (loading) {
    return (
      <div className={`grid ${colClass} gap-6 md:gap-8`}>
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (!products?.length) {
    return (
      <EmptyState
        type="products"
        title="No products found"
        description="Try adjusting your filters or check back later for new drops."
        actionLabel="Clear Filters"
      />
    )
  }

  return (
    <div className={`grid ${colClass} gap-6 md:gap-8`}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}
