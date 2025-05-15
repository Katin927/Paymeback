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

const prisma = new PrismaClient();
const app = express();

// Make Prisma client available to routes
app.set('prisma', prisma);

// ✅ Updated CORS options for dev + prod
const corsOptions = {
  origin: [
    'http://localhost:3000', // dev
    'https://effortless-gingersnap-d18028.netlify.app' // production (Netlify frontend)
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// ✅ Health check route
app.get('/', (req, res) => {
  res.json({ message: 'PayMeBack API is up and running!' });
});

// ✅ API routes
app.use('/api/auth', authRouter);
app.use('/api/users', authenticate, usersRouter);
app.use('/api/invoices', authenticate, invoicesRouter);
app.use('/api/contacts', authenticate, contactsRouter);

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
  });
});

module.exports = app;
