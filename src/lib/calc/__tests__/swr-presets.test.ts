import { describe, expect, it } from "vitest";

import { SWR_PRESETS } from "@/lib/calc/swr-presets";

describe("SWR_PRESETS", () => {
  it("contains the seven PRD explainer presets in ascending order", () => {
    expect(SWR_PRESETS).toHaveLength(7);
    expect(SWR_PRESETS.map((preset) => preset.label)).toEqual([
      "3.0%",
      "3.3%",
      "3.5%",
      "3.9%",
      "4.0%",
      "4.5%",
      "4.7%",
    ]);
    expect(SWR_PRESETS.map((preset) => preset.safeWithdrawalRate)).toEqual([
      0.03,
      0.033,
      0.035,
      0.039,
      0.04,
      0.045,
      0.047,
    ]);
  });

  it("marks 4.0% as the default preset", () => {
    expect(SWR_PRESETS.filter((preset) => preset.isDefault)).toEqual([
      expect.objectContaining({
        label: "4.0%",
        safeWithdrawalRate: 0.04,
        portfolioMultiple: 25,
      }),
    ]);
  });
});
