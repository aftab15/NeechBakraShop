import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useAuthActions } from '@convex-dev/auth/react'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { ShoppingBag, Heart, Menu, X, Zap, User, LogOut, LayoutDashboard } from 'lucide-react'
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
  const headerRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    dispatch(closeMobileMenu())
    toast.success('Signed out!')
    navigate('/')
  }

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          height: '68px',
          background: scrolled
            ? 'rgba(10,10,10,0.92)'
            : 'rgba(10,10,10,0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled
            ? '1px solid rgba(255,255,255,0.1)'
            : '1px solid rgba(255,255,255,0.05)',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        <div className="container flex items-center justify-between h-full">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            onClick={() => dispatch(closeMobileMenu())}
          >
            <div className="relative">
              <Zap
                className="w-6 h-6 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_#39ff14]"
                style={{ color: '#39ff14' }}
              />
            </div>
            <span
              className="text-[20px] font-black tracking-wide uppercase leading-none"
              style={{
                fontFamily: 'Orbitron, monospace',
                color: '#39ff14',
                textShadow: scrolled ? '0 0 12px rgba(57,255,20,0.5)' : 'none',
                transition: 'text-shadow 0.3s ease',
              }}
            >
              NeechBakra
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors duration-200 rounded-lg
                  ${isActive ? 'text-[#39ff14]' : 'text-[#9ca3af] hover:text-[#e8e8e8]'}`
                }
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive && (
                      <span
                        className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[2px] rounded-full"
                        style={{ background: '#39ff14', width: '20px', boxShadow: '0 0 6px #39ff14' }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-0.5">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-lg text-[#9ca3af] hover:text-[#8b5cf6] hover:bg-white/5 transition-all duration-200"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 w-[14px] h-[14px] rounded-full text-[9px] font-bold flex items-center justify-center"
                  style={{ background: '#8b5cf6', color: '#fff' }}
                >
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative p-2.5 rounded-lg text-[#9ca3af] hover:text-[#39ff14] hover:bg-white/5 transition-all duration-200"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 w-[14px] h-[14px] rounded-full text-[9px] font-bold flex items-center justify-center"
                  style={{ background: '#39ff14', color: '#0a0a0a' }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth */}
            {me ? (
              <div className="hidden md:flex items-center gap-0.5">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="p-2.5 rounded-lg text-[#9ca3af] hover:text-[#39ff14] hover:bg-white/5 transition-all duration-200"
                    aria-label="Admin"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="p-2.5 rounded-lg text-[#9ca3af] hover:text-[#39ff14] hover:bg-white/5 transition-all duration-200"
                  aria-label="Profile"
                >
                  <User className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2.5 rounded-lg text-[#9ca3af] hover:text-red-400 hover:bg-red-400/5 transition-all duration-200"
                  aria-label="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="hidden md:flex items-center gap-2 ml-2 px-4 py-2 rounded-lg text-[13px] font-semibold uppercase tracking-[0.08em] transition-all duration-200"
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  background: 'rgba(57,255,20,0.1)',
                  color: '#39ff14',
                  border: '1px solid rgba(57,255,20,0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(57,255,20,0.18)'
                  e.currentTarget.style.boxShadow = '0 0 16px rgba(57,255,20,0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(57,255,20,0.1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                Login
              </Link>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => dispatch(toggleMobileMenu())}
              className="md:hidden p-2.5 rounded-lg text-[#9ca3af] hover:text-[#e8e8e8] hover:bg-white/5 transition-all duration-200 ml-1"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden border-t py-5 px-5 flex flex-col gap-1 animate-slide-in-up"
            style={{
              background: 'rgba(10,10,10,0.98)',
              backdropFilter: 'blur(20px)',
              borderColor: 'rgba(255,255,255,0.08)',
            }}
          >
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => dispatch(closeMobileMenu())}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl text-[15px] font-semibold uppercase tracking-[0.06em] transition-colors ${
                    isActive
                      ? 'text-[#39ff14] bg-[#39ff14]/8'
                      : 'text-[#9ca3af] hover:text-[#e8e8e8] hover:bg-white/4'
                  }`
                }
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {l.label}
              </NavLink>
            ))}
            <div className="my-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} />
            {me ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => dispatch(closeMobileMenu())}
                  className="px-4 py-3 rounded-xl text-[15px] font-semibold uppercase tracking-[0.06em] text-[#9ca3af] hover:text-[#e8e8e8]"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={() => dispatch(closeMobileMenu())}
                  className="px-4 py-3 rounded-xl text-[15px] font-semibold uppercase tracking-[0.06em] text-[#9ca3af] hover:text-[#e8e8e8]"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  My Orders
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => dispatch(closeMobileMenu())}
                    className="px-4 py-3 rounded-xl text-[15px] font-semibold uppercase tracking-[0.06em]"
                    style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#39ff14' }}
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="text-left px-4 py-3 rounded-xl text-[15px] font-semibold uppercase tracking-[0.06em] text-red-400"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => dispatch(closeMobileMenu())}
                className="btn-neon justify-center mt-2"
              >
                Login / Register
              </Link>
            )}
          </div>
        )}
      </header>

      <CartDrawer />
    </>
  )
}
