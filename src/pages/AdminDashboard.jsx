import { Link } from 'react-router-dom'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Package, ShoppingBag, IndianRupee, Clock, Mail, Users, ArrowRight, TrendingUp } from 'lucide-react'
import { formatPrice, formatDate, getStatusColor } from '../lib/utils'
import { PageLoader } from '../components/common/LoadingSpinner'

export default function AdminDashboard() {
  const stats = useQuery(api.admin.getDashboardStats)
  const recentOrders = useQuery(api.orders.getAllOrders, { limit: 5 })

  if (stats === undefined) return <PageLoader />

  const cards = [
    { icon: IndianRupee, color: '#FF3500', label: 'Total Revenue', value: formatPrice(stats.totalRevenue) },
    { icon: ShoppingBag, color: '#8b5cf6', label: 'Total Orders', value: stats.totalOrders },
    { icon: Clock, color: '#f59e0b', label: 'Pending Orders', value: stats.pendingOrders },
    { icon: TrendingUp, color: '#007cf0', label: 'Confirmed', value: stats.confirmedOrders },
    { icon: Package, color: '#FF3500', label: 'Active Products', value: `${stats.activeProducts}/${stats.totalProducts}` },
    { icon: Users, color: '#8b5cf6', label: 'Subscribers', value: stats.totalSubscribers },
    { icon: Mail, color: '#ef4444', label: 'Unread Messages', value: stats.unreadMessages },
  ]

  return (
    <div className="min-h-screen py-10">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#FF3500] mb-2">Admin</p>
            <h1 className="text-4xl md:text-5xl font-black uppercase" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>
              Dashboard
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/admin/products" className="btn-outline-neon text-xs">Products</Link>
            <Link to="/admin/orders" className="btn-neon text-xs">Orders</Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
          {cards.map(({ icon: Icon, color, label, value }) => (
            <div key={label} className="glass rounded-2xl p-5 transition-all hover:scale-[1.02]" style={{ border: `1px solid ${color}33` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}1a` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <p className="text-xs uppercase tracking-widest text-[#6b7280] mb-1">{label}</p>
              <p className="text-2xl font-black" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>{value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass rounded-2xl p-6" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black uppercase" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>
                Recent Orders
              </h2>
              <Link to="/admin/orders" className="text-xs font-bold uppercase tracking-widest text-[#FF3500] hover:underline" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                View All <ArrowRight className="inline w-3 h-3" />
              </Link>
            </div>
            {!recentOrders ? (
              <p className="text-[#6b7280] text-sm">Loading...</p>
            ) : recentOrders.length === 0 ? (
              <p className="text-[#6b7280] text-sm">No orders yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-mono text-[#FF3500]">{order._id.slice(-10).toUpperCase()}</p>
                      <p className="text-xs text-[#6b7280] mt-0.5">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span className={`text-xs font-bold uppercase ${getStatusColor(order.status)}`} style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                        {order.status}
                      </span>
                      <span className="text-sm font-black" style={{ color: '#FF3500', fontFamily: 'Rajdhani, sans-serif' }}>
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass rounded-2xl p-6" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 className="text-xl font-black uppercase mb-6" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>
              Quick Actions
            </h2>
            <div className="flex flex-col gap-3">
              <Link to="/admin/products" className="flex items-center justify-between p-3 rounded-lg transition-all hover:bg-white/5" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="flex items-center gap-3">
                  <Package className="w-4 h-4" style={{ color: '#FF3500' }} />
                  <span className="text-sm font-medium text-[#e8e8e8]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Manage Products</span>
                </span>
                <ArrowRight className="w-4 h-4 text-[#6b7280]" />
              </Link>
              <Link to="/admin/orders" className="flex items-center justify-between p-3 rounded-lg transition-all hover:bg-white/5" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                  <span className="text-sm font-medium text-[#e8e8e8]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Manage Orders</span>
                </span>
                <ArrowRight className="w-4 h-4 text-[#6b7280]" />
              </Link>
              <Link to="/shop" className="flex items-center justify-between p-3 rounded-lg transition-all hover:bg-white/5" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="flex items-center gap-3">
                  <ArrowRight className="w-4 h-4" style={{ color: '#007cf0' }} />
                  <span className="text-sm font-medium text-[#e8e8e8]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>View Storefront</span>
                </span>
                <ArrowRight className="w-4 h-4 text-[#6b7280]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
