// src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import './Settings.css';

export default function Settings() {
  const [settings, setSettings] = useState({
    profile: {
      name: '',
      email: '',
      phone: '',
      address: { street: '', city: '', state: '', zip: '' }
    },
    cards: [],                 // { id, type, number, name, exp, cvv }
    defaultCardId: null,
    notifications: { email: true, sms: false },
    integrations: { plaid: false, contacts: false }
  });

  const [newCard, setNewCard] = useState({ type: 'Visa', number: '', name: '', exp: '', cvv: '' });
  const [showAddCard, setShowAddCard] = useState(false);

  // Load and merge defaults
  useEffect(() => {
    const stored = localStorage.getItem('paymeback_settings');
    if (stored) {
      const parsed = JSON.parse(stored);
      setSettings(s => ({
        ...s,
        ...parsed,
        profile: {
          ...s.profile,
          ...parsed.profile,
          address: {
            ...s.profile.address,
            ...parsed.profile?.address
          }
        }
      }));
    }
  }, []);

  // Persist helper
  const save = updated => {
    setSettings(updated);
    localStorage.setItem('paymeback_settings', JSON.stringify(updated));
  };

  // Profile handlers
  const handleProfileChange = e => {
    const { name, value } = e.target;
    setSettings(s => ({
      ...s,
      profile: { ...s.profile, [name]: value }
    }));
  };
  const handleAddressChange = e => {
    const { name, value } = e.target;
    setSettings(s => ({
      ...s,
      profile: { ...s.profile, address: { ...s.profile.address, [name]: value } }
    }));
  };
  const handleSaveProfile = () => save(settings);

  // Card handlers
  const handleNewCardChange = e => {
    const { name, value } = e.target;
    setNewCard(c => ({ ...c, [name]: value }));
  };
  const addCard = e => {
    e.preventDefault();
    const id = Date.now();
    const card = { id, ...newCard };
    setSettings(s => ({
      ...s,
      cards: [...s.cards, card],
      defaultCardId: s.defaultCardId || id
    }));
    setNewCard({ type: 'Visa', number: '', name: '', exp: '', cvv: '' });
    setShowAddCard(false);
  };
  const deleteCard = id => {
    setSettings(s => {
      const cards = s.cards.filter(c => c.id !== id);
      const defaultCardId =
        s.defaultCardId === id && cards.length ? cards[0].id :
        s.defaultCardId === id ? null : s.defaultCardId;
      return { ...s, cards, defaultCardId };
    });
  };
  const setDefaultCard = id => setSettings(s => ({ ...s, defaultCardId: id }));
  const handleSaveWallet = () => save(settings);

  // Notification handlers
  const toggleNotif = key => {
    setSettings(s => ({
      ...s,
      notifications: { ...s.notifications, [key]: !s.notifications[key] }
    }));
  };
  const handleSaveNotifications = () => save(settings);

  // Integration handlers
  const toggleIntegration = key => {
    setSettings(s => ({
      ...s,
      integrations: { ...s.integrations, [key]: !s.integrations[key] }
    }));
  };
  const handleSaveIntegrations = () => save(settings);

  // Mask card number
  const mask = num => num.slice(-4).padStart(num.length, '•');

  return (
    <div className="settings-container">
      <h1>Settings</h1>

      {/* Profile Section */}
      <section className="settings-section profile-section">
        <h2>Profile & Billing Address</h2>
        <div className="profile-grid">
          <label>
            Name
            <input name="name" value={settings.profile.name} onChange={handleProfileChange} placeholder="Your name" />
          </label>
          <label>
            Email
            <input name="email" type="email" value={settings.profile.email} onChange={handleProfileChange} placeholder="you@example.com" />
          </label>
          <label>
            Phone
            <input name="phone" type="tel" value={settings.profile.phone} onChange={handleProfileChange} placeholder="(555) 123-4567" />
          </label>
          <label>
            Street Address
            <input name="street" value={settings.profile.address.street} onChange={handleAddressChange} placeholder="123 Main St" />
          </label>
          <label>
            City
            <input name="city" value={settings.profile.address.city} onChange={handleAddressChange} placeholder="Anytown" />
          </label>
          <label>
            State
            <input name="state" value={settings.profile.address.state} onChange={handleAddressChange} placeholder="CA" />
          </label>
          <label>
            ZIP Code
            <input name="zip" value={settings.profile.address.zip} onChange={handleAddressChange} placeholder="12345" />
          </label>
        </div>
        <button className="btn-primary save-btn" onClick={handleSaveProfile}>Save Profile</button>
      </section>

      {/* Wallet Section */}
      <section className="settings-section">
        <h2>Wallet</h2>
        {settings.cards.length ? (
          <ul className="card-list">
            {settings.cards.map(card => (
              <li key={card.id} className="card-item">
                <div className="card-icon">{card.type}</div>
                <div className="card-info">
                  <span className="card-number">{mask(card.number)}</span>
                  <span className="card-name">{card.name}</span>
                  <span className="card-exp">{card.exp}</span>
                </div>
                <div className="card-actions">
                  {settings.defaultCardId === card.id && <span className="default-badge">Default</span>}
                  <button onClick={() => setDefaultCard(card.id)} disabled={settings.defaultCardId === card.id}>Make Default</button>
                  <button onClick={() => deleteCard(card.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No cards added yet.</p>
        )}
        {showAddCard ? (
          <form className="card-form" onSubmit={addCard}>
            <label>
              Type
              <select name="type" value={newCard.type} onChange={handleNewCardChange}>
                <option>Visa</option>
                <option>MasterCard</option>
                <option>Amex</option>
                <option>Discover</option>
              </select>
            </label>
            <label>
              Card Number
              <input name="number" value={newCard.number} onChange={handleNewCardChange} placeholder="1234123412341234" required />
            </label>
            <label>
              Name on Card
              <input name="name" value={newCard.name} onChange={handleNewCardChange} placeholder="John Doe" required />
            </label>
            <div className="small-inputs">
              <label>
                Expiry
                <input name="exp" type="month" value={newCard.exp} onChange={handleNewCardChange} required />
              </label>
              <label>
                CVV
                <input name="cvv" value={newCard.cvv} onChange={handleNewCardChange} placeholder="123" required />
              </label>
            </div>
            <button type="submit" className="btn-primary">Save Card</button>
            <button type="button" className="btn-secondary" onClick={() => setShowAddCard(false)}>Cancel</button>
          </form>
        ) : (
          <button className="btn-primary" onClick={() => setShowAddCard(true)}>+ Add New Card</button>
        )}
        <button className="btn-primary save-btn" onClick={handleSaveWallet}>Save Wallet</button>
      </section>

      {/* Notifications Section */}
      <section className="settings-section">
        <h2>Notifications</h2>
        <label className="toggle">
          <input type="checkbox" checked={settings.notifications.email} onChange={() => toggleNotif('email')} />
          <span>Email Reminders</span>
        </label>
        <label className="toggle">
          <input type="checkbox" checked={settings.notifications.sms} onChange={() => toggleNotif('sms')} />
          <span>SMS Reminders</span>
        </label>
        <button className="btn-primary save-btn" onClick={handleSaveNotifications}>Save Notifications</button>
      </section>

      {/* Integrations Section */}
      <section className="settings-section">
        <h2>Integrations</h2>
        <label className="toggle">
          <input type="checkbox" checked={settings.integrations.plaid} onChange={() => toggleIntegration('plaid')} />
          <span>Connect Plaid (Bank Accounts)</span>
        </label>
        <label className="toggle">
          <input type="checkbox" checked={settings.integrations.contacts} onChange={() => toggleIntegration('contacts')} />
          <span>Enable Contacts Import</span>
        </label>
        <button className="btn-primary save-btn" onClick={handleSaveIntegrations}>Save Integrations</button>
      </section>
    </div>
  );
}