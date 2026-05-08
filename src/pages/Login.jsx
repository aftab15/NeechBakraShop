import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuthActions } from '@convex-dev/auth/react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useForm } from 'react-hook-form'
import { Zap, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn } = useAuthActions()
  const me = useQuery(api.users.getMe)
  const ensureUser = useMutation(api.users.ensureUserRecord)

  const [mode, setMode] = useState('signIn')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const from = location.state?.from || '/'

  useEffect(() => {
    if (me) navigate(from, { replace: true })
  }, [me, navigate, from])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('email', data.email.trim().toLowerCase())
      formData.append('password', data.password)
      formData.append('flow', mode === 'signIn' ? 'signIn' : 'signUp')
      if (mode === 'signUp' && data.name) formData.append('name', data.name)

      await signIn('password', formData)
      await ensureUser({ name: data.name, email: data.email.trim().toLowerCase() }).catch(() => {})
      toast.success(mode === 'signIn' ? 'Welcome back!' : 'Account created! 🎮')
    } catch (err) {
      const msg = err?.message?.includes('InvalidAccountId')
        ? 'Invalid email or password'
        : err?.message?.includes('already exists')
          ? 'Account already exists. Try signing in.'
          : 'Authentication failed. Try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-6" style={{ background: '#080808' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 120px)' }} />

      <div className="relative w-full max-w-md">
        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '52px 48px' }}>
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 flex items-center justify-center" style={{ background: 'rgba(255,53,0,0.1)', border: '1px solid rgba(255,53,0,0.25)', borderRadius: '4px' }}>
              <Zap className="w-6 h-6" style={{ color: '#FF3500' }} />
            </div>
          </div>

          <h1
            className="text-3xl font-black uppercase text-center mb-2"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: '#F0EBE3' }}
          >
            {mode === 'signIn' ? 'Welcome Back' : 'Join the Squad'}
          </h1>
          <p className="text-center mb-8" style={{ color: '#6b7280', fontSize: '14px', fontFamily: 'Space Grotesk, sans-serif' }}>
            {mode === 'signIn' ? 'Sign in to your NeechBakra account' : 'Create your account to start shopping'}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {mode === 'signUp' && (
              <div>
                <label className="mb-2 block" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6b7280', fontFamily: 'Space Grotesk, sans-serif' }}>Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Too short' } })}
                    placeholder="Your name"
                    className="w-full pl-10 pr-4 py-3 bg-[#0D0D0D] border border-white/10 text-[#F0EBE3] placeholder-[#444] focus:outline-none focus:border-[#FF3500] transition-colors"
                  />
                </div>
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
              </div>
            )}

            <div>
              <label className="mb-2 block" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6b7280', fontFamily: 'Space Grotesk, sans-serif' }}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                  })}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#0D0D0D] border border-white/10 text-[#F0EBE3] placeholder-[#444] focus:outline-none focus:border-[#FF3500] transition-colors"
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-2 block" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6b7280', fontFamily: 'Space Grotesk, sans-serif' }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'At least 8 characters' },
                  })}
                  placeholder={mode === 'signIn' ? 'Your password' : 'Create a strong password'}
                  className="w-full pl-10 pr-10 py-3 bg-[#0D0D0D] border border-white/10 text-[#F0EBE3] placeholder-[#444] focus:outline-none focus:border-[#FF3500] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#F0EBE3]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-neon w-full justify-center mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : mode === 'signIn' ? 'Sign In' : 'Create Account'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')}
              className="text-sm text-[#9ca3af] hover:text-[#FF3500] transition-colors"
            >
              {mode === 'signIn' ? (
                <>Don't have an account? <span className="font-bold text-[#FF3500]">Sign up</span></>
              ) : (
                <>Already have an account? <span className="font-bold text-[#FF3500]">Sign in</span></>
              )}
            </button>
          </div>

          <p className="text-xs text-[#6b7280] text-center mt-6">
            By continuing you agree to our{' '}
            <Link to="/terms" className="text-[#FF3500] hover:underline">Terms</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-[#FF3500] hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
