import { Link } from 'react-router-dom'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Package, ChevronRight, Eye } from 'lucide-react'
import { formatPrice, formatDate, getStatusColor, getPaymentStatusColor } from '../lib/utils'
import { PageLoader } from '../components/common/LoadingSpinner'
import EmptyState from '../components/common/EmptyState'

export default function Orders() {
  const orders = useQuery(api.orders.getUserOrders)

  if (orders === undefined) return <PageLoader />

  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black uppercase mb-2" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>
          My Orders
        </h1>
        <p className="text-[#6b7280] mb-8">
          {orders.length === 0 ? 'No orders yet' : `${orders.length} order${orders.length === 1 ? '' : 's'}`}
        </p>

        {orders.length === 0 ? (
          <EmptyState
            type="orders"
            title="No orders yet"
            description="Start shopping and your orders will appear here."
            actionLabel="Browse Shop"
            actionTo="/shop"
          />
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="glass rounded-2xl p-5 md:p-6"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-4 mb-4 border-b border-white/10">
                  <div>
                    <p className="text-xs text-[#6b7280] uppercase tracking-widest">Order ID</p>
                    <p className="text-sm font-mono text-[#39ff14]">{order._id.slice(-12).toUpperCase()}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs text-[#6b7280] uppercase tracking-widest">Date</p>
                      <p className="text-sm text-[#e8e8e8]">{formatDate(order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6b7280] uppercase tracking-widest">Status</p>
                      <p className={`text-sm font-bold uppercase ${getStatusColor(order.status)}`} style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                        {order.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6b7280] uppercase tracking-widest">Payment</p>
                      <p className={`text-sm font-bold uppercase ${getPaymentStatusColor(order.paymentStatus)}`} style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                        {order.paymentStatus}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 4).map((item, i) => (
                      <div key={i} className="w-12 h-12 rounded-lg overflow-hidden border-2 border-[#0a0a0a] product-gradient-1">
                        {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold border-2 border-[#0a0a0a] bg-white/5 text-[#9ca3af]">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold line-clamp-1" style={{ color: '#e8e8e8', fontFamily: 'Rajdhani, sans-serif' }}>
                      {order.items.map((i) => i.productName).join(', ')}
                    </p>
                    <p className="text-xs text-[#6b7280]">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} item(s)
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-[#6b7280] uppercase tracking-widest">Total</p>
                      <p className="text-xl font-black" style={{ color: '#39ff14', fontFamily: 'Rajdhani, sans-serif' }}>
                        {formatPrice(order.total)}
                      </p>
                    </div>
                    <Link
                      to={`/order/${order._id}`}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors text-[#9ca3af] hover:text-[#39ff14]"
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
