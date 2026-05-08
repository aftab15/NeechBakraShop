import { Link, useSearchParams, useParams } from 'react-router-dom'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { CheckCircle2, Package, ArrowRight, Truck } from 'lucide-react'
import { formatPrice, formatDate } from '../lib/utils'
import { PageLoader } from '../components/common/LoadingSpinner'

export default function OrderSuccess() {
  const [searchParams] = useSearchParams()
  const params = useParams()
  const orderId = searchParams.get('orderId') || params.orderId

  const order = useQuery(api.orders.getOrderById, orderId ? { orderId } : 'skip')

  if (orderId && order === undefined) return <PageLoader />

  // No orderId in URL, or query returned null (not found / not yours).
  if (!orderId || order === null) {
    return (
      <div className="min-h-screen py-12">
        <div className="container max-w-2xl mx-auto">
          <div className="glass-strong rounded-3xl p-8 md:p-12 text-center" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <h1
              className="text-3xl md:text-4xl font-black uppercase mb-3"
              style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}
            >
              Order Not Found
            </h1>
            <p className="text-[#9ca3af] mb-6">
              We couldn't find that order, or you don't have access to it.
            </p>
            <Link to="/orders" className="btn-neon">
              <Package className="w-4 h-4" /> View My Orders
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-2xl mx-auto">
        <div className="glass-strong rounded-3xl p-8 md:p-12 text-center" style={{ border: '1px solid rgba(57,255,20,0.3)' }}>
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(57,255,20,0.1)', border: '1px solid rgba(57,255,20,0.4)' }}>
            <CheckCircle2 className="w-10 h-10" style={{ color: '#39ff14' }} />
          </div>

          <h1
            className="text-4xl md:text-5xl font-black uppercase mb-3"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}
          >
            Order Confirmed!
          </h1>
          <p className="text-[#9ca3af] mb-8">
            Thank you for your purchase. Your order is being processed and you'll receive an email confirmation shortly.
          </p>

          {order && (
            <div className="glass rounded-2xl p-6 text-left mb-8">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                <div>
                  <p className="text-xs text-[#6b7280] uppercase tracking-widest">Order ID</p>
                  <p className="text-sm font-mono text-[#39ff14]">{order._id.slice(-12).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#6b7280] uppercase tracking-widest">Date</p>
                  <p className="text-sm text-[#e8e8e8]">{formatDate(order.createdAt)}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 product-gradient-1">
                      {item.image && <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold line-clamp-1" style={{ color: '#e8e8e8', fontFamily: 'Rajdhani, sans-serif' }}>
                        {item.productName}
                      </p>
                      <p className="text-xs text-[#6b7280]">Size: {item.size} · Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold" style={{ color: '#39ff14' }}>{formatPrice(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4 border-t border-white/10">
                <span className="text-sm font-bold uppercase tracking-wide" style={{ color: '#e8e8e8', fontFamily: 'Rajdhani, sans-serif' }}>
                  Total Paid
                </span>
                <span className="text-2xl font-black" style={{ color: '#39ff14', fontFamily: 'Rajdhani, sans-serif' }}>
                  {formatPrice(order.total)}
                </span>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-start gap-3">
                <Truck className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#39ff14' }} />
                <div>
                  <p className="text-sm font-bold text-[#e8e8e8]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    Shipping to:
                  </p>
                  <p className="text-xs text-[#9ca3af] leading-relaxed mt-1">
                    {order.shippingAddress.fullName}, {order.shippingAddress.addressLine1}
                    {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                    , {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/orders" className="btn-neon">
              <Package className="w-4 h-4" /> View My Orders
            </Link>
            <Link to="/shop" className="btn-outline-neon">
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
