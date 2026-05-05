import PolicyLayout from '../components/common/PolicyLayout'

export default function ShippingPolicy() {
  return (
    <PolicyLayout title="Shipping Policy" lastUpdated="May 5, 2026">
      <p>
        Here's everything you need to know about how we ship NeechBakra merch.
      </p>

      <h2>1. Where We Ship</h2>
      <p>
        Currently we ship across all of India. International shipping is coming soon — drop your email in the newsletter to be the first to know.
      </p>

      <h2>2. Shipping Charges</h2>
      <ul>
        <li><strong>Free shipping</strong> on all orders above <strong>₹999</strong>.</li>
        <li>Flat <strong>₹99</strong> shipping fee on orders below ₹999.</li>
        <li>Stickers and small accessories may ship via India Post at no extra cost on orders above ₹499.</li>
      </ul>

      <h2>3. Processing Time</h2>
      <p>
        Orders are processed within <strong>1–2 business days</strong>. You'll receive a tracking link by email and SMS as soon as your package leaves our warehouse.
      </p>

      <h2>4. Delivery Time</h2>
      <ul>
        <li><strong>Metro cities</strong> (Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Kolkata): 2–4 business days</li>
        <li><strong>Tier 2 cities:</strong> 4–6 business days</li>
        <li><strong>Tier 3 / remote pincodes:</strong> 6–10 business days</li>
      </ul>
      <p>
        Limited-edition drops may take an extra 2–3 days due to bulk processing.
      </p>

      <h2>5. Courier Partners</h2>
      <p>
        We work with trusted partners — Delhivery, Bluedart, DTDC, and India Post — depending on your pincode and the size of your order.
      </p>

      <h2>6. Tracking Your Order</h2>
      <p>
        Once shipped, you'll get an email and SMS with the tracking ID and link. You can also check your order status anytime under <a href="/orders">My Orders</a>.
      </p>

      <h2>7. Failed Deliveries / Address Issues</h2>
      <p>
        If a delivery fails because of an incorrect address or unavailability after multiple attempts, the package is returned to us. We'll contact you to arrange a re-ship; additional shipping fees may apply.
      </p>

      <h2>8. Cash on Delivery (COD)</h2>
      <p>
        We currently <strong>do not</strong> support COD. All orders are pre-paid via Razorpay (UPI, cards, net banking, wallets).
      </p>

      <h2>9. Lost or Damaged in Transit</h2>
      <p>
        If your package is lost or arrives damaged, contact <a href="mailto:support@neechbakra.com">support@neechbakra.com</a> within 48 hours of the delivery date with photos. We'll send a free replacement or refund you fully.
      </p>

      <h2>10. Contact</h2>
      <p>
        Shipping questions? Email <a href="mailto:support@neechbakra.com">support@neechbakra.com</a> with your order ID.
      </p>
    </PolicyLayout>
  )
}
