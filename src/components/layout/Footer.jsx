import { Link } from 'react-router-dom'
import { Zap, Youtube, Instagram, Twitter, Twitch } from 'lucide-react'
import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import toast from 'react-hot-toast'

const policyLinks = [
  { to: '/terms', label: 'Terms & Conditions' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/refund-policy', label: 'Refund Policy' },
  { to: '/shipping-policy', label: 'Shipping Policy' },
]

const shopLinks = [
  { to: '/shop?category=hoodies', label: 'Hoodies' },
  { to: '/shop?category=tees', label: 'Oversized Tees' },
  { to: '/shop?category=caps', label: 'Caps' },
  { to: '/shop?category=mousepads', label: 'Mousepads' },
  { to: '/shop?category=stickers', label: 'Stickers' },
]

const socialLinks = [
  { icon: Youtube, href: 'https://youtube.com/@NeechBakra', label: 'YouTube', color: '#ff0000' },
  { icon: Instagram, href: 'https://instagram.com/NeechBakra', label: 'Instagram', color: '#e1306c' },
  { icon: Twitter, href: 'https://twitter.com/NeechBakra', label: 'Twitter', color: '#1da1f2' },
  { icon: Twitch, href: 'https://twitch.tv/NeechBakra', label: 'Twitch', color: '#9147ff' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const subscribe = useMutation(api.newsletter.subscribe)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      const res = await subscribe({ email: email.trim().toLowerCase() })
      if (res.status === 'already_subscribed') toast('Already subscribed!', { icon: '📬' })
      else toast.success('You\'re in the squad! 🎮')
      setEmail('')
    } catch {
      toast.error('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="bg-[#0d0d0d] border-t border-white/10 pt-20 pb-10 mt-auto">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5" style={{ color: '#39ff14' }} />
              <span style={{ fontFamily: 'Orbitron, monospace', color: '#39ff14', fontWeight: 900, fontSize: '18px', letterSpacing: '0.1em' }}>
                NeechBakra
              </span>
            </Link>
            <p className="text-[#6b7280] leading-relaxed mb-6" style={{ fontSize: '13px', fontFamily: 'Space Grotesk, sans-serif' }}>
              Gaming. Creating. Merching. The official store for NeechBakra fans. Wear the Madness. Own the Game.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label, color }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg glass transition-transform hover:scale-110"
                  aria-label={label}
                  style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-5" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>
              Shop
            </h4>
            <ul className="space-y-3">
              {shopLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-[#6b7280] hover:text-[#39ff14] transition-colors" style={{ fontSize: '13px', fontFamily: 'Space Grotesk, sans-serif' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-5" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>
              Legal
            </h4>
            <ul className="space-y-3">
              {policyLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-[#6b7280] hover:text-[#39ff14] transition-colors" style={{ fontSize: '13px', fontFamily: 'Space Grotesk, sans-serif' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/contact" className="text-[#6b7280] hover:text-[#39ff14] transition-colors" style={{ fontSize: '13px', fontFamily: 'Space Grotesk, sans-serif' }}>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>
              Join the Squad
            </h4>
            <p className="text-[#6b7280] mb-4" style={{ fontSize: '13px', fontFamily: 'Space Grotesk, sans-serif' }}>Get early access to drops, exclusive deals & chaos.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[#e8e8e8] text-sm placeholder-[#6b7280] focus:outline-none focus:border-[#39ff14] transition-colors"
              />
              <button type="submit" disabled={loading} className="btn-neon justify-center">
                {loading ? 'Joining...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p style={{ color: '#6b7280', fontSize: '12px', fontFamily: 'Space Grotesk, sans-serif' }}>
            © {new Date().getFullYear()} NeechBakra. All rights reserved.
          </p>
          <p style={{ color: '#6b7280', fontSize: '12px', fontFamily: 'Space Grotesk, sans-serif' }} className="flex items-center gap-1">
            Made with <span style={{ color: '#39ff14' }}>⚡</span> for the gaming community
          </p>
        </div>
      </div>
    </footer>
  )
}
