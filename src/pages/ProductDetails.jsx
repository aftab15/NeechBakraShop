import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, openCart } from '../features/cart/cartSlice'
import { toggleWishlist, selectIsWishlisted } from '../features/wishlist/wishlistSlice'
import SizeSelector from '../components/product/SizeSelector'
import QuantitySelector from '../components/product/QuantitySelector'
import { formatPrice, discountPercent } from '../lib/utils'
import { Heart, ShoppingBag, ChevronRight, Package, Truck, RotateCcw, Shield } from 'lucide-react'
import { PageLoader } from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'
import { MOCK_PRODUCTS } from '../lib/mockProducts'

const isPlaceholder = import.meta.env.VITE_CONVEX_URL?.includes('placeholder')

export default function ProductDetails() {
  const { slug } = useParams()
  const rawProduct = useQuery(api.products.getProductBySlug, isPlaceholder ? 'skip' : { slug })
  const product = isPlaceholder ? (MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null) : rawProduct
  const dispatch = useDispatch()
  const isWishlisted = useSelector(selectIsWishlisted(product?._id))

  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [sizeError, setSizeError] = useState(false)

  if (!isPlaceholder && product === undefined) return <PageLoader />
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-black text-[#e8e8e8] mb-4" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Product Not Found</h2>
        <Link to="/shop" className="btn-neon">Back to Shop</Link>
      </div>
    </div>
  )

  const discount = discountPercent(product.price, product.compareAtPrice)

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes[0] !== 'ONE SIZE') {
      setSizeError(true)
      toast.error('Please select a size!')
      return
    }
    const size = selectedSize || product.sizes[0]
    dispatch(addToCart({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images?.[0] || '',
      size,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      gradientClass: product.gradientClass,
      quantity,
    }))
    dispatch(openCart())
    toast.success(`${product.name} (${size}) added to cart!`)
  }

  const handleWishlist = () => {
    dispatch(toggleWishlist({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images?.[0] || '',
      price: product.price,
      gradientClass: product.gradientClass,
    }))
    toast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist! 💜', { icon: isWishlisted ? '💔' : '💜' })
  }

  return (
    <div className="min-h-screen py-10">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: '#6b7280' }}>
          <Link to="/" className="hover:text-[#39ff14] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/shop" className="hover:text-[#39ff14] transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <span style={{ color: '#e8e8e8' }}>{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* ── IMAGE GALLERY ── */}
          <div className="flex flex-col gap-4">
            <div
              className={`rounded-2xl overflow-hidden ${product.gradientClass || 'product-gradient-1'} noise-overlay`}
              style={{ aspectRatio: '4/5', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {product.images?.[activeImage] ? (
                <img
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-9xl font-black opacity-10 select-none" style={{ fontFamily: 'Orbitron, monospace', color: '#39ff14' }}>NB</span>
                </div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className="w-20 h-20 rounded-xl overflow-hidden transition-all"
                    style={{ border: `2px solid ${activeImage === i ? '#39ff14' : 'rgba(255,255,255,0.1)'}`, boxShadow: activeImage === i ? '0 0 12px rgba(57,255,20,0.3)' : 'none' }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── PRODUCT INFO ── */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-2" style={{ color: '#6b7280', fontFamily: 'Space Grotesk, sans-serif' }}>
                {product.category}
              </p>
              <h1 className="text-4xl md:text-5xl font-black uppercase leading-tight mb-5" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>
                {product.name}
              </h1>
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-4xl font-black" style={{ color: '#39ff14', fontFamily: 'Orbitron, monospace', letterSpacing: '-0.02em' }}>
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && (
                  <>
                    <span className="text-xl line-through" style={{ color: '#4b5563', fontFamily: 'Space Grotesk, sans-serif' }}>
                      {formatPrice(product.compareAtPrice)}
                    </span>
                    <span className="tag" style={{ background: '#ef4444', color: '#fff' }}>
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${product.stock > 0 ? '' : ''}`}
                style={{ background: product.stock > 10 ? '#39ff14' : product.stock > 0 ? '#f59e0b' : '#ef4444', boxShadow: product.stock > 0 ? `0 0 6px ${product.stock > 10 ? '#39ff14' : '#f59e0b'}` : 'none' }}
              />
              <span style={{ fontSize: '13px', color: '#9ca3af', fontFamily: 'Space Grotesk, sans-serif' }}>
                {product.stock > 10 ? `In stock` : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of stock'}
              </span>
            </div>

            {/* Description */}
            <p style={{ color: '#9ca3af', fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', lineHeight: '1.65' }}>
              {product.description}
            </p>

            {/* Size Selector */}
            {product.sizes?.[0] !== 'ONE SIZE' && (
              <div>
                <SizeSelector
                  sizes={product.sizes}
                  selected={selectedSize}
                  onChange={(s) => { setSelectedSize(s); setSizeError(false) }}
                />
                {sizeError && (
                  <p className="text-xs mt-2" style={{ color: '#ef4444', fontFamily: 'Space Grotesk, sans-serif' }}>
                    Please select a size to continue
                  </p>
                )}
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-3">
              <QuantitySelector value={quantity} onChange={setQuantity} max={Math.min(10, product.stock)} />
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn-neon flex-1 justify-center py-3.5 gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-5 h-5" />
                {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
              </button>
              <button
                onClick={handleWishlist}
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                style={{
                  background: isWishlisted ? '#8b5cf6' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isWishlisted ? '#8b5cf6' : 'rgba(255,255,255,0.1)'}`,
                  boxShadow: isWishlisted ? '0 4px 14px rgba(139,92,246,0.3)' : 'none',
                }}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className="w-5 h-5" fill={isWishlisted ? '#fff' : 'none'} color={isWishlisted ? '#fff' : '#9ca3af'} />
              </button>
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '12px', color: '#6b7280', fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {[
                { icon: Truck,    label: 'Free shipping over ₹999' },
                { icon: Package,  label: 'Secure packaging'         },
                { icon: RotateCcw,label: 'Easy 7-day returns'       },
                { icon: Shield,   label: 'Razorpay secure checkout' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#39ff14' }} />
                  <span style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'Space Grotesk, sans-serif' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
