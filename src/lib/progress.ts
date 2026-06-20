"use client";

import { useCallback, useEffect, useState } from "react";

// Lightweight localStorage-backed progress tracking for learning tracks.
// No backend — everything lives in the browser.

export function useTrackProgress(track: string) {
  const [completed, setCompleted] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`sfmc-labs:${track}`);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setCompleted(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, [track]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(`sfmc-labs:${track}`, JSON.stringify(completed));
    } catch {
      // ignore quota / privacy mode errors
    }
  }, [completed, hydrated, track]);

  const markComplete = useCallback((id: string) => {
    setCompleted((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const reset = useCallback(() => setCompleted([]), []);

  const isComplete = useCallback(
    (id: string) => completed.includes(id),
    [completed]
  );

  return { completed, markComplete, isComplete, reset, hydrated };
}
