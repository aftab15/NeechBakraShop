import { useRef, useEffect } from 'react'
import ProductCard from './ProductCard'
import EmptyState from '../common/EmptyState'
import { scrollRevealStagger } from '../../lib/animations'

function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="skeleton" style={{ aspectRatio: '4/5' }} />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-2.5 skeleton rounded-full w-1/4" />
        <div className="h-4 skeleton rounded-full w-3/4" />
        <div className="h-3 skeleton rounded-full w-1/2" />
        <div className="flex items-center justify-between mt-2 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="h-5 skeleton rounded-full w-16" />
          <div className="w-10 h-10 skeleton rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export default function ProductGrid({ products, loading, cols = 4 }) {
  const gridRef = useRef(null)

  const colClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[cols] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

  useEffect(() => {
    if (!gridRef.current || !products?.length) return
    const cards = gridRef.current.querySelectorAll(':scope > a')
    if (cards.length) scrollRevealStagger(Array.from(cards), { y: 30, stagger: 0.07 })
  }, [products])

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
    <div ref={gridRef} className={`grid ${colClass} gap-6 md:gap-8`}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}
