import { useState } from "react";
import { supabase } from "./supabaseClient";

const stages = [
  {
    name: "Breathe",
    description: "A guided breathing exercise to calm and centre yourself.",
  },
  {
    name: "Feel",
    placeholder: "How are you feeling right now?",
  },
  {
    name: "Gratitude",
    placeholder: "What are you grateful for today?",
  },
  {
    name: "Intention",
    placeholder: "Set a positive intention for the day",
  },
];

export function CheckInPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [feeling, setFeeling] = useState("");
  const [gratitude, setGratitude] = useState("");
  const [intention, setIntention] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isLastStep = currentStep === stages.length - 1;

  async function handleSubmit() {
    const { error } = await supabase.from("check_ins").insert({
      feeling,
      gratitude,
      intention,
    });
    if (!error) {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="check-in-page">
        <h1>Check-in Complete</h1>
        <p>Thank you for taking a moment for yourself today.</p>
      </div>
    );
  }

  const stage = stages[currentStep];

  return (
    <div className="check-in-page">
      <nav className="stepper" aria-label="Check-in progress">
        {stages.map((s, i) => {
          let className = "step";
          if (i === currentStep) className += " step--active";
          else if (i < currentStep) className += " step--completed";
          return (
            <div key={s.name} className={className} data-testid={`step-${i}`}>
              <span className="step-number">{i + 1}</span>
              <span className="step-name">{s.name}</span>
            </div>
          );
        })}
      </nav>

      <div className="stage-content">
        <h2>{stage.name}</h2>

        {currentStep === 0 && (
          <p>A guided breathing exercise to calm and centre yourself.</p>
        )}

        {currentStep === 1 && (
          <textarea
            placeholder="How are you feeling right now?"
            value={feeling}
            onChange={(e) => setFeeling(e.target.value)}
          />
        )}

        {currentStep === 2 && (
          <textarea
            placeholder="What are you grateful for today?"
            value={gratitude}
            onChange={(e) => setGratitude(e.target.value)}
          />
        )}

        {currentStep === 3 && (
          <textarea
            placeholder="Set a positive intention for the day"
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
          />
        )}
      </div>

      <div className="stage-actions">
        {currentStep > 0 && (
          <button type="button" onClick={() => setCurrentStep((s) => s - 1)}>
            Back
          </button>
        )}
        {isLastStep ? (
          <button type="button" onClick={handleSubmit}>
            Submit
          </button>
        ) : (
          <button type="button" onClick={() => setCurrentStep((s) => s + 1)}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}
