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
});

module.exports = app;
