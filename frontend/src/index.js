import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import reportWebVitals from './reportWebVitals';

// Stripe
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Tailwind + global styles
import './index.css'; // Includes @tailwind directives

// Stripe public key from environment
const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

if (!publishableKey) {
  console.error(
    '❌ Missing REACT_APP_STRIPE_PUBLISHABLE_KEY! Please set it in frontend/.env'
  );
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
