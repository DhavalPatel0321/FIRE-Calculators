import { describe, expect, it } from "vitest";

import pkg from "../package.json";

describe("project scaffold", () => {
  it("pins Next.js 15", () => {
    expect(pkg.dependencies.next).toBe("15.5.15");
  });

  it("uses the repo package name", () => {
    expect(pkg.name).toBe("fire-calculators");
  });
});
