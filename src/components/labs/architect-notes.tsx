import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export type Note = {
  tone: "info" | "success" | "warning" | "danger";
  text: string;
};

const toneMap = {
  info: { dot: "bg-electric", text: "text-text-secondary" },
  success: { dot: "bg-green", text: "text-text-secondary" },
  warning: { dot: "bg-amber", text: "text-text-secondary" },
  danger: { dot: "bg-red", text: "text-text-secondary" },
};

export function ArchitectNotes({ notes }: { notes: Note[] }) {
  return (
    <div className="rounded-xl border border-line bg-gradient-to-br from-violet/5 to-transparent">
      <div className="flex items-center gap-2.5 border-b border-line px-5 py-3.5">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet/15 text-violet">
          <ShieldCheck className="h-4 w-4" />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-text">
            Senior Architect Notes
          </h3>
          <p className="text-[11px] text-muted">
            Feedback from a 10-year SFMC veteran
          </p>
        </div>
      </div>
      <ul className="space-y-3 p-5">
        {notes.map((note, i) => {
          const tone = toneMap[note.tone];
          return (
            <li key={i} className="flex gap-3">
              <span
                className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", tone.dot)}
              />
              <p className={cn("text-sm leading-relaxed", tone.text)}>
                {note.text}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
