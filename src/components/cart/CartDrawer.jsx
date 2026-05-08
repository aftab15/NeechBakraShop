import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { X, ShoppingBag, Trash2 } from 'lucide-react'
import {
  selectCartItems, selectCartTotal, selectCartIsOpen,
  closeCart, removeFromCart, updateQuantity,
} from '../../features/cart/cartSlice'
import { formatPrice } from '../../lib/utils'
import QuantitySelector from '../product/QuantitySelector'
import EmptyState from '../common/EmptyState'

export default function CartDrawer() {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const total = useSelector(selectCartTotal)
  const isOpen = useSelector(selectCartIsOpen)

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-50"
          onClick={() => dispatch(closeCart())}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className="fixed top-0 right-0 h-full w-full max-w-md z-50 flex flex-col"
        style={{
          background: '#111',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        }}
        aria-label="Shopping cart"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-4 h-4" style={{ color: '#FF3500' }} />
            <span className="font-black uppercase tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '16px', color: '#F0EBE3' }}>
              Your Cart
            </span>
            {items.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold" style={{ background: '#FF3500', color: '#000', borderRadius: '2px', fontFamily: 'Space Grotesk, sans-serif' }}>
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={() => dispatch(closeCart())}
            className="p-2 transition-colors"
            style={{ color: '#555', borderRadius: '3px' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#F0EBE3'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.background = 'transparent' }}
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-6 px-7">
          {items.length === 0 ? (
            <EmptyState
              type="cart"
              title="Cart is empty"
              description="Add some merch to your cart!"
              actionLabel="Shop Now"
              actionTo="/shop"
            />
          ) : (
            <ul className="flex flex-col gap-3">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.size}`}
                  className="flex gap-5 p-5"
                  style={{ background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px' }}
                >
                  {/* Image */}
                  <div
                    className={`w-20 h-20 overflow-hidden flex-shrink-0 ${item.gradientClass || 'product-gradient-1'}`}
                    style={{ borderRadius: '3px' }}
                  >
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-lg font-black" style={{ fontFamily: 'Orbitron, monospace', color: 'rgba(255,255,255,0.08)' }}>NB</span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/shop/${item.slug}`}
                      onClick={() => dispatch(closeCart())}
                      className="text-sm font-bold leading-tight line-clamp-2 transition-colors hover:text-[#FF3500]"
                      style={{ fontFamily: 'Rajdhani, sans-serif', color: '#F0EBE3', display: 'block' }}
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1" style={{ fontSize: '11px', color: '#555', fontFamily: 'Space Grotesk, sans-serif' }}>
                      Size: {item.size}
                    </p>
                    <div className="flex items-center justify-between mt-2.5">
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(qty) => dispatch(updateQuantity({ productId: item.productId, size: item.size, quantity: qty }))}
                        min={1}
                        max={10}
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black" style={{ color: '#F0EBE3', fontFamily: 'Rajdhani, sans-serif' }}>
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => dispatch(removeFromCart({ productId: item.productId, size: item.size }))}
                          className="p-1.5 transition-colors"
                          style={{ color: '#444', borderRadius: '2px' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                          onMouseLeave={e => e.currentTarget.style.color = '#444'}
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-7 py-6 flex flex-col gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: '13px', color: '#666', fontFamily: 'Space Grotesk, sans-serif' }}>Subtotal</span>
              <span className="font-black" style={{ fontFamily: 'Orbitron, monospace', fontSize: '20px', color: '#F0EBE3' }}>
                {formatPrice(total)}
              </span>
            </div>
            <p style={{ fontSize: '11px', color: '#444', fontFamily: 'Space Grotesk, sans-serif', marginTop: '-8px' }}>
              Shipping & taxes calculated at checkout
            </p>
            <Link
              to="/checkout"
              onClick={() => dispatch(closeCart())}
              className="btn-neon justify-center text-center"
            >
              Checkout
            </Link>
            <Link
              to="/shop"
              onClick={() => dispatch(closeCart())}
              className="btn-outline-neon justify-center text-center text-xs"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </aside>
    </>
  )
}
