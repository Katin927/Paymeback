<<<<<<< HEAD
// backend/src/app.js
require('dotenv').config();

const express       = require('express');
const cors          = require('cors');
const { PrismaClient } = require('@prisma/client');
const authRouter    = require('./routes/auth');
const usersRouter   = require('./routes/users');
const invoicesRouter= require('./routes/invoices');
const contactsRouter= require('./routes/contacts');
const { authenticate } = require('./middleware/auth');

const prisma = new PrismaClient();
const app = express();

// Make Prisma client available in routes via req.app.get('prisma')
app.set('prisma', prisma);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'PayMeBack API is up and running!' });
});

// Public routes
app.use('/api/auth', authRouter);

// Protected routes
app.use('/api/users',      authenticate, usersRouter);
app.use('/api/invoices',   authenticate, invoicesRouter);
app.use('/api/contacts',   authenticate, contactsRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ error: err.message || 'Internal Server Error' });
=======
// src/app.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const invoicesRouter = require('./routes/invoices');
const contactsRouter = require('./routes/contacts');
const { authenticate } = require('./middleware/auth');

const app = express();
const prisma = new PrismaClient();

// Make Prisma client available in routes
app.set('prisma', prisma);

// ✅ CORS setup for both dev and production
const corsOptions = {
  origin: [
    'http://localhost:3000', // local dev
    'https://effortless-gingersnap-d18028.netlify.app' // deployed frontend
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ✅ handle CORS preflight requests
app.use(express.json());

// ✅ Health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'PayMeBack API is up and running!' });
});

// ✅ Routes
app.use('/api/auth', authRouter);
app.use('/api/users', authenticate, usersRouter);
app.use('/api/invoices', authenticate, invoicesRouter);
app.use('/api/contacts', authenticate, contactsRouter);

// ✅ Catch-all 404 for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
>>>>>>> heroku/main
});

module.exports = app;
