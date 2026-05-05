import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, X } from 'lucide-react'
import { selectWishlistItems, removeFromWishlist } from '../features/wishlist/wishlistSlice'
import { addToCart, openCart } from '../features/cart/cartSlice'
import { formatPrice } from '../lib/utils'
import EmptyState from '../components/common/EmptyState'
import toast from 'react-hot-toast'

export default function Wishlist() {
  const dispatch = useDispatch()
  const items = useSelector(selectWishlistItems)

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState
          type="wishlist"
          title="Your wishlist is empty"
          description="Save your favourite drops here for later."
          actionLabel="Discover Merch"
          actionTo="/shop"
        />
      </div>
    )
  }

  const handleAddToCart = (item) => {
    dispatch(addToCart({
      productId: item.productId,
      name: item.name,
      slug: item.slug,
      image: item.image,
      size: 'ONE SIZE',
      price: item.price,
      gradientClass: item.gradientClass,
    }))
    dispatch(openCart())
    toast.success(`${item.name} added to cart!`)
  }

  return (
    <div className="min-h-screen py-10">
      <div className="container">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-7 h-7" style={{ color: '#8b5cf6' }} fill="#8b5cf6" />
          <h1 className="text-4xl md:text-5xl font-black uppercase" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>
            Wishlist
          </h1>
        </div>
        <p className="text-[#6b7280] mb-8">
          {items.length} item{items.length === 1 ? '' : 's'} saved
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.productId}
              className="group relative glass rounded-2xl overflow-hidden flex flex-col transition-all hover:scale-[1.02]"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <button
                onClick={() => { dispatch(removeFromWishlist(item.productId)); toast('Removed from wishlist') }}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
                aria-label="Remove from wishlist"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              <Link to={`/shop/${item.slug}`} className={`aspect-square overflow-hidden ${item.gradientClass || 'product-gradient-1'}`}>
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl font-black opacity-20" style={{ fontFamily: 'Orbitron, monospace', color: '#39ff14' }}>NB</span>
                  </div>
                )}
              </Link>

              <div className="p-4 flex flex-col gap-2 flex-1">
                <Link
                  to={`/shop/${item.slug}`}
                  className="text-base font-bold leading-snug hover:text-[#39ff14] transition-colors line-clamp-2"
                  style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}
                >
                  {item.name}
                </Link>
                <div className="flex items-center justify-between mt-auto pt-2">
                  <span className="text-lg font-black" style={{ color: '#39ff14', fontFamily: 'Rajdhani, sans-serif' }}>
                    {formatPrice(item.price)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: '#39ff14' }}
                    aria-label="Add to cart"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#0a0a0a]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
