import { Link } from 'react-router-dom'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { ChevronRight } from 'lucide-react'
import { formatPrice, formatDate, getStatusColor, getPaymentStatusColor } from '../lib/utils'
import { PageLoader } from '../components/common/LoadingSpinner'
import EmptyState from '../components/common/EmptyState'

export default function Orders() {
  const orders = useQuery(api.orders.getUserOrders)

  if (orders === undefined) return <PageLoader />

  return (
    <div className="min-h-screen py-14 md:py-20" style={{ background: '#080808' }}>
      <div className="container max-w-5xl mx-auto">
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: '24px', marginBottom: '40px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: '#FF3500', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', display: 'block', marginBottom: '10px' }}>
            Account
          </span>
          <h1 className="uppercase font-black leading-none" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(32px, 5vw, 56px)', color: '#F0EBE3' }}>
            My Orders
          </h1>
          <p className="mt-2" style={{ color: '#555', fontSize: '13px', fontFamily: 'Space Grotesk, sans-serif' }}>
            {orders.length === 0 ? 'No orders yet' : `${orders.length} order${orders.length === 1 ? '' : 's'}`}
          </p>
        </div>

        {orders.length === 0 ? (
          <EmptyState
            type="orders"
            title="No orders yet"
            description="Start shopping and your orders will appear here."
            actionLabel="Browse Shop"
            actionTo="/shop"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <div
                key={order._id}
                className="p-7 md:p-8"
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px' }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-4 mb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <div>
                    <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', color: '#555', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '4px' }}>Order ID</p>
                    <p style={{ fontSize: '13px', fontFamily: 'Space Grotesk, sans-serif', color: '#FF3500', fontWeight: 600 }}>
                      {order._id.slice(-12).toUpperCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div>
                      <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', color: '#555', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '4px' }}>Date</p>
                      <p style={{ fontSize: '13px', color: '#F0EBE3', fontFamily: 'Space Grotesk, sans-serif' }}>{formatDate(order.createdAt)}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', color: '#555', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '4px' }}>Status</p>
                      <p className={`text-sm font-bold uppercase ${getStatusColor(order.status)}`} style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                        {order.status}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', color: '#555', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '4px' }}>Payment</p>
                      <p className={`text-sm font-bold uppercase ${getPaymentStatusColor(order.paymentStatus)}`} style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                        {order.paymentStatus}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 4).map((item, i) => (
                      <div key={i} className="w-12 h-12 overflow-hidden product-gradient-1" style={{ borderRadius: '3px', border: '2px solid #0D0D0D' }}>
                        {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="w-12 h-12 flex items-center justify-center" style={{ borderRadius: '3px', border: '2px solid #0D0D0D', background: '#222', fontSize: '11px', fontWeight: 700, color: '#666' }}>
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold line-clamp-1" style={{ color: '#F0EBE3', fontFamily: 'Rajdhani, sans-serif', fontSize: '15px' }}>
                      {order.items.map((i) => i.productName).join(', ')}
                    </p>
                    <p style={{ fontSize: '12px', color: '#555', fontFamily: 'Space Grotesk, sans-serif' }}>
                      {order.items.reduce((s, i) => s + i.quantity, 0)} item(s)
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', color: '#555', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '4px' }}>Total</p>
                      <p className="font-black" style={{ color: '#F0EBE3', fontFamily: 'Orbitron, monospace', fontSize: '16px' }}>
                        {formatPrice(order.total)}
                      </p>
                    </div>
                    <Link
                      to={`/order/${order._id}`}
                      className="p-2 transition-colors"
                      style={{ color: '#555', borderRadius: '3px' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#F0EBE3'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.background = 'transparent' }}
                      aria-label="View details"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
