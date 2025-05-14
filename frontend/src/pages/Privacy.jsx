import React from 'react';
import './Privacy.css';

export default function Privacy() {
  return (
    <div className="privacy-container">
      <div className="panel">
        <h2>Privacy Policy</h2>
        <p><em>Last updated: May 2025</em></p>

        <section>
          <h3>1. Information We Collect</h3>
          <p>
            <strong>Account Information:</strong> Name, email, phone, billing address.<br/>
            <strong>Transaction Data:</strong> Invoices you create, payment statuses.<br/>
            <strong>Usage Data:</strong> IP address, browser type, pages visited (via cookies and analytics).
          </p>
        </section>

        <section>
          <h3>2. How We Use Your Information</h3>
          <p>
            We use data to:
            <ul>
              <li>Provide and maintain our service</li>
              <li>Process payments and invoices</li>
              <li>Communicate account updates and support</li>
              <li>Improve and personalize your experience</li>
            </ul>
          </p>
        </section>

        <section>
          <h3>3. Sharing &amp; Disclosure</h3>
          <p>
            We do not sell your personal data. We may share information with:
            <ul>
              <li>Payment processors (e.g. Stripe) to complete transactions.</li>
              <li>Service providers under confidentiality obligations.</li>
              <li>Law enforcement when required by law.</li>
            </ul>
          </p>
        </section>

        <section>
          <h3>4. Cookies &amp; Tracking</h3>
          <p>
            We use cookies and similar technologies for session management, analytics, and preferences.
            You can control cookies via your browser settings.
          </p>
        </section>

        <section>
          <h3>5. Data Security</h3>
          <p>
            We implement industry-standard security measures (encryption, access controls) to protect your data.
            However, no method is 100% secure—use at your own risk.
          </p>
        </section>

        <section>
          <h3>6. Your Rights</h3>
          <p>
            Subject to local laws, you may:
            <ul>
              <li>Access and update your personal data.</li>
              <li>Request deletion of your account and data.</li>
              <li>Opt out of marketing communications.</li>
            </ul>
            Contact us at <a href="mailto:privacy@paymeback.com">privacy@paymeback.com</a>.
          </p>
        </section>

        <section>
          <h3>7. Children’s Privacy</h3>
          <p>
            We do not knowingly collect data from children under 13. If you believe we have, please contact us.
          </p>
        </section>

        <section>
          <h3>8. Changes to This Policy</h3>
          <p>
            We may update this policy—notice will be posted here with a new “Last updated” date.
          </p>
        </section>

        <section>
          <h3>9. Contact Information</h3>
          <p>
            Questions? Email <a href="mailto:privacy@paymeback.com">privacy@paymeback.com</a> or visit our <a href="/contact">Contact Us</a> page.
          </p>
        </section>
      </div>
    </div>
);
}
