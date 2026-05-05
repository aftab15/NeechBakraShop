import { Link } from 'react-router-dom'
import { Zap, Target, Users, Sparkles, ArrowRight } from 'lucide-react'

export default function About() {
  return (
    <div className="min-h-screen">
      <section className="relative py-24 md:py-32 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #0d0a1a 50%, #0a0a0a 100%)' }}>
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: '#39ff14' }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ background: '#8b5cf6' }} />

        <div className="relative container text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 glass" style={{ border: '1px solid rgba(57,255,20,0.3)' }}>
            <Sparkles className="w-4 h-4" style={{ color: '#39ff14' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#39ff14', fontFamily: 'Rajdhani, sans-serif' }}>Our Story</span>
          </div>

          <h1
            className="text-5xl md:text-7xl font-black uppercase mb-6"
            style={{ fontFamily: 'Orbitron, monospace', color: '#e8e8e8' }}
          >
            Born from <span style={{ color: '#39ff14', textShadow: '0 0 30px rgba(57,255,20,0.5)' }}>the grind</span>
          </h1>

          <p className="text-lg md:text-xl text-[#9ca3af] max-w-2xl mx-auto leading-relaxed">
            NeechBakra started as a gaming alias. A late-night handle. A meme.
            Today it's a movement — by the underdogs, for the underdogs.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: '#0d0d0d' }}>
        <div className="container max-w-4xl">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#39ff14] mb-3 block">The Origin</span>
              <h2 className="text-3xl md:text-4xl font-black uppercase mb-6" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>
                From streams to streets
              </h2>
              <div className="flex flex-col gap-4 text-[#9ca3af] leading-relaxed">
                <p>
                  What started as marathon gaming sessions and unfiltered streams turned into something bigger — a tribe of fans who believed in chaos, hustle, and never settling.
                </p>
                <p>
                  Every drop carries that energy. Every stitch tells a story. We don't make merch for everyone — we make it for the ones who get it.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="w-full max-w-sm mx-auto aspect-square rounded-3xl overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a0533 0%, #0a1a2e 50%, #001a0d 100%)' }}>
                <span className="text-[140px] font-black opacity-15 select-none" style={{ fontFamily: 'Orbitron, monospace', color: '#39ff14' }}>NB</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#0a0a0a' }}>
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black uppercase mb-4" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>
              What we stand for
            </h2>
            <p className="text-[#6b7280]">Three things we never compromise on</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, color: '#39ff14', title: 'Bold Energy', desc: 'No safe designs. No corporate vibes. Every piece is loud, proud, and unapologetic.' },
              { icon: Target, color: '#8b5cf6', title: 'Quality First', desc: 'Heavyweight fabrics. Premium prints. Built to last from your first stream to your 1000th.' },
              { icon: Users, color: '#007cf0', title: 'Community Always', desc: 'You\'re not a customer — you\'re part of the squad. We listen, we drop, we evolve together.' },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="glass rounded-2xl p-8 transition-all hover:scale-[1.02]" style={{ border: `1px solid ${color}33` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}1a`, border: `1px solid ${color}4d` }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <h3 className="text-xl font-black uppercase mb-2" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>{title}</h3>
                <p className="text-sm text-[#9ca3af] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#0d0d0d' }}>
        <div className="container max-w-3xl text-center">
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-6" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>
            Ready to wear the <span style={{ color: '#39ff14' }}>madness</span>?
          </h2>
          <p className="text-[#9ca3af] mb-10">
            Drop your email for first dibs on every collection. Or skip the wait and shop the latest now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" className="btn-neon">Shop the Drop <ArrowRight className="w-4 h-4" /></Link>
            <Link to="/contact" className="btn-outline-neon">Get in Touch</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
