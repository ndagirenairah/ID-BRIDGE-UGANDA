import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { checklistItems, officialLinks, problemGuides } from "../js/domain/guidance";
import {
  CollectionStrategy,
  GuidanceStrategyContext,
  MissingIdStrategy,
  VerificationStrategy
} from "../js/domain/guidanceStrategies";
import { LocalStorageChecklistRepository } from "../js/infrastructure/repositories";

const page = readFileSync(resolve("index.html"), "utf8");

describe("IDBridge UG guidance", () => {
  it("returns the correct guide for a missing ID", () => {
    const context = new GuidanceStrategyContext([new MissingIdStrategy()]);
    expect(context.getGuidance("missing")?.title).toBe("Your ID has not arrived");
  });

  it("selects different strategies without changing the caller", () => {
    const context = new GuidanceStrategyContext([new CollectionStrategy(), new VerificationStrategy()]);
    expect(context.getGuidance("collection")?.title).toBe("Ready to collect your ID");
    expect(context.getGuidance("verification")?.title).toBe("Your ID was not accepted");
  });

  it("contains guidance for every supported problem", () => {
    expect(Object.keys(problemGuides)).toEqual([
      "missing", "collection", "verification", "rejected", "renewal", "other"
    ]);
  });
});

describe("IDBridge UG browser-only storage", () => {
  it("saves and loads checklist state through a storage boundary", () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value)
    };
    const repository = new LocalStorageChecklistRepository(storage, "checklist");
    repository.save([true, false, true]);
    expect(repository.load()).toEqual([true, false, true]);
  });

  it("defines three citizen checklist items", () => {
    expect(checklistItems).toHaveLength(3);
  });
});

describe("IDBridge UG public page", () => {
  it("links to NIRA official services and YouTube", () => {
    expect(officialLinks.every((link) => link.href.includes("nira.go.ug"))).toBe(true);
    expect(page).toContain("https://www.youtube.com/@NIRA_Ug");
  });

  it("offers the three language choices", () => {
    expect(page).toContain('value="en"');
    expect(page).toContain('value="lg"');
    expect(page).toContain('value="sw"');
  });
});
