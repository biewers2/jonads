import { Either } from "../../../src/either/either";

describe("Either", () => {
    describe("left()", () => {
        it("creates a new Left instance", () => {
            const l = Either.left(1);
            expect(l.isLeft()).toBe(true);
            expect(l.getLeftOrThrow()).toBe(1);
        });
    });

    describe("right()", () => {
        it("creates a new Right instance", () => {
            const r = Either.right("a");
            expect(r.isRight()).toBe(true);
            expect(r.getRightOrThrow()).toBe("a");
        });
    });

    describe("isInstance()", () => {
        it("returns true for a Left instance", () => {
            const l = Either.left(1);
            expect(Either.isInstance(l)).toBe(true);
        });

        it("returns true for a Right instance", () => {
            const r = Either.right("a");
            expect(Either.isInstance(r)).toBe(true);
        });

        it("returns false for a non-Either instance", () => {
            expect(Either.isInstance("foo")).toBe(false);
        });
    });
});
