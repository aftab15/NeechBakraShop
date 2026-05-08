import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  selectCartItems, selectCartTotal,
  removeFromCart, updateQuantity, clearCart,
} from '../features/cart/cartSlice'
import QuantitySelector from '../components/product/QuantitySelector'
import { formatPrice, calculateOrderTotals } from '../lib/utils'
import { Trash2, ArrowRight } from 'lucide-react'
import EmptyState from '../components/common/EmptyState'
import toast from 'react-hot-toast'

export default function Cart() {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const subtotal = useSelector(selectCartTotal)
  const { shippingFee, tax, total } = calculateOrderTotals(subtotal)

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#080808' }}>
        <EmptyState type="cart" title="Your cart is empty"
          description="Add some merch to get started!" actionLabel="Shop Now" actionTo="/shop" />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-14 md:py-20" style={{ background: '#080808' }}>
      <div className="container">
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: '24px', marginBottom: '40px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: '#FF3500', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', display: 'block', marginBottom: '10px' }}>
            Bag
          </span>
          <h1 className="uppercase font-black leading-none" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(32px, 5vw, 56px)', color: '#F0EBE3' }}>
            Your Cart
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                className="flex gap-6 p-6"
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px' }}
              >
                <div className={`w-24 h-24 overflow-hidden flex-shrink-0 ${item.gradientClass || 'product-gradient-1'}`} style={{ borderRadius: '3px' }}>
                  {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : null}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        to={`/shop/${item.slug}`}
                        className="font-bold leading-snug line-clamp-2 transition-colors hover:text-[#FF3500]"
                        style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '16px', color: '#F0EBE3' }}
                      >
                        {item.name}
                      </Link>
                      <p style={{ fontSize: '12px', color: '#555', fontFamily: 'Space Grotesk, sans-serif', marginTop: '4px' }}>
                        Size: {item.size}
                      </p>
                      <p style={{ fontSize: '12px', color: '#666', fontFamily: 'Space Grotesk, sans-serif' }}>
                        Unit: {formatPrice(item.price)}
                      </p>
                    </div>
                    <button
                      onClick={() => { dispatch(removeFromCart({ productId: item.productId, size: item.size })); toast('Removed') }}
                      className="transition-colors p-1 flex-shrink-0"
                      style={{ color: '#444' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                      onMouseLeave={e => e.currentTarget.style.color = '#444'}
                      aria-label="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <QuantitySelector
                      value={item.quantity}
                      onChange={(qty) => dispatch(updateQuantity({ productId: item.productId, size: item.size, quantity: qty }))}
                    />
                    <span className="font-black" style={{ color: '#F0EBE3', fontFamily: 'Orbitron, monospace', fontSize: '16px' }}>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => { dispatch(clearCart()); toast('Cart cleared') }}
              className="self-start flex items-center gap-2 transition-colors"
              style={{ fontSize: '13px', color: '#444', fontFamily: 'Space Grotesk, sans-serif' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={e => e.currentTarget.style.color = '#444'}
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Cart
            </button>
          </div>

          {/* Summary */}
          <div className="sticky top-24 h-fit p-8 flex flex-col gap-5" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px' }}>
            <h2 className="font-black uppercase" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '16px', color: '#F0EBE3', letterSpacing: '0.1em' }}>
              Order Summary
            </h2>
            <div className="flex flex-col gap-2" style={{ color: '#666', fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px' }}>
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? <span style={{ color: '#FF3500' }}>FREE</span> : formatPrice(shippingFee)}</span>
              </div>
              <div className="flex justify-between"><span>GST (18%)</span><span>{formatPrice(tax)}</span></div>
              <hr style={{ borderColor: 'rgba(255,255,255,0.07)', margin: '4px 0' }} />
              <div className="flex justify-between items-center">
                <span className="font-black uppercase" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#F0EBE3', fontSize: '14px' }}>Total</span>
                <span className="font-black" style={{ color: '#F0EBE3', fontFamily: 'Orbitron, monospace', fontSize: '18px' }}>{formatPrice(total)}</span>
              </div>
            </div>
            {shippingFee > 0 && (
              <p style={{ fontSize: '12px', color: '#555', fontFamily: 'Space Grotesk, sans-serif' }}>
                Add {formatPrice(99900 - subtotal)} more for FREE shipping!
              </p>
            )}
            <Link to="/checkout" className="btn-neon justify-center gap-2">
              Checkout <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/shop" className="btn-outline-neon justify-center text-xs">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
