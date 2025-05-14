import React, { useState } from 'react';
import './ContactUs.css';

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: wire up your mailer / API
    setSent(true);
  };

  if (sent) {
    return (
      <div className="contact-container">
        <div className="panel">
          <h2>Thanks for reaching out!</h2>
          <p>We’ve received your message and will be in touch shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-container">
      <div className="panel">
        <h2>Contact Us</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Message
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              required
            />
          </label>
          <button type="submit" className="btn-primary">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
