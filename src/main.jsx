import React, { useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

// ---------------------------------------------------------------------------
// Point this to your Vercel Serverless Function.
// Uses the api/generate.js endpoint.
// ---------------------------------------------------------------------------
const WEBHOOK_URL =
  "/api/generate";

const initialState = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  objective: "",
  education: "",
  skills: "",
  experience: "",
  projects: "",
  certifications: "",
  achievements: "",
  jobTitle: "",
  jobDescription: "",
};

const STEPS = [
  {
    id: "personal",
    number: "01",
    title: "Personal details",
    note: "How the hiring manager reaches you.",
    fields: [
      { name: "fullName", label: "Full name", type: "text", required: true, placeholder: "Aryan Kapadiya" },
      { name: "email", label: "Email", type: "email", required: true, placeholder: "you@email.com" },
      { name: "phone", label: "Phone", type: "tel", required: true, placeholder: "+91 98765 43210" },
      { name: "location", label: "Location", type: "text", required: true, placeholder: "Rajkot, Gujarat" },
    ],
  },
  {
    id: "career",
    number: "02",
    title: "Career details",
    note: "Raw notes are fine — the AI turns them into resume copy.",
    fields: [
      { name: "objective", label: "Career objective", type: "textarea", required: true, placeholder: "What you're looking for and what you bring to it." },
      { name: "education", label: "Education", type: "textarea", required: true, placeholder: "Degree, institution, year, grade." },
      { name: "skills", label: "Skills", type: "textarea", required: true, placeholder: "React, Node.js, SQL, Figma..." },
      { name: "experience", label: "Experience", type: "textarea", required: false, placeholder: "Role, company, dates, what you did." },
      { name: "projects", label: "Projects", type: "textarea", required: false, placeholder: "Project name — what it does, your role, stack." },
      { name: "certifications", label: "Certifications", type: "textarea", required: false, placeholder: "Certificate name, issuer, year." },
      { name: "achievements", label: "Achievements", type: "textarea", required: false, placeholder: "Awards, recognitions, measurable wins." },
    ],
  },
  {
    id: "target",
    number: "03",
    title: "Target job",
    note: "The AI tailors your resume and cover letter to this specific role.",
    fields: [
      { name: "jobTitle", label: "Job title", type: "text", required: true, placeholder: "Frontend Developer" },
      { name: "jobDescription", label: "Job description", type: "textarea", required: true, placeholder: "Paste the job listing here." },
    ],
  },
];

function useTilt(maxDeg = 10) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const onMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    const ry = (px - 0.5) * maxDeg * 2;
    const rx = (0.5 - py) * maxDeg * 2;
    setTilt({ rx, ry });
  };

  const onMouseLeave = () => setTilt({ rx: 0, ry: 0 });

  return { ref, tilt, onMouseMove, onMouseLeave };
}

function Field({ field, value, onChange }) {
  const commonProps = {
    id: field.name,
    name: field.name,
    value,
    required: field.required,
    placeholder: field.placeholder,
    onChange: (e) => onChange(field.name, e.target.value),
  };

  return (
    <div className="field">
      <label htmlFor={field.name}>
        {field.label}
        {!field.required && <span className="field-optional">optional</span>}
      </label>
      {field.type === "textarea" ? (
        <textarea rows={4} {...commonProps} />
      ) : (
        <input type={field.type} {...commonProps} />
      )}
    </div>
  );
}

function ProgressRail({ currentStep }) {
  return (
    <div className="rail">
      {STEPS.map((step, i) => (
        <React.Fragment key={step.id}>
          <div
            className={
              "rivet" +
              (i === currentStep ? " rivet-active" : i < currentStep ? " rivet-done" : "")
            }
          >
            <span>{i < currentStep ? "✓" : step.number}</span>
            <p>{step.title}</p>
          </div>
          {i < STEPS.length - 1 && (
            <div className={"rail-line" + (i < currentStep ? " rail-line-done" : "")} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function Hero() {
  const { ref, tilt, onMouseMove, onMouseLeave } = useTilt(9);

  return (
    <section
      className="hero"
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="hero-copy">
        <p className="kicker">ResumeAI · dimensional edition</p>
        <h1>
          Your resume,
          <br />
          rendered in depth.
        </h1>
        <p className="subhead">
          Three short steps. One AI workflow. A resume and cover letter tailored to
          the job you're chasing, sent straight to your inbox.
        </p>
      </div>

      <div
        className="stage"
        style={{ "--rx": `${tilt.rx}deg`, "--ry": `${tilt.ry}deg` }}
      >
        <div className="paper paper-back" />
        <div className="paper paper-mid" />
        <div className="paper paper-front">
          <div className="sheet-rule sheet-rule-wide" />
          <div className="sheet-rule" />
          <div className="sheet-rule" />
          <div className="sheet-block" />
          <div className="sheet-rule" />
          <div className="sheet-rule sheet-rule-short" />
          <span className="sheet-seal">AI</span>
        </div>
        <div className="stage-glow" />
      </div>
    </section>
  );
}

function App() {
  const [form, setForm] = useState(initialState);
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const [attempted, setAttempted] = useState(false);

  const step = STEPS[currentStep];

  const isStepValid = useMemo(() => {
    return step.fields
      .filter((f) => f.required)
      .every((f) => form[f.name].trim().length > 0);
  }, [step, form]);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const goNext = () => {
    if (!isStepValid) {
      setAttempted(true);
      return;
    }
    setAttempted(false);
    setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setAttempted(false);
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isStepValid) {
      setAttempted(true);
      return;
    }
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(`Workflow responded with status ${response.status}`);
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err.message || "Couldn't reach the workflow. Check the webhook URL and try again."
      );
    }
  };

  const handleReset = () => {
    setForm(initialState);
    setCurrentStep(0);
    setStatus("idle");
    setErrorMessage("");
    setAttempted(false);
  };

  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div className="app">
      <div className="grain" />
      <div className="container">
        <Hero />

        {status === "success" ? (
          <div className="panel result-panel">
            <p className="result-seal">✓</p>
            <h2>Your workflow is running</h2>
            <p>
              Groq is drafting your resume and cover letter now. Check{" "}
              <strong>{form.email || "your inbox"}</strong> in a minute or two.
            </p>
            <button type="button" className="secondary-btn" onClick={handleReset}>
              Generate another
            </button>
          </div>
        ) : (
          <>
            <ProgressRail currentStep={currentStep} />

            <form onSubmit={handleSubmit} noValidate>
              <div className="flip-stage">
                <div className="panel flip-panel" key={step.id}>
                  <div className="section-heading">
                    <span className="section-number">{step.number}</span>
                    <div>
                      <h2>{step.title}</h2>
                      <p className="section-note">{step.note}</p>
                    </div>
                  </div>
                  <div className="grid">
                    {step.fields.map((field) => (
                      <Field
                        key={field.name}
                        field={field}
                        value={form[field.name]}
                        onChange={handleChange}
                      />
                    ))}
                  </div>

                  {attempted && !isStepValid && (
                    <p className="field-warning">Fill in the required fields to continue.</p>
                  )}
                </div>
              </div>

              {status === "error" && (
                <div className="error-banner" role="alert">
                  <strong>Couldn't generate your resume.</strong> {errorMessage}
                </div>
              )}

              <div className="nav-row">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={goBack}
                  disabled={currentStep === 0}
                >
                  Back
                </button>

                {isLastStep ? (
                  <button type="submit" className="generate-btn" disabled={status === "loading"}>
                    {status === "loading" ? (
                      <>
                        <span className="spinner" aria-hidden="true" />
                        Generating your resume…
                      </>
                    ) : (
                      "Generate my resume"
                    )}
                  </button>
                ) : (
                  <button type="button" className="generate-btn" onClick={goNext}>
                    Continue
                  </button>
                )}
              </div>
              <p className="fine-print">
                Submitting sends your details straight to our serverless backend — no API key
                lives in this page.
              </p>
            </form>
          </>
        )}

        <footer className="footer">
          <span>ResumeAI</span>
          <span>Built on Vercel · Groq · Gmail</span>
        </footer>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
