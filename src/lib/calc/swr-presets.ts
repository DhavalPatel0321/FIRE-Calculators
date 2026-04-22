import type { SwrPreset } from "@/lib/calc/types";

export const SWR_PRESETS: SwrPreset[] = [
  {
    safeWithdrawalRate: 0.03,
    portfolioMultiple: 33.3,
    label: "3.0%",
    rationale:
      "Very conservative. Appropriate for 50+ year horizons, low-return environments, or users who want near-certainty of not running out.",
    source: 'Common "safety margin" guidance for young FIRE-seekers',
  },
  {
    safeWithdrawalRate: 0.033,
    portfolioMultiple: 30.3,
    label: "3.3%",
    rationale:
      '"Safe" rate often cited for early retirees with 40+ year horizons.',
    source: "ERN's Safe Withdrawal Rate series",
  },
  {
    safeWithdrawalRate: 0.035,
    portfolioMultiple: 28.6,
    label: "3.5%",
    rationale:
      "Morningstar's 2026 base-case for a 30-year retirement with a 30-50% equity allocation. Good default for bond-heavy portfolios.",
    source: "Morningstar 2026 SWR study",
  },
  {
    safeWithdrawalRate: 0.039,
    portfolioMultiple: 25.6,
    label: "3.9%",
    rationale:
      "Morningstar 2026 base case for a stock-heavy (50%+ equity) 30-year retirement.",
    source: "Morningstar 2026 SWR study",
  },
  {
    safeWithdrawalRate: 0.04,
    portfolioMultiple: 25,
    label: "4.0%",
    rationale:
      "Default. Trinity Study / Bengen 1994 - the canonical FIRE anchor. Historically successful for 30-year retirements with ~60/40 allocation.",
    source: "Trinity Study 1998",
    isDefault: true,
  },
  {
    safeWithdrawalRate: 0.045,
    portfolioMultiple: 22.2,
    label: "4.5%",
    rationale:
      'Upper end of "reasonable." Requires flexibility (variable withdrawals).',
    source: "Bengen's later research",
  },
  {
    safeWithdrawalRate: 0.047,
    portfolioMultiple: 21.3,
    label: "4.7%",
    rationale:
      "Bengen's updated (2020s) research suggests this was historically safe for 30-year horizons with a broader asset mix. Aggressive for a FIRE default.",
    source: "Bengen updated",
  },
];
