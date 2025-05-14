// src/components/Home.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';         // ← import Link
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Home.css';

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="home__hero">
        <img
          src="/static/images/person-left.png"
          alt="Person sending money"
          className="figure static left"
        />
        <img
          src="/static/images/person-right.png"
          alt="Person receiving money"
          className="figure static right"
        />

        <div className="home__hero-overlay">
          <div className="hero-box">
            <h1>Welcome to PayMeBack</h1>
            <p>Say goodbye to awkward money talks. We handle it for you—seamlessly.</p>
            {/* Updated button to Link to /register */}
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="home__about" data-aos="fade-up" id="get-started">
        <h2>Who We Are</h2>
        <p>
          PayMeBack is built for the real world—where people borrow money,
          split bills, cover each other, and then forget. We’re here to fix that
          in the most stress-free way possible.
        </p>
        <p>
          Whether you’re a freelancer tracking unpaid invoices, roommates
          splitting rent, or friends planning a trip, PayMeBack gives you one
          place to log debts, send friendly reminders, and even accept payments
          —all without needing to chase anyone down.
        </p>
        <p>
          We believe managing money between people should feel personal, not
          painful. That’s why PayMeBack is simple, polite, and mobile-friendly—
          like a financial assistant who’s always on your side.
        </p>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        {/* …your footer content… */}
      </footer>
    </div>
  );
}
