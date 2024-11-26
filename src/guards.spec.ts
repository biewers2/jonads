import { isFunction, isPromise } from "./guards";

describe("isFunction", () => {
    it("should return true for a function", () => {
        expect(isFunction(() => {})).toBe(true);
    });

    it("should return false for a non-function", () => {
        expect(isFunction("foo")).toBe(false);
    });
});

describe("isPromise", () => {
    it("should return true for a promise", () => {
        expect(isPromise(Promise.resolve())).toBe(true);
    });

    it("should return false for a non-promise", () => {
        expect(isPromise("foo")).toBe(false);
    });
});
