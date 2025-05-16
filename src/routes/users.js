<<<<<<< HEAD
// backend/src/routes/users.js
=======
>>>>>>> heroku/main
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

<<<<<<< HEAD
// GET /api/users/me
=======
// GET /api/users/me (No change needed)
>>>>>>> heroku/main
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

<<<<<<< HEAD
=======
// GET /api/users/:id (Handling dynamic parameter)
router.get('/:id', authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const prisma = req.app.get('prisma');
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: { id: true, name: true, email: true, phone: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

>>>>>>> heroku/main
module.exports = router;
