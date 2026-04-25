import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CopyUrlButton } from "@/components/plan/copy-url-button";

describe("<CopyUrlButton />", () => {
  let writeText: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
    window.history.replaceState({}, "", "/plan?currentAge=42");
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
    window.history.replaceState({}, "", "/plan");
  });

  it("renders the idle label by default", () => {
    render(<CopyUrlButton />);
    expect(screen.getByTestId("copy-url")).toHaveTextContent(/copy share url/i);
  });

  it("writes window.location.href to the clipboard on click", async () => {
    render(<CopyUrlButton />);
    fireEvent.click(screen.getByTestId("copy-url"));
    await act(async () => {
      await Promise.resolve();
    });
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith(window.location.href);
  });

  it("flashes 'Copied!' for ~1.5s after a successful click", async () => {
    render(<CopyUrlButton />);
    fireEvent.click(screen.getByTestId("copy-url"));
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.getByTestId("copy-url")).toHaveTextContent(/copied/i);
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.getByTestId("copy-url")).toHaveTextContent(/copy share url/i);
  });
});
