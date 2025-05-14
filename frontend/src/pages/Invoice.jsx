// src/pages/Invoice.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '../api';
import logo from '../assets/logo.png';
import './Invoice.css';

export default function Invoice() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  /* eslint-disable-next-line no-unused-vars */
  const initialMode = searchParams.get('mode') || 'individual';

  const [user, setUser] = useState({ id: null, name: '', email: '', phone: '' });
  const [mode, setMode] = useState(initialMode);
  const [memo, setMemo] = useState('');
  const [contact, setContact] = useState({ name: '', email: '', phone: '' });
  const [participants, setParticipants] = useState([{ name: '', email: '', phone: '' }]);
  const [items, setItems] = useState([{ description: '', amount: '' }]);
  const [frequency, setFrequency] = useState('one-time');
  const [splitMethod, setSplitMethod] = useState('equal');
  const [shares, setShares] = useState(() => participants.map(() => ''));
  const [importIndex, setImportIndex] = useState(null);

  const fileInputRef = useRef(null);

  const invoiceNumber = useMemo(
    () => `INV-${new Date().getFullYear()}-${Date.now()}`,
    []
  );
  const issueDate = useMemo(() => new Date().toLocaleDateString(), []);
  const total = useMemo(
    () => items.reduce((sum, it) => sum + parseFloat(it.amount || 0), 0).toFixed(2),
    [items]
  );

  const sumShares = () =>
    shares.map(s => parseFloat(s || '0')).reduce((a, b) => a + b, 0).toFixed(2);

  useEffect(() => {
    API.get('/users/me')
      .then(res => setUser(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (mode !== 'split') return;
    const count = participants.length;
    if (splitMethod === 'equal') {
      const share = (parseFloat(total) / count).toFixed(2);
      setShares(Array(count).fill(share));
    } else {
      setShares(prev => (prev.length === count ? prev : Array(count).fill('')));
    }
  }, [mode, participants, splitMethod, total]);

  const addItem = () => setItems(p => [...p, { description: '', amount: '' }]);
  const removeItem = i => setItems(p => p.filter((_, idx) => idx !== i));
  const updateItem = (i, f, v) =>
    setItems(p => p.map((it, idx) => (idx === i ? { ...it, [f]: v } : it)));

  const addParticipant = () =>
    setParticipants(p => [...p, { name: '', email: '', phone: '' }]);
  const removeParticipant = i =>
    setParticipants(p => p.filter((_, idx) => idx !== i));
  const updateParticipant = (i, f, v) =>
    setParticipants(p => p.map((pt, idx) => (idx === i ? { ...pt, [f]: v } : pt)));
  const updateShare = (i, v) =>
    setShares(p => p.map((sh, idx) => (idx === i ? v : sh)));

  const handleFile = async e => {
    try {
      const text = await e.target.files[0].text();
      const name = text.match(/FN:(.+)/)?.[1].trim() || '';
      const email = text.match(/EMAIL[^:]*:(.+)/)?.[1].trim() || '';
      const phone = text.match(/TEL[^:]*:(.+)/)?.[1].trim() || '';
      if (importIndex === -1) {
        setContact({ name, email, phone });
      } else {
        setParticipants(p =>
          p.map((pt, idx) => (idx === importIndex ? { name, email, phone } : pt))
        );
      }
    } catch {
      console.error('vCard import error');
    } finally {
      setImportIndex(null);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (mode === 'split' && splitMethod === 'custom' && sumShares() !== total) {
      return alert(`Shares sum $${sumShares()} but total is $${total}.`);
    }

    const payload = {
      ownerId: user.id,
      borrowerName:
        mode === 'individual' ? contact.name : participants[0]?.name || '',
      borrowerEmail:
        mode === 'individual' ? contact.email : participants[0]?.email || '',
      borrowerPhone:
        mode === 'individual' ? contact.phone : participants[0]?.phone || '',
      issueDate: new Date().toISOString(),
      items,
      total: parseFloat(total),
      termsType: frequency,
      planAmount: null,
      planFreq: null,
      memo: memo || null
    };

    try {
      await API.post('/invoices', payload);
      navigate('/dashboard');
    } catch (err) {
      console.error('Submit error', err);
      alert(
        'Submission failed: ' + (err.response?.data?.error || err.message)
      );
    }
  };

  return (
    <div className={`invoice-page panel ${mode === 'split' ? 'split-mode' : ''}`}>
      <header className="invoice-header">
        <div className="invoice-logo-block">
          <img src={logo} alt="Logo" className="invoice-logo" />
          <div className="issuer-info">
            <strong>{user.name}</strong>
            <br />
            {user.email}
            <br />
            {user.phone}
          </div>
        </div>
        <div className="invoice-meta-box">
          <div>
            <strong>Invoice #:</strong> {invoiceNumber}
          </div>
          <div>
            <strong>Date:</strong> {issueDate}
          </div>
          <select value={mode} onChange={e => setMode(e.target.value)}>
            <option value="individual">Individual</option>
            <option value="split">Split Bill</option>
          </select>
        </div>
      </header>

      <form className="invoice-form" onSubmit={handleSubmit}>
        {mode === 'individual' && (
          <section className="invoice-section contact-section">
            <h2>Contact Info</h2>
            <div className="field-group">
              <input
                placeholder="Name"
                value={contact.name}
                onChange={e => setContact(c => ({ ...c, name: e.target.value }))}
                required
              />
              <input
                placeholder="Email"
                type="email"
                value={contact.email}
                onChange={e => setContact(c => ({ ...c, email: e.target.value }))}
                required
              />
              <input
                placeholder="Phone"
                type="tel"
                value={contact.phone}
                onChange={e => setContact(c => ({ ...c, phone: e.target.value }))}
                required
              />
              <button
                type="button"
                onClick={() => {
                  setImportIndex(-1);
                  fileInputRef.current.click();
                }}
              >
                Import vCard
              </button>
            </div>
          </section>
        )}

        <section className="invoice-section items-section">
          <h2>Invoice Items</h2>
          <table className="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i}>
                  <td>
                    <input
                      placeholder="Description"
                      value={it.description}
                      onChange={e =>
                        updateItem(i, 'description', e.target.value)
                      }
                      required
                    />
                  </td>
                  <td>
                    <input
                      placeholder="0.00"
                      type="number"
                      value={it.amount}
                      onChange={e => updateItem(i, 'amount', e.target.value)}
                      required
                    />
                  </td>
                  <td>
                    <button type="button" onClick={() => removeItem(i)}>
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={addItem}>
            + Add Item
          </button>
          <div className="total-line">
            <strong>Total:</strong> ${total}
          </div>
        </section>

        {mode === 'split' && (
          <section className="invoice-section split-section">
            <h2>Split Between</h2>
            <div className="split-controls">
              <select
                value={splitMethod}
                onChange={e => setSplitMethod(e.target.value)}
              >
                <option value="equal">Equal</option>
                <option value="custom">Custom</option>
              </select>
              <span>Total: ${total}</span>
              <button type="button" onClick={addParticipant}>
                + Add Person
              </button>
            </div>
            <table className="split-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Share</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p, i) => (
                  <tr key={i}>
                    <td>
                      <input
                        value={p.name}
                        onChange={e =>
                          updateParticipant(i, 'name', e.target.value)
                        }
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        value={p.email}
                        onChange={e =>
                          updateParticipant(i, 'email', e.target.value)
                        }
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="tel"
                        value={p.phone}
                        onChange={e =>
                          updateParticipant(i, 'phone', e.target.value)
                        }
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        value={shares[i]}
                        readOnly={splitMethod === 'equal'}
                        onChange={e => updateShare(i, e.target.value)}
                        required
                      />
                    </td>
                    <td>
                      <button type="button" onClick={() => removeParticipant(i)}>
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        <section className="invoice-section terms-section">
          <h2>Payment Plan</h2>
          <select
            value={frequency}
            onChange={e => setFrequency(e.target.value)}
          >
            <option value="one-time">One-Time</option>
            <option value="weekly">Weekly</option>
            <option value="bi-weekly">Bi-Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </section>

        <section className="invoice-section memo-section">
          <h2>Memo / Notes</h2>
          <textarea
            value={memo}
            onChange={e => setMemo(e.target.value)}
            placeholder="Optional notes..."
          />
        </section>

        <button type="submit">Submit Invoice</button>
      </form>

      <input
        ref={fileInputRef}
        type="file"
        accept=".vcf"
        style={{ display: 'none' }}
        onChange={handleFile}
      />
    </div>
  );
}
