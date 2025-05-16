// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import './Dashboard.css';
import './Invoice.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalBorrowed: '0.00',
    totalOwed: '0.00',
    upcomingPayments: [],
    upcomingDeposits: [],
    recentInvoices: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState({});

  const formatTerm = invoice => invoice.planFreq || invoice.termsType || '—';

  useEffect(() => {
    async function fetchData() {
      try {
        // 1️⃣ Fetch current user
        const { data: userData } = await API.get('/users/me');
        setUser(userData);

        // 2️⃣ Fetch invoices (each has a scalar `total` field)
        const { data: invoices } = await API.get('/invoices');

        // 3️⃣ Ensure `total` is a string with two decimals
        const enriched = invoices.map(inv => ({
          ...inv,
          total: Number(inv.total).toFixed(2)
        }));

        // 4️⃣ Split pending into youOwe vs theyOwe
        const pending = enriched.filter(i => i.status === 'pending');
        const youOwe = pending.filter(i => i.borrowerEmail === userData.email);
        const theyOwe = pending.filter(i => i.borrowerEmail !== userData.email);

        // Sort by dueDate ascending
        youOwe.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        theyOwe.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        // 5️⃣ Compute totals from the scalar `total`
        const totalBorrowed = youOwe
          .reduce((sum, inv) => sum + Number(inv.total), 0)
          .toFixed(2);
        const totalOwed = theyOwe
          .reduce((sum, inv) => sum + Number(inv.total), 0)
          .toFixed(2);

        // 6️⃣ Update stats
        setStats({
          totalBorrowed,
          totalOwed,
          upcomingPayments: youOwe.slice(0, 5),
          upcomingDeposits: theyOwe.slice(0, 5),
          recentInvoices: enriched.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        });
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="empty">Loading...</div>;
  if (error) return <div className="empty">Error: {error}</div>;

  const filtered = stats.recentInvoices.filter(inv =>
    inv.borrowerName.toLowerCase().includes(search.toLowerCase()) ||
    inv.borrowerEmail.toLowerCase().includes(search.toLowerCase()) ||
    inv.id.toString().includes(search)
  );

  const toggle = id => {
    setExpanded(e => ({ ...e, [id]: !e[id] }));
  };

  return (
    <div className="invoice-container dashboard-theme">
      <h1>Welcome, {user.name}</h1>

      {/* Stats */}
      <section className="stats-cards">
        <div className="stat-card bordered">
          <h3>Cash Outflow</h3>
          <p>${stats.totalBorrowed}</p>
        </div>
        <div className="stat-card bordered">
          <h3>Cash Inflow</h3>
          <p>${stats.totalOwed}</p>
        </div>
      </section>

      {/* New Invoice */}
      <button
        className="btn-primary"
        onClick={() => navigate('/invoice?mode=individual')}
      >
        + New Invoice
      </button>

      {/* Upcoming Payments & Deposits */}
      <section className="upcoming-grid">
        <div className="upcoming-panel bordered">
          <h2>Upcoming Payments</h2>
          {stats.upcomingPayments.length > 0 ? (
            stats.upcomingPayments.map(u => (
              <div key={u.id} className="line-item">
                <span>{u.borrowerName}</span>
                <span>Terms: {formatTerm(u)}</span>
                <span>${u.total}</span>
                <button
                  className="btn-primary small"
                  onClick={() => navigate(`/pay/${u.id}`)}
                >
                  Pay
                </button>
              </div>
            ))
          ) : (
            <p className="empty">No upcoming payments.</p>
          )}
        </div>
        <div className="upcoming-panel bordered">
          <h2>Upcoming Deposits</h2>
          {stats.upcomingDeposits.length > 0 ? (
            stats.upcomingDeposits.map(u => (
              <div key={u.id} className="line-item">
                <span>{u.borrowerName}</span>
                <span>Terms: {formatTerm(u)}</span>
                <span>${u.total}</span>
              </div>
            ))
          ) : (
            <p className="empty">No upcoming deposits.</p>
          )}
        </div>
      </section>

      {/* Recent Activity Accordion */}
      <div className="recent-section bordered">
        <div className="recent-header">
          <h2>Recent Activity</h2>
          <input
            type="text"
            placeholder="Search by name, email, or ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <ul className="accordion-list">
          {filtered.map(r => {
            const open = !!expanded[r.id];
            return (
              <li key={r.id}>
                <div
                  className="collapse-header"
                  onClick={() => toggle(r.id)}
                >
                  <span>{r.borrowerName}</span>
                  <button className="collapse-toggle">
                    {open ? '−' : '+'}
                  </button>
                </div>
                {open && (
                  <div className="collapse-content">
                    <div className="line-field">Phone: {r.borrowerPhone}</div>
                    <div className="line-field">Email: {r.borrowerEmail}</div>
                    <div className="line-field">Amount: ${r.total}</div>
                    <button
                      className="btn-secondary"
                      onClick={() => alert('Reminder sent')}
                    >
                      Nudge
                    </button>
                  </div>
                )}
              </li>
            );
          })}
          {!filtered.length && (
            <li className="empty">No recent activity.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
