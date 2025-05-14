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
    res.json(contacts);
  } catch (err) {
    next(err);
  }
});

// POST /api/contacts
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
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

module.exports = router;
