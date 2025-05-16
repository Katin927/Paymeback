require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const path         = require('path');
const { PrismaClient } = require('@prisma/client');

const authRouter     = require('./routes/auth');
const usersRouter    = require('./routes/users');
const invoicesRouter = require('./routes/invoices');
const contactsRouter = require('./routes/contacts');
const { authenticate } = require('./middleware/auth');

const app = express();

// ─── Trust Proxy (Heroku) ─────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// ─── Prisma Client ─────────────────────────────────────────────────────────────
const prisma = new PrismaClient();
app.set('prisma', prisma);

// ─── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:3000',
  'https://paymeback.herokuapp.com'
];
const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (mobile apps, Postman) or from our whitelist
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS policy: Origin ${origin} not allowed`), false);
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// ─── Body Parsers ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── API ROUTES ─────────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/users', authenticate, usersRouter);
app.use('/api/invoices', authenticate, invoicesRouter);
app.use('/api/contacts', authenticate, contactsRouter);

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({ message: 'PayMeBack API is up and running!' });
});

// ─── Static React Build (after API & health check) ─────────────────────────────
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

// ─── 404 Handler (unreachable when serving React build) ─────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// ─── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack || err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// ─── Start Server ───────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});

module.exports = app;
