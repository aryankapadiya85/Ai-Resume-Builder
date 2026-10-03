import crypto from 'crypto';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Only POST allowed');
  
  try {
    const { email, otp, hash } = req.body;
    if (!email || !otp || !hash) return res.status(400).json({ error: 'Missing parameters' });

    const secret = process.env.OTP_SECRET || 'super-secret-key';
    const computedHash = crypto.createHmac('sha256', secret).update(email + otp).digest('hex');
    
    if (computedHash === hash) {
      // Notify Admin
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS 
          }
        });
        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: process.env.GMAIL_USER,
          subject: 'New User Authenticated on ResumeAI',
          text: `The following email has successfully completed OTP authentication: ${email}`
        });
      } catch (notifyErr) {
        console.error("Failed to send admin notification:", notifyErr);
      }

      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
