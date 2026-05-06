import { useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Heart, ShoppingBag, Eye, Zap } from 'lucide-react'
import { addToCart, openCart } from '../../features/cart/cartSlice'
import { toggleWishlist, selectIsWishlisted } from '../../features/wishlist/wishlistSlice'
import { formatPrice, discountPercent } from '../../lib/utils'
import { cardTilt } from '../../lib/animations'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isWishlisted = useSelector(selectIsWishlisted(product._id))
  const cardRef = useRef(null)

  useEffect(() => {
    if (!cardRef.current) return
    return cardTilt(cardRef.current)
  }, [])

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
      ref={cardRef}
      to={`/shop/${product.slug}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden border-glow"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(57,255,20,0.25)'
        e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(57,255,20,0.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
        e.currentTarget.style.boxShadow = 'none'
      }}
      aria-label={product.name}
    >
      {/* Image area */}
      <div className={`relative overflow-hidden ${product.gradientClass || 'product-gradient-1'}`}
        style={{ aspectRatio: '4/5' }}>
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center noise-overlay">
            <span
              className="text-7xl font-black opacity-15 select-none"
              style={{ fontFamily: 'Orbitron, monospace', color: '#39ff14' }}
            >
              NB
            </span>
          </div>
        )}

        {/* Scan-line effect on hover */}
        <div
          className="absolute left-0 right-0 h-px opacity-0 group-hover:opacity-60 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, #39ff14, transparent)',
            animation: 'scan-line 2s linear infinite',
            top: 0,
          }}
        />

        {/* Dark gradient at bottom of image */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 100%)' }} />

        {/* Overlay actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-3
          opacity-0 group-hover:opacity-100 transition-all duration-300"
          style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}>
          <button
            onClick={handleWishlist}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              background: isWishlisted ? '#8b5cf6' : 'rgba(255,255,255,0.12)',
              border: `1px solid ${isWishlisted ? '#8b5cf6' : 'rgba(255,255,255,0.2)'}`,
              backdropFilter: 'blur(8px)',
            }}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className="w-4.5 h-4.5" fill={isWishlisted ? '#fff' : 'none'} color="#fff" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/shop/${product.slug}`) }}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
            aria-label="View product"
          >
            <Eye className="w-4.5 h-4.5 text-white" />
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isFeatured && (
            <span className="tag" style={{ background: '#39ff14', color: '#0a0a0a' }}>
              <Zap className="w-2.5 h-2.5 mr-0.5" /> Featured
            </span>
          )}
          {discount > 0 && (
            <span className="tag" style={{ background: '#ef4444', color: '#fff' }}>
              -{discount}%
            </span>
          )}
          {outOfStock && (
            <span className="tag" style={{ background: 'rgba(55,65,81,0.9)', color: '#9ca3af' }}>
              Sold Out
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col gap-2.5 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: '#6b7280', fontFamily: 'Space Grotesk, sans-serif' }}>
          {product.category}
        </p>
        <h3
          className="text-[15px] font-semibold leading-snug group-hover:text-[#39ff14] transition-colors duration-200 line-clamp-2"
          style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#e8e8e8', letterSpacing: '-0.01em' }}
        >
          {product.name}
        </h3>

        {/* Sizes preview */}
        {product.sizes?.length > 0 && product.sizes[0] !== 'ONE SIZE' && (
          <div className="flex items-center gap-1 flex-wrap">
            {product.sizes.slice(0, 4).map((s) => (
              <span key={s} className="text-[9px] px-1.5 py-0.5 rounded"
                style={{ border: '1px solid rgba(255,255,255,0.08)', color: '#6b7280', fontFamily: 'Space Grotesk, sans-serif' }}>
                {s}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-[9px]" style={{ color: '#6b7280' }}>+{product.sizes.length - 4}</span>
            )}
          </div>
        )}

        {/* Price row */}
        <div className="flex items-center justify-between mt-auto pt-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex flex-col gap-0.5">
            <span className="text-lg font-bold leading-none"
              style={{ color: '#39ff14', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}>
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs line-through" style={{ color: '#4b5563' }}>
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              background: outOfStock ? '#1a1a1a' : 'linear-gradient(135deg, #39ff14, #28cc0f)',
              boxShadow: outOfStock ? 'none' : '0 4px 14px rgba(57,255,20,0.3)',
            }}
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" color={outOfStock ? '#6b7280' : '#0a0a0a'} />
          </button>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(90deg, transparent, #39ff14, transparent)' }}
      />
    </Link>
  )
}
