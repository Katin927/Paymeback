import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <p>&copy; 2025 <strong>PayMeBack</strong>. All rights reserved.</p>

        <nav className="footer__links" aria-label="Footer Navigation">
          <a href="/contact">Contact Us</a>
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
        </nav>
      </div>
    </footer>
  );
}
