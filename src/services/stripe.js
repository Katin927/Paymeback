// backend/src/services/stripe.js
require('dotenv').config();
const Stripe = require('stripe');

// Ensure .env has only one STRIPE_SECRET_KEY line:
console.log('🔑 STRIPE_SECRET_KEY=', process.env.STRIPE_SECRET_KEY);

module.exports = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});
