import { GetValueError } from "../errors";
import { Either } from "./either";

describe("Left", () => {
    describe("isLeft()", () => {
        it("returns true", () => {
            const l = Either.left(1);
            expect(l.isLeft()).toBe(true);
        });
    });

    describe("isRight()", () => {
        it("returns false", () => {
            const l = Either.left(1);
            expect(l.isRight()).toBe(false);
        });
    });

    describe("leftOr()", () => {
        it("returns the value", () => {
            const l = Either.left(1);
            expect(l.leftOr(2)).toBe(1);
        });
    });

    describe("leftOrAsync()", () => {
        it("returns the value", async () => {
            const l = Either.left(1);
            expect(await l.leftOrAsync(2)).toBe(1);
        });
    });

    describe("rightOr()", () => {
        it("returns the fallback value", () => {
            const l = Either.left(1);
            expect(l.rightOr("a")).toBe("a");
        });

        it("returns the result of the fallback function", () => {
            const l = Either.left<number, string>(1);
            expect(l.rightOr(n => n + "")).toBe("1");
        });
    });

    describe("rightOrAsync()", () => {
        it("returns the fallback value", async () => {
            const l = Either.left(1);
            expect(await l.rightOrAsync("a")).toBe("a");
        });

        it("returns the result of the fallback function", async () => {
            const l = Either.left<number, string>(1);
            expect(await l.rightOrAsync(async n => n + "")).toBe("1");
        });
    });

    describe("mapLeft()", () => {
        it("returns a new Left instance with the mapped value", () => {
            const l = Either.left(1);
            const mapped = l.mapLeft((n) => n * 2);
            expect(mapped.isLeft()).toBe(true);
            expect(mapped.getLeftOrThrow()).toBe(2);
        });
    });

    describe("mapLeftAsync()", () => {
        it("returns a new Left instance with the mapped value", async () => {
            const l = Either.left(1);
            const mapped = await l.mapLeftAsync((n) => Promise.resolve(n * 2));
            expect(mapped.isLeft()).toBe(true);
            expect(mapped.getLeftOrThrow()).toBe(2);
        });
    });

    describe("mapRight()", () => {
        it("returns a new Left instance with the same value", () => {
            const l = Either.left(1);
            const mapped = l.mapRight((n) => n + " * " + n);
            expect(mapped.isLeft()).toBe(true);
            expect(mapped.getLeftOrThrow()).toBe(1);
        });
    });

    describe("mapRightAsync()", () => {
        it("returns a new Left instance with the same value", async () => {
            const l = Either.left(1);
            const mapped = await l.mapRightAsync((n) => Promise.resolve(n + " * " + n));
            expect(mapped.isLeft()).toBe(true);
            expect(mapped.getLeftOrThrow()).toBe(1);
        });
    });

    describe("tapLeft()", () => {
        it("calls the callback", () => {
            let l = Either.left<{[k: string]: number}, number[]>({});
            l.tapLeft((obj) => { obj["key"] = 1 });

            expect(l.getLeftOrThrow()).toEqual({ key: 1 });
        });
    });

    describe("tapLeftAsync()", () => {
        it("calls the callback", async () => {
            let l = Either.left<{[k: string]: number}, number[]>({});
            await l.tapLeftAsync(async (obj) => { obj["key"] = 1 });

            expect(l.getLeftOrThrow()).toEqual({ key: 1 });
        });
    });

    describe("tapRight()", () => {
        it("does nothing", () => {
            let l = Either.left<{[k: string]: number}, number[]>({});
            l.tapRight((arr) => { arr.push(1) });

            expect(l.getLeftOrThrow()).toEqual({});
        });
    });

    describe("tapRightAsync()", () => {
        it("does nothing", async () => {
            let l = Either.left<{[k: string]: number}, number[]>({});
            await l.tapRightAsync(async (arr) => { arr.push(1) });

            expect(l.getLeftOrThrow()).toEqual({});
        });
    });

    describe("match()", () => {
        it("calls the onLeft function", () => {
            const l = Either.left<number, string>(1);
            const result = l.match(
                (n) => n * 2,
                (s) => parseInt(s)
            );
            expect(result).toBe(2);
        });
    });

    describe("matchAsync()", () => {
        it("calls the onLeft function", async () => {
            const l = Either.left<number, string>(1);
            const result = await l.matchAsync(
                async (n) => n * 2,
                async (s) => parseInt(s)
            );
            expect(result).toBe(2);
        });
    });

    describe("getLeftOrThrow()", () => {
        it("returns the value", () => {
            const l = Either.left(1);
            expect(l.getLeftOrThrow()).toBe(1);
        });
    });

    describe("getRightOrThrow()", () => {
        it("throws an error", () => {
            const l = Either.left(1);
            expect(() => l.getRightOrThrow()).toThrow(GetValueError);
        });
    });

    describe("toString()", () => {
        it("converts to a string", () => {
            const l = Either.left(1);
            expect(l.toString()).toBe("Left(1)");
        });
    });
});
