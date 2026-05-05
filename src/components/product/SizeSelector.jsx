export default function SizeSelector({ sizes = [], selected, onChange, outOfStockSizes = [] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#6b7280]">Select Size</p>
        {selected && (
          <span className="text-sm font-bold" style={{ color: '#39ff14', fontFamily: 'Rajdhani, sans-serif' }}>
            {selected}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isOOS = outOfStockSizes.includes(size)
          const isSelected = selected === size
          return (
            <button
              key={size}
              onClick={() => !isOOS && onChange(size)}
              disabled={isOOS}
              className="relative px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition-all"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                minWidth: '52px',
                background: isSelected ? '#39ff14' : isOOS ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                color: isSelected ? '#0a0a0a' : isOOS ? '#374151' : '#9ca3af',
                border: '1px solid',
                borderColor: isSelected ? '#39ff14' : isOOS ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
                cursor: isOOS ? 'not-allowed' : 'pointer',
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                boxShadow: isSelected ? '0 0 12px rgba(57,255,20,0.4)' : 'none',
              }}
              aria-label={`Size ${size}${isOOS ? ' (out of stock)' : ''}`}
              aria-pressed={isSelected}
            >
              {size}
              {isOOS && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="absolute w-full h-px rotate-45 bg-[#374151]" />
                </span>
              )}
            </button>
          )
        })}
      </div>
      {!selected && (
        <p className="text-xs text-red-400 mt-2">Please select a size</p>
      )}
    </div>
  )
}
