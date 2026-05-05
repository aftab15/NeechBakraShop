import { Link } from 'react-router-dom'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Zap, ArrowRight, Star, Flame, Clock } from 'lucide-react'
import ProductGrid from '../components/product/ProductGrid'
import { useState, useEffect } from 'react'
import { useMutation } from 'convex/react'
import toast from 'react-hot-toast'
import { MOCK_FEATURED } from '../lib/mockProducts'

const isPlaceholder = import.meta.env.VITE_CONVEX_URL?.includes('placeholder')

// Countdown timer hook
function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({})
  useEffect(() => {
    const tick = () => {
      const diff = targetDate - Date.now()
      if (diff <= 0) { setTimeLeft({ d: 0, h: 0, m: 0, s: 0 }); return }
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])
  return timeLeft
}

const DROP_DATE = Date.now() + 3 * 24 * 3600 * 1000 + 5 * 3600 * 1000 // 3d 5h from now

export default function Home() {
  const rawFeatured = useQuery(api.products.getFeaturedProducts, isPlaceholder ? 'skip' : { limit: 4 })
  const featured = isPlaceholder ? MOCK_FEATURED : rawFeatured
  const countdown = useCountdown(DROP_DATE)
  const [email, setEmail] = useState('')
  const [subLoading, setSubLoading] = useState(false)
  const subscribe = useMutation(api.newsletter.subscribe)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    setSubLoading(true)
    try {
      await subscribe({ email: email.trim().toLowerCase() })
      toast.success('Welcome to the squad! 🎮')
      setEmail('')
    } catch { toast.error('Try again.') }
    setSubLoading(false)
  }

  return (
    <div className="flex flex-col">
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #0d0d1a 40%, #0a0a0a 100%)' }}>
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(57,255,20,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,20,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: '#39ff14' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ background: '#8b5cf6' }} />

        <div className="relative z-10 container text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 glass" style={{ border: '1px solid rgba(57,255,20,0.3)' }}>
            <Flame className="w-4 h-4" style={{ color: '#39ff14' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#39ff14', fontFamily: 'Rajdhani, sans-serif' }}>
              Official Merch Store
            </span>
          </div>

          {/* Wordmark */}
          <h1
            className="text-7xl md:text-9xl lg:text-[160px] font-black uppercase tracking-tighter leading-none mb-6"
            style={{
              fontFamily: 'Orbitron, monospace',
              background: 'linear-gradient(135deg, #39ff14 0%, #8b5cf6 50%, #007cf0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 30px rgba(57,255,20,0.3))',
            }}
          >
            Neech<br />Bakra
          </h1>

          <p
            className="text-2xl md:text-4xl font-bold uppercase tracking-widest mb-4"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}
          >
            Wear the Madness. Own the Game.
          </p>
          <p className="text-[#6b7280] text-base md:text-lg max-w-lg mx-auto mb-14">
            Gaming streetwear for those who live the grind. Limited drops. No restocks.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/shop" className="btn-neon text-base px-8 py-4 gap-3">
              Shop Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/about" className="btn-outline-neon text-base px-8 py-4">
              Our Story
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-14 mt-20">
            {[['10K+', 'Community'], ['50+', 'Products'], ['100%', 'Fire']].map(([num, label]) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-black" style={{ fontFamily: 'Orbitron, monospace', color: '#39ff14' }}>{num}</p>
                <p className="text-xs text-[#6b7280] uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="text-[10px] text-[#6b7280] uppercase tracking-widest">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-[#6b7280] flex items-start justify-center pt-1">
            <div className="w-1 h-2 rounded-full bg-[#39ff14] animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── FEATURED DROPS ── */}
      <section className="section" style={{ background: '#0d0d0d' }}>
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4" style={{ color: '#39ff14' }} />
                <span className="text-xs font-bold uppercase tracking-widest text-[#6b7280]">New Drops</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black uppercase" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>
                Featured Merch
              </h2>
            </div>
            <Link to="/shop" className="btn-outline-neon text-xs py-2 px-5 hidden md:flex items-center gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={featured} loading={!isPlaceholder && rawFeatured === undefined} cols={4} />
          <div className="mt-12 flex md:hidden justify-center">
            <Link to="/shop" className="btn-outline-neon">View All Products</Link>
          </div>
        </div>
      </section>

      {/* ── BRAND STORY ── */}
      <section className="section" style={{ background: '#0a0a0a' }}>
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#6b7280] mb-3 block">About the Brand</span>
              <h2 className="text-4xl md:text-5xl font-black uppercase mb-4" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>
                Why<br /><span style={{ color: '#39ff14' }}>NeechBakra?</span>
              </h2>
              <p className="text-[#9ca3af] leading-relaxed mb-5">
                NeechBakra started as a gaming alias — and turned into a movement. We're the underdogs who outgrind everyone. The ones they said couldn't make it. We proved them wrong. Now you can wear that energy.
              </p>
              <p className="text-[#9ca3af] leading-relaxed mb-8">
                Every drop is limited. Every design tells a story. From the grind to the stream, to the streets — this is for the real ones.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: '🎮', label: 'Gaming DNA' },
                  { icon: '🔥', label: 'Bold Design' },
                  { icon: '💜', label: 'Community First' },
                ].map(({ icon, label }) => (
                  <div key={label} className="glass rounded-xl p-5 text-center" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-2xl mb-2">{icon}</p>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#6b7280]">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="w-full max-w-sm mx-auto aspect-square rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a0533 0%, #0a1a2e 50%, #001a0d 100%)' }}>
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-[160px] font-black opacity-10 select-none" style={{ fontFamily: 'Orbitron, monospace', color: '#39ff14' }}>
                    NB
                  </span>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute bottom-4 left-4 glass rounded-2xl px-5 py-3" style={{ border: '1px solid rgba(57,255,20,0.3)' }}>
                <p className="text-3xl font-black" style={{ fontFamily: 'Orbitron, monospace', color: '#39ff14' }}>10K+</p>
                <p className="text-xs text-[#6b7280] uppercase tracking-widest">Fans Strong</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIMITED EDITION COUNTDOWN ── */}
      <section className="section" style={{ background: 'linear-gradient(135deg, #0d0a1a 0%, #0a0a0a 100%)' }}>
        <div className="container text-center">
          <div className="glass-strong rounded-3xl p-8 md:p-12 max-w-3xl mx-auto" style={{ border: '1px solid rgba(139,92,246,0.3)' }}>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Clock className="w-5 h-5" style={{ color: '#8b5cf6' }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#8b5cf6' }}>Limited Drop Incoming</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase mb-3" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>
              Season 2 Drop
            </h2>
            <p className="text-[#9ca3af] mb-10">The most hyped collection yet. Don't sleep on this.</p>
            {/* Countdown */}
            <div className="flex items-center justify-center gap-4 md:gap-8 mb-8">
              {[
                [countdown.d ?? 0, 'Days'],
                [countdown.h ?? 0, 'Hours'],
                [countdown.m ?? 0, 'Mins'],
                [countdown.s ?? 0, 'Secs'],
              ].map(([val, label]) => (
                <div key={label} className="flex flex-col items-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center mb-2"
                    style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)' }}>
                    <span className="text-2xl md:text-3xl font-black" style={{ fontFamily: 'Orbitron, monospace', color: '#8b5cf6' }}>
                      {String(val).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#6b7280] uppercase tracking-widest">{label}</span>
                </div>
              ))}
            </div>
            <Link to="/shop" className="btn-neon text-base px-8 py-3 inline-flex" style={{ background: '#8b5cf6', color: '#fff' }}>
              Notify Me <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="section" style={{ background: '#0d0d0d' }}>
        <div className="container max-w-2xl mx-auto text-center">
          <Zap className="w-10 h-10 block mx-auto mb-6" style={{ color: '#39ff14' }} />
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-4" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>
            Join the<br /><span style={{ color: '#39ff14' }}>Inner Circle</span>
          </h2>
          <p className="text-[#9ca3af] mb-10">
            First access to drops, exclusive offers, and zero spam. Just pure NeechBakra energy.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-5 py-3.5 rounded-lg bg-white/5 border border-white/10 text-[#e8e8e8] placeholder-[#6b7280] focus:outline-none focus:border-[#39ff14] transition-colors"
            />
            <button type="submit" disabled={subLoading} className="btn-neon whitespace-nowrap">
              {subLoading ? 'Joining...' : 'Join Now'}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
