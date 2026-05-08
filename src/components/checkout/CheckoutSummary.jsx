import { formatPrice, calculateOrderTotals } from '../../lib/utils'
import { Truck, ShieldCheck, Tag } from 'lucide-react'

export default function CheckoutSummary({ items, subtotal }) {
  const { shippingFee, tax, total } = calculateOrderTotals(subtotal)

  return (
    <div className="flex flex-col gap-5 p-6" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px' }}>
      <h2 className="font-black uppercase tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '16px', color: '#F0EBE3' }}>
        Order Summary
      </h2>

      {/* Items */}
      <ul className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
        {items.map((item) => (
          <li key={`${item.productId}-${item.size}`} className="flex items-center gap-3">
            <div className={`w-12 h-12 overflow-hidden flex-shrink-0 ${item.gradientClass || 'product-gradient-1'}`} style={{ borderRadius: '3px' }}>
              {item.image
                ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold line-clamp-1" style={{ color: '#F0EBE3', fontFamily: 'Rajdhani, sans-serif' }}>{item.name}</p>
              <p style={{ fontSize: '10px', color: '#555', fontFamily: 'Space Grotesk, sans-serif' }}>Size: {item.size} × {item.quantity}</p>
            </div>
            <span className="text-sm font-bold flex-shrink-0" style={{ color: '#F0EBE3', fontFamily: 'Rajdhani, sans-serif' }}>
              {formatPrice(item.price * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <hr style={{ borderColor: 'rgba(255,255,255,0.07)' }} />

      {/* Totals */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm" style={{ color: '#666', fontFamily: 'Space Grotesk, sans-serif' }}>
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm" style={{ color: '#666', fontFamily: 'Space Grotesk, sans-serif' }}>
          <span className="flex items-center gap-1">
            <Truck className="w-3 h-3" /> Shipping
          </span>
          <span>{shippingFee === 0 ? <span style={{ color: '#FF3500' }}>FREE</span> : formatPrice(shippingFee)}</span>
        </div>
        <div className="flex justify-between text-sm" style={{ color: '#666', fontFamily: 'Space Grotesk, sans-serif' }}>
          <span className="flex items-center gap-1">
            <Tag className="w-3 h-3" /> GST (18%)
          </span>
          <span>{formatPrice(tax)}</span>
        </div>
        <hr style={{ borderColor: 'rgba(255,255,255,0.07)', margin: '4px 0' }} />
        <div className="flex justify-between items-center">
          <span className="font-black uppercase tracking-wide" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '15px', color: '#F0EBE3' }}>Total</span>
          <span className="font-black" style={{ fontFamily: 'Orbitron, monospace', fontSize: '20px', color: '#F0EBE3' }}>
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* Trust badge */}
      <div className="flex items-center gap-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: '#FF3500' }} />
        <p style={{ fontSize: '12px', color: '#555', fontFamily: 'Space Grotesk, sans-serif' }}>Secure checkout powered by Razorpay</p>
      </div>
      {shippingFee > 0 && (
        <p style={{ fontSize: '12px', color: '#555', fontFamily: 'Space Grotesk, sans-serif', marginTop: '-12px' }}>
          Add {formatPrice(99900 - subtotal)} more for free shipping!
        </p>
      )}
    </div>
  )
}
