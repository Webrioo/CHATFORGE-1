'use strict';

require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const publicDir = path.join(__dirname);

app.disable('x-powered-by');
app.use(express.json({ limit: '12kb' }));
app.use(express.static(publicDir, { extensions: ['html'] }));

// Small in-memory rate limiter. For a multi-instance deployment, use a shared store.
const submissions = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_SUBMISSIONS = 5;
app.post('/api/contact', async (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const recent = (submissions.get(ip) || []).filter((stamp) => now - stamp < WINDOW_MS);
  if (recent.length >= MAX_SUBMISSIONS) {
    return res.status(429).json({ error: 'Too many enquiries from this connection. Please try again later.' });
  }

  const body = req.body || {};
  // Quietly accept the honeypot so basic bots do not learn the filter.
  if (typeof body.company_website === 'string' && body.company_website.trim()) {
    submissions.set(ip, [...recent, now]);
    return res.json({ ok: true });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const interest = typeof body.interest === 'string' ? body.interest.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const validInterests = [
    'Business AI assistant',
    'Personal AI assistant',
    'Public AI chatbot',
    'Not sure yet — help me decide'
  ];
  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name || name.length > 100 || !emailLooksValid || email.length > 254 || !validInterests.includes(interest) || message.length > 3000) {
    return res.status(400).json({ error: 'Please check your details and try again.' });
  }

  const requiredEnv = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'CONTACT_TO'];
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length) {
    console.error(`Contact form is not configured. Missing environment values: ${missing.join(', ')}`);
    return res.status(503).json({ error: 'The enquiry form is not connected yet. Please try again later.' });
  }

  try {
    const port = Number(process.env.SMTP_PORT);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE === 'true' || port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });

    const safeName = name.replace(/[\r\n]+/g, ' ');
    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_TO,
      replyTo: email,
      subject: `New ChatForge enquiry — ${interest}`,
      text: [
        'A new enquiry was submitted through the ChatForge website.',
        '',
        `Name: ${safeName}`,
        `Email: ${email}`,
        `Interested in: ${interest}`,
        '',
        'Message:',
        message || '(No additional message provided.)'
      ].join('\n')
    });

    submissions.set(ip, [...recent, now]);
    return res.json({ ok: true });
  } catch (error) {
    console.error('Unable to send contact enquiry:', error.message);
    return res.status(500).json({ error: 'We could not send your enquiry right now. Please try again later.' });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`ChatForge is running at http://localhost:${PORT}`);
});
