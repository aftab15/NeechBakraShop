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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          onClick={() => dispatch(closeCart())}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className="fixed top-0 right-0 h-full w-full max-w-md z-50 flex flex-col glass-strong"
        style={{
          borderLeft: '1px solid rgba(255,255,255,0.1)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        }}
        aria-label="Shopping cart"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5" style={{ color: '#39ff14' }} />
            <span className="text-lg font-black uppercase tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Your Cart
            </span>
            {items.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: '#39ff14', color: '#0a0a0a' }}>
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={() => dispatch(closeCart())}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-[#6b7280] hover:text-[#e8e8e8]"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-6">
          {items.length === 0 ? (
            <EmptyState
              type="cart"
              title="Cart is empty"
              description="Add some merch to your cart!"
              actionLabel="Shop Now"
              actionTo="/shop"
            />
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li key={`${item.productId}-${item.size}`}
                  className="flex gap-4 p-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {/* Image */}
                  <div className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 ${item.gradientClass || 'product-gradient-1'}`}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-lg font-black opacity-20" style={{ fontFamily: 'Orbitron, monospace', color: '#39ff14' }}>NB</span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/shop/${item.slug}`}
                      onClick={() => dispatch(closeCart())}
                      className="text-sm font-bold leading-tight line-clamp-2 hover:text-[#39ff14] transition-colors"
                      style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1" style={{ fontSize: '11px', color: '#6b7280', fontFamily: 'Space Grotesk, sans-serif' }}>Size: {item.size}</p>
                    <div className="flex items-center justify-between mt-2">
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(qty) => dispatch(updateQuantity({ productId: item.productId, size: item.size, quantity: qty }))}
                        min={1}
                        max={10}
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black" style={{ color: '#39ff14', fontFamily: 'Rajdhani, sans-serif' }}>
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => dispatch(removeFromCart({ productId: item.productId, size: item.size }))}
                          className="p-1.5 rounded text-[#6b7280] hover:text-red-400 transition-colors"
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
          <div className="px-6 py-5 border-t border-white/10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span style={{ fontSize: '13px', color: '#6b7280', fontFamily: 'Space Grotesk, sans-serif' }}>Subtotal</span>
              <span className="text-xl font-black" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#39ff14' }}>
                {formatPrice(total)}
              </span>
            </div>
            <p className="-mt-2" style={{ fontSize: '11px', color: '#4b5563', fontFamily: 'Space Grotesk, sans-serif' }}>Shipping & taxes calculated at checkout</p>
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
