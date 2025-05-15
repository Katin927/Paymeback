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
});

module.exports = app;
