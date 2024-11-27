import { isFunction } from "../../src/guards";

describe("isFunction", () => {
    it("should return true for a function", () => {
        expect(isFunction(() => {})).toBe(true);
    });

    it("should return false for a non-function", () => {
        expect(isFunction("foo")).toBe(false);
    });
});
