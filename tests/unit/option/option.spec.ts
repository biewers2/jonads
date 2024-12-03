import { Option } from "../../../src/option/option";
import { Result } from "../../../src/result/result";

describe("Option", () => {
    describe("from()", () => {
        it("creates a Some for a non-null value", () => {
            const option = Option.from(1);
            expect(option.getLeftOrThrow()).toBe(1);
        });

        it("creates a None for a null value", () => {
            const option = Option.from(null);
            expect(option.isNone()).toBe(true);
        });

        it("creates a None for an undefined value", () => {
            const option = Option.from(undefined);
            expect(option.isNone()).toBe(true);
        });
    });

    describe("none()", () => {
        it("creates a None", () => {
            const option = Option.none();
            expect(option.isNone()).toBe(true);
        });
    });

    describe("transpose()", () => {
        it("transposes a Some of an Ok into an Ok of a Some", () => {
            const option = Option.from(Result.ok(1));
            const transposed = Option.transpose(option);

            expect(transposed.isOk()).toBe(true);
            const innerOption = transposed.getLeftOrThrow();
            expect(innerOption.isSome()).toBe(true);
            expect(innerOption.getLeftOrThrow()).toBe(1);
        });

        it("transposes a Some of an Err into an Err", () => {
            const option = Option.from(Result.err(new Error("oops")));
            const transposed = Option.transpose(option);

            expect(transposed.isErr()).toBe(true);
            expect(transposed.getRightOrThrow()).toBeInstanceOf(Error);
        });
        
        it("transposes a None into an Ok of a None", () => {
            const option = Option.none<Result<number, Error>>();
            const transposed = Option.transpose(option);

            expect(transposed.isOk()).toBe(true);
            expect(transposed.getLeftOrThrow().isNone()).toBe(true);
        });
    });

    describe("isInstance()", () => {
        it("returns true for a Some instance", () => {
            const option = Option.from(1);
            expect(Option.isInstance(option)).toBe(true);
        });

        it("returns true for a None instance", () => {
            const option = Option.none();
            expect(Option.isInstance(option)).toBe(true);
        });

        it("returns false for a non-Option instance", () => {
            const option = { value: 1 };
            expect(Option.isInstance(option)).toBe(false);
        });
    });

    describe("isSome()", () => {
        it("calls the isSome method of the provided option", () => {
            const mapper = Option.isSome();

            expect(mapper(Option.from(1))).toBe(true);
            expect(mapper(Option.none())).toBe(false);
        });
    });

    describe("isNone()", () => {
        it("calls the isNone method of the provided option", () => {
            const mapper = Option.isNone();

            expect(mapper(Option.from(1))).toBe(false);
            expect(mapper(Option.none())).toBe(true);
        });
    });

    describe("valueOr()", () => {
        it("calls the valueOr method of the provided option", () => {
            const mapper = Option.valueOr(2);

            expect(mapper(Option.from(1))).toBe(1);
            expect(mapper(Option.none())).toBe(2);
        });
    });

    describe("map()", () => {
        it("calls the map method of the provided option", () => {
            const mapper = Option.map((value: number) => value + 1);

            expect(mapper(Option.from(1)).getLeftOrThrow()).toBe(2);
            expect(mapper(Option.none()).isNone()).toBe(true);
        });
    });

    describe("andThen()", () => {
        it("calls the andThen method of the provided option", () => {
            const mapper = Option.andThen((value: number) => Option.from(value + 1));

            expect(mapper(Option.from(1)).getLeftOrThrow()).toBe(2);
            expect(mapper(Option.none()).isNone()).toBe(true);
        });
    });

    describe("okOr()", () => {
        it("calls the okOr method of the provided option", () => {
            const mapper = Option.okOr(new Error("oops"));

            expect(mapper(Option.from(1))).toEqual(Result.ok(1));
            expect(mapper(Option.none())).toEqual(Result.err(new Error("oops")));
        });
    });

    describe("okOrError()", () => {
        it("calls the okOrError method of the provided option", () => {
            const mapper = Option.okOrError("oops");

            expect(mapper(Option.from(1))).toEqual(Result.ok(1));
            expect(mapper(Option.none())).toEqual(Result.err(new Error("oops")));
        });
    });
});


