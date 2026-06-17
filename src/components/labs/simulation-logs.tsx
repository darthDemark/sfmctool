import { cn } from "@/lib/utils";

export type LogLine = {
  level: "INFO" | "WARN" | "ERROR" | "OK";
  time: string;
  message: string;
};

const levelColor = {
  INFO: "text-electric",
  WARN: "text-amber",
  ERROR: "text-red",
  OK: "text-green",
};

export function SimulationLogs({ lines }: { lines: LogLine[] }) {
  return (
    <div className="scrollbar-thin max-h-72 overflow-y-auto rounded-lg border border-line bg-deep p-3 font-mono text-[12px] leading-relaxed">
      {lines.map((line, i) => (
        <div key={i} className="flex gap-3 px-1 py-0.5">
          <span className="shrink-0 text-muted">{line.time}</span>
          <span className={cn("w-12 shrink-0 font-semibold", levelColor[line.level])}>
            {line.level}
          </span>
          <span className="text-text-secondary">{line.message}</span>
        </div>
      ))}
    </div>
  );
}
