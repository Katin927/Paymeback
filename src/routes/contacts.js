<<<<<<< HEAD
// backend/src/routes/contacts.js

const express          = require('express');
const router           = express.Router();
const { listContacts, addContact } = require('../services/contacts');
const { authenticate } = require('../middleware/auth');

// GET /api/contacts
router.get('/', authenticate, async (req, res, next) => {
  try {
    const contacts = await listContacts(
      req.app.get('prisma'),
      req.user.userId
    );
=======
const express = require('express');
const router = express.Router();
const { listContacts, addContact } = require('../services/contacts');
const { authenticate } = require('../middleware/auth');

// Validate email format (optional)
const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

// GET /api/contacts
router.get('/', authenticate, async (req, res, next) => {
  try {
    const contacts = await listContacts(req.app.get('prisma'), req.user.userId);
>>>>>>> heroku/main
    res.json(contacts);
  } catch (err) {
    next(err);
  }
});

// POST /api/contacts
router.post('/', authenticate, async (req, res, next) => {
<<<<<<< HEAD
  try {
    const { name, email, phone } = req.body;
=======
  const { name, email, phone } = req.body;

  // Basic validation
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, email, and phone are required' });
  }

  // Validate email format
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
>>>>>>> heroku/main
    const contact = await addContact(
      req.app.get('prisma'),
      req.user.userId,
      { name, email, phone }
    );
    res.status(201).json(contact);
  } catch (err) {
    next(err);
  }
});

<<<<<<< HEAD
module.exports = router;
=======
module.exports = router;
>>>>>>> heroku/main
