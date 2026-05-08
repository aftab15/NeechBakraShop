import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useAuthActions } from '@convex-dev/auth/react'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { ShoppingBag, Heart, Menu, X, User, LogOut, LayoutDashboard, ArrowRight } from 'lucide-react'
import { selectCartCount, toggleCart } from '../../features/cart/cartSlice'
import { selectWishlistItems } from '../../features/wishlist/wishlistSlice'
import { toggleMobileMenu, selectMobileMenuOpen, closeMobileMenu } from '../../features/ui/uiSlice'
import CartDrawer from '../cart/CartDrawer'
import toast from 'react-hot-toast'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

const ANNOUNCEMENT = 'Free shipping on orders above ₹999 — Limited drops, no restocks'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { signOut } = useAuthActions()
  const cartCount = useSelector(selectCartCount)
  const wishlistItems = useSelector(selectWishlistItems)
  const mobileMenuOpen = useSelector(selectMobileMenuOpen)
  const me = useQuery(api.users.getMe)
  const isAdmin = me?.role === 'admin'
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    dispatch(closeMobileMenu())
    toast.success('Signed out.')
    navigate('/')
  }

  return (
    <>
      {/* Announcement bar */}
      <div
        className="w-full overflow-hidden py-2 text-center"
        style={{ background: '#FF3500', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', color: '#000', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase' }}
      >
        <div className="marquee-track">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="px-12">{ANNOUNCEMENT} &nbsp;·&nbsp;</span>
          ))}
        </div>
      </div>

      <header
        className="sticky top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(8,8,8,0.96)' : '#080808',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        }}
      >
        <div className="container flex items-center justify-between" style={{ height: '60px' }}>
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            onClick={() => dispatch(closeMobileMenu())}
          >
            <span
              style={{
                fontFamily: 'Orbitron, monospace',
                fontWeight: 900,
                fontSize: '17px',
                letterSpacing: '0.06em',
                color: '#F0EBE3',
                textTransform: 'uppercase',
                transition: 'color 0.2s',
              }}
              className="group-hover:text-[#FF3500]"
            >
              Neech<span style={{ color: '#FF3500' }}>Bakra</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}
                className={({ isActive }) =>
                  `transition-colors duration-150 ${isActive ? 'text-[#FF3500]' : 'text-[#A89E94] hover:text-[#F0EBE3]'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Link
              to="/wishlist"
              className="relative p-2.5 text-[#A89E94] hover:text-[#F0EBE3] transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-[18px] h-[18px]" />
              {wishlistItems.length > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full text-[9px] font-bold flex items-center justify-center"
                  style={{ background: '#FF3500', color: '#000' }}
                >
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => dispatch(toggleCart())}
              className="relative p-2.5 text-[#A89E94] hover:text-[#F0EBE3] transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-[18px] h-[18px]" />
              {cartCount > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full text-[9px] font-bold flex items-center justify-center"
                  style={{ background: '#FF3500', color: '#000' }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {me ? (
              <div className="hidden md:flex items-center gap-0.5">
                {isAdmin && (
                  <Link to="/admin" className="p-2.5 text-[#A89E94] hover:text-[#F0EBE3] transition-colors" aria-label="Admin">
                    <LayoutDashboard className="w-[18px] h-[18px]" />
                  </Link>
                )}
                <Link to="/profile" className="p-2.5 text-[#A89E94] hover:text-[#F0EBE3] transition-colors" aria-label="Profile">
                  <User className="w-[18px] h-[18px]" />
                </Link>
                <button onClick={handleSignOut} className="p-2.5 text-[#A89E94] hover:text-red-400 transition-colors" aria-label="Sign out">
                  <LogOut className="w-[18px] h-[18px]" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="hidden md:flex items-center gap-1.5 ml-3 btn-neon py-2 px-4 text-xs"
              >
                Login <ArrowRight className="w-3 h-3" />
              </Link>
            )}

            <button
              onClick={() => dispatch(toggleMobileMenu())}
              className="md:hidden p-2.5 text-[#A89E94] hover:text-[#F0EBE3] transition-colors ml-1"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden flex flex-col animate-slide-in-up"
            style={{ background: '#0D0D0D', borderTop: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="container py-6 flex flex-col gap-1">
              {navLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  onClick={() => dispatch(closeMobileMenu())}
                  style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}
                  className={({ isActive }) =>
                    `py-3 border-b border-white/5 transition-colors ${isActive ? 'text-[#FF3500]' : 'text-[#A89E94] hover:text-[#F0EBE3]'}`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <div className="pt-4 flex flex-col gap-2">
                {me ? (
                  <>
                    <Link to="/profile" onClick={() => dispatch(closeMobileMenu())} className="py-2 text-sm text-[#A89E94]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Profile</Link>
                    <Link to="/orders" onClick={() => dispatch(closeMobileMenu())} className="py-2 text-sm text-[#A89E94]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>My Orders</Link>
                    {isAdmin && <Link to="/admin" onClick={() => dispatch(closeMobileMenu())} className="py-2 text-sm text-[#FF3500]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Admin</Link>}
                    <button onClick={handleSignOut} className="text-left py-2 text-sm text-red-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Sign Out</button>
                  </>
                ) : (
                  <Link to="/auth" onClick={() => dispatch(closeMobileMenu())} className="btn-neon w-full justify-center">Login / Register</Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <CartDrawer />
    </>
  )
}
