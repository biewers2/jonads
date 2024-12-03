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

    describe("isLeft()", () => {
        it("calls the isLeft method of the provided Either", () => {
            const mapper = Either.isLeft<number, string>();

            expect(mapper(Either.left(1))).toBe(true);
            expect(mapper(Either.right("a"))).toBe(false);
        });
    });

    describe("isRight()", () => {
        it("calls the isRight method of the provided Either", () => {
            const mapper = Either.isRight<number, string>();

            expect(mapper(Either.left(1))).toBe(false);
            expect(mapper(Either.right("a"))).toBe(true);
        });
    });

    describe("leftOr()", () => {
        it("calls the leftOr method of the provided Either", () => {
            const mapper = Either.leftOr<number, string>(2);

            expect(mapper(Either.left(1))).toBe(1);
            expect(mapper(Either.right("string"))).toBe(2);
        });
    });

    describe("rightOr()", () => {
        it("calls the rightOr method of the provided Either", () => {
            const mapper = Either.rightOr<number, string>("default");

            expect(mapper(Either.left(1))).toBe("default");
            expect(mapper(Either.right("string"))).toBe("string");
        });
    });

    describe("mapLeft()", () => {
        it("calls the mapLeft method of the provided Either", () => {
            const mapper = Either.mapLeft<number, string, number>(x => x + 1);

            const leftResult = mapper(Either.left(1));
            expect(leftResult.getLeftOrThrow()).toBe(2);

            const rightResult = mapper(Either.right("a"));
            expect(rightResult.getRightOrThrow()).toBe("a");
        });
    });

    describe("mapRight()", () => {
        it("calls the mapRight method of the provided Either", () => {
            const mapper = Either.mapRight<number, string, string>(x => x + "b");

            const leftResult = mapper(Either.left(1));
            expect(leftResult.getLeftOrThrow()).toBe(1);

            const rightResult = mapper(Either.right("a"));
            expect(rightResult.getRightOrThrow()).toBe("ab");
        });
    });

    describe("tapLeft()", () => {
        it("calls the tapLeft method of the provided Either", () => {
            const mapper = Either.tapLeft<number[], string>(arr => arr.push(1));

            const lefty = Either.left<number[], string>([]);
            mapper(lefty);
            expect(lefty.getLeftOrThrow()).toEqual([1]);

            const righty = Either.right<number[], string>("a");
            mapper(righty);
            expect(righty.getRightOrThrow()).toBe("a");
        });
    });

    describe("tapRight()", () => {
        it("calls the tapRight method of the provided Either", () => {
            const mapper = Either.tapRight<number, string[]>(arr => arr.push("a"));

            const lefty = Either.left<number, string[]>(1);
            mapper(lefty);
            expect(lefty.getLeftOrThrow()).toBe(1);

            const righty = Either.right<number, string[]>([]);
            mapper(righty);
            expect(righty.getRightOrThrow()).toEqual(["a"]);
        });
    });

    describe("match()", () => {
        it("calls the match method of the provided Either", () => {
            const mapper = Either.match<number, string, string>(
                x => x.toString(),
                x => x.toUpperCase()
            );

            expect(mapper(Either.left(1))).toBe("1");
            expect(mapper(Either.right("a"))).toBe("A");
        });
    });
});
