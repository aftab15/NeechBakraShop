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
    } catch (err) {
      toast.error('Failed to update profile')
    }
  }

  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black uppercase mb-8" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>
          My Profile
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          <aside className="md:col-span-1">
            <div className="glass rounded-2xl p-6 flex flex-col gap-3" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(57,255,20,0.1)' }}>
                  <User className="w-6 h-6" style={{ color: '#39ff14' }} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: '#e8e8e8', fontFamily: 'Rajdhani, sans-serif' }}>
                    {me.name || 'NeechBakra Fan'}
                  </p>
                  <p className="text-xs text-[#6b7280] truncate">{me.email}</p>
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
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-white/5 transition-colors text-left"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </aside>

          <section className="md:col-span-2">
            <div className="glass rounded-2xl p-6 md:p-8" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black uppercase" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>
                  Account Details
                </h2>
                {!editing ? (
                  <button onClick={() => setEditing(true)} className="text-sm font-bold uppercase tracking-widest text-[#39ff14] hover:underline" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    Edit
                  </button>
                ) : (
                  <button onClick={() => setEditing(false)} className="text-sm font-bold uppercase tracking-widest text-[#6b7280] hover:text-[#e8e8e8]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    Cancel
                  </button>
                )}
              </div>

              {editing ? (
                <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-[#6b7280] mb-2 block">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                      <input
                        type="text"
                        defaultValue={me.name}
                        {...register('name', { required: 'Required' })}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-[#e8e8e8] focus:outline-none focus:border-[#39ff14] transition-colors"
                      />
                    </div>
                    {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-[#6b7280] mb-2 block">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                      <input
                        type="tel"
                        defaultValue={me.phone}
                        {...register('phone', {
                          pattern: { value: /^[0-9]{10}$/, message: '10 digits' },
                        })}
                        placeholder="9876543210"
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-[#e8e8e8] focus:outline-none focus:border-[#39ff14] transition-colors"
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>}
                  </div>

                  <button type="submit" className="btn-neon self-start mt-2">
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
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
      style={{
        fontFamily: 'Rajdhani, sans-serif',
        background: active ? 'rgba(57,255,20,0.08)' : 'transparent',
        color: active ? '#39ff14' : '#9ca3af',
        border: active ? '1px solid rgba(57,255,20,0.2)' : '1px solid transparent',
      }}
    >
      <Icon className="w-4 h-4" /> {label}
    </Link>
  )
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <Icon className="w-4 h-4 text-[#9ca3af]" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-[#6b7280]">{label}</p>
        <p className="text-base font-medium text-[#e8e8e8]">{value}</p>
      </div>
    </div>
  )
}
