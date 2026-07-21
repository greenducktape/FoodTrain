"use client";

import { useState } from "react";

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

function iso(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export type DayMarker = "free" | "taken";

export function MonthCalendar({
  markers = {},
  selected,
  onPick,
  mode,
  minDate,
}: {
  /** Markierte Tage: Wunschtage der Empfänger (frei / schon versorgt) */
  markers?: Record<string, DayMarker>;
  selected: string[];
  onPick: (isoDate: string) => void;
  /** "pick-marked": nur markierte Tage wählbar (Helfer-Ansicht),
      "pick-future": alle Tage ab minDate wählbar (Empfänger wählen Wunschtage) */
  mode: "pick-marked" | "pick-future";
  minDate?: string;
}) {
  const startIso =
    selected[0] ?? Object.keys(markers).sort()[0] ?? minDate ?? iso(new Date().getFullYear(), new Date().getMonth(), 1);
  const [year, setYear] = useState(Number(startIso.slice(0, 4)));
  const [month, setMonth] = useState(Number(startIso.slice(5, 7)) - 1);

  const monthLabel = new Intl.DateTimeFormat("de-DE", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month, 1));

  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Mo = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const now = new Date();
  const todayIso = iso(now.getFullYear(), now.getMonth(), now.getDate());

  function shiftMonth(delta: number) {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  }

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="card-warm mx-auto w-full max-w-sm p-5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          aria-label="Voriger Monat"
          className="flex h-9 w-9 items-center justify-center rounded-full text-stone-400 transition hover:bg-rose-50 hover:text-rose-500"
        >
          ‹
        </button>
        <p className="font-semibold text-stone-800">{monthLabel}</p>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          aria-label="Nächster Monat"
          className="flex h-9 w-9 items-center justify-center rounded-full text-stone-400 transition hover:bg-rose-50 hover:text-rose-500"
        >
          ›
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-medium text-stone-400">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;

          const dayIso = iso(year, month, day);
          const marker = markers[dayIso];
          const isSelected = selected.includes(dayIso);
          const isPast = minDate ? dayIso < minDate : false;
          const selectable =
            mode === "pick-marked" ? marker !== undefined && !isPast : !isPast;

          let cls =
            "relative mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm transition ";
          if (isSelected) {
            cls += "btn-warm font-semibold text-white";
          } else if (marker === "free") {
            cls += "chip-warm font-semibold ring-1 ring-rose-200 hover:brightness-105";
          } else if (marker === "taken") {
            cls += "chip-sage font-semibold ring-1 ring-emerald-100 hover:brightness-105";
          } else if (selectable) {
            cls += "text-stone-600 hover:bg-rose-50";
          } else {
            cls += "text-stone-300";
          }

          return (
            <button
              key={dayIso}
              type="button"
              disabled={!selectable}
              onClick={() => onPick(dayIso)}
              className={cls}
            >
              {day}
              {dayIso === todayIso && !isSelected && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-rose-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
