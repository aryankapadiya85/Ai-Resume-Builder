import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Only POST allowed');
  
  try {
    const { email, otp, hash } = req.body;
    if (!email || !otp || !hash) return res.status(400).json({ error: 'Missing parameters' });

    const secret = process.env.OTP_SECRET || 'super-secret-key';
    const computedHash = crypto.createHmac('sha256', secret).update(email + otp).digest('hex');
    
    if (computedHash === hash) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
