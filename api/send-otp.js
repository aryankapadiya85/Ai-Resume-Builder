import nodemailer from 'nodemailer';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Only POST allowed');
  
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash it
    const secret = process.env.OTP_SECRET || 'super-secret-key';
    const hash = crypto.createHmac('sha256', secret).update(email + otp).digest('hex');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS 
      }
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Your ResumeAI Login Code',
      text: `Your one-time password is: ${otp}`,
      html: `<h2>Welcome to ResumeAI!</h2><p>Your one-time password is: <strong>${otp}</strong></p><p>Please enter this code to access the app.</p>`
    });

    return res.status(200).json({ hash });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
