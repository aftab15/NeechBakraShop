import PolicyLayout from '../components/common/PolicyLayout'

export default function Privacy() {
  return (
    <PolicyLayout title="Privacy Policy" lastUpdated="May 5, 2026">
      <p>
        Your privacy matters. This Privacy Policy explains what information NeechBakra collects, how we use it, and your rights.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li><strong>Account info:</strong> name, email, phone, hashed password.</li>
        <li><strong>Order info:</strong> shipping address, items purchased, payment status (we do <em>not</em> store card numbers — only Razorpay IDs).</li>
        <li><strong>Communications:</strong> messages you send through the contact form.</li>
        <li><strong>Technical info:</strong> IP address, device type, browser, anonymized usage data.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To process and fulfil your orders.</li>
        <li>To communicate about your account, orders, and support requests.</li>
        <li>If you opt into our newsletter, to send you drops, offers, and updates (you can unsubscribe anytime).</li>
        <li>To detect and prevent fraud.</li>
        <li>To improve the Site and your shopping experience.</li>
      </ul>

      <h2>3. Payment Security</h2>
      <p>
        All payments are processed by Razorpay using industry-standard PCI-DSS compliant infrastructure. Card and bank details never touch our servers. We only store the Razorpay order/payment IDs needed to verify your transaction.
      </p>

      <h2>4. Data Sharing</h2>
      <p>
        We do not sell your data. We share information only with trusted service providers required to run the store — payment gateway (Razorpay), shipping partners, and email/communication providers — and only the data they need to do their job.
      </p>

      <h2>5. Cookies</h2>
      <p>
        We use minimal cookies for session management, cart persistence, and basic analytics. You can disable cookies in your browser, but some features (like staying logged in or keeping your cart) won't work properly.
      </p>

      <h2>6. Your Rights</h2>
      <ul>
        <li>Access the personal data we hold about you.</li>
        <li>Correct inaccuracies or update your details from your profile page.</li>
        <li>Request deletion of your account and associated data.</li>
        <li>Unsubscribe from marketing emails at any time.</li>
      </ul>

      <h2>7. Data Retention</h2>
      <p>
        We retain order records for as long as required for accounting, legal, and fraud-prevention purposes. Other data is deleted when you close your account.
      </p>

      <h2>8. Children</h2>
      <p>
        Our Site is not intended for users under 18. We do not knowingly collect data from children.
      </p>

      <h2>9. Updates</h2>
      <p>
        We may update this policy occasionally. The "Last updated" date at the top reflects the latest version.
      </p>

      <h2>10. Contact</h2>
      <p>
        For privacy questions or data requests, email <a href="mailto:privacy@neechbakra.com">privacy@neechbakra.com</a>.
      </p>
    </PolicyLayout>
  )
}
