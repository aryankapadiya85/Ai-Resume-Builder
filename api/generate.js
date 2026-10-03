import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Only POST allowed');

  try {
    const data = req.body;
    
    // 1. Call Gemini AI to generate HTML resume and enhance descriptions
    const geminiPrompt = `You are an expert resume writer. Output ONLY a clean, professional HTML resume based on the following user data. Enhance their experience and project descriptions based on their domain to be highly professional and impressive. Do not include any markdown formatting like \`\`\`html, just output raw HTML.\n\nUser Data: ${JSON.stringify(data)}`;
    
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: geminiPrompt }]
        }],
        generationConfig: {
          temperature: 0.7
        }
      })
    });
    
    const geminiData = await geminiResponse.json();
    if (!geminiResponse.ok || !geminiData.candidates) {
      throw new Error(`Gemini API Error: ${JSON.stringify(geminiData)}`);
    }
    const htmlResume = geminiData.candidates[0].content.parts[0].text.replace(/```html|```/gi, '').trim();

    // 2. Convert HTML to PDF using PDFBolt
    const pdfResponse = await fetch('https://api.pdfbolt.com/v1/direct', {
      method: 'POST',
      headers: {
        'API-KEY': process.env.PDFBOLT_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ html: Buffer.from(htmlResume).toString('base64') })
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
      bcc: process.env.GMAIL_USER, // Notifies the admin and gives them a copy of the resume
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
