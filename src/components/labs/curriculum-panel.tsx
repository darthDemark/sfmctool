"use client";

import { CheckCircle2, Lock, Circle, Dot } from "lucide-react";
import { cn } from "@/lib/utils";

export type CurriculumLevel = "Beginner" | "Intermediate" | "Advanced";

export type CurriculumItem = {
  id: string;
  level: CurriculumLevel;
  title: string;
  xp: number;
};

const levelTone: Record<CurriculumLevel, string> = {
  Beginner: "text-green",
  Intermediate: "text-amber",
  Advanced: "text-red",
};

const levelDot: Record<CurriculumLevel, string> = {
  Beginner: "bg-green",
  Intermediate: "bg-amber",
  Advanced: "bg-red",
};

export function CurriculumPanel({
  items,
  currentId,
  completedIds,
  onSelect,
  itemLabel = "Lesson",
}: {
  items: CurriculumItem[];
  currentId: string;
  completedIds: string[];
  onSelect: (id: string) => void;
  itemLabel?: string;
}) {
  const levels: CurriculumLevel[] = ["Beginner", "Intermediate", "Advanced"];

  const isUnlocked = (index: number) =>
    index === 0 || completedIds.includes(items[index - 1].id);

  let counter = 0;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-line px-4 py-3">
        <h3 className="text-sm font-semibold text-text">Curriculum</h3>
        <p className="text-[11px] text-muted">
          {completedIds.filter((id) => items.some((i) => i.id === id)).length} /{" "}
          {items.length} {itemLabel.toLowerCase()}s complete
        </p>
      </div>
      <div className="scrollbar-thin flex-1 space-y-4 overflow-y-auto p-3">
        {levels.map((level) => {
          const levelItems = items.filter((i) => i.level === level);
          if (levelItems.length === 0) return null;
          return (
            <div key={level}>
              <div className="mb-1.5 flex items-center gap-2 px-2">
                <span className={cn("h-1.5 w-1.5 rounded-full", levelDot[level])} />
                <span
                  className={cn(
                    "text-[10px] font-semibold uppercase tracking-[0.18em]",
                    levelTone[level]
                  )}
                >
                  {level}
                </span>
              </div>
              <div className="space-y-0.5">
                {levelItems.map((item) => {
                  const globalIndex = items.findIndex((i) => i.id === item.id);
                  const num = ++counter;
                  const done = completedIds.includes(item.id);
                  const unlocked = isUnlocked(globalIndex);
                  const active = item.id === currentId;
                  return (
                    <button
                      key={item.id}
                      disabled={!unlocked}
                      onClick={() => onSelect(item.id)}
                      className={cn(
                        "group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors",
                        active && "bg-electric/10",
                        !active && unlocked && "hover:bg-panel",
                        !unlocked && "cursor-not-allowed opacity-50"
                      )}
                    >
                      <span className="shrink-0">
                        {done ? (
                          <CheckCircle2 className="h-4 w-4 text-green" />
                        ) : !unlocked ? (
                          <Lock className="h-3.5 w-3.5 text-muted" />
                        ) : active ? (
                          <Dot className="h-4 w-4 text-electric" />
                        ) : (
                          <Circle className="h-3.5 w-3.5 text-muted" />
                        )}
                      </span>
                      <span className="w-5 shrink-0 font-mono text-[11px] text-muted">
                        {String(num).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "flex-1 truncate",
                          active
                            ? "font-semibold text-text"
                            : done
                            ? "text-text-secondary"
                            : "text-text-secondary"
                        )}
                      >
                        {item.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
