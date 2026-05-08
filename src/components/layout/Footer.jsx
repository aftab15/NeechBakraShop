import { Link } from 'react-router-dom'
import { Youtube, Instagram, Twitter, Twitch } from 'lucide-react'
import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import Logo from '../common/Logo'
import toast from 'react-hot-toast'

const policyLinks = [
  { to: '/terms',           label: 'Terms & Conditions' },
  { to: '/privacy',         label: 'Privacy Policy'     },
  { to: '/refund-policy',   label: 'Refund Policy'      },
  { to: '/shipping-policy', label: 'Shipping Policy'    },
]

const shopLinks = [
  { to: '/shop?category=hoodies',    label: 'Hoodies'        },
  { to: '/shop?category=tees',       label: 'Oversized Tees' },
  { to: '/shop?category=caps',       label: 'Caps'           },
  { to: '/shop?category=mousepads',  label: 'Mousepads'      },
  { to: '/shop?category=stickers',   label: 'Stickers'       },
]

const socialLinks = [
  { icon: Youtube,   href: 'https://youtube.com/@NeechBakra',   label: 'YouTube'   },
  { icon: Instagram, href: 'https://instagram.com/NeechBakra',  label: 'Instagram' },
  { icon: Twitter,   href: 'https://twitter.com/NeechBakra',    label: 'Twitter'   },
  { icon: Twitch,    href: 'https://twitch.tv/NeechBakra',      label: 'Twitch'    },
]

const COL_LABEL = { fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', color: '#555', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '20px', display: 'block' }
const LINK_STYLE = { fontSize: '13px', color: '#666', fontFamily: 'Space Grotesk, sans-serif', transition: 'color 0.15s' }

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
      if (res.status === 'already_subscribed') toast('Already in the squad.', { icon: '📬' })
      else toast.success('You\'re in.')
      setEmail('')
    } catch {
      toast.error('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer style={{ background: '#0A0A0A', borderTop: '1px solid rgba(255,255,255,0.07)' }} className="mt-auto">
      <div className="container pt-28 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 pb-20" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5" aria-label="NeechBakra home">
              <Logo size={36} />
              <span style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: '16px', letterSpacing: '0.06em', color: '#F0EBE3' }}>
                Neech<span style={{ color: '#FF3500' }}>Bakra</span>
              </span>
            </Link>
            <p style={{ ...LINK_STYLE, lineHeight: 1.7, marginBottom: '20px' }}>
              Gaming. Creating. Merching.<br />
              Wear the Madness. Own the Game.
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center transition-colors hover:text-[#F0EBE3]"
                  style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', color: '#555' }}
                  aria-label={label}
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <span style={COL_LABEL}>Shop</span>
            <ul className="space-y-3">
              {shopLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} style={LINK_STYLE} className="hover:text-[#F0EBE3]">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <span style={COL_LABEL}>Legal</span>
            <ul className="space-y-3">
              {policyLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} style={LINK_STYLE} className="hover:text-[#F0EBE3]">{l.label}</Link>
                </li>
              ))}
              <li>
                <Link to="/contact" style={LINK_STYLE} className="hover:text-[#F0EBE3]">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <span style={COL_LABEL}>Join the Squad</span>
            <p style={{ ...LINK_STYLE, marginBottom: '14px', lineHeight: 1.6 }}>Early access to every drop.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  padding: '10px 14px',
                  background: '#111',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '3px',
                  color: '#F0EBE3',
                  fontSize: '13px',
                  fontFamily: 'Space Grotesk, sans-serif',
                  outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = '#FF3500'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
              <button type="submit" disabled={loading} className="btn-neon justify-center py-2.5 text-xs">
                {loading ? 'Joining...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p style={{ fontSize: '12px', color: '#444', fontFamily: 'Space Grotesk, sans-serif' }}>
            © {new Date().getFullYear()} NeechBakra. All rights reserved.
          </p>
          <p style={{ fontSize: '12px', color: '#444', fontFamily: 'Space Grotesk, sans-serif' }}>
            Made for the grind.
          </p>
        </div>
      </div>
    </footer>
  )
}
