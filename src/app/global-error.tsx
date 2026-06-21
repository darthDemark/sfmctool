"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          margin: 0,
          display: "grid",
          placeItems: "center",
          background: "#0b0f14",
          color: "#f9fafb",
          fontFamily: "system-ui, sans-serif",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 440 }}>
          <h1 style={{ fontSize: 20, fontWeight: 600 }}>
            The app hit an unexpected error
          </h1>
          <p style={{ color: "#cbd5e1", fontSize: 14, marginTop: 8 }}>
            {error?.message || "Please reload to continue."}
          </p>
          <button
            onClick={() => reset()}
            style={{
              marginTop: 20,
              borderRadius: 8,
              border: "none",
              padding: "10px 18px",
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
              background: "linear-gradient(135deg,#2563eb,#8b5cf6)",
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
