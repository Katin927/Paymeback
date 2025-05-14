import React from 'react';
import './Terms.css';

export default function Terms() {
  return (
    <div className="terms-container">
      <div className="panel">
        <h2>Terms &amp; Conditions</h2>
        <p><em>Last updated: May 2025</em></p>

        <section>
          <h3>1. Introduction</h3>
          <p>
            Welcome to PayMeBack! These Terms &amp; Conditions (“Terms”) govern your use of our website and services.
            By accessing or using PayMeBack, you agree to be bound by these Terms. If you do not agree, please do not use our services.
          </p>
        </section>

        <section>
          <h3>2. Eligibility</h3>
          <p>
            You must be at least 18 years old and have full power to enter into contracts to use PayMeBack. By registering,
            you represent and warrant that you meet these requirements.
          </p>
        </section>

        <section>
          <h3>3. Account Registration &amp; Security</h3>
          <p>
            You agree to provide accurate, current, and complete information during registration and to keep your account
            credentials secure. You are responsible for all activity under your account. Notify us immediately of any unauthorized access.
          </p>
        </section>

        <section>
          <h3>4. Creating &amp; Sending Invoices</h3>
          <p>
            PayMeBack lets you generate and send digital invoices. You agree to only create invoices for legitimate transactions
            and to comply with all applicable laws. We are not responsible for disputes between you and your payees.
          </p>
        </section>

        <section>
          <h3>5. Payments &amp; Fees</h3>
          <p>
            Payment processing is powered by Stripe. You authorize us to collect processing fees as disclosed on our pricing page.
            All payments and refunds are subject to Stripe’s terms and conditions.
          </p>
        </section>

        <section>
          <h3>6. User Conduct</h3>
          <p>
            You may not use PayMeBack to engage in fraudulent behavior, harassment, or to transmit illegal content. We reserve
            the right to suspend or terminate accounts that violate these Terms.
          </p>
        </section>

        <section>
          <h3>7. Limitation of Liability</h3>
          <p>
            To the fullest extent permitted by law, PayMeBack and its affiliates will not be liable for any indirect,
            incidental, special, or consequential damages arising out of your use of the service.
          </p>
        </section>

        <section>
          <h3>8. Governing Law</h3>
          <p>
            These Terms are governed by the laws of the state of [Your State], without regard to conflict of law principles.
            Any dispute will be resolved in the state or federal courts located in [Your County], [Your State].
          </p>
        </section>

        <section>
          <h3>9. Changes to Terms</h3>
          <p>
            We may modify these Terms at any time. If we make material changes, we’ll notify you via email or a notice on the site.
            Continued use after changes constitutes acceptance.
          </p>
        </section>

        <section>
          <h3>10. Contact Us</h3>
          <p>
            Questions? Email us at <a href="mailto:support@paymeback.com">support@paymeback.com</a> or visit our <a href="/contact">Contact Us</a> page.
          </p>
        </section>
      </div>
    </div>
);
}
