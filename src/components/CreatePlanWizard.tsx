"use client";

import { useState, useTransition } from "react";
import { createPlan } from "@/app/actions";

const bigInput =
  "w-full rounded-2xl border-2 border-rose-100 bg-white px-5 py-4 text-lg text-stone-800 placeholder:text-stone-300 focus:border-rose-300 focus:outline-none";

export function CreatePlanWizard() {
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!title.trim() || !recipientName.trim()) return;
    startTransition(async () => {
      const formData = new FormData();
      formData.set("title", title);
      formData.set("recipientName", recipientName);
      await createPlan(formData);
    });
  }

  const steps = [
    {
      question: "Für wen möchtet ihr kochen?",
      hint: "Der Name der Person oder Familie, die das Essen bekommt.",
      value: recipientName,
      setValue: setRecipientName,
      placeholder: "z.B. Anna & Tom",
      next: () => {
        if (!recipientName.trim()) return;
        if (!title.trim()) setTitle(`Essen für ${recipientName.trim()}`);
        setStep(1);
      },
      button: "Weiter",
    },
    {
      question: "Wie soll euer Plan heißen?",
      hint: "Diesen Titel sehen alle, die den Link öffnen.",
      value: title,
      setValue: setTitle,
      placeholder: "z.B. Essen für Anna & Tom",
      next: submit,
      button: pending ? "Einen Moment …" : "Plan erstellen 🌷",
    },
  ];

  const current = steps[step];

  return (
    <div key={step} className="animate-slide-in">
      <p className="text-sm font-medium tracking-wide text-rose-400">
        Schritt {step + 1} von {steps.length}
      </p>
      <h2 className="mt-2 text-2xl font-bold text-stone-800">
        {current.question}
      </h2>
      <p className="mt-1 text-stone-500">{current.hint}</p>

      <input
        autoFocus
        value={current.value}
        onChange={(e) => current.setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && current.next()}
        maxLength={200}
        placeholder={current.placeholder}
        className={`mt-6 ${bigInput}`}
      />

      <div className="mt-6 flex items-center gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="rounded-full px-4 py-3 text-sm font-medium text-stone-400 transition hover:text-stone-600"
          >
            ← Zurück
          </button>
        )}
        <button
          type="button"
          onClick={current.next}
          disabled={pending || !current.value.trim()}
          className="flex-1 rounded-full bg-rose-400 px-6 py-3.5 text-lg font-semibold text-white shadow-md shadow-rose-200 transition hover:bg-rose-500 disabled:opacity-40"
        >
          {current.button}
        </button>
      </div>
    </div>
  );
}
