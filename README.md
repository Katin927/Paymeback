# Paymeback

# PaymebackPayMeBack 💸

PayMeBack URL: https://paymeback.herokuapp.com/
GitHub repo URL: https://github.com/Katin927/PayMeBack
Project Initial Ideas: https://docs.google.com/document/your-initial-ideas
Project Proposal: https://docs.google.com/document/your-project-proposal

What is PayMeBack?

PayMeBack is a full-stack web application designed to simplify splitting bills, sending invoices, and tracking personal debts. With a mobile-first responsive interface, users can create individual or group invoices, send payment requests via email or SMS, and settle balances seamlessly.

Features Implemented

Invoice Creation: Build one-time or recurring invoices with customizable line items and payment terms.

Group Bill Splitting: Divide shared expenses among multiple participants, auto-calculating each person’s share.

Payment Integrations: Accept payments securely through Stripe and track real-time payment statuses.

Bank Linking: (Optional) Integrate with Plaid for bank account verification and balance checks.

Notifications: Send invoice reminders and payment confirmations via email (Mailtrap) and SMS (Twilio).

Dashboard & Analytics: View outstanding balances, payment history, and upcoming recurring payments in a consolidated dashboard.

Authentication & Security: User signup/login with JWT-based authentication and protected API routes.

Dark/Light Mode: Toggle between dark and light themes for comfortable usage in any environment.

Why These Features?

The goal of PayMeBack is to remove the awkwardness and manual calculations involved in splitting bills or chasing payments. Automated invoicing, secure payment processing, and in-app notifications keep users on top of their finances without hassle.

Standard User Flow

User signs up or logs in.

User creates a new invoice (individual or group).

User adds line items, sets terms (one-time or recurring), and enters participants.

System generates a shareable link and sends requests via email/SMS.

Recipients click the link, review the invoice, and pay via Stripe.

User monitors payment status and views history in the dashboard.

APIs & Services Used

Stripe API: Secure payment processing for one-time and recurring invoices.

Twilio API: SMS notifications for invoice reminders and confirmations.

Mailtrap (Nodemailer): Email delivery of invoices and notifications in development.

Plaid API: (Optional) Bank account linking for balance checks and validation.

Technology Stack

Frontend: React.js, Tailwind CSS, React Router

Backend: Node.js, Express.js, Prisma ORM

Database: PostgreSQL (Heroku Postgres)

Authentication: JSON Web Tokens (JWT)

Deployment: Heroku

Future Improvements

In-app Chat: Allow users to comment or message within an invoice for clarifications.

Mobile App: Build native Android/iOS apps using React Native for on-the-go invoicing.

Automated Recurring Payments: Fully automate subscription billing cycles.

PDF Export: Generate downloadable and printable PDF invoices.

Multi-currency Support: Enable invoices in different currencies with real-time exchange rates.

Additional Notes

PayMeBack focuses on simplicity and security, offering a lightweight solution for both personal and group financing scenarios. Challenges included handling nested relational data with Prisma and orchestrating Stripe webhooks for payment updates.

Project Planning Files

Initial Project Ideas: Uploaded to GitHub repository.

Project Proposal: Uploaded to GitHub repository.

🚀 Deployment

Deployed via Heroku. Visit the live application to create, send, and manage invoices all in one place.

Thank you for exploring PayMeBack! We hope it makes settling bills and keeping track of payments effortless.

