"use client";

import { useEffect, useRef } from "react";

import { decodeScenario, encodeScenario } from "@/lib/url/scenario";
import { useScenarioStore } from "@/store/scenario";

const URL_DEBOUNCE_MS = 150;

// Mounts inside /plan, has no visible output. On mount it hydrates the store
// from window.location.search; thereafter it pushes a debounced replaceState
// any time the inputs change. We use replaceState (not next/router) so URL
// updates don't trigger a route transition or scroll jump.
export function ScenarioUrlSync() {
  const inputs = useScenarioStore((state) => state.inputs);
  const applyInputs = useScenarioStore((state) => state.applyInputs);
  const hydratedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const partial = decodeScenario(
      new URLSearchParams(window.location.search),
    );
    if (Object.keys(partial).length > 0) {
      applyInputs(partial);
    }
    hydratedRef.current = true;
    // Hydration runs once on mount; intentional empty dep array.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hydratedRef.current) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      const params = encodeScenario(inputs);
      const search = params.toString();
      const next = `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`;
      window.history.replaceState(window.history.state, "", next);
    }, URL_DEBOUNCE_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [inputs]);

  return null;
}
