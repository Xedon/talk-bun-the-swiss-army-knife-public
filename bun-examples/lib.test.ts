import { add } from "./lib";
import { it, describe, expect } from "bun:test";

describe("add", () => {
  it("should return the sum of two numbers", () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 5)).toBe(4);
    expect(add(0, 0)).toBe(0);
  });
});
