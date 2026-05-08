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
        className="w-20 h-20 flex items-center justify-center mb-6"
        style={{ background: 'rgba(255,53,0,0.06)', border: '1px solid rgba(255,53,0,0.2)', borderRadius: '4px' }}
      >
        <Icon className="w-9 h-9" style={{ color: '#FF3500' }} />
      </div>
      <h3
        className="text-2xl font-bold mb-3 uppercase tracking-wide"
        style={{ fontFamily: 'Rajdhani, sans-serif', color: '#F0EBE3' }}
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
