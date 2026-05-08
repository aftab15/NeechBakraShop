import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Heart, ShoppingBag, MoveRight } from 'lucide-react'
import { addToCart, openCart } from '../../features/cart/cartSlice'
import { toggleWishlist, selectIsWishlisted } from '../../features/wishlist/wishlistSlice'
import { formatPrice, discountPercent } from '../../lib/utils'
import { cardTilt } from '../../lib/animations'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
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
    toast.success(`${product.name} added!`)
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
    toast(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist', { icon: isWishlisted ? '♡' : '♥' })
  }

  const discount = discountPercent(product.price, product.compareAtPrice)
  const outOfStock = product.stock === 0

  return (
    <Link
      ref={cardRef}
      to={`/shop/${product.slug}`}
      className="group flex flex-col"
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      aria-label={product.name}
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden ${product.gradientClass || 'product-gradient-1'}`}
        style={{ aspectRatio: '3/4', borderRadius: '4px' }}
      >
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center noise-overlay">
            <span
              className="text-[80px] font-black select-none"
              style={{ fontFamily: 'Orbitron, monospace', color: 'rgba(255,255,255,0.06)', letterSpacing: '-0.04em' }}
            >
              NB
            </span>
          </div>
        )}

        {/* Gradient fade at bottom */}
        <div
          className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(8,8,8,0.85) 0%, transparent 100%)' }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isFeatured && (
            <span className="tag" style={{ background: '#FF3500', color: '#000' }}>Drop</span>
          )}
          {discount > 0 && (
            <span className="tag" style={{ background: '#000', color: '#F0EBE3', border: '1px solid rgba(255,255,255,0.15)' }}>-{discount}%</span>
          )}
          {outOfStock && (
            <span className="tag" style={{ background: 'rgba(0,0,0,0.8)', color: '#666', border: '1px solid rgba(255,255,255,0.1)' }}>Sold Out</span>
          )}
        </div>

        {/* Wishlist button — top right */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-sm flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
          style={{ background: isWishlisted ? '#FF3500' : 'rgba(8,8,8,0.75)', backdropFilter: 'blur(8px)' }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className="w-3.5 h-3.5" fill={isWishlisted ? '#000' : 'none'} color={isWishlisted ? '#000' : '#F0EBE3'} />
        </button>

        {/* Quick add — bottom overlay on hover */}
        <div
          className="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          style={{ background: 'rgba(8,8,8,0.5)' }}
        >
          <span
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: '#A89E94', fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {outOfStock ? 'Sold Out' : product.sizes?.[0] !== 'ONE SIZE' ? 'Select Size' : 'One Size'}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="flex items-center gap-2 font-bold uppercase tracking-widest transition-all disabled:opacity-40 active:scale-95"
            style={{
              background: '#FF3500',
              color: '#000',
              borderRadius: '2px',
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '12px',
              padding: '10px 18px',
            }}
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" /> Add to Cart
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pt-3 pb-1 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-0.5"
              style={{ color: '#666666', fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {product.category}
            </p>
            <h3
              className="text-[14px] font-semibold leading-snug group-hover:text-[#FF3500] transition-colors duration-200 line-clamp-2"
              style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#F0EBE3', letterSpacing: '-0.01em' }}
            >
              {product.name}
            </h3>
          </div>
          <MoveRight
            className="w-4 h-4 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5"
            style={{ color: '#FF3500' }}
          />
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className="text-[15px] font-bold"
            style={{ color: '#F0EBE3', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}
          >
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-[12px] line-through" style={{ color: '#444444', fontFamily: 'Space Grotesk, sans-serif' }}>
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
