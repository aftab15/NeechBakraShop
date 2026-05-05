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

  const handleSignOut = async () => {
    await signOut()
    dispatch(closeMobileMenu())
    toast.success('Signed out!')
    navigate('/')
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/10" style={{ height: '70px' }}>
        <div className="container flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" onClick={() => dispatch(closeMobileMenu())}>
            <Zap className="w-7 h-7 group-hover:animate-pulse-neon transition-all" style={{color:'#39ff14'}} />
            <span
              className="text-[22px] font-black tracking-wider uppercase"
              style={{ fontFamily: 'Orbitron, monospace', color: '#39ff14', textShadow: '0 0 10px #39ff14' }}
            >
              NeechBakra
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `text-sm font-semibold uppercase tracking-widest transition-colors duration-200 ${
                    isActive ? 'text-[#39ff14]' : 'text-[#e8e8e8] hover:text-[#39ff14]'
                  }`
                }
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 text-[#e8e8e8] hover:text-[#8b5cf6] transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                  style={{ background: '#8b5cf6', color: '#fff' }}>
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative p-2 text-[#e8e8e8] hover:text-[#39ff14] transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                  style={{ background: '#39ff14', color: '#0a0a0a' }}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth */}
            {me ? (
              <div className="hidden md:flex items-center gap-2">
                {isAdmin && (
                  <Link to="/admin" className="p-2 text-[#e8e8e8] hover:text-[#39ff14] transition-colors" aria-label="Admin">
                    <LayoutDashboard className="w-5 h-5" />
                  </Link>
                )}
                <Link to="/profile" className="p-2 text-[#e8e8e8] hover:text-[#39ff14] transition-colors" aria-label="Profile">
                  <User className="w-5 h-5" />
                </Link>
                <button onClick={handleSignOut} className="p-2 text-[#e8e8e8] hover:text-red-400 transition-colors" aria-label="Sign out">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="hidden md:block btn-neon py-2 px-4 text-xs">
                Login
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => dispatch(toggleMobileMenu())}
              className="md:hidden p-2 text-[#e8e8e8] hover:text-[#39ff14] transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-strong border-t border-white/10 py-4 px-6 flex flex-col gap-4 animate-slide-in-up">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => dispatch(closeMobileMenu())}
                className={({ isActive }) =>
                  `text-base font-bold uppercase tracking-widest transition-colors ${
                    isActive ? 'text-[#39ff14]' : 'text-[#e8e8e8]'
                  }`
                }
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                {l.label}
              </NavLink>
            ))}
            <hr className="border-white/10" />
            {me ? (
              <>
                <Link to="/profile" onClick={() => dispatch(closeMobileMenu())} className="text-base font-bold text-[#e8e8e8] uppercase tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Profile</Link>
                <Link to="/orders" onClick={() => dispatch(closeMobileMenu())} className="text-base font-bold text-[#e8e8e8] uppercase tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif' }}>My Orders</Link>
                {isAdmin && <Link to="/admin" onClick={() => dispatch(closeMobileMenu())} className="text-base font-bold text-[#39ff14] uppercase tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Admin</Link>}
                <button onClick={handleSignOut} className="text-left text-base font-bold text-red-400 uppercase tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Sign Out</button>
              </>
            ) : (
              <Link to="/auth" onClick={() => dispatch(closeMobileMenu())} className="btn-neon w-full justify-center">Login / Register</Link>
            )}
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  )
}
