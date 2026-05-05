import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useForm } from 'react-hook-form'
import { selectCartItems, selectCartTotal, clearCart } from '../features/cart/cartSlice'
import { calculateOrderTotals } from '../lib/utils'
import CheckoutSummary from '../components/checkout/CheckoutSummary'
import RazorpayButton from '../components/checkout/RazorpayButton'
import EmptyState from '../components/common/EmptyState'
import { ChevronRight, MapPin, User, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

const isPlaceholder = import.meta.env.VITE_CONVEX_URL?.includes('placeholder')

export default function Checkout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const subtotal = useSelector(selectCartTotal)
  const me = useQuery(api.users.getMe, isPlaceholder ? 'skip' : {})
  const createOrder = useMutation(api.orders.createOrder)

  const [orderId, setOrderId] = useState(null)
  const [creatingOrder, setCreatingOrder] = useState(false)
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      country: 'India',
    },
  })

  if (items.length === 0 && !orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState
          type="cart"
          title="Your cart is empty"
          description="Add some merch before checking out!"
          actionLabel="Shop Now"
          actionTo="/shop"
        />
      </div>
    )
  }

  const onSubmitAddress = async (data) => {
    setCreatingOrder(true)
    try {
      const { shippingFee, tax, total } = calculateOrderTotals(subtotal)
      const id = await createOrder({
        items: items.map((it) => ({
          productId: it.productId,
          productName: it.name,
          productSlug: it.slug,
          image: it.image || '',
          size: it.size,
          quantity: it.quantity,
          price: it.price,
          subtotal: it.price * it.quantity,
        })),
        subtotal,
        shippingFee,
        tax,
        total,
        shippingAddress: {
          fullName: data.fullName,
          phone: data.phone,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2 || undefined,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          country: data.country,
        },
        notes: data.notes || undefined,
      })
      setOrderId(id)
      toast.success('Address saved! Proceed to payment.')
    } catch (err) {
      toast.error(err.message || 'Failed to create order')
    } finally {
      setCreatingOrder(false)
    }
  }

  const handlePaymentSuccess = ({ orderId: confirmedOrderId }) => {
    dispatch(clearCart())
    navigate(`/order/success?orderId=${confirmedOrderId}`, { replace: true })
  }

  const handlePaymentFailure = () => {
    navigate(`/order/failed?orderId=${orderId}`, { replace: true })
  }

  return (
    <div className="min-h-screen py-10">
      <div className="container">
        <nav className="flex items-center gap-2 text-xs text-[#6b7280] mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-[#39ff14] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/cart" className="hover:text-[#39ff14] transition-colors">Cart</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#e8e8e8]">Checkout</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-black uppercase mb-6" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>
          Checkout
        </h1>

        {isPlaceholder && (
          <div className="flex items-start gap-3 rounded-xl px-4 py-3 mb-6 text-sm" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#f59e0b' }} />
            <p style={{ color: '#fbbf24' }}>
              <strong>Demo mode:</strong> Convex backend is not connected. Fill the form to explore the UI — placing the order will fail until you run <code className="px-1 py-0.5 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>npx convex dev</code> and set your Razorpay keys.
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="glass rounded-2xl p-6" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(57,255,20,0.1)' }}>
                  <MapPin className="w-5 h-5" style={{ color: '#39ff14' }} />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase tracking-wide" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>
                    Shipping Address
                  </h2>
                  <p className="text-xs text-[#6b7280]">Where should we send your merch?</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmitAddress)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Full Name" error={errors.fullName?.message}>
                  <input
                    type="text"
                    defaultValue={me?.name}
                    {...register('fullName', { required: 'Required' })}
                    disabled={!!orderId}
                    className="checkout-input"
                  />
                </Field>
                <Field label="Phone" error={errors.phone?.message}>
                  <input
                    type="tel"
                    defaultValue={me?.phone}
                    {...register('phone', {
                      required: 'Required',
                      pattern: { value: /^[0-9]{10}$/, message: '10 digits only' },
                    })}
                    placeholder="9876543210"
                    disabled={!!orderId}
                    className="checkout-input"
                  />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Address Line 1" error={errors.addressLine1?.message}>
                    <input
                      type="text"
                      {...register('addressLine1', { required: 'Required' })}
                      placeholder="Flat / Building / Street"
                      disabled={!!orderId}
                      className="checkout-input"
                    />
                  </Field>
                </div>
                <div className="md:col-span-2">
                  <Field label="Address Line 2 (optional)">
                    <input
                      type="text"
                      {...register('addressLine2')}
                      placeholder="Landmark / Area"
                      disabled={!!orderId}
                      className="checkout-input"
                    />
                  </Field>
                </div>
                <Field label="City" error={errors.city?.message}>
                  <input
                    type="text"
                    {...register('city', { required: 'Required' })}
                    disabled={!!orderId}
                    className="checkout-input"
                  />
                </Field>
                <Field label="State" error={errors.state?.message}>
                  <input
                    type="text"
                    {...register('state', { required: 'Required' })}
                    disabled={!!orderId}
                    className="checkout-input"
                  />
                </Field>
                <Field label="Pincode" error={errors.pincode?.message}>
                  <input
                    type="text"
                    {...register('pincode', {
                      required: 'Required',
                      pattern: { value: /^[0-9]{6}$/, message: '6 digits' },
                    })}
                    placeholder="400001"
                    disabled={!!orderId}
                    className="checkout-input"
                  />
                </Field>
                <Field label="Country">
                  <input
                    type="text"
                    {...register('country')}
                    disabled
                    className="checkout-input opacity-60"
                  />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Order notes (optional)">
                    <textarea
                      {...register('notes')}
                      rows={2}
                      disabled={!!orderId}
                      placeholder="Anything we should know?"
                      className="checkout-input resize-none"
                    />
                  </Field>
                </div>

                {!orderId && (
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={creatingOrder}
                      className="btn-neon w-full justify-center disabled:opacity-50"
                    >
                      {creatingOrder ? 'Saving...' : 'Continue to Payment'}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </form>
            </div>

            {orderId && (
              <div className="glass rounded-2xl p-6" style={{ border: '1px solid rgba(57,255,20,0.3)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(57,255,20,0.1)' }}>
                    <User className="w-5 h-5" style={{ color: '#39ff14' }} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-wide" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8e8e8' }}>
                      Payment
                    </h2>
                    <p className="text-xs text-[#6b7280]">Complete payment to confirm your order</p>
                  </div>
                </div>
                <RazorpayButton
                  orderId={orderId}
                  subtotal={subtotal}
                  userProfile={{ name: watch('fullName'), email: me?.email, phone: watch('phone') }}
                  onSuccess={handlePaymentSuccess}
                  onFailure={handlePaymentFailure}
                />
                <p className="text-xs text-[#6b7280] text-center mt-3">
                  You'll be redirected to Razorpay's secure checkout
                </p>
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-24 lg:h-fit">
            <CheckoutSummary items={items} subtotal={subtotal} />
          </div>
        </div>
      </div>

      <style>{`
        .checkout-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #e8e8e8;
          font-size: 14px;
          transition: all 0.2s;
        }
        .checkout-input:focus { outline: none; border-color: #39ff14; }
        .checkout-input::placeholder { color: #6b7280; }
      `}</style>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-widest text-[#6b7280] mb-1.5 block">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}
