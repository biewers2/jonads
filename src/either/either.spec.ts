import { Either } from "./either";

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
});
