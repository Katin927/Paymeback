// src/pages/PayInvoice.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CardElement,
  PaymentRequestButtonElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import API from '../api';
import './PayInvoice.css';

export default function PayInvoice() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  // List state
  const [invoices, setInvoices] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState('');

  // Detail state
  const [invoice, setInvoice] = useState(null);
  const [payeeName, setPayeeName] = useState('');
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  // Payment Request and wallet support
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [canUsePR, setCanUsePR] = useState(false);
  const [supportedWallets, setSupportedWallets] = useState({ applePay: false, googlePay: false });

  // Payment method selection
  const [method, setMethod] = useState('credit'); // credit, debit, applepay, googlepay

  // Fetch pending invoices
  useEffect(() => {
    if (invoiceId) return;
    API.get('/invoices?status=pending')
      .then(res => setInvoices(res.data))
      .catch(() => setListError('Unable to load invoices.'))
      .finally(() => setListLoading(false));
  }, [invoiceId]);

  // Fetch single invoice and set payee name
  useEffect(() => {
    if (!invoiceId) return;
    API.get(`/invoices/${invoiceId}`)
      .then(res => {
        const inv = res.data;
        setInvoice(inv);
        setPayeeName(inv.borrowerName || inv.borrowerEmail || '');
        setError('');
      })
      .catch(() => setError('Invoice not found.'))
      .finally(() => setFetching(false));
  }, [invoiceId]);

  // Setup PaymentRequest and detect wallet support
  useEffect(() => {
    if (!invoiceId || !stripe || !invoice) return;
    const pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: { label: `Invoice #${invoice.invoiceNumber || invoice.id}`, amount: Math.round(invoice.total * 100) },
      requestPayerName: true,
      requestPayerEmail: true,
    });
    pr.canMakePayment().then(result => {
      if (result) {
        setSupportedWallets({
          applePay: !!result.applePay,
          googlePay: !!(result.googlePay || result.androidPay)
        });
        setCanUsePR(true);
        setPaymentRequest(pr);
      }
    });
    const handler = async ev => {
      try {
        await API.post(`/invoices/${invoiceId}/pay`, { paymentMethodId: ev.paymentMethod.id });
        ev.complete('success');
        navigate('/thank-you');
      } catch {
        ev.complete('fail');
        setError('Payment failed.');
      }
    };
    pr.on('paymentmethod', handler);
    return () => pr.off('paymentmethod', handler);
  }, [invoiceId, stripe, invoice, navigate]);

  // Handle card/debit payment
  const handleCardPay = async () => {
    if (!stripe || !elements) return;
    setProcessing(true);
    setError('');
    const cardEl = elements.getElement(CardElement);
    const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardEl });
    if (pmError) {
      setError(pmError.message);
      setProcessing(false);
      return;
    }
    try {
      await API.post(`/invoices/${invoiceId}/pay`, { paymentMethodId: paymentMethod.id });
      navigate('/thank-you');
    } catch {
      setError('Payment could not be processed.');
    } finally {
      setProcessing(false);
    }
  };

  // Render list of pending invoices
  if (!invoiceId) {
    if (listLoading) return <div className="center-text">Loading invoices…</div>;
    if (listError) return <div className="center-text error-text">{listError}</div>;
    if (!invoices.length) return <div className="center-text">No pending invoices.</div>;

    return (
      <div className="invoice-list">
        <h2>Pending Invoices</h2>
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Name</th>
              <th>Term</th>
              <th>Amount</th>
              <th>Remaining</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id} onClick={() => navigate(`/pay/${inv.id}`)}>
                <td>{inv.invoiceNumber || inv.id}</td>
                <td>{inv.borrowerName || inv.payeeName || '—'}</td>
                <td>{inv.planFreq || inv.termsType || '—'}</td>
                <td>${inv.total.toFixed(2)}</td>
                <td>${(inv.paidAt ? 0 : inv.total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Render digital check detail view
  if (fetching || !invoice) return <div className="center-text">Loading details…</div>;
  if (error) return <div className="center-text error-text">{error}</div>;

  return (
    <div className="invoice-detail">
      <h2>Invoice #{invoice.invoiceNumber || invoice.id}</h2>

      <div className="detail-grid">
        <div className="detail-row"><span>Payee:</span><strong>{payeeName}</strong></div>
        <div className="detail-row"><span>Amount:</span><strong>${invoice.total.toFixed(2)}</strong></div>
        <div className="detail-row"><span>Terms:</span><strong>{invoice.planFreq || invoice.termsType}</strong></div>
        <div className="detail-row"><span>Issued:</span><strong>{new Date(invoice.createdAt).toLocaleDateString()}</strong></div>
      </div>

      <div className="payment-options">
        <label htmlFor="method-select">Choose payment method:</label>
        <select
          id="method-select"
          value={method}
          onChange={e => setMethod(e.target.value)}
        >
          <option value="credit">Credit Card</option>
          <option value="debit">Debit Card</option>
          {supportedWallets.applePay && <option value="applepay">Apple Pay</option>}
          {supportedWallets.googlePay && <option value="googlepay">Google Pay</option>}
        </select>

        {['credit', 'debit'].includes(method) && (
          <div className="card-pay">
            <CardElement options={{ hidePostalCode: true }} />
            <button
              onClick={handleCardPay}
              disabled={processing || !stripe}
              className="btn-pay"
            >
              {processing ? 'Processing…' : `Pay with ${method === 'credit' ? 'Credit' : 'Debit'} Card`}
            </button>
          </div>
        )}

        {['applepay', 'googlepay'].includes(method) && canUsePR && paymentRequest && (
          <div className="wallet-pay">
            <PaymentRequestButtonElement options={{ paymentRequest }} className="pr-button" />
          </div>
        )}
      </div>
    </div>
  );
}