# AI Resume Builder - Dimensional Edition

A sleek, dimensional web interface for the AI Resume Tailoring Engine. Features an immersive dark mode design and smooth micro-animations.

## 🚀 Features
- **Modern UI**: Dark mode, dimensional rendering, and micro-animations using Framer Motion.
- **n8n Integration**: Sends user data to an automated n8n webhook workflow.
- **Groq AI Tailoring**: Uses Groq LLMs to instantly analyze and tailor resumes for specific job descriptions.
- **Automated PDF Delivery**: Converts the tailored HTML into a PDF via PDFBolt and emails the final result via Gmail API.

## 💻 Tech Stack
- **Frontend**: React, Vite, Framer Motion, Vanilla CSS
- **Backend Workflow**: n8n, Groq AI, PDFBolt, Gmail API

## 🛠️ How to Run Locally

1. Clone the repository
   ```bash
   git clone https://github.com/aryankapadiya85/Ai-Resume-Builder.git
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

## 🤖 Backend Automation
The project includes the n8n workflow file located in the `n8n` directory. You can import this JSON file directly into your n8n instance to set up the webhook and email delivery system.

---
*Designed & built by [Aryan Kapadiya](https://github.com/aryankapadiya85)*
