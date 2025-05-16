<<<<<<< HEAD
// backend/src/routes/invoices.js
const express = require('express');
const router = express.Router();
const stripe = require('../services/stripe');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const { authenticate } = require('../middleware/auth');

// Protect all invoice routes
router.use(authenticate);

// Configure Nodemailer with Mailtrap
const emailTransporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: parseInt(process.env.MAILTRAP_PORT, 10),
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  }
});

// Configure Twilio client (optional SMS)
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const TWILIO_FROM = process.env.TWILIO_FROM_NUMBER;

/**
 * GET /api/invoices
 * List all invoices that the authenticated user owns or owes
 */
router.get('/', async (req, res, next) => {
  const prisma = req.app.get('prisma');
  try {
    const invoices = await prisma.invoice.findMany({
      where: {
        OR: [
          { ownerId: req.user.userId },
          { borrowerEmail: req.user.email }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });
    res.json(invoices);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/invoices/:id
 * Retrieve a specific invoice if the user has access
 */
router.get('/:id', async (req, res, next) => {
  const prisma = req.app.get('prisma');
  const id = Number(req.params.id);
  try {
    const invoice = await prisma.invoice.findUnique({ where: { id } });
    if (!invoice || (invoice.ownerId !== req.user.userId && invoice.borrowerEmail !== req.user.email)) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
=======
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
>>>>>>> heroku/main
    res.json(invoice);
  } catch (err) {
    next(err);
  }
});

<<<<<<< HEAD
/**
 * POST /api/invoices
 * Create a new invoice
 */
router.post('/', async (req, res, next) => {
  const prisma = req.app.get('prisma');
  const {
    borrowerName,
    borrowerEmail,
    borrowerPhone,
    items,
    total,
    issueDate,
    termsType,
    planAmount,
    planFreq,
    memo
  } = req.body;

  try {
    const invoice = await prisma.invoice.create({
      data: {
        ownerId: req.user.userId,
        borrowerName,
        borrowerEmail,
        borrowerPhone,
        items: Array.isArray(items) ? items : JSON.parse(items),
        total: parseFloat(total),
        issueDate: new Date(issueDate),
        termsType,
        planAmount: planAmount ? parseFloat(planAmount) : null,
        planFreq: planFreq || null,
        memo: memo || null,
        status: 'pending'
      }
    });
    res.status(201).json(invoice);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/invoices/:id/pay
 * Confirm a Stripe PaymentIntent and mark invoice as paid
 */
router.post('/:id/pay', async (req, res, next) => {
  const prisma = req.app.get('prisma');
  const id = Number(req.params.id);
  const { paymentMethodId } = req.body;

  try {
    const invoice = await prisma.invoice.findUnique({ where: { id } });
    if (!invoice || invoice.ownerId !== req.user.userId) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const amount = Math.round(invoice.total * 100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      metadata: { invoiceId: id.toString() },
    });

    await prisma.invoice.update({
      where: { id },
      data: { status: 'paid', paidAt: new Date() },
    });

    res.json({ success: true, paymentIntentId: paymentIntent.id });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/invoices/:id/send
 * Send invoice via email (Mailtrap) and optional SMS (Twilio)
 */
router.post('/:id/send', async (req, res, next) => {
  const prisma = req.app.get('prisma');
  const id = Number(req.params.id);

  try {
    const invoice = await prisma.invoice.findUnique({ where: { id } });
    if (!invoice || invoice.ownerId !== req.user.userId) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const mailOptions = {
      from: 'no-reply@paymeback.com',
      to: invoice.borrowerEmail,
      subject: `Invoice #${invoice.id} from ${req.user.email}`,
      text: `You have a new invoice (#${invoice.id}) for $${invoice.total.toFixed(2)}. View and pay at https://${req.headers.host}/pay/${invoice.id}`,
      html: `<p>You have a new invoice (<strong>#${invoice.id}</strong>) for <strong>$${invoice.total.toFixed(2)}</strong>.</p>
             <p><a href="https://${req.headers.host}/pay/${invoice.id}">Click here to view and pay</a></p>`
    };

    await emailTransporter.sendMail(mailOptions);

    if (TWILIO_FROM && invoice.borrowerPhone) {
      await twilioClient.messages.create({
        from: TWILIO_FROM,
        to: invoice.borrowerPhone,
        body: `Invoice #${invoice.id} for $${invoice.total.toFixed(2)} available to view and pay at https://${req.headers.host}/pay/${invoice.id}`
      });
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
=======
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
>>>>>>> heroku/main
  }
});

module.exports = router;
