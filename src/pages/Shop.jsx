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

  const products = isPlaceholder ? MOCK_PRODUCTS : rawProducts

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
    <div className="min-h-screen" style={{ background: '#080808' }}>

      {/* Page header */}
      <div style={{ background: '#0D0D0D', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container py-20 md:py-28">
          <div className="flex items-end justify-between">
            <div>
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: '#FF3500', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', display: 'block', marginBottom: '10px' }}>
                The Collection
              </span>
              <h1 className="uppercase font-black leading-none" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(36px, 6vw, 72px)', color: '#F0EBE3' }}>
                {filters.category || 'All Products'}
              </h1>
              {sorted.length > 0 && (
                <p className="mt-3" style={{ color: '#555', fontSize: '13px', fontFamily: 'Space Grotesk, sans-serif' }}>
                  {sorted.length} {sorted.length === 1 ? 'product' : 'products'}
                </p>
              )}
            </div>
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.12)', borderRadius: '3px', color: '#F0EBE3', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: '#111' }}
            >
              {showFilters ? <X className="w-3.5 h-3.5" /> : <SlidersHorizontal className="w-3.5 h-3.5" />}
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="container py-14 md:py-16">
        <div className="flex gap-10">
          {/* Sidebar Filters — desktop */}
          <ProductFilters className="hidden lg:flex w-56 flex-shrink-0" />

          {/* Mobile filters drawer */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div className="absolute inset-0 bg-black/70" onClick={() => setShowFilters(false)} />
              <div className="relative z-10 w-72 h-full overflow-y-auto p-6" style={{ background: '#111', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
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
