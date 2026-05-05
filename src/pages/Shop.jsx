import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useSelector } from 'react-redux'
import { selectFilters } from '../features/ui/uiSlice'
import ProductGrid from '../components/product/ProductGrid'
import ProductFilters from '../components/product/ProductFilters'
import { SlidersHorizontal, X } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setFilter } from '../features/ui/uiSlice'
import { MOCK_PRODUCTS } from '../lib/mockProducts'

const isPlaceholder = import.meta.env.VITE_CONVEX_URL?.includes('placeholder')

export default function Shop() {
  const [showFilters, setShowFilters] = useState(false)
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const filters = useSelector(selectFilters)

  // Read category from URL query param
  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) {
      const map = { hoodies: 'Hoodies', tees: 'Oversized Tees', caps: 'Caps', mousepads: 'Mousepads', stickers: 'Stickers' }
      dispatch(setFilter({ category: map[cat] || '' }))
    }
  }, [searchParams, dispatch])

  const rawProducts = useQuery(api.products.listProducts, isPlaceholder ? 'skip' : {
    category: filters.category || undefined,
    size: filters.size || undefined,
    maxPrice: filters.maxPrice ? filters.maxPrice * 100 : undefined,
    inStockOnly: filters.inStockOnly || undefined,
  })

  // In placeholder mode use mock data; otherwise use real Convex data
  const products = isPlaceholder ? MOCK_PRODUCTS : rawProducts

  // Client-side filter + sort (needed for mock data which isn't server-filtered)
  const sorted = useMemo(() => {
    if (!products) return []
    let arr = [...products]
    if (filters.category) arr = arr.filter((p) => p.category === filters.category)
    if (filters.size) arr = arr.filter((p) => p.sizes?.includes(filters.size))
    if (filters.maxPrice) arr = arr.filter((p) => p.price <= filters.maxPrice * 100)
    if (filters.inStockOnly) arr = arr.filter((p) => p.stock > 0)
    if (filters.sortBy === 'price-asc') return arr.sort((a, b) => a.price - b.price)
    if (filters.sortBy === 'price-desc') return arr.sort((a, b) => b.price - a.price)
    if (filters.sortBy === 'featured') return arr.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    return arr.sort((a, b) => b.createdAt - a.createdAt)
  }, [products, filters])

  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="container">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wide" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>
              {filters.category || 'All Products'}
            </h1>
            <p className="text-[#6b7280] text-sm mt-2">
              {sorted.length > 0 ? `${sorted.length} products` : ''}
            </p>
          </div>
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg glass text-sm font-semibold"
            style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#e8e8e8', fontFamily: 'Rajdhani, sans-serif' }}
          >
            {showFilters ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
            Filters
          </button>
        </div>

        <div className="flex gap-10">
          {/* Sidebar Filters — desktop */}
          <ProductFilters className="hidden lg:flex w-56 flex-shrink-0" />

          {/* Mobile filters drawer */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div className="absolute inset-0 bg-black/60" onClick={() => setShowFilters(false)} />
              <div className="relative z-10 w-72 h-full overflow-y-auto glass-strong p-6 border-r border-white/10">
                <ProductFilters />
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            <ProductGrid products={sorted} loading={!isPlaceholder && rawProducts === undefined} cols={3} />
          </div>
        </div>
      </div>
    </div>
  )
}
