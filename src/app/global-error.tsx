"use client"; // Replaces the root layout when it fails, so it brings its own document and styles.

import { useEffect } from "react";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#0f0f0e",
          color: "#f5f4ef",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          padding: 24,
        }}
      >
        <main style={{ maxWidth: 480 }}>
          <p style={{ color: "#a3a29a", fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase" }}>
            Mithila Web Labs
          </p>
          <h1 style={{ fontSize: 32, lineHeight: 1.15, margin: "12px 0" }}>Something went wrong.</h1>
          <p style={{ color: "#a3a29a", lineHeight: 1.6 }}>
            The site hit an unexpected problem. Please try again in a moment.
          </p>
          <button
            onClick={() => retry()}
            style={{
              marginTop: 20,
              background: "#c2410c",
              color: "#fff",
              border: 0,
              borderRadius: 999,
              padding: "12px 22px",
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
