import { PackageSearch, ShoppingBag, Heart, Inbox } from 'lucide-react'
import { Link } from 'react-router-dom'

const icons = {
  products: PackageSearch,
  cart: ShoppingBag,
  wishlist: Heart,
  orders: Inbox,
  default: PackageSearch,
}

export default function EmptyState({
  type = 'default',
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}) {
  const Icon = icons[type] || icons.default
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
        style={{ background: 'rgba(57,255,20,0.06)', border: '1px solid rgba(57,255,20,0.15)' }}
      >
        <Icon className="w-10 h-10" style={{ color: '#39ff14' }} />
      </div>
      <h3
        className="text-2xl font-bold mb-3 uppercase tracking-wide"
        style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}
      >
        {title || 'Nothing here yet'}
      </h3>
      <p className="text-[#6b7280] text-sm max-w-xs mb-8">
        {description || 'Looks empty. Come back later!'}
      </p>
      {actionLabel && (actionTo ? (
        <Link to={actionTo} className="btn-neon">
          {actionLabel}
        </Link>
      ) : (
        <button onClick={onAction} className="btn-neon">
          {actionLabel}
        </button>
      ))}
    </div>
  )
}
