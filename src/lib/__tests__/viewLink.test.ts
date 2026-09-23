import { describe, expect, it } from "vitest";
import { entryIdFromHash, viewHash } from "../viewLink";
import { compareYearFromHash } from "../mapCamera";

describe("view links", () => {
  it("write only the keys that are set", () => {
    expect(viewHash({})).toBe("");
    expect(viewHash({ entry: "vj-day" })).toBe("#entry=vj-day");
    expect(viewHash({ year: 1900.4, span: 0.123456, compare: 1776 })).toBe(
      "#year=1900&span=0.1235&compare=1776"
    );
    expect(viewHash({ year: 1900, compare: null })).toBe("#year=1900");
  });

  it("round-trip through the hash readers", () => {
    const hash = viewHash({ year: 1850, compare: 1700, entry: "croton" });
    expect(compareYearFromHash(hash)).toBe(1700);
    expect(entryIdFromHash(hash)).toBe("croton");
    expect(entryIdFromHash("#year=1850")).toBeNull();
  });
});
