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

// Make Prisma client available in routes via req.app.get('prisma')
app.set('prisma', prisma);

// CORS options
const corsOptions = {
  origin: 'https://effortless-gingersnap-d18028.netlify.app',  // Set to your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allowing custom headers like Authorization
  credentials: true,  // Allow credentials (cookies, session)
};

// Enable CORS with the options
app.use(cors(corsOptions));

// Allow preflight requests for all routes
app.options('*', cors(corsOptions));  // Respond to preflight OPTIONS requests

// Parse JSON request bodies
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'PayMeBack API is up and running!' });
});

// Public routes
app.use('/api/auth', authRouter);

// Protected routes
app.use('/api/users', authenticate, usersRouter);
app.use('/api/invoices', authenticate, invoicesRouter);
app.use('/api/contacts', authenticate, contactsRouter);

// Error handler
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
