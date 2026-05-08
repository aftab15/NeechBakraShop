import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { ChevronLeft, Filter, Eye, X } from 'lucide-react'
import { formatPrice, formatDate, getStatusColor, getPaymentStatusColor } from '../lib/utils'
import { PageLoader } from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']

export default function AdminOrders() {
  const [filter, setFilter] = useState('')
  const [viewing, setViewing] = useState(null)
  const orders = useQuery(api.orders.getAllOrders, filter ? { status: filter } : {})
  const updateStatus = useMutation(api.orders.updateOrderStatus)

  if (orders === undefined) return <PageLoader />

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await updateStatus({ orderId, status })
      toast.success(`Order marked ${status}`)
    } catch {
      toast.error('Failed to update')
    }
  }

  return (
    <div className="min-h-screen py-10">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/admin" className="flex items-center gap-1 text-xs text-[#6b7280] hover:text-[#FF3500] transition-colors mb-2">
              <ChevronLeft className="w-3 h-3" /> Back to Dashboard
            </Link>
            <h1 className="text-4xl md:text-5xl font-black uppercase" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>
              Orders
            </h1>
            <p className="text-[#6b7280] text-sm mt-1">{orders.length} {filter ? `${filter} ` : ''}order{orders.length === 1 ? '' : 's'}</p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#9ca3af]" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-[#e8e8e8] focus:outline-none focus:border-[#FF3500]"
            >
              <option value="">All</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="glass rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs uppercase tracking-widest text-[#6b7280] border-b border-white/10">
                  <th className="text-left p-4">Order ID</th>
                  <th className="text-left p-4 hidden md:table-cell">Date</th>
                  <th className="text-left p-4 hidden lg:table-cell">Items</th>
                  <th className="text-left p-4">Total</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4 hidden md:table-cell">Payment</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="p-4">
                      <p className="text-xs font-mono text-[#FF3500]">{order._id.slice(-10).toUpperCase()}</p>
                      <p className="text-xs text-[#6b7280] mt-0.5">{order.shippingAddress.fullName}</p>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-xs text-[#9ca3af]">{formatDate(order.createdAt)}</span>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className="text-xs text-[#9ca3af]">{order.items.reduce((s, i) => s + i.quantity, 0)} items</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-bold" style={{ color: '#FF3500', fontFamily: 'Rajdhani, sans-serif' }}>{formatPrice(order.total)}</span>
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                        className={`px-2 py-1 rounded text-xs font-bold uppercase bg-transparent border focus:outline-none cursor-pointer ${getStatusColor(order.status)}`}
                        style={{ borderColor: 'rgba(255,255,255,0.1)', fontFamily: 'Rajdhani, sans-serif' }}
                      >
                        {STATUSES.map((s) => <option key={s} value={s} style={{ background: '#0a0a0a' }}>{s}</option>)}
                      </select>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className={`text-xs font-bold uppercase ${getPaymentStatusColor(order.paymentStatus)}`} style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setViewing(order)}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-[#9ca3af] hover:text-[#FF3500]"
                        aria-label="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-[#6b7280] text-sm">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {viewing && <OrderDetailModal order={viewing} onClose={() => setViewing(null)} />}
    </div>
  )
}

function OrderDetailModal({ order, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-strong rounded-2xl p-6 md:p-8"
        style={{ border: '1px solid rgba(57,255,20,0.3)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-[#6b7280] uppercase tracking-widest">Order</p>
            <p className="text-lg font-mono text-[#FF3500]">{order._id.slice(-12).toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-[#6b7280] hover:text-[#e8e8e8]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-white/10">
          <Detail label="Date" value={formatDate(order.createdAt)} />
          <Detail label="Customer" value={order.shippingAddress.fullName} />
          <Detail label="Phone" value={order.shippingAddress.phone} />
          <Detail label="Status" value={order.status.toUpperCase()} valueClass={getStatusColor(order.status)} />
          <Detail label="Payment" value={order.paymentStatus.toUpperCase()} valueClass={getPaymentStatusColor(order.paymentStatus)} />
          {order.razorpayPaymentId && <Detail label="Razorpay Payment" value={order.razorpayPaymentId} />}
        </div>

        <h3 className="text-sm font-bold uppercase tracking-widest text-[#6b7280] mb-3">Items</h3>
        <div className="flex flex-col gap-3 mb-6">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 product-gradient-1">
                {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold line-clamp-1" style={{ color: '#e8e8e8', fontFamily: 'Rajdhani, sans-serif' }}>{item.productName}</p>
                <p className="text-xs text-[#6b7280]">Size: {item.size} · Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-bold" style={{ color: '#FF3500' }}>{formatPrice(item.subtotal)}</span>
            </div>
          ))}
        </div>

        <h3 className="text-sm font-bold uppercase tracking-widest text-[#6b7280] mb-3">Shipping Address</h3>
        <div className="text-sm text-[#9ca3af] leading-relaxed mb-6">
          <p className="text-[#e8e8e8] font-bold">{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.addressLine1}</p>
          {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
          <p>{order.shippingAddress.country}</p>
          <p className="mt-1">📞 {order.shippingAddress.phone}</p>
        </div>

        {order.notes && (
          <div className="glass rounded-lg p-3 mb-6">
            <p className="text-xs text-[#6b7280] uppercase tracking-widest mb-1">Customer Notes</p>
            <p className="text-sm text-[#9ca3af]">{order.notes}</p>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-white/10">
          <span className="text-sm text-[#9ca3af]">Subtotal: {formatPrice(order.subtotal)} · Ship: {formatPrice(order.shippingFee)} · Tax: {formatPrice(order.tax)}</span>
          <span className="text-2xl font-black" style={{ color: '#FF3500', fontFamily: 'Rajdhani, sans-serif' }}>{formatPrice(order.total)}</span>
        </div>
      </div>
    </div>
  )
}

function Detail({ label, value, valueClass = '' }) {
  return (
    <div>
      <p className="text-xs text-[#6b7280] uppercase tracking-widest">{label}</p>
      <p className={`text-sm font-medium ${valueClass || 'text-[#e8e8e8]'}`} style={{ fontFamily: 'Rajdhani, sans-serif' }}>{value}</p>
    </div>
  )
}
