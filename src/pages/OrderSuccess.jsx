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
    <div className="min-h-screen py-16 md:py-24" style={{ background: '#080808' }}>
      <div className="container max-w-2xl mx-auto">
        <div className="p-10 md:p-16 text-center" style={{ background: '#111', border: '1px solid rgba(255,53,0,0.25)', borderRadius: '4px' }}>
          <div className="w-16 h-16 mx-auto flex items-center justify-center mb-6" style={{ background: 'rgba(255,53,0,0.08)', border: '1px solid rgba(255,53,0,0.25)', borderRadius: '4px' }}>
            <CheckCircle2 className="w-8 h-8" style={{ color: '#FF3500' }} />
          </div>

          <h1
            className="uppercase font-black leading-none mb-3"
            style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(32px, 5vw, 52px)', color: '#F0EBE3' }}
          >
            Order Confirmed
          </h1>
          <p className="mb-8" style={{ color: '#666', fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', lineHeight: 1.7 }}>
            Thank you for your purchase. Your order is being processed and you'll receive an email confirmation shortly.
          </p>

          {order && (
            <div className="p-6 text-left mb-8" style={{ background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px' }}>
              <div className="flex items-center justify-between mb-4 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', color: '#555', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '4px' }}>Order ID</p>
                  <p style={{ fontSize: '13px', fontFamily: 'Space Grotesk, sans-serif', color: '#FF3500', fontWeight: 600 }}>{order._id.slice(-12).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', color: '#555', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '4px' }}>Date</p>
                  <p style={{ fontSize: '13px', color: '#F0EBE3', fontFamily: 'Space Grotesk, sans-serif' }}>{formatDate(order.createdAt)}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 overflow-hidden flex-shrink-0 product-gradient-1" style={{ borderRadius: '3px' }}>
                      {item.image && <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold line-clamp-1" style={{ color: '#F0EBE3', fontFamily: 'Rajdhani, sans-serif', fontSize: '14px' }}>
                        {item.productName}
                      </p>
                      <p style={{ fontSize: '11px', color: '#555', fontFamily: 'Space Grotesk, sans-serif' }}>Size: {item.size} · Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold" style={{ fontSize: '13px', color: '#F0EBE3', fontFamily: 'Rajdhani, sans-serif' }}>{formatPrice(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <span className="font-black uppercase" style={{ fontSize: '13px', color: '#F0EBE3', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.08em' }}>
                  Total Paid
                </span>
                <span className="font-black" style={{ color: '#F0EBE3', fontFamily: 'Orbitron, monospace', fontSize: '20px' }}>
                  {formatPrice(order.total)}
                </span>
              </div>

              <div className="mt-6 pt-4 flex items-start gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <Truck className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#FF3500' }} />
                <div>
                  <p className="font-bold" style={{ fontSize: '13px', color: '#F0EBE3', fontFamily: 'Rajdhani, sans-serif' }}>
                    Shipping to:
                  </p>
                  <p style={{ fontSize: '12px', color: '#666', fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.6, marginTop: '4px' }}>
                    {order.shippingAddress.fullName}, {order.shippingAddress.addressLine1}
                    {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                    , {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/orders" className="btn-neon gap-2">
              <Package className="w-4 h-4" /> View My Orders
            </Link>
            <Link to="/shop" className="btn-outline-neon gap-2">
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
