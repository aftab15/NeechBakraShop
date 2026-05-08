import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Zap, Target, Users, ArrowRight } from 'lucide-react'
import { scrollReveal } from '../lib/animations'

const OVERLINE = { fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: '#FF3500', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '16px', display: 'block' }

export default function About() {
  const heroRef   = useRef(null)
  const originRef = useRef(null)
  const valuesRef = useRef(null)
  const ctaRef    = useRef(null)

  useEffect(() => {
    [heroRef, originRef, valuesRef, ctaRef].forEach(r => {
      if (r.current) scrollReveal(r.current, { y: 40 })
    })
  }, [])

  return (
    <div className="min-h-screen" style={{ background: '#080808' }}>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ background: '#080808', padding: '140px 0' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 120px)',
        }} />
        <div ref={heroRef} className="relative container text-center">
          <div className="inline-flex items-center gap-2 mb-8 px-3 py-1.5" style={{ border: '1px solid rgba(255,53,0,0.3)', borderRadius: '2px', background: 'rgba(255,53,0,0.07)' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', color: '#FF3500', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif' }}>Our Story</span>
          </div>
          <h1 className="uppercase font-black leading-none mb-6" style={{ fontFamily: 'Orbitron, monospace', fontSize: 'clamp(36px, 8vw, 96px)', color: '#F0EBE3' }}>
            Born from<br /><span style={{ color: '#FF3500' }}>the grind</span>
          </h1>
          <p className="max-w-xl mx-auto" style={{ fontSize: '16px', color: '#666', fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.7 }}>
            NeechBakra started as a gaming alias. A late-night handle. A meme.
            Today it's a movement — by the underdogs, for the underdogs.
          </p>
        </div>
      </section>

      {/* ── ORIGIN ── */}
      <section className="section" style={{ background: '#0D0D0D', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container max-w-4xl">
          <div ref={originRef} className="grid md:grid-cols-2 gap-20 items-start">
            <div>
              <span style={OVERLINE}>The Origin</span>
              <h2 className="uppercase font-black leading-none mb-8" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(28px, 4vw, 48px)', color: '#F0EBE3' }}>
                From streams<br />to streets
              </h2>
              <div className="flex flex-col gap-5" style={{ color: '#666', fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', lineHeight: 1.75 }}>
                <p>What started as marathon gaming sessions and unfiltered streams turned into something bigger — a tribe of fans who believed in chaos, hustle, and never settling.</p>
                <p>Every drop carries that energy. Every stitch tells a story. We don't make merch for everyone — we make it for the ones who get it.</p>
              </div>
            </div>
            <div className="relative">
              <div className="w-full max-w-sm mx-auto noise-overlay" style={{ aspectRatio: '4/5', background: 'linear-gradient(160deg, #111 0%, #1a0800 60%, #2a0800 100%)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: '100px', color: 'rgba(255,255,255,0.04)', lineHeight: 1 }}>NB</span>
                <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: '#FF3500' }} />
              </div>
              <div className="absolute -bottom-3 -right-3 px-4 py-3" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
                <p style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: '18px', color: '#FF3500' }}>Est.</p>
                <p style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: '28px', color: '#F0EBE3', lineHeight: 1 }}>2023</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="section" style={{ background: '#080808' }}>
        <div className="container">
          <div className="mb-16">
            <span style={OVERLINE}>What we stand for</span>
            <h2 className="uppercase font-black leading-none" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(32px, 4vw, 56px)', color: '#F0EBE3' }}>
              Three things we never<br />compromise on
            </h2>
          </div>
          <div ref={valuesRef} className="grid md:grid-cols-3 gap-px" style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', overflow: 'hidden' }}>
            {[
              { icon: Zap,    color: '#FF3500', title: 'Bold Energy',      desc: 'No safe designs. No corporate vibes. Every piece is loud, proud, and unapologetic.' },
              { icon: Target, color: '#F0EBE3', title: 'Quality First',    desc: 'Heavyweight fabrics. Premium prints. Built to last from your first stream to your 1000th.' },
              { icon: Users,  color: '#FF3500', title: 'Community Always', desc: "You're not a customer — you're part of the squad. We listen, we drop, we evolve together." },
            ].map(({ icon: Icon, color, title, desc }, i) => (
              <div
                key={title}
                className="flex flex-col transition-colors"
                style={{ background: '#111', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none', padding: '48px 40px', gap: '24px' }}
                onMouseEnter={e => e.currentTarget.style.background = '#161616'}
                onMouseLeave={e => e.currentTarget.style.background = '#111'}
              >
                <Icon className="w-7 h-7" style={{ color }} />
                <div>
                  <h3 className="uppercase font-black mb-4" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '24px', color: '#F0EBE3' }}>{title}</h3>
                  <p style={{ color: '#666', fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', lineHeight: 1.75 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section" style={{ background: '#0D0D0D', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container max-w-2xl">
          <div ref={ctaRef}>
            <span style={OVERLINE}>Ready?</span>
            <h2 className="uppercase font-black leading-none mb-6" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(36px, 6vw, 72px)', color: '#F0EBE3' }}>
              Wear the<br /><span style={{ color: '#FF3500' }}>madness.</span>
            </h2>
            <p className="mb-10" style={{ color: '#666', fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', lineHeight: 1.7 }}>
              Shop the latest drops or get in touch — we're always building something new.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/shop" className="btn-neon gap-2">Shop the Drop <ArrowRight className="w-4 h-4" /></Link>
              <Link to="/contact" className="btn-outline-neon">Get in Touch</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
