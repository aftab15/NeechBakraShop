import { Minus, Plus } from 'lucide-react'

export default function QuantitySelector({ value, onChange, min = 1, max = 10 }) {
  return (
    <div className="flex items-center gap-0 rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-10 h-10 flex items-center justify-center transition-all hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4 text-[#e8e8e8]" />
      </button>
      <span
        className="w-12 text-center font-bold text-[#e8e8e8]"
        style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '16px' }}
        aria-live="polite"
        aria-label={`Quantity: ${value}`}
      >
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-10 h-10 flex items-center justify-center transition-all hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4 text-[#e8e8e8]" />
      </button>
    </div>
  )
}
