"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

const COPY_FLASH_MS = 1500;

export function CopyUrlButton() {
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
      await navigator.clipboard.writeText(window.location.href);
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
