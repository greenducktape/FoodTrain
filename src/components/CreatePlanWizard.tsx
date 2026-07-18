"use client";

import { useState, useTransition } from "react";
import { createPlan } from "@/app/actions";

export function CreatePlanWizard() {
  const [recipientName, setRecipientName] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    const name = recipientName.trim();
    if (!name || pending) return;
    startTransition(async () => {
      const formData = new FormData();
      formData.set("title", `Essen für ${name}`);
      formData.set("recipientName", name);
      await createPlan(formData);
    });
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-stone-800">
        Für wen möchtet ihr kochen?
      </h2>
      <p className="mt-1 text-stone-500">
        Mehr braucht es nicht – alles Weitere kommt danach, Schritt für Schritt.
      </p>

      <input
        autoFocus
        value={recipientName}
        onChange={(e) => setRecipientName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        maxLength={190}
        placeholder="z.B. Anna & Tom"
        className="input-line mt-6 w-full text-2xl"
      />

      <button
        type="button"
        onClick={submit}
        disabled={pending || !recipientName.trim()}
        className="btn-warm mt-8 w-full rounded-full px-6 py-3.5 text-lg font-semibold text-white disabled:opacity-40"
      >
        {pending ? "Einen Moment …" : "Essensplan erstellen 🌷"}
      </button>
    </div>
  );
}
