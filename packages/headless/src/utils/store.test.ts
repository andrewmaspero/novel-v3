import { describe, expect, it } from "vitest";
import { novelStore } from "./store";
import { queryAtom, rangeAtom } from "./atoms";

describe("store", () => {
  it("exposes a jotai store and atoms", () => {
    expect(novelStore.get(queryAtom)).toBe("");
    expect(novelStore.get(rangeAtom)).toBeNull();
    novelStore.set(queryAtom, "hello");
    expect(novelStore.get(queryAtom)).toBe("hello");
  });
});
