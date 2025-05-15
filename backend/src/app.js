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
  origin: 'https://effortless-gingersnap-d18028.netlify.app', // replace with your Netlify URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));

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
  console.error(err);
  res
    .status(err.status || 500)
    .json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
