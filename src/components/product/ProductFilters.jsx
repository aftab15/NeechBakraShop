import { useDispatch, useSelector } from 'react-redux'
import { setFilter, resetFilters, selectFilters } from '../../features/ui/uiSlice'
import { SlidersHorizontal, RotateCcw } from 'lucide-react'

const CATEGORIES = ['All', 'Hoodies', 'Oversized Tees', 'Caps', 'Mousepads', 'Stickers']
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'ONE SIZE']

export default function ProductFilters({ className = '' }) {
  const dispatch = useDispatch()
  const filters = useSelector(selectFilters)

  const set = (key, value) => dispatch(setFilter({ [key]: value }))

  return (
    <aside className={`flex flex-col gap-7 glass rounded-2xl p-6 ${className}`} style={{ border: '1px solid rgba(255,255,255,0.07)', alignSelf: 'flex-start' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" style={{ color: '#39ff14' }} />
          <span className="text-sm font-bold uppercase tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>
            Filters
          </span>
        </div>
        <button
          onClick={() => dispatch(resetFilters())}
          className="flex items-center gap-1 text-xs text-[#6b7280] hover:text-[#39ff14] transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Category */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#6b7280] mb-3">Category</p>
        <div className="flex flex-col gap-1.5">
          {CATEGORIES.map((cat) => {
            const val = cat === 'All' ? '' : cat
            const active = filters.category === val
            return (
              <button
                key={cat}
                onClick={() => set('category', val)}
                className="text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  background: active ? 'rgba(57,255,20,0.12)' : 'rgba(255,255,255,0.03)',
                  color: active ? '#39ff14' : '#9ca3af',
                  border: active ? '1px solid rgba(57,255,20,0.35)' : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Size */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#6b7280] mb-3">Size</p>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => {
            const active = filters.size === s
            return (
              <button
                key={s}
                onClick={() => set('size', active ? '' : s)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all"
                style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  background: active ? '#39ff14' : 'rgba(255,255,255,0.05)',
                  color: active ? '#0a0a0a' : '#9ca3af',
                  border: '1px solid',
                  borderColor: active ? '#39ff14' : 'rgba(255,255,255,0.1)',
                }}
              >
                {s}
              </button>
            )
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#6b7280] mb-3">
          Max Price: ₹{filters.maxPrice}
        </p>
        <input
          type="range"
          min={0}
          max={10000}
          step={100}
          value={filters.maxPrice}
          onChange={(e) => set('maxPrice', Number(e.target.value))}
          className="w-full accent-[#39ff14]"
          aria-label="Max price filter"
        />
        <div className="flex justify-between text-[10px] text-[#6b7280] mt-1">
          <span>₹0</span><span>₹10,000</span>
        </div>
      </div>

      {/* In Stock Only */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            onClick={() => set('inStockOnly', !filters.inStockOnly)}
            className="relative w-10 h-5 rounded-full transition-all cursor-pointer"
            style={{ background: filters.inStockOnly ? '#39ff14' : 'rgba(255,255,255,0.1)' }}
          >
            <span
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
              style={{ left: filters.inStockOnly ? '22px' : '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
            />
          </div>
          <span className="text-sm font-medium" style={{ color: '#9ca3af', fontFamily: 'Rajdhani, sans-serif' }}>
            In Stock Only
          </span>
        </label>
      </div>

      {/* Sort */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#6b7280] mb-3">Sort By</p>
        <select
          value={filters.sortBy}
          onChange={(e) => set('sortBy', e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-[#e8e8e8] focus:outline-none focus:border-[#39ff14] transition-colors"
          aria-label="Sort products"
        >
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="featured">Featured</option>
        </select>
      </div>
    </aside>
  )
}
