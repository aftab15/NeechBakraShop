import { useState } from 'react'
import { useAction } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { loadRazorpayScript, openRazorpayCheckout } from '../../lib/razorpay'
import { calculateOrderTotals, formatPrice } from '../../lib/utils'
import { Zap } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RazorpayButton({
  orderId,
  subtotal,
  userProfile,
  onSuccess,
  onFailure,
  disabled,
}) {
  const [loading, setLoading] = useState(false)
  const createRazorpayOrder = useAction(api.payments.createRazorpayOrder)
  const verifyPayment = useAction(api.payments.verifyPayment)

  const { total } = calculateOrderTotals(subtotal)

  const handlePay = async () => {
    setLoading(true)
    try {
      // 1. Load Razorpay SDK
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        toast.error('Failed to load payment gateway. Check your connection.')
        setLoading(false)
        return
      }

      // 2. Create Razorpay order from backend (amount + secret stay server-side)
      const { razorpayOrderId, amount, currency } = await createRazorpayOrder({
        orderId,
        currency: 'INR',
      })

      // 3. Open Razorpay Standard Checkout
      openRazorpayCheckout({
        razorpayOrderId,
        amount,
        currency,
        prefillName: userProfile?.name,
        prefillEmail: userProfile?.email,
        prefillContact: userProfile?.phone,
        onSuccess: async ({ razorpayPaymentId, razorpayOrderId: rpOrderId, razorpaySignature }) => {
          try {
            // 4. Verify signature on backend
            const result = await verifyPayment({
              orderId,
              razorpayOrderId: rpOrderId,
              razorpayPaymentId,
              razorpaySignature,
            })
            if (result.success) {
              toast.success('Payment successful! 🎉')
              onSuccess?.({ razorpayPaymentId, orderId })
            } else {
              toast.error('Payment verification failed!')
              onFailure?.()
            }
          } catch {
            toast.error('Verification error. Contact support.')
            onFailure?.()
          }
          setLoading(false)
        },
        onDismiss: (error) => {
          if (error) toast.error(`Payment failed: ${error.description || 'Unknown error'}`)
          else toast('Payment cancelled.', { icon: '❌' })
          setLoading(false)
          onFailure?.()
        },
      })
    } catch (err) {
      toast.error(err.message || 'Payment initiation failed')
      setLoading(false)
      onFailure?.()
    }
  }

  return (
    <button
      onClick={handlePay}
      disabled={disabled || loading}
      className="btn-neon w-full justify-center text-base py-4 gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={loading ? 'Processing payment' : `Pay ${formatPrice(total)} with Razorpay`}
    >
      <Zap className="w-5 h-5" />
      {loading ? 'Processing...' : `Pay ${formatPrice(total)}`}
    </button>
  )
}
