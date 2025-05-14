// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import reportWebVitals from './reportWebVitals';
// Stripe
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Global styles: theme and resets
import './styles/theme.css';
import './styles/global.css';

const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
let stripePromise = null;

if (!publishableKey) {
  console.error(
    '❌ Missing REACT_APP_STRIPE_PUBLISHABLE_KEY! Please set it in frontend/.env'
  );
} else {
  stripePromise = loadStripe(publishableKey);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {stripePromise ? (
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    ) : (
      <App />
    )}
  </React.StrictMode>
);

reportWebVitals();
