import { formatPrice, calculateOrderTotals } from '../../lib/utils'
import { Truck, ShieldCheck, Tag } from 'lucide-react'

export default function CheckoutSummary({ items, subtotal }) {
  const { shippingFee, tax, total } = calculateOrderTotals(subtotal)

  return (
    <div className="glass rounded-2xl p-6 flex flex-col gap-5" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
      <h2 className="text-lg font-black uppercase tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>
        Order Summary
      </h2>

      {/* Items */}
      <ul className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
        {items.map((item) => (
          <li key={`${item.productId}-${item.size}`} className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ${item.gradientClass || 'product-gradient-1'}`}>
              {item.image
                ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold line-clamp-1" style={{ color: '#e8e8e8', fontFamily: 'Rajdhani, sans-serif' }}>{item.name}</p>
              <p className="text-[10px] text-[#6b7280]">Size: {item.size} × {item.quantity}</p>
            </div>
            <span className="text-sm font-bold flex-shrink-0" style={{ color: '#39ff14', fontFamily: 'Rajdhani, sans-serif' }}>
              {formatPrice(item.price * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <hr className="border-white/10" />

      {/* Totals */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm text-[#9ca3af]">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-[#9ca3af]">
          <span className="flex items-center gap-1">
            <Truck className="w-3 h-3" /> Shipping
          </span>
          <span>{shippingFee === 0 ? <span style={{ color: '#39ff14' }}>FREE</span> : formatPrice(shippingFee)}</span>
        </div>
        <div className="flex justify-between text-sm text-[#9ca3af]">
          <span className="flex items-center gap-1">
            <Tag className="w-3 h-3" /> GST (18%)
          </span>
          <span>{formatPrice(tax)}</span>
        </div>
        <hr className="border-white/10 my-1" />
        <div className="flex justify-between">
          <span className="text-base font-black uppercase tracking-wide" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>Total</span>
          <span className="text-2xl font-black" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#39ff14' }}>
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* Trust badges */}
      <div className="flex items-center gap-2 pt-2">
        <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: '#39ff14' }} />
        <p className="text-xs text-[#6b7280]">Secure checkout powered by Razorpay</p>
      </div>
      {shippingFee > 0 && (
        <p className="text-xs text-[#6b7280] -mt-2">
          Add {formatPrice(99900 - subtotal)} more for free shipping!
        </p>
      )}
    </div>
  )
}
