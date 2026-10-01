import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Only POST allowed');

  try {
    const data = req.body;
    
    // 1. Call Groq AI to generate HTML resume
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [
          { role: 'system', content: 'You are an expert resume writer. Output ONLY a clean, professional HTML resume based on the user data. No markdown, just raw HTML.' },
          { role: 'user', content: JSON.stringify(data) }
        ]
      })
    });
    
    const groqData = await groqResponse.json();
    if (!groqResponse.ok || !groqData.choices) {
      throw new Error(`Groq API Error: ${JSON.stringify(groqData)}`);
    }
    const htmlResume = groqData.choices[0].message.content;

    // 2. Convert HTML to PDF using PDFBolt (or similar HTML-to-PDF API)
    const pdfResponse = await fetch('https://api.pdfbolt.com/v1/pdf/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PDFBOLT_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ html: htmlResume })
    });
    if (!pdfResponse.ok) {
      const errText = await pdfResponse.text();
      throw new Error(`PDFBolt Error: ${pdfResponse.status} ${errText}`);
    }
    const pdfBuffer = await pdfResponse.arrayBuffer();

    // 3. Send Email using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS 
      }
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: data.email, // Sends to whatever email the user typed in the form
      subject: 'Your AI Tailored Resume is Ready! 🚀',
      text: 'Hello! Please find your AI-tailored resume attached.',
      attachments: [{ filename: 'Tailored_Resume.pdf', content: Buffer.from(pdfBuffer) }]
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
