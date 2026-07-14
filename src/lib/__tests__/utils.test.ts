import { describe, it, expect } from "vitest";
import {
  cn,
  formatPrice,
  formatDate,
  formatTime,
  getDurationMinutes,
  formatFirstName,
  truncate,
} from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("handles tailwind conflicts", () => {
    expect(cn("px-4", "px-2")).toBe("px-2");
  });
});

describe("formatPrice", () => {
  it("formats paise to INR", () => {
    const result = formatPrice(29900);
    expect(result).toContain("299");
  });

  it("formats zero paise", () => {
    const result = formatPrice(0);
    expect(result).toContain("0");
  });

  it("handles large values", () => {
    const result = formatPrice(10000000);
    expect(result).toContain("1,00,000");
  });
});

describe("getDurationMinutes", () => {
  it("returns 30 for call_30", () => {
    expect(getDurationMinutes("call_30")).toBe(30);
  });

  it("returns 45 for call_45", () => {
    expect(getDurationMinutes("call_45")).toBe(45);
  });

  it("returns 60 for call_60", () => {
    expect(getDurationMinutes("call_60")).toBe(60);
  });

  it("returns 40 for group_40", () => {
    expect(getDurationMinutes("group_40")).toBe(40);
  });

  it("defaults to 30 for unknown type", () => {
    expect(getDurationMinutes("unknown")).toBe(30);
  });
});

describe("formatFirstName", () => {
  it("extracts first name from full name", () => {
    expect(formatFirstName("John Doe")).toBe("John");
  });

  it("returns full name if no space", () => {
    expect(formatFirstName("John")).toBe("John");
  });
});

describe("truncate", () => {
  it("returns short text as-is", () => {
    expect(truncate("Hello", 10)).toBe("Hello");
  });

  it("truncates long text with ellipsis", () => {
    const result = truncate("Hello World This Is Long", 10);
    expect(result).toBe("Hello Worl...");
    expect(result.length).toBeLessThanOrEqual(14);
  });

  it("handles empty string", () => {
    expect(truncate("", 10)).toBe("");
  });
});

describe("formatDate", () => {
  it("formats a date string", () => {
    const result = formatDate("2026-01-15");
    expect(result).toContain("January");
    expect(result).toContain("15");
    expect(result).toContain("2026");
  });

  it("formats a Date object", () => {
    const result = formatDate(new Date("2026-06-01"));
    expect(result).toContain("June");
  });
});

describe("formatTime", () => {
  it("formats time correctly", () => {
    const result = formatTime("2026-01-15T14:30:00Z");
    expect(result.toLowerCase()).toContain("pm");
  });
});
