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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#080808' }}>
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
    <div className="min-h-screen py-14 md:py-20" style={{ background: '#080808' }}>
      <div className="container">

        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: '24px', marginBottom: '40px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: '#FF3500', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', display: 'block', marginBottom: '10px' }}>
            Saved Items
          </span>
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6" style={{ color: '#FF3500' }} fill="#FF3500" />
            <h1 className="uppercase font-black leading-none" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(28px, 4vw, 48px)', color: '#F0EBE3' }}>
              Wishlist
            </h1>
          </div>
          <p className="mt-2" style={{ color: '#555', fontSize: '13px', fontFamily: 'Space Grotesk, sans-serif' }}>
            {items.length} item{items.length === 1 ? '' : 's'} saved
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="group relative flex flex-col"
              style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', overflow: 'hidden' }}
            >
              <button
                onClick={() => { dispatch(removeFromWishlist(item.productId)); toast('Removed from wishlist') }}
                className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center transition-colors"
                style={{ background: 'rgba(8,8,8,0.7)', borderRadius: '2px' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,53,0,0.8)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(8,8,8,0.7)'}
                aria-label="Remove from wishlist"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>

              <Link to={`/shop/${item.slug}`} className={`overflow-hidden ${item.gradientClass || 'product-gradient-1'}`} style={{ aspectRatio: '3/4' }}>
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl font-black" style={{ fontFamily: 'Orbitron, monospace', color: 'rgba(255,255,255,0.05)' }}>NB</span>
                  </div>
                )}
              </Link>

              <div className="p-4 flex flex-col gap-2 flex-1">
                <Link
                  to={`/shop/${item.slug}`}
                  className="font-bold leading-snug line-clamp-2 transition-colors hover:text-[#FF3500]"
                  style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '15px', color: '#F0EBE3' }}
                >
                  {item.name}
                </Link>
                <div className="flex items-center justify-between mt-auto pt-2">
                  <span className="font-black" style={{ color: '#F0EBE3', fontFamily: 'Orbitron, monospace', fontSize: '14px' }}>
                    {formatPrice(item.price)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-8 h-8 flex items-center justify-center transition-colors"
                    style={{ background: '#FF3500', borderRadius: '2px' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#cc2b00'}
                    onMouseLeave={e => e.currentTarget.style.background = '#FF3500'}
                    aria-label="Add to cart"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" style={{ color: '#000' }} />
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
