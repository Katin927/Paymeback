const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// GET /api/invoices/:id
router.get('/:id', authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const prisma = req.app.get('prisma');
    const invoice = await prisma.invoice.findUnique({
      where: { id: parseInt(id) },
    });

    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    next(err);
  }
});

// POST /api/invoices/checkout
router.post('/checkout', authenticate, async (req, res, next) => {
  const { amount, email } = req.body;

  if (!amount || !email) {
    return res.status(400).json({ error: 'Amount and email are required' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'PayMeBack Invoice',
            },
            unit_amount: amount * 100, // amount in cents
          },
          quantity: 1,
        },
      ],
      success_url: 'https://effortless-gingersnap-d18028.netlify.app/success',
      cancel_url: 'https://effortless-gingersnap-d18028.netlify.app/cancel',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: 'Stripe checkout failed' });
  }
});

module.exports = router;
