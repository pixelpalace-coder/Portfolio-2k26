import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Name, email and message are required.' });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const to = process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER;
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

    await transporter.sendMail({
      from: `"Portfolio Contact" <${fromEmail}>`,
      to,
      replyTo: email,
      subject: subject || 'New message from portfolio contact form',
      text: `New message from your portfolio:

Name: ${name}
Email: ${email}
Subject: ${subject || '(no subject)'}

Message:
${message}
`,
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact API error:', err);
    res.status(500).json({ error: 'Failed to send email.' });
  }
}

