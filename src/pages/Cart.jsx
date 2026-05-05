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
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState type="cart" title="Your cart is empty"
          description="Add some merch to get started!" actionLabel="Shop Now" actionTo="/shop" />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-10">
      <div className="container">
        <h1 className="text-5xl font-black uppercase mb-8"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>Your Cart</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}`}
                className="glass rounded-2xl p-5 flex gap-5"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className={`w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 ${item.gradientClass || 'product-gradient-1'}`}>
                  {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : null}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link to={`/shop/${item.slug}`}
                        className="text-lg font-bold hover:text-[#39ff14] transition-colors line-clamp-2"
                        style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>{item.name}</Link>
                      <p className="text-sm text-[#6b7280]">Size: {item.size}</p>
                      <p className="text-sm text-[#6b7280]">Unit: <span style={{ color: '#39ff14' }}>{formatPrice(item.price)}</span></p>
                    </div>
                    <button onClick={() => { dispatch(removeFromCart({ productId: item.productId, size: item.size })); toast('Removed') }}
                      className="text-[#6b7280] hover:text-red-400 transition-colors p-1" aria-label="Remove">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <QuantitySelector value={item.quantity}
                      onChange={(qty) => dispatch(updateQuantity({ productId: item.productId, size: item.size, quantity: qty }))} />
                    <span className="text-xl font-black" style={{ color: '#39ff14', fontFamily: 'Rajdhani, sans-serif' }}>
                      {formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => { dispatch(clearCart()); toast('Cart cleared') }}
              className="self-start text-sm text-[#6b7280] hover:text-red-400 transition-colors flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Clear Cart
            </button>
          </div>
          <div className="glass rounded-2xl p-6 sticky top-24 h-fit" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 className="text-xl font-black uppercase mb-6" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>Order Summary</h2>
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex justify-between text-sm text-[#9ca3af]"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-sm text-[#9ca3af]"><span>Shipping</span>
                <span>{shippingFee === 0 ? <span className="text-[#39ff14]">FREE</span> : formatPrice(shippingFee)}</span></div>
              <div className="flex justify-between text-sm text-[#9ca3af]"><span>GST (18%)</span><span>{formatPrice(tax)}</span></div>
              <hr className="border-white/10" />
              <div className="flex justify-between">
                <span className="font-black uppercase" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>Total</span>
                <span className="text-2xl font-black" style={{ color: '#39ff14', fontFamily: 'Rajdhani, sans-serif' }}>{formatPrice(total)}</span>
              </div>
            </div>
            {shippingFee > 0 && <p className="text-xs text-[#6b7280] mb-4">Add {formatPrice(99900 - subtotal)} more for FREE shipping!</p>}
            <Link to="/checkout" className="btn-neon w-full justify-center gap-2">Checkout <ArrowRight className="w-4 h-4" /></Link>
            <Link to="/shop" className="btn-outline-neon w-full justify-center mt-3 text-xs">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
