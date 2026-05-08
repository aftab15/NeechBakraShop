export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12', xl: 'w-16 h-16' }
  return (
    <div className={`flex items-center justify-center ${className}`} role="status" aria-label="Loading">
      <div
        className={`${sizes[size]} rounded-full border-2 border-transparent animate-spin`}
        style={{
          borderTopColor: '#FF3500',
          borderRightColor: 'rgba(255,53,0,0.3)',
        }}
      />
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#080808' }}>
      <LoadingSpinner size="xl" />
      <p className="uppercase tracking-widest" style={{ color: '#555', fontSize: '12px', fontFamily: 'Space Grotesk, sans-serif' }}>
        Loading…
      </p>
    </div>
  )
}
