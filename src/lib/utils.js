/** Format price from paise to INR display string */
export function formatPrice(paise) {
  if (paise == null) return '—'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(paise / 100)
}

/** Calculate discount percentage */
export function discountPercent(price, compareAtPrice) {
  if (!compareAtPrice || compareAtPrice <= price) return 0
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
}

/** Truncate text to max length */
export function truncate(text, max = 80) {
  if (!text) return ''
  return text.length > max ? text.slice(0, max) + '…' : text
}

/** Slugify a string */
export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** Calculate order totals (all in paise) */
export function calculateOrderTotals(subtotal) {
  const shippingFee = subtotal >= 99900 ? 0 : 9900   // Free shipping over ₹999
  const tax = Math.round(subtotal * 0.18)              // 18% GST
  const total = subtotal + shippingFee + tax
  return { shippingFee, tax, total }
}

/** Format date */
export function formatDate(timestamp) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(timestamp))
}

/** Get order status color class */
export function getStatusColor(status) {
  const map = {
    pending: 'text-yellow-400',
    confirmed: 'text-blue-400',
    processing: 'text-purple-400',
    shipped: 'text-cyan-400',
    delivered: 'text-green-400',
    cancelled: 'text-red-400',
    refunded: 'text-orange-400',
  }
  return map[status] ?? 'text-gray-400'
}

/** Get payment status color */
export function getPaymentStatusColor(status) {
  const map = {
    pending: 'text-yellow-400',
    paid: 'text-green-400',
    failed: 'text-red-400',
    refunded: 'text-orange-400',
  }
  return map[status] ?? 'text-gray-400'
}

/** cn utility for conditional classes */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
