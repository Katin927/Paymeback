// backend/src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { PrismaClient } = require('@prisma/client');
const path = require('path');

const authRouter     = require('./routes/auth');
const usersRouter    = require('./routes/users');
const invoicesRouter = require('./routes/invoices');

const prisma = new PrismaClient();
const app    = express();

// Whitelisted origins (add your frontend URLs here)
const allowedOrigins = [
  process.env.CORS_ORIGIN || 'http://localhost:3000',
  'https://effortless-gingersnap-d18028.netlify.app'
];

// CORS + cookie parsing
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(cookieParser());
app.set('prisma', prisma);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/invoices', invoicesRouter);

// Serve React static files
app.use(express.static(path.join(__dirname, '../frontend/build')));

// All other GET requests not handled above should return React app
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    // Let the 404 API handler run
    return next();
  }
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// 404 handler for any unmatched API requests
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`🚀 Server listening on port ${port}`));
