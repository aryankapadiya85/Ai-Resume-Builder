# AI Resume Builder - Dimensional Edition

A sleek, dimensional web interface for the AI Resume Tailoring Engine. Features an immersive dark mode design and smooth micro-animations.

## 🚀 Features
- **Modern UI**: Dark mode, dimensional rendering, and micro-animations using Framer Motion.
- **Vercel Serverless API**: Processes user data via Vercel serverless functions in the backend.
- **Groq AI Tailoring**: Uses Groq LLMs to instantly analyze and tailor resumes for specific job descriptions.
- **Automated PDF Delivery**: Converts the tailored HTML into a PDF via PDFBolt and emails the final result via Gmail API (via Nodemailer).

## 💻 Tech Stack
- **Frontend**: React, Vite, Framer Motion, Vanilla CSS
- **Backend**: Vercel Serverless Functions (Node.js), Groq AI, PDFBolt, Nodemailer

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

## 🤖 Backend API
The project handles API requests via the `api/generate.js` file, built to run seamlessly on Vercel Serverless Functions. Set up your environment variables (`GROQ_API_KEY`, `PDFBOLT_API_KEY`, `GMAIL_USER`, `GMAIL_PASS`) to enable AI tailoring and email delivery.

---
*Designed & built by [Aryan Kapadiya](https://github.com/aryankapadiya85)*
