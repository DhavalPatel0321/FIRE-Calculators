import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CopyUrlButton } from "@/components/plan/copy-url-button";
import { useScenarioStore } from "@/store/scenario";

describe("<CopyUrlButton />", () => {
  let writeText: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    useScenarioStore.getState().resetInputs();
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
    useScenarioStore.getState().resetInputs();
    window.history.replaceState({}, "", "/plan");
  });

  it("renders the idle label by default", () => {
    render(<CopyUrlButton />);
    expect(screen.getByTestId("copy-url")).toHaveTextContent(/copy share url/i);
  });

  it("writes a share URL from the latest store state on click", async () => {
    useScenarioStore.getState().setInput("currentAge", 43);
    render(<CopyUrlButton />);
    fireEvent.click(screen.getByTestId("copy-url"));
    await act(async () => {
      await Promise.resolve();
    });
    expect(writeText).toHaveBeenCalledTimes(1);
    const copied = String(writeText.mock.calls[0][0]);
    expect(copied).toContain("/plan?");
    expect(copied).toContain("currentAge=43");
    expect(copied).not.toContain("currentAge=42");
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
