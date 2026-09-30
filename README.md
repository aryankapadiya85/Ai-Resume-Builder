# ResumeAI UI — 3D edition

Frontend for your n8n resume-generation workflow: Website → n8n Webhook → Groq AI → Resume + Cover Letter → Gmail.

This version presents the form as a three-step wizard with a tilting 3D paper stack in the hero (it follows your cursor) and a flip transition between steps.

## Run it

```bash
npm install
npm run dev
```

## Point it at your workflow

Open `src/main.jsx` and check the `WEBHOOK_URL` constant near the top:

```js
const WEBHOOK_URL =
  "https://aryankapadiya85.app.n8n.cloud/webhook/generate-free-resume";
```

- While testing in the n8n editor, use the **test** URL: `.../webhook-test/generate-free-resume`
- Once your workflow is Published/Active, use the **production** URL above.

No API key is stored in this frontend.

## What's included

- `index.html` — loads Fraunces (display serif) + JetBrains Mono
- `src/main.jsx` — three-step wizard (Personal → Career → Target job), 3D tilt hero, submit/loading/success/error states
- `src/styles.css` — all the 3D transforms, glow, and responsive rules
- `package.json`, `vite.config.js` — standard Vite + React, no extra dependencies

## Fields collected

**Personal details** — full name, email, phone, location
**Career details** — objective, education, skills, experience, projects, certifications, achievements
**Target job** — job title, job description

Submitting on the final step fires the webhook immediately.
