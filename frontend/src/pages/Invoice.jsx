// src/pages/Invoice.jsx
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '../api';
import logo from '../assets/logo.png';
import './Invoice.css';

export default function Invoice() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') || 'individual';
  const [mode, setMode] = useState(initialMode);

  // Form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    termsType: 'one-time',
    planFreq: '',
    memo: '',
    items: [{ description: '', amount: '' }],
    participants: []   // for split bill
  });
  const [error, setError] = useState('');

  // Compute total
  const total = form.items
    .reduce((sum, it) => sum + (parseFloat(it.amount) || 0), 0)
    .toFixed(2);

  // Generic field handler
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // Line‐items handlers
  const handleItemChange = (idx, e) => {
    const next = [...form.items];
    next[idx][e.target.name] = e.target.value;
    setForm(f => ({ ...f, items: next }));
  };
  const addItem = () => {
    setForm(f => ({
      ...f,
      items: [...f.items, { description: '', amount: '' }]
    }));
  };

  // Participants handlers
  const handleParticipantChange = (idx, e) => {
    const next = [...form.participants];
    next[idx][e.target.name] = e.target.value;
    setForm(f => ({ ...f, participants: next }));
  };
  const addParticipant = () => {
    setForm(f => ({
      ...f,
      participants: [...f.participants, { name: '', email: '', phone: '' }]
    }));
  };
  const removeParticipant = idx => {
    setForm(f => ({
      ...f,
      participants: f.participants.filter((_, i) => i !== idx)
    }));
  };

  // Mode change handler
  const handleModeChange = e => {
    setMode(e.target.value);
  };

  // Submit
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.phone || form.items.length === 0) {
      return setError('Name, email, phone, and at least one line item are required.');
    }
    if (mode === 'split' && form.participants.length === 0) {
      return setError('Please add at least one participant for a split bill.');
    }

    const payload = {
      borrowerName: form.name,
      borrowerEmail: form.email,
      borrowerPhone: form.phone,
      termsType: form.termsType,
      planFreq: form.planFreq,
      memo: form.memo,
      items: form.items.map(i => ({
        description: i.description,
        amount: parseFloat(i.amount)
      })),
      ...(mode === 'split' && {
        participants: form.participants.map(p => ({
          name: p.name,
          email: p.email,
          phone: p.phone
        }))
      })
    };

    try {
      const { data } = await API.post('/invoices', payload);
      navigate(`/invoice/${data.id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to create invoice');
    }
  };

  return (
    <div className="invoice-page">
      <header className="invoice-header">
        <img src={logo} alt="Logo" className="invoice-logo" />
        <div className="invoice-meta">
          <div>
            <label htmlFor="mode"><strong>Mode:</strong></label>
            <select id="mode" name="mode" value={mode} onChange={handleModeChange}>
              <option value="individual">Individual</option>
              <option value="split">Split Bill</option>
            </select>
          </div>
        </div>
      </header>

      {mode === 'split' && (
        <div className="participants-section">
          <h3>Participants</h3>
          {form.participants.map((p, i) => (
            <div className="participant-row" key={i}>
              <input
                name="name"
                placeholder="Name"
                autoComplete="name"
                value={p.name}
                onChange={e => handleParticipantChange(i, e)}
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                autoComplete="email"
                value={p.email}
                onChange={e => handleParticipantChange(i, e)}
                required
              />
              <input
                name="phone"
                type="tel"
                placeholder="Phone"
                autoComplete="tel"
                value={p.phone}
                onChange={e => handleParticipantChange(i, e)}
                required
              />
              <button
                type="button"
                className="remove-participant-btn"
                onClick={() => removeParticipant(i)}
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            className="add-participant-btn"
            onClick={addParticipant}
          >
            + Add Participant
          </button>
        </div>
      )}

      <form className="invoice-form" onSubmit={handleSubmit}>
        {/* Borrower fields */}
        <div className="field-row">
          <div className="field-group">
            <label>Name</label>
            <input
              name="name"
              placeholder="Full Name"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field-group">
            <label>Phone</label>
            <input
              name="phone"
              type="tel"
              placeholder="(555) 123-4567"
              autoComplete="tel"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Line items */}
        <h3>Line Items</h3>
        <table className="items-table">
          <thead>
            <tr><th>Description</th><th>Amount</th></tr>
          </thead>
          <tbody>
            {form.items.map((it, idx) => (
              <tr key={idx}>
                <td>
                  <input
                    name="description"
                    placeholder="Item"
                    value={it.description}
                    onChange={e => handleItemChange(idx, e)}
                    required
                  />
                </td>
                <td>
                  <input
                    name="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={it.amount}
                    onChange={e => handleItemChange(idx, e)}
                    required
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total:</td>
              <td className="total-cell">${total}</td>
            </tr>
          </tfoot>
        </table>
        <button
          type="button"
          className="btn-secondary small"
          onClick={addItem}
        >
          + Add Line Item
        </button>

        {/* Memo */}
        <div className="field-row">
          <div className="field-group full">
            <label>Memo</label>
            <textarea
              name="memo"
              placeholder="Notes (optional)"
              value={form.memo}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Error & submit */}
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn-primary large">
          {mode === 'split' ? 'Create Split Invoice' : 'Create Invoice'}
        </button>
      </form>
    </div>
  );
}
