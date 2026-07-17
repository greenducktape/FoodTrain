"use client";

import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback für ältere Browser / http
      const input = document.createElement("textarea");
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="shrink-0 rounded-full bg-rose-400 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-rose-200 transition hover:bg-rose-500"
    >
      {copied ? "Kopiert ✓" : "Kopieren"}
    </button>
  );
}
