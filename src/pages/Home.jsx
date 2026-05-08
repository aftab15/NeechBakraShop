import { Link } from 'react-router-dom'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { ArrowRight, Flame, Clock, Truck, RotateCcw, ShieldCheck, Users, MoveRight } from 'lucide-react'
import ProductGrid from '../components/product/ProductGrid'
import { useState, useEffect, useRef } from 'react'
import { useMutation } from 'convex/react'
import toast from 'react-hot-toast'
import { MOCK_FEATURED } from '../lib/mockProducts'
import { heroEntrance, scrollReveal, fadeUp } from '../lib/animations'

const isPlaceholder = import.meta.env.VITE_CONVEX_URL?.includes('placeholder')

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

const DROP_DATE = Date.now() + 3 * 24 * 3600 * 1000 + 5 * 3600 * 1000

const TRUST_ITEMS = [
  { icon: Truck,        label: 'Free Shipping',    sub: 'Orders above ₹999' },
  { icon: RotateCcw,   label: '7-Day Returns',    sub: 'No questions asked'  },
  { icon: ShieldCheck,  label: 'Secure Checkout',  sub: 'Razorpay encrypted'  },
  { icon: Users,        label: '10K+ Community',   sub: 'Join the squad'      },
]

export default function Home() {
  const rawFeatured = useQuery(api.products.getFeaturedProducts, isPlaceholder ? 'skip' : { limit: 4 })
  const featured = isPlaceholder ? MOCK_FEATURED : rawFeatured
  const countdown = useCountdown(DROP_DATE)
  const [email, setEmail] = useState('')
  const [subLoading, setSubLoading] = useState(false)
  const subscribe = useMutation(api.newsletter.subscribe)

  const badgeRef   = useRef(null)
  const titleRef   = useRef(null)
  const subRef     = useRef(null)
  const descRef    = useRef(null)
  const btnsRef    = useRef(null)
  const statsRef   = useRef(null)
  const trustRef   = useRef(null)
  const featRef    = useRef(null)
  const brandRef   = useRef(null)
  const dropRef    = useRef(null)
  const nlRef      = useRef(null)

  useEffect(() => {
    heroEntrance([badgeRef.current, titleRef.current, subRef.current, descRef.current, btnsRef.current], { delay: 0.1 })
    if (statsRef.current) fadeUp(statsRef.current, { delay: 0.85, y: 15 })
  }, [])

  useEffect(() => {
    [trustRef, featRef, brandRef, dropRef, nlRef].forEach(r => {
      if (r.current) scrollReveal(r.current, { y: 40 })
    })
  }, [])

  const handleSubscribe = async (e) => {
    e.preventDefault()
    setSubLoading(true)
    try {
      await subscribe({ email: email.trim().toLowerCase() })
      toast.success('You\'re in.')
      setEmail('')
    } catch { toast.error('Try again.') }
    setSubLoading(false)
  }

  return (
    <div className="flex flex-col" style={{ background: '#080808' }}>

      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ background: '#080808' }}
      >
        {/* Subtle grain */}
        <div className="absolute inset-0 noise-overlay pointer-events-none" />

        {/* Faint vertical lines */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 120px)',
        }} />

        {/* Big background letter */}
        <div
          className="absolute select-none pointer-events-none"
          style={{
            fontSize: 'clamp(200px, 40vw, 600px)',
            fontFamily: 'Orbitron, monospace',
            fontWeight: 900,
            color: 'rgba(255,255,255,0.025)',
            letterSpacing: '-0.06em',
            lineHeight: 1,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -52%)',
            userSelect: 'none',
          }}
        >
          NB
        </div>

        <div className="relative z-10 container text-center flex flex-col items-center">
          {/* Label */}
          <div ref={badgeRef} style={{ opacity: 0 }}>
            <div
              className="inline-flex items-center gap-2 mb-8"
              style={{
                padding: '6px 14px',
                border: '1px solid rgba(255,53,0,0.4)',
                borderRadius: '2px',
                background: 'rgba(255,53,0,0.08)',
              }}
            >
              <Flame className="w-3 h-3" style={{ color: '#FF3500' }} />
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', color: '#FF3500', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase' }}>
                Official Merch Store
              </span>
            </div>
          </div>

          {/* Wordmark */}
          <h1
            ref={titleRef}
            className="uppercase leading-none"
            style={{
              fontFamily: 'Orbitron, monospace',
              fontWeight: 900,
              fontSize: 'clamp(64px, 14vw, 180px)',
              letterSpacing: '-0.04em',
              color: '#F0EBE3',
              opacity: 0,
              lineHeight: 0.9,
            }}
          >
            Neech<br />
            <span style={{ color: '#FF3500', WebkitTextStroke: '0px', textShadow: '0 0 60px rgba(255,53,0,0.3)' }}>Bakra</span>
          </h1>

          {/* Tagline */}
          <p
            ref={subRef}
            className="uppercase mt-8"
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(16px, 3vw, 28px)',
              letterSpacing: '0.25em',
              color: '#A89E94',
              opacity: 0,
            }}
          >
            Wear the Madness. Own the Game.
          </p>

          <p
            ref={descRef}
            className="mt-4 max-w-md"
            style={{ fontSize: '15px', color: '#555', fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.6, opacity: 0 }}
          >
            Gaming streetwear for those who live the grind.<br />Limited drops. No restocks.
          </p>

          <div ref={btnsRef} className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10" style={{ opacity: 0 }}>
            <Link to="/shop" className="btn-neon text-sm px-8 py-3.5 gap-2.5">
              Shop the Drop <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/about" className="btn-outline-neon text-sm px-8 py-3.5">
              Our Story
            </Link>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="flex items-center justify-center gap-16 mt-24" style={{ opacity: 0 }}>
            {[['10K+', 'Community'], ['50+', 'Products'], ['2+', 'Years']].map(([num, label]) => (
              <div key={label} className="text-center">
                <p
                  className="font-black leading-none"
                  style={{ fontFamily: 'Orbitron, monospace', fontSize: '22px', color: '#F0EBE3', letterSpacing: '-0.02em' }}
                >
                  {num}
                </p>
                <p style={{ fontSize: '10px', color: '#555', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', marginTop: '6px' }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ opacity: 0.35 }}>
          <span style={{ fontSize: '9px', letterSpacing: '0.2em', color: '#555', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif' }}>Scroll</span>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, #555, transparent)' }} />
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div ref={trustRef} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#0D0D0D' }}>
        <div className="container py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x" style={{ '--tw-divide-opacity': 1 }}>
            {TRUST_ITEMS.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-4 md:px-10 first:pl-0 last:pr-0">
                <Icon className="w-5 h-5 flex-shrink-0" style={{ color: '#FF3500' }} />
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#F0EBE3', fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.4 }}>{label}</p>
                  <p style={{ fontSize: '12px', color: '#555', fontFamily: 'Space Grotesk, sans-serif', marginTop: '2px' }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURED DROPS ── */}
      <section className="section" style={{ background: '#080808' }}>
        <div className="container">
          <div ref={featRef} className="flex items-end justify-between mb-16">
            <div>
              <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', color: '#FF3500', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '10px' }}>
                New Drops
              </p>
              <h2
                className="uppercase font-black leading-none"
                style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(32px, 5vw, 56px)', color: '#F0EBE3', letterSpacing: '-0.01em' }}
              >
                Featured Merch
              </h2>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest transition-colors hover:text-[#FF3500]"
              style={{ color: '#A89E94', fontFamily: 'Space Grotesk, sans-serif' }}>
              View All <MoveRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={featured} loading={!isPlaceholder && rawFeatured === undefined} cols={4} />
          <div className="mt-10 flex md:hidden justify-center">
            <Link to="/shop" className="btn-outline-neon">View All Products</Link>
          </div>
        </div>
      </section>

      {/* ── BRAND STORY ── */}
      <section style={{ background: '#0D0D0D', borderTop: '1px solid rgba(255,255,255,0.06)' }} className="section">
        <div className="container">
          <div ref={brandRef} className="grid md:grid-cols-2 gap-20 items-start">
            <div>
              <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', color: '#FF3500', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '16px' }}>
                About the Brand
              </p>
              <h2
                className="uppercase font-black leading-none mb-8"
                style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(36px, 5vw, 60px)', color: '#F0EBE3' }}
              >
                Why<br />NeechBakra?
              </h2>
              <p style={{ color: '#888', fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', lineHeight: 1.75, marginBottom: '20px' }}>
                NeechBakra started as a gaming alias — and turned into a movement. We're the underdogs who outgrind everyone. The ones they said couldn't make it.
              </p>
              <p style={{ color: '#888', fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', lineHeight: 1.75, marginBottom: '40px' }}>
                Every drop is limited. Every design tells a story. From the grind to the stream, to the streets — this is for the real ones.
              </p>
              <div className="grid grid-cols-3 gap-px" style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', overflow: 'hidden' }}>
                {[
                  { emoji: '🎮', label: 'Gaming DNA' },
                  { emoji: '🔥', label: 'Bold Design' },
                  { emoji: '💜', label: 'Community' },
                ].map(({ emoji, label }) => (
                  <div key={label} className="flex flex-col items-center justify-center gap-3 py-8" style={{ background: '#111', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
                    <span style={{ fontSize: '22px' }}>{emoji}</span>
                    <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', color: '#666', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div
                className="w-full mx-auto noise-overlay"
                style={{
                  aspectRatio: '4/5',
                  background: 'linear-gradient(160deg, #111 0%, #1a0a00 60%, #2a0800 100%)',
                  borderRadius: '4px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  className="select-none"
                  style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: '120px', color: 'rgba(255,255,255,0.04)', lineHeight: 1, letterSpacing: '-0.04em' }}
                >
                  NB
                </span>
                {/* Accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: '#FF3500' }} />
              </div>
              <div
                className="absolute -bottom-3 -left-3 px-5 py-4"
                style={{ background: '#FF3500', borderRadius: '3px' }}
              >
                <p style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: '22px', color: '#000', lineHeight: 1 }}>10K+</p>
                <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(0,0,0,0.6)', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif' }}>Fans</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DROP COUNTDOWN ── */}
      <section className="section" style={{ background: '#080808' }}>
        <div className="container">
          <div ref={dropRef} style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            {/* Header */}
            <div className="flex items-center gap-3 px-10 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: '#FF3500' }}>
              <Clock className="w-4 h-4" style={{ color: '#000' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', color: '#000', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif' }}>Limited Drop Incoming</span>
            </div>
            <div className="px-10 py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-12" style={{ background: '#0D0D0D' }}>
              <div>
                <h2 className="uppercase font-black leading-none mb-3" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(36px, 6vw, 72px)', color: '#F0EBE3' }}>
                  Season 2 Drop
                </h2>
                <p style={{ color: '#555', fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px' }}>
                  The most hyped collection yet. Don't sleep on this.
                </p>
              </div>
              <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
                {[
                  [countdown.d ?? 0, 'Days'],
                  [countdown.h ?? 0, 'Hrs'],
                  [countdown.m ?? 0, 'Min'],
                  [countdown.s ?? 0, 'Sec'],
                ].map(([val, label], i) => (
                  <div key={label} className="flex items-center gap-3 md:gap-6">
                    <div className="flex flex-col items-center">
                      <span
                        className="font-black"
                        style={{ fontFamily: 'Orbitron, monospace', fontSize: 'clamp(28px, 4vw, 48px)', color: '#F0EBE3', letterSpacing: '-0.04em', lineHeight: 1 }}
                      >
                        {String(val).padStart(2, '0')}
                      </span>
                      <span style={{ fontSize: '9px', color: '#555', letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', marginTop: '4px' }}>{label}</span>
                    </div>
                    {i < 3 && <span style={{ color: '#333', fontSize: '24px', fontWeight: 100, lineHeight: 1 }}>:</span>}
                  </div>
                ))}
              </div>
            </div>
            <div className="px-10 py-6 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#0A0A0A' }}>
              <p style={{ fontSize: '12px', color: '#444', fontFamily: 'Space Grotesk, sans-serif' }}>Don't miss it — no restocks after this.</p>
              <Link to="/shop" className="btn-neon text-xs py-2.5 px-5 gap-2">
                Notify Me <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section style={{ background: '#0D0D0D', borderTop: '1px solid rgba(255,255,255,0.06)' }} className="section">
        <div className="container max-w-3xl mx-auto text-center">
          <div ref={nlRef}>
            <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', color: '#FF3500', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '16px' }}>
              Inner Circle
            </p>
            <h2 className="uppercase font-black leading-none mb-5" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(32px, 5vw, 52px)', color: '#F0EBE3' }}>
              First access.<br />Every drop.
            </h2>
            <p className="mb-10" style={{ color: '#666', fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', lineHeight: 1.7 }}>
              Zero spam. Just early access to every collection and exclusive community offers.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  flex: 1,
                  padding: '13px 16px',
                  background: '#111',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '3px',
                  color: '#F0EBE3',
                  fontSize: '14px',
                  fontFamily: 'Space Grotesk, sans-serif',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#FF3500'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
              <button type="submit" disabled={subLoading} className="btn-neon whitespace-nowrap">
                {subLoading ? 'Joining...' : 'Join Now'}
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  )
}
