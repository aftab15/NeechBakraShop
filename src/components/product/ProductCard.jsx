import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Heart, ShoppingBag, Eye } from 'lucide-react'
import { addToCart, openCart } from '../../features/cart/cartSlice'
import { toggleWishlist, selectIsWishlisted } from '../../features/wishlist/wishlistSlice'
import { formatPrice, discountPercent } from '../../lib/utils'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isWishlisted = useSelector(selectIsWishlisted(product._id))

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const defaultSize = product.sizes?.[0] || 'ONE SIZE'
    dispatch(addToCart({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images?.[0] || '',
      size: defaultSize,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      gradientClass: product.gradientClass,
    }))
    dispatch(openCart())
    toast.success(`${product.name} added to cart!`)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(toggleWishlist({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images?.[0] || '',
      price: product.price,
      gradientClass: product.gradientClass,
    }))
    toast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist! 💜', {
      icon: isWishlisted ? '💔' : '💜',
    })
  }

  const discount = discountPercent(product.price, product.compareAtPrice)
  const outOfStock = product.stock === 0

  return (
    <Link
      to={`/shop/${product.slug}`}
      className="group relative flex flex-col glass rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
      style={{ border: '1px solid rgba(255,255,255,0.08)', '--shadow-color': 'rgba(57,255,20,0.15)' }}
      aria-label={product.name}
    >
      {/* Image / Gradient Placeholder */}
      <div className={`relative aspect-square overflow-hidden ${product.gradientClass || 'product-gradient-1'}`}>
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span
              className="text-6xl font-black opacity-20 select-none"
              style={{ fontFamily: 'Orbitron, monospace', color: '#39ff14' }}
            >
              NB
            </span>
          </div>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={handleWishlist}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: isWishlisted ? '#8b5cf6' : 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className="w-5 h-5" fill={isWishlisted ? '#fff' : 'none'} color="#fff" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/shop/${product.slug}`) }}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
            aria-label="View product"
          >
            <Eye className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isFeatured && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded"
              style={{ background: '#39ff14', color: '#0a0a0a', fontFamily: 'Rajdhani, sans-serif' }}>
              Featured
            </span>
          )}
          {discount > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded"
              style={{ background: '#ef4444', color: '#fff', fontFamily: 'Rajdhani, sans-serif' }}>
              -{discount}%
            </span>
          )}
          {outOfStock && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded"
              style={{ background: '#374151', color: '#9ca3af', fontFamily: 'Rajdhani, sans-serif' }}>
              Sold Out
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
          {product.category}
        </p>
        <h3
          className="text-[15px] font-bold leading-snug group-hover:text-[#39ff14] transition-colors line-clamp-2"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}
        >
          {product.name}
        </h3>

        {/* Sizes preview */}
        {product.sizes?.length > 0 && product.sizes[0] !== 'ONE SIZE' && (
          <div className="flex items-center gap-1 flex-wrap">
            {product.sizes.slice(0, 4).map((s) => (
              <span key={s} className="text-[9px] px-1.5 py-0.5 rounded border border-white/10 text-[#6b7280]">
                {s}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-[9px] text-[#6b7280]">+{product.sizes.length - 4}</span>
            )}
          </div>
        )}

        {/* Price row */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black" style={{ color: '#39ff14', fontFamily: 'Rajdhani, sans-serif' }}>
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm line-through text-[#6b7280]">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: outOfStock ? '#1a1a1a' : '#39ff14' }}
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" color={outOfStock ? '#6b7280' : '#0a0a0a'} />
          </button>
        </div>
      </div>
    </Link>
  )
}
