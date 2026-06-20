"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  computeStats,
  initialStore,
  type ProgressStore,
  type Stats,
} from "@/lib/competency";

const STORAGE_KEY = "sfmc-labs:v2";

type Activity = ProgressStore["activity"][number];

function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function applyStreak(s: ProgressStore): ProgressStore {
  const today = todayKey();
  if (s.lastActiveISO === today) return s;
  let streak = 1;
  if (s.lastActiveISO) {
    const prev = new Date(s.lastActiveISO);
    const diff = Math.round(
      (new Date(today).getTime() - prev.getTime()) / 86400000
    );
    streak = diff === 1 ? s.streak + 1 : 1;
  }
  return { ...s, streak, lastActiveISO: today };
}

function pushActivity(
  s: ProgressStore,
  text: string,
  type: Activity["type"]
): ProgressStore {
  const entry: Activity = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    text,
    type,
    ts: Date.now(),
  };
  return { ...s, activity: [entry, ...s.activity].slice(0, 12) };
}

type ProgressContextValue = {
  store: ProgressStore;
  stats: Stats;
  hydrated: boolean;
  isComplete: (id: string) => boolean;
  isViewed: (id: string) => boolean;
  viewLesson: (id: string) => void;
  completeLesson: (id: string, title: string, score?: number) => void;
  recordChallenge: (challengeId: string, title: string, score: number) => void;
  answerCert: (qid: string, choice: number, correct: boolean) => void;
  recordExam: (scorePct: number) => void;
  recordSim: (kind: "journey" | "automation", label: string) => void;
  addMilestone: (m: string) => void;
  resolveIncident: (label: string) => void;
  reset: () => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<ProgressStore>(initialStore);
  const [hydrated, setHydrated] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStore({ ...initialStore, ...parsed });
      }
    } catch {
      // ignore malformed storage
    }
    loaded.current = true;
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch {
      // ignore quota errors
    }
  }, [store, hydrated]);

  const update = useCallback(
    (fn: (s: ProgressStore) => ProgressStore) => {
      setStore((prev) => {
        let next = applyStreak(fn(prev));
        const xp = computeStats(next).xp;
        const last = next.xpHistory[next.xpHistory.length - 1];
        if (!last || last.xp !== xp) {
          next = {
            ...next,
            xpHistory: [...next.xpHistory, { t: Date.now(), xp }].slice(-24),
          };
        }
        return next;
      });
    },
    []
  );

  const viewLesson = useCallback(
    (id: string) => {
      update((s) =>
        s.viewedLessons.includes(id) || s.completedLessons.includes(id)
          ? s
          : { ...s, viewedLessons: [...s.viewedLessons, id] }
      );
    },
    [update]
  );

  const completeLesson = useCallback(
    (id: string, title: string, score?: number) => {
      update((s) => {
        const already = s.completedLessons.includes(id);
        const next: ProgressStore = {
          ...s,
          completedLessons: already
            ? s.completedLessons
            : [...s.completedLessons, id],
          viewedLessons: s.viewedLessons.filter((v) => v !== id),
          lessonScores:
            score === undefined
              ? s.lessonScores
              : { ...s.lessonScores, [id]: Math.max(s.lessonScores[id] ?? 0, score) },
        };
        return already
          ? next
          : pushActivity(next, `Completed lesson — ${title}`, "success");
      });
    },
    [update]
  );

  const recordChallenge = useCallback(
    (challengeId: string, title: string, score: number) => {
      update((s) => {
        const best = Math.max(s.challengeScores[challengeId] ?? 0, score);
        const next: ProgressStore = {
          ...s,
          challengeScores: { ...s.challengeScores, [challengeId]: best },
        };
        return pushActivity(
          next,
          `Challenge scored ${score}% — ${title}`,
          score >= 80 ? "success" : "warning"
        );
      });
    },
    [update]
  );

  const answerCert = useCallback(
    (qid: string, choice: number, correct: boolean) => {
      update((s) => ({
        ...s,
        certAnswers: { ...s.certAnswers, [qid]: { choice, correct } },
      }));
    },
    [update]
  );

  const recordExam = useCallback(
    (scorePct: number) => {
      update((s) => {
        const next: ProgressStore = {
          ...s,
          examAttempts: s.examAttempts + 1,
          examBest: Math.max(s.examBest, scorePct),
        };
        return pushActivity(
          next,
          `Mock exam scored ${scorePct}%`,
          scorePct >= 80 ? "success" : "warning"
        );
      });
    },
    [update]
  );

  const recordSim = useCallback(
    (kind: "journey" | "automation", label: string) => {
      update((s) => {
        const next: ProgressStore = {
          ...s,
          simRuns: { ...s.simRuns, [kind]: s.simRuns[kind] + 1 },
        };
        return pushActivity(next, label, "info");
      });
    },
    [update]
  );

  const addMilestone = useCallback(
    (m: string) => {
      update((s) =>
        s.milestones.includes(m)
          ? s
          : { ...s, milestones: [...s.milestones, m] }
      );
    },
    [update]
  );

  const resolveIncident = useCallback(
    (label: string) => {
      update((s) =>
        pushActivity(
          { ...s, incidentsResolved: s.incidentsResolved + 1 },
          label,
          "warning"
        )
      );
    },
    [update]
  );

  const reset = useCallback(() => setStore(initialStore), []);

  const stats = useMemo(() => computeStats(store), [store]);

  const value = useMemo<ProgressContextValue>(
    () => ({
      store,
      stats,
      hydrated,
      isComplete: (id: string) => store.completedLessons.includes(id),
      isViewed: (id: string) => store.viewedLessons.includes(id),
      viewLesson,
      completeLesson,
      recordChallenge,
      answerCert,
      recordExam,
      recordSim,
      addMilestone,
      resolveIncident,
      reset,
    }),
    [
      store,
      stats,
      hydrated,
      viewLesson,
      completeLesson,
      recordChallenge,
      answerCert,
      recordExam,
      recordSim,
      addMilestone,
      resolveIncident,
      reset,
    ]
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
