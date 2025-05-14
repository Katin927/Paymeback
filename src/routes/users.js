// backend/src/routes/users.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// GET /api/users/me
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const prisma = req.app.get('prisma');
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, name: true, email: true, phone: true }
    });
    if (!user) return res.sendStatus(404);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
