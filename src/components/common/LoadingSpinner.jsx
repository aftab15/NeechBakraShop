export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12', xl: 'w-16 h-16' }
  return (
    <div className={`flex items-center justify-center ${className}`} role="status" aria-label="Loading">
      <div
        className={`${sizes[size]} rounded-full border-2 border-transparent animate-spin`}
        style={{
          borderTopColor: '#39ff14',
          borderRightColor: 'rgba(57,255,20,0.3)',
          boxShadow: '0 0 12px rgba(57,255,20,0.4)',
        }}
      />
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#0a0a0a' }}>
      <LoadingSpinner size="xl" />
      <p className="text-[#6b7280] text-sm uppercase tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
        Loading…
      </p>
    </div>
  )
}
