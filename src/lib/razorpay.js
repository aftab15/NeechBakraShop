/**
 * Load the Razorpay checkout script dynamically
 * @returns {Promise<boolean>}
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

/**
 * Open Razorpay Standard Checkout
 * @param {object} options
 */
export function openRazorpayCheckout({
  razorpayOrderId,
  amount,
  currency = 'INR',
  name = 'NeechBakra Store',
  description = 'Official NeechBakra Merch',
  prefillName,
  prefillEmail,
  prefillContact,
  onSuccess,
  onDismiss,
}) {
  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID
  if (!keyId) throw new Error('VITE_RAZORPAY_KEY_ID not set')

  const options = {
    key: keyId,
    amount,
    currency,
    name,
    description,
    image: '/favicon.svg',
    order_id: razorpayOrderId,
    prefill: {
      name: prefillName,
      email: prefillEmail,
      contact: prefillContact,
    },
    theme: {
      color: '#39ff14',
      backdrop_color: '#0a0a0a',
    },
    modal: {
      ondismiss: onDismiss,
      animation: true,
    },
    handler: (response) => {
      onSuccess({
        razorpayPaymentId: response.razorpay_payment_id,
        razorpayOrderId: response.razorpay_order_id,
        razorpaySignature: response.razorpay_signature,
      })
    },
  }

  const rzp = new window.Razorpay(options)
  rzp.on('payment.failed', (response) => {
    onDismiss?.(response.error)
  })
  rzp.open()
}
