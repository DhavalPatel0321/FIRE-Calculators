"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { encodeScenario } from "@/lib/url/scenario";
import { useScenarioStore } from "@/store/scenario";

const COPY_FLASH_MS = 1500;

export function CopyUrlButton() {
  const inputs = useScenarioStore((state) => state.inputs);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClick = async () => {
    if (typeof window === "undefined") return;
    try {
      const params = encodeScenario(inputs);
      const search = params.toString();
      const href = `${window.location.origin}${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`;
      await navigator.clipboard.writeText(href);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), COPY_FLASH_MS);
    } catch {
      // Clipboard API can reject in insecure contexts or denied permissions.
      // Fail silently; the URL is still in the address bar.
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      data-testid="copy-url"
      onClick={handleClick}
    >
      {copied ? "Copied!" : "Copy share URL"}
    </Button>
  );
}
