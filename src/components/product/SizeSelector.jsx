export default function SizeSelector({ sizes = [], selected, onChange, outOfStockSizes = [] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', color: '#555', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif' }}>Select Size</p>
        {selected && (
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#FF3500', fontFamily: 'Space Grotesk, sans-serif' }}>
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
              className="relative px-4 py-2 text-sm font-bold uppercase tracking-wide transition-all"
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                borderRadius: '2px',
                minWidth: '48px',
                background: isSelected ? '#FF3500' : isOOS ? 'rgba(255,255,255,0.02)' : 'transparent',
                color: isSelected ? '#000' : isOOS ? '#333' : '#666',
                border: '1px solid',
                borderColor: isSelected ? '#FF3500' : isOOS ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.12)',
                cursor: isOOS ? 'not-allowed' : 'pointer',
              }}
              aria-label={`Size ${size}${isOOS ? ' (out of stock)' : ''}`}
              aria-pressed={isSelected}
            >
              {size}
              {isOOS && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="absolute w-full h-px rotate-45 bg-[#333]" />
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
