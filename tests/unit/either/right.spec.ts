import { GetValueError } from "../../../src/errors";
import { Either } from "../../../src/either/either";

describe("Right", () => {
    describe("isLeft()", () => {
        it("returns false", () => {
            const r = Either.right("a");
            expect(r.isLeft()).toBe(false);
        });
    });

    describe("isRight()", () => {
        it("returns true", () => {
            const r = Either.right("a");
            expect(r.isRight()).toBe(true);
        });
    });

    describe("leftOr()", () => {
        it("returns the fallback value", () => {
            const r = Either.right("a");
            expect(r.leftOr(2)).toBe(2);
        });

        it("returns the result of the fallback function", () => {
            const r = Either.right<number, string>("5");
            expect(r.leftOr(n => parseInt(n))).toBe(5);
        });
    });

    describe("leftOrAsync()", () => {
        it("returns the fallback value", async () => {
            const r = Either.right("a");
            expect(await r.leftOrAsync(2)).toBe(2);
        });

        it("returns the promised fallback value", async () => {
            const r = Either.right("a");
            expect(await r.leftOrAsync(Promise.resolve(2))).toBe(2);
        });

        it("returns the result of the fallback function", async () => {
            const r = Either.right<number, string>("5");
            expect(await r.leftOrAsync(async n => parseInt(n))).toBe(5);
        });
    });

    describe("rightOr()", () => {
        it("returns the value", () => {
            const r = Either.right("a");
            expect(r.rightOr("b")).toBe("a");
        });
    });

    describe("rightOrAsync()", () => {
        it("returns the value", async () => {
            const r = Either.right("a");
            expect(await r.rightOrAsync("b")).toBe("a");
        });
    });

    describe("mapLeft()", () => {
        it("returns a new Right instance with the same value", () => {
            const r = Either.right<number, string>("a");
            const mapped = r.mapLeft((n) => n * 2);
            expect(mapped.isRight()).toBe(true);
            expect(mapped.getRightOrThrow()).toBe("a");
        });
    });

    describe("mapLeftAsync()", () => {
        it("returns a new Right instance with the same value", async () => {
            const r = Either.right<number, string>("a");
            const mapped = await r.mapLeftAsync((n) => Promise.resolve(n * 2));
            expect(mapped.isRight()).toBe(true);
            expect(mapped.getRightOrThrow()).toBe("a");
        });
    });

    describe("mapRight()", () => {
        it("returns a new Right instance with the mapped value", () => {
            const r = Either.right("a");
            const mapped = r.mapRight((s) => s + " * " + s);
            expect(mapped.isRight()).toBe(true);
            expect(mapped.getRightOrThrow()).toBe("a * a");
        });
    });

    describe("mapRightAsync()", () => {
        it("returns a new Right instance with the mapped value", async () => {
            const r = Either.right("a");
            const mapped = await r.mapRightAsync((s) => Promise.resolve(s + " * " + s));
            expect(mapped.isRight()).toBe(true);
            expect(mapped.getRightOrThrow()).toBe("a * a");
        });
    });

    describe("tapLeft()", () => {
        it("does nothing", () => {
            let r = Either.right<{[k: string]: number}, number[]>([]);
            r.tapLeft((obj) => { obj["key"] = 1 });

            expect(r.getRightOrThrow()).toEqual([]);
        });
    });

    describe("tapLeftAsync()", () => {
        it("does nothing", async () => {
            let r = Either.right<{[k: string]: number}, number[]>([]);
            await r.tapLeftAsync(async (obj) => { obj["key"] = 1 });

            expect(r.getRightOrThrow()).toEqual([]);
        });
    });

    describe("tapRight()", () => {
        it("calls the callback", () => {
            let r = Either.right<{[k: string]: number}, number[]>([]);
            r.tapRight((arr) => { arr.push(1) });

            expect(r.getRightOrThrow()).toEqual([1]);
        });
    });

    describe("tapRightAsync()", () => {
        it("calls the callback", async () => {
            let r = Either.right<{[k: string]: number}, number[]>([]);
            await r.tapRightAsync(async (arr) => { arr.push(1) });

            expect(r.getRightOrThrow()).toEqual([1]);
        });
    });

    describe("match()", () => {
        it("calls the onRight function", () => {
            const r = Either.right<number, string>("5");
            const result = r.match(
                (n) => n * 2,
                (s) => parseInt(s) * 2
            );
            expect(result).toBe(10);
        });
    });

    describe("matchAsync()", () => {
        it("calls the onRight function", async () => {
            const r = Either.right<number, string>("5");
            const result = await r.matchAsync(
                async (n) => n * 2,
                async (s) => parseInt(s) * 2
            );
            expect(result).toBe(10);
        });
    });

    describe("getLeftOrThrow()", () => {
        it("throws an error", () => {
            const r = Either.right("a");
            expect(() => r.getLeftOrThrow()).toThrow(GetValueError);
        });
    });

    describe("getRightOrThrow()", () => {
        it("returns the value", () => {
            const r = Either.right("a");
            expect(r.getRightOrThrow()).toBe("a");
        });
    });

    describe("toString()", () => {
        it("converts to a string", () => {
            const r = Either.right("a");
            expect(r.toString()).toBe("Right(a)");
        });
    });
});
