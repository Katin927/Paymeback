const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// GET /api/invoices/:id
router.get('/:id', authenticate, async (req, res, next) => {
  const { id } = req.params;  // 'id' is the parameter name
  try {
    const prisma = req.app.get('prisma');
    const invoice = await prisma.invoice.findUnique({
      where: { id: parseInt(id) },
    });

    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
