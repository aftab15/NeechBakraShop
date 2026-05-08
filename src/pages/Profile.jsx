import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useForm } from 'react-hook-form'
import { User, Mail, Phone, Save, Package, Heart, Shield, LogOut } from 'lucide-react'
import { useAuthActions } from '@convex-dev/auth/react'
import { PageLoader } from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function Profile() {
  const me = useQuery(api.users.getMe)
  const updateProfile = useMutation(api.users.updateProfile)
  const { signOut } = useAuthActions()
  const [editing, setEditing] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  if (me === undefined) return <PageLoader />
  if (!me) return null

  const onSave = async (data) => {
    try {
      await updateProfile({
        name: data.name?.trim() || undefined,
        phone: data.phone?.trim() || undefined,
      })
      toast.success('Profile updated!')
      setEditing(false)
    } catch {
      toast.error('Failed to update profile')
    }
  }

  return (
    <div className="min-h-screen py-14 md:py-20" style={{ background: '#080808' }}>
      <div className="container max-w-4xl mx-auto">
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: '24px', marginBottom: '40px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: '#FF3500', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', display: 'block', marginBottom: '10px' }}>
            Account
          </span>
          <h1 className="uppercase font-black leading-none" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(32px, 5vw, 56px)', color: '#F0EBE3' }}>
            My Profile
          </h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <aside className="md:col-span-1">
            <div className="flex flex-col gap-2 p-7" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px' }}>
              <div className="flex items-center gap-3 pb-5 mb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,53,0,0.08)', border: '1px solid rgba(255,53,0,0.2)', borderRadius: '3px' }}>
                  <User className="w-5 h-5" style={{ color: '#FF3500' }} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold truncate" style={{ color: '#F0EBE3', fontFamily: 'Rajdhani, sans-serif', fontSize: '14px' }}>
                    {me.name || 'NeechBakra Fan'}
                  </p>
                  <p className="truncate" style={{ fontSize: '11px', color: '#555', fontFamily: 'Space Grotesk, sans-serif' }}>{me.email}</p>
                </div>
              </div>

              <NavItem to="/profile" icon={User} label="Profile" active />
              <NavItem to="/orders" icon={Package} label="My Orders" />
              <NavItem to="/wishlist" icon={Heart} label="Wishlist" />
              {me.role === 'admin' && (
                <NavItem to="/admin" icon={Shield} label="Admin Dashboard" />
              )}

              <button
                onClick={async () => { await signOut(); toast.success('Signed out') }}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-left transition-colors"
                style={{ fontFamily: 'Space Grotesk, sans-serif', borderRadius: '3px', color: '#ef4444' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </aside>

          <section className="md:col-span-2">
            <div className="p-10 md:p-12" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="uppercase font-black" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '22px', color: '#F0EBE3' }}>
                  Account Details
                </h2>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#FF3500', fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={() => setEditing(false)}
                    style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    Cancel
                  </button>
                )}
              </div>

              {editing ? (
                <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-4">
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', color: '#555', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', display: 'block', marginBottom: '8px' }}>
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#555' }} />
                      <input
                        type="text"
                        defaultValue={me.name}
                        {...register('name', { required: 'Required' })}
                        className="w-full pl-10 pr-4 py-3 transition-colors focus:outline-none"
                        style={{ background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#F0EBE3', fontSize: '14px', fontFamily: 'Space Grotesk, sans-serif' }}
                        onFocus={e => e.target.style.borderColor = '#FF3500'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                    </div>
                    {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', color: '#555', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', display: 'block', marginBottom: '8px' }}>
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#555' }} />
                      <input
                        type="tel"
                        defaultValue={me.phone}
                        {...register('phone', { pattern: { value: /^[0-9]{10}$/, message: '10 digits' } })}
                        placeholder="9876543210"
                        className="w-full pl-10 pr-4 py-3 transition-colors focus:outline-none"
                        style={{ background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#F0EBE3', fontSize: '14px', fontFamily: 'Space Grotesk, sans-serif' }}
                        onFocus={e => e.target.style.borderColor = '#FF3500'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>}
                  </div>

                  <button type="submit" className="btn-neon self-start mt-2 gap-2">
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </form>
              ) : (
                <div className="flex flex-col gap-5">
                  <Detail icon={User} label="Name" value={me.name || '—'} />
                  <Detail icon={Mail} label="Email" value={me.email || '—'} />
                  <Detail icon={Phone} label="Phone" value={me.phone || '—'} />
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function NavItem({ to, icon: Icon, label, active }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all"
      style={{
        fontFamily: 'Space Grotesk, sans-serif',
        borderRadius: '3px',
        background: active ? 'rgba(255,53,0,0.08)' : 'transparent',
        color: active ? '#FF3500' : '#888',
        border: active ? '1px solid rgba(255,53,0,0.2)' : '1px solid transparent',
      }}
    >
      <Icon className="w-4 h-4" /> {label}
    </Link>
  )
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '3px' }}>
        <Icon className="w-4 h-4" style={{ color: '#555' }} />
      </div>
      <div>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', color: '#555', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '3px' }}>{label}</p>
        <p style={{ fontSize: '14px', color: '#F0EBE3', fontFamily: 'Space Grotesk, sans-serif' }}>{value}</p>
      </div>
    </div>
  )
}
