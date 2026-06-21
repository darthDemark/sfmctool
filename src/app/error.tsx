"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error for debugging without crashing the whole app.
    console.error("SFMC Labs route error:", error);
  }, [error]);

  return (
    <div className="grid min-h-screen place-items-center bg-bg px-6 text-center">
      <div className="max-w-md">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl border border-red/30 bg-red/10 text-red">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-xl font-semibold tracking-tight text-text">
          Something hit a snag
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-text-secondary">
          This section ran into an unexpected error. Your progress is saved —
          try again, and if it keeps happening, head back to the dashboard.
        </p>
        {error?.message && (
          <p className="mx-auto mt-3 max-w-sm break-words rounded-lg border border-line bg-card px-3 py-2 font-mono text-[11px] text-muted">
            {error.message}
          </p>
        )}
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-blue to-violet px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
          >
            <RotateCcw className="h-4 w-4" /> Try again
          </button>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-card px-4 py-2 text-sm font-semibold text-text hover:border-electric/50"
          >
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
