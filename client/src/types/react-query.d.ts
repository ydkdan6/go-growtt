// src/types/react-query.d.ts
// ─────────────────────────────────────────────────────────────────────────────
// Tells TypeScript that ALL useQuery / useMutation error states are `string`
// by default across the entire app — matching our parseApiError utility which
// always throws a string.
//
// Without this, React Query defaults error to `Error`, causing a runtime crash
// when you render {error} in JSX because React can't render an Error object.
// ─────────────────────────────────────────────────────────────────────────────

import "@tanstack/react-query";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: string;
  }
}