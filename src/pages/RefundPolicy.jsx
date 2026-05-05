import PolicyLayout from '../components/common/PolicyLayout'

export default function RefundPolicy() {
  return (
    <PolicyLayout title="Refund & Cancellation Policy" lastUpdated="May 5, 2026">
      <p>
        We want you to love every NeechBakra drop. If something isn't right, here's how we handle returns, exchanges, and refunds.
      </p>

      <h2>1. Cancellation Window</h2>
      <p>
        You can cancel an order for a full refund anytime <strong>before it ships</strong>. Once dispatched, cancellation isn't possible — but you can still return eligible items after delivery.
      </p>

      <h2>2. Return Window</h2>
      <p>
        Eligible items can be returned within <strong>7 days of delivery</strong>. To qualify:
      </p>
      <ul>
        <li>Item must be unused, unwashed, and in its original packaging.</li>
        <li>All tags and stickers must still be attached.</li>
        <li>Limited-edition / final-sale drops are <strong>not</strong> returnable (this is clearly stated on the product page).</li>
        <li>Stickers, mousepads, and other accessories are non-returnable for hygiene reasons unless they arrive damaged.</li>
      </ul>

      <h2>3. Damaged or Wrong Item</h2>
      <p>
        If your order arrives damaged or you receive the wrong item, contact us within 48 hours of delivery with photos at <a href="mailto:support@neechbakra.com">support@neechbakra.com</a>. We'll arrange a free replacement or a full refund.
      </p>

      <h2>4. How to Request a Return</h2>
      <ol>
        <li>Go to <a href="/orders">My Orders</a> and find your order.</li>
        <li>Email <a href="mailto:support@neechbakra.com">support@neechbakra.com</a> with your order ID and the reason.</li>
        <li>We'll send you a return label and pickup details within 2 business days.</li>
        <li>Once we receive and inspect the item, we'll process your refund.</li>
      </ol>

      <h2>5. Refund Timeline</h2>
      <p>
        Refunds are issued back to the original payment method via Razorpay. Once approved, you should see the amount back in your account within:
      </p>
      <ul>
        <li><strong>Cards / Net Banking:</strong> 5–7 business days</li>
        <li><strong>UPI / Wallets:</strong> 3–5 business days</li>
      </ul>

      <h2>6. Exchanges</h2>
      <p>
        Need a different size? We'll exchange it for free as long as the new item is in stock and your request meets the return criteria above. Initiate the exchange the same way as a return.
      </p>

      <h2>7. Shipping Costs on Returns</h2>
      <p>
        Free return shipping if the issue is on us (wrong item, defect, damage). For change-of-mind returns, return shipping (₹99) is deducted from your refund.
      </p>

      <h2>8. Contact</h2>
      <p>
        Questions? Reach our team at <a href="mailto:support@neechbakra.com">support@neechbakra.com</a>. We typically reply within 24 hours.
      </p>
    </PolicyLayout>
  )
}
