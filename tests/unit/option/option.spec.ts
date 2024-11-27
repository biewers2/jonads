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
});


