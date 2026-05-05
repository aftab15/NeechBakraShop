import { Link, useSearchParams } from 'react-router-dom'
import { XCircle, RefreshCw, ArrowRight, ShieldAlert } from 'lucide-react'

export default function OrderFailed() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-2xl mx-auto">
        <div className="glass-strong rounded-3xl p-8 md:p-12 text-center" style={{ border: '1px solid rgba(239,68,68,0.3)' }}>
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)' }}>
            <XCircle className="w-10 h-10 text-red-400" />
          </div>

          <h1
            className="text-4xl md:text-5xl font-black uppercase mb-3"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}
          >
            Payment Failed
          </h1>
          <p className="text-[#9ca3af] mb-8 max-w-md mx-auto">
            Your payment could not be processed. Don't worry — no amount has been deducted. Please try again or use a different payment method.
          </p>

          <div className="glass rounded-2xl p-5 mb-8 flex items-start gap-3 text-left">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-yellow-400" />
            <div>
              <p className="text-sm font-bold text-[#e8e8e8]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                What to do next
              </p>
              <ul className="text-xs text-[#9ca3af] mt-2 space-y-1 list-disc list-inside">
                <li>Check your card details and try again</li>
                <li>Try a different payment method (UPI, NetBanking, Wallet)</li>
                <li>Make sure you have sufficient balance</li>
                <li>Contact your bank if the issue persists</li>
              </ul>
            </div>
          </div>

          {orderId && (
            <p className="text-xs text-[#6b7280] mb-6">
              Reference Order: <span className="font-mono text-[#9ca3af]">{orderId.slice(-12).toUpperCase()}</span>
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/checkout" className="btn-neon">
              <RefreshCw className="w-4 h-4" /> Try Again
            </Link>
            <Link to="/contact" className="btn-outline-neon">
              Contact Support <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
