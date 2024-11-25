import { Either, Left, Right } from "./either";
import { GetValueError } from "./errors";

describe("Either", () => {
    describe("isLeft()", () => {
        it("returns true for Left", () => {
            const l = left(1);
            expect(l.isLeft()).toBe(true);
        });

        it("returns false for Right", () => {
            const r = right("a");
            expect(r.isLeft()).toBe(false);
        });
    });

    describe("isRight()", () => {
        it("returns false for Left", () => {
            const l = left(1);
            expect(l.isRight()).toBe(false);
        });

        it("returns true for Right", () => {
            const r = right("a");
            expect(r.isRight()).toBe(true);
        });
    });

    describe("leftOr()", () => {
        it("returns the value for Left", () => {
            const l = left(1);
            expect(l.leftOr(2)).toBe(1);
        });

        it("returns the fallback value for Right", () => {
            const r = right("a");
            expect(r.leftOr(2)).toBe(2);
        });

        it("returns the result of the fallback function for Right", () => {
            const r = right("5");
            expect(r.leftOr(n => parseInt(n))).toBe(5);
        });
    });

    describe("leftOrAsync()", () => {
        it("returns the value for Left", async () => {
            const l = left(1);
            expect(await l.leftOrAsync(2)).toBe(1);
        });

        it("returns the fallback value for Right", async () => {
            const r = right("a");
            expect(await r.leftOrAsync(2)).toBe(2);
        });

        it("returns the result of the fallback function for Right", async () => {
            const r = right("5");
            expect(await r.leftOrAsync(async n => parseInt(n))).toBe(5);
        });
    });

    describe("rightOr()", () => {
        it("returns the fallback value for Left", () => {
            const l = left(1);
            expect(l.rightOr("a")).toBe("a");
        });

        it("returns the result of the fallback function for Left", () => {
            const l = left(1);
            expect(l.rightOr(n => n + "")).toBe("1");
        });

        it("returns the value for Right", () => {
            const r = right("a");
            expect(r.rightOr("b")).toBe("a");
        });
    });

    describe("rightOrAsync()", () => {
        it("returns the fallback value for Left", async () => {
            const l = left(1);
            expect(await l.rightOrAsync("a")).toBe("a");
        });

        it("returns the result of the fallback function for Left", async () => {
            const l = left(1);
            expect(await l.rightOrAsync(async n => n + "")).toBe("1");
        });

        it("returns the value for Right", async () => {
            const r = right("a");
            expect(await r.rightOrAsync("b")).toBe("a");
        });
    });

    describe("mapLeft()", () => {
        it("returns a new Left instance with the mapped value for Left", () => {
            const l = left(1);
            const mapped = l.mapLeft((n) => n * 2);
            expect(mapped.isLeft()).toBe(true);
            expect(mapped.getLeftOrThrow()).toBe(2);
        });

        it("returns a new Right instance with the same value for Right", () => {
            const r = right("a");
            const mapped = r.mapLeft((n) => n * 2);
            expect(mapped.isRight()).toBe(true);
            expect(mapped.getRightOrThrow()).toBe("a");
        });
    });

    describe("mapLeftAsync()", () => {
        it("returns a new Left instance with the mapped value for Left", async () => {
            const l = left(1);
            const mapped = await l.mapLeftAsync((n) => Promise.resolve(n * 2));
            expect(mapped.isLeft()).toBe(true);
            expect(mapped.getLeftOrThrow()).toBe(2);
        });

        it("returns a new Right instance with the same value for Right", async () => {
            const r = right("a");
            const mapped = await r.mapLeftAsync((n) => Promise.resolve(n * 2));
            expect(mapped.isRight()).toBe(true);
            expect(mapped.getRightOrThrow()).toBe("a");
        });
    });

    describe("mapRight()", () => {
        it("returns a new Left instance with the same value for Left", () => {
            const l = left(1);
            const mapped = l.mapRight((n) => n + " * " + n);
            expect(mapped.isLeft()).toBe(true);
            expect(mapped.getLeftOrThrow()).toBe(1);
        });

        it("returns a new Right instance with the mapped value for Right", () => {
            const r = right("a");
            const mapped = r.mapRight((s) => s + " * " + s);
            expect(mapped.isRight()).toBe(true);
            expect(mapped.getRightOrThrow()).toBe("a * a");
        });
    });

    describe("mapRightAsync()", () => {
        it("returns a new Left instance with the same value for Left", async () => {
            const l = left(1);
            const mapped = await l.mapRightAsync((n) => Promise.resolve(n + " * " + n));
            expect(mapped.isLeft()).toBe(true);
            expect(mapped.getLeftOrThrow()).toBe(1);
        });

        it("returns a new Right instance with the mapped value for Right", async () => {
            const r = right("a");
            const mapped = await r.mapRightAsync((s) => Promise.resolve(s + " * " + s));
            expect(mapped.isRight()).toBe(true);
            expect(mapped.getRightOrThrow()).toBe("a * a");
        });
    });

    describe("match()", () => {
        it("calls the on_left function for Left", () => {
            const l = left(1);
            const result = l.match(
                (n) => n * 2,
                (s) => parseInt(s)
            );
            expect(result).toBe(2);
        });

        it("calls the on_right function for Right", () => {
            const r = right("5");
            const result = r.match(
                (n) => n * 2,
                (s) => parseInt(s) * 2
            );
            expect(result).toBe(10);
        });
    });

    describe("matchAsync()", () => {
        it("calls the on_left function for Left", async () => {
            const l = left(1);
            const result = await l.matchAsync(
                async (n) => n * 2,
                async (s) => parseInt(s)
            );
            expect(result).toBe(2);
        });

        it("calls the on_right function for Right", async () => {
            const r = right("5");
            const result = await r.matchAsync(
                async (n) => n * 2,
                async (s) => parseInt(s) * 2
            );
            expect(result).toBe(10);
        });
    });

    describe("getLeftOrThrow()", () => {
        it("returns the value for Left", () => {
            const l = left(1);
            expect(l.getLeftOrThrow()).toBe(1);
        });

        it("throws an error for Right", () => {
            const r = right("a");
            expect(() => r.getLeftOrThrow()).toThrow(GetValueError);
        });
    });

    describe("getRightOrThrow()", () => {
        it("throws an error for Left", () => {
            const l = left(1);
            expect(() => l.getRightOrThrow()).toThrow(GetValueError);
        });

        it("returns the value for Right", () => {
            const r = right("a");
            expect(r.getRightOrThrow()).toBe("a");
        });
    });

    describe("toString()", () => {
        it("converts to a string", () => {
            const l = left(1);
            expect(l.toString()).toBe("Left(1)");

            const r = right("a");
            expect(r.toString()).toBe("Right(a)");
        });
    });
});

function left(value: number): Either<number, string> {
    return new Left(value);
}

function right(value: string): Either<number, string> {
    return new Right(value);
}
