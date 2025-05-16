<<<<<<< HEAD
// backend/src/index.js
require('dotenv').config();
const express      = require('express');
const cookieParser = require('cookie-parser');
const { PrismaClient } = require('@prisma/client');
const path         = require('path');

const authRouter     = require('./routes/auth');
const usersRouter    = require('./routes/users');
const invoicesRouter = require('./routes/invoices');

const app    = express();
const prisma = new PrismaClient();

// --- CORS & Preflight (allow any origin) ---
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    // echo back incoming origin — you can lock this down later
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // preflight
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    return res.sendStatus(200);
  }
  next();
});

// JSON body + cookies
app.use(express.json());
app.use(cookieParser());

// attach Prisma client
app.set('prisma', prisma);

// --- Health check ---
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// --- API routes (all under /api) ---
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/invoices', invoicesRouter);

// --- Serve React static build ---
app.use(express.static(path.join(__dirname, '../frontend/build')));

// fallback to React for any non‐API GET
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    // no such API route
    return res.status(404).json({ error: 'Not Found' });
  }
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// --- Global error handler ---
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// start
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`🚀 Server listening on port ${port}`));
=======
// src/index.js
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 PayMeBack API running at http://localhost:${PORT}`);
});
>>>>>>> heroku/main
