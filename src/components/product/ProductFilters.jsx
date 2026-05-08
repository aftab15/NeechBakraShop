import { useDispatch, useSelector } from 'react-redux'
import { setFilter, resetFilters, selectFilters } from '../../features/ui/uiSlice'
import { SlidersHorizontal, RotateCcw } from 'lucide-react'

const CATEGORIES = ['All', 'Hoodies', 'Oversized Tees', 'Caps', 'Mousepads', 'Stickers']
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'ONE SIZE']

const LABEL = { fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', color: '#555', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '12px', display: 'block' }

export default function ProductFilters({ className = '' }) {
  const dispatch = useDispatch()
  const filters = useSelector(selectFilters)
  const set = (key, value) => dispatch(setFilter({ [key]: value }))

  return (
    <aside
      className={`flex flex-col gap-7 ${className}`}
      style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', padding: '32px', alignSelf: 'flex-start' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5" style={{ color: '#FF3500' }} />
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', color: '#F0EBE3', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif' }}>
            Filters
          </span>
        </div>
        <button
          onClick={() => dispatch(resetFilters())}
          className="flex items-center gap-1 transition-colors hover:text-[#F0EBE3]"
          style={{ fontSize: '11px', color: '#555', fontFamily: 'Space Grotesk, sans-serif' }}
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Category */}
      <div>
        <span style={LABEL}>Category</span>
        <div className="flex flex-col gap-1">
          {CATEGORIES.map((cat) => {
            const val = cat === 'All' ? '' : cat
            const active = filters.category === val
            return (
              <button
                key={cat}
                onClick={() => set('category', val)}
                className="text-left px-3 py-2 transition-all text-sm font-medium"
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '13px',
                  borderRadius: '3px',
                  background: active ? 'rgba(255,53,0,0.1)' : 'transparent',
                  color: active ? '#FF3500' : '#888',
                  border: active ? '1px solid rgba(255,53,0,0.25)' : '1px solid transparent',
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
        <span style={LABEL}>Size</span>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => {
            const active = filters.size === s
            return (
              <button
                key={s}
                onClick={() => set('size', active ? '' : s)}
                className="px-3.5 py-2 text-[11px] font-bold uppercase tracking-wide transition-all"
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  borderRadius: '2px',
                  background: active ? '#FF3500' : 'transparent',
                  color: active ? '#000' : '#666',
                  border: `1px solid ${active ? '#FF3500' : 'rgba(255,255,255,0.1)'}`,
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
        <span style={LABEL}>Max Price: ₹{filters.maxPrice?.toLocaleString()}</span>
        <input
          type="range"
          min={0}
          max={10000}
          step={100}
          value={filters.maxPrice}
          onChange={(e) => set('maxPrice', Number(e.target.value))}
          className="w-full"
          style={{ accentColor: '#FF3500' }}
          aria-label="Max price filter"
        />
        <div className="flex justify-between mt-1" style={{ fontSize: '10px', color: '#444', fontFamily: 'Space Grotesk, sans-serif' }}>
          <span>₹0</span><span>₹10,000</span>
        </div>
      </div>

      {/* In Stock Only */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => set('inStockOnly', !filters.inStockOnly)}
            className="relative w-9 h-5 rounded-full transition-all cursor-pointer flex-shrink-0"
            style={{ background: filters.inStockOnly ? '#FF3500' : 'rgba(255,255,255,0.1)' }}
          >
            <span
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
              style={{ left: filters.inStockOnly ? '19px' : '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
            />
          </div>
          <span style={{ fontSize: '13px', fontFamily: 'Space Grotesk, sans-serif', color: '#888' }}>In Stock Only</span>
        </label>
      </div>

      {/* Sort */}
      <div>
        <span style={LABEL}>Sort By</span>
        <select
          value={filters.sortBy}
          onChange={(e) => set('sortBy', e.target.value)}
          className="w-full px-3 py-2 transition-colors focus:outline-none"
          style={{
            background: '#0D0D0D',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '3px',
            color: '#F0EBE3',
            fontSize: '13px',
            fontFamily: 'Space Grotesk, sans-serif',
          }}
          aria-label="Sort products"
          onFocus={e => e.target.style.borderColor = '#FF3500'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
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
