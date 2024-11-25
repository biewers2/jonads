import { Either, Left, Right } from "./index";

describe("Left", () => {
    it("isLeft() returns true", () => {
        const l = left(1);
        expect(l.isLeft()).toBe(true);
    });

    it("isRight() returns false", () => {
        const l = left(1);
        expect(l.isRight()).toBe(false);
    });

    it("leftOr() returns the value", () => {
        const l = left(1);
        expect(l.leftOr(2)).toBe(1);
    });

    it("rightOr() returns the fallback value", () => {
        const l = left(1);
        expect(l.rightOr("a")).toBe("a");
    });

    it("rightOr() returns the result of the fallback function", () => {
        const l = left(1);
        expect(l.rightOr(n => n + "")).toBe("1");
    });

    it("mapLeft() returns a new Left instance with the mapped value", () => {
        const l = left(1);
        const mapped = l.mapLeft((n) => n * 2);
        expect(mapped.isLeft()).toBe(true);
        expect(mapped.getLeftOrThrow()).toBe(2);
    });

    it("mapRight() returns a new Left instance with the same value", () => {
        const l = left(1);
        const mapped = l.mapRight((n) => n + " * " + n);
        expect(mapped.isLeft()).toBe(true);
        expect(mapped.getLeftOrThrow()).toBe(1);
    });

    it("match() calls the on_left function", () => {
        const l = left(1);
        const result = l.match(
            (n) => n * 2,
            (s) => parseInt(s)
        );
        expect(result).toBe(2);
    });
});

function left(value: number): Either<number, string> {
    return new Left(value);
}

function right(value: string): Either<number, string> {
    return new Right(value);
}
