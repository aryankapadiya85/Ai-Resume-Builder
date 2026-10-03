export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Only POST allowed');

  try {
    const { text, context } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    // Call Gemini AI to enhance the text
    const geminiPrompt = `You are an expert resume writer. Please rewrite and enhance the following ${context || 'text'} to be highly professional, impactful, and action-oriented for a resume. Use strong action verbs. Keep it concise. Return ONLY the enhanced text without any surrounding quotes or extra commentary.\n\nOriginal text:\n${text}`;

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
    
    const enhancedText = geminiData.candidates[0].content.parts[0].text.trim();

    return res.status(200).json({ enhancedText });

  } catch (error) {
    console.error("Enhance error:", error);
    return res.status(500).json({ error: error.message });
  }
}
