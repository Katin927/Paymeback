// backend/src/services/email.js
const nodemailer = require('nodemailer');

// configure with your Mailtrap (or other SMTP) credentials in .env
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

/**
 * Send an invoice email.
 * @param {Object} invoice  – Prisma invoice record (with JSON items array, etc.)
 * @param {string} to       – recipient email address
 */
async function sendInvoiceEmail(invoice, to) {
  // build a simple HTML invoice
  const html = `
    <h2>Invoice #${invoice.id}</h2>
    <p><strong>Date:</strong> ${new Date(invoice.issueDate).toLocaleDateString()}</p>
    <p><strong>Total:</strong> $${invoice.total.toFixed(2)}</p>
    <h3>Items:</h3>
    <ul>
      ${invoice.items
        .map(i => `<li>${i.description}: $${i.amount.toFixed(2)}</li>`)
        .join('')}
    </ul>
    <p>Thank you for your business!</p>
  `;

  await transporter.sendMail({
    from: `"PayMeBack" <no-reply@paymeback.app>`,
    to,
    subject: `Invoice #${invoice.id}`,
    html
  });
}

module.exports = { sendInvoiceEmail };
