import { Option } from "./option";
import { Result } from "./result";
import { some, none, ok, err } from "./testing";

describe("Option", () => {
    describe("isSome()", () => {
        it("returns true for Some", () => {
            const option = some(1);
            expect(option.isSome()).toBe(true);
        });

        it("returns false for None", () => {
            const option = none();
            expect(option.isSome()).toBe(false);
        });
    });

    describe("isNone()", () => {
        it("returns false for Some", () => {
            const option = some(1);
            expect(option.isNone()).toBe(false);
        });

        it("returns true for None", () => {
            const option = none();
            expect(option.isNone()).toBe(true);
        });
    });

    describe("valueOr()", () => {
        it("returns the value for Some", () => {
            const option = some(1);
            expect(option.valueOr(0)).toBe(1);
        });

        it("returns the fallback for None", () => {
            const option = none();
            expect(option.valueOr(0)).toBe(0);
        });

        it("returns the result of the fallback function for None", () => {
            const option = none();
            expect(option.valueOr(() => 0)).toBe(0);
        });
    });

    describe("valueOrAsync()", () => {
        it("returns the value for Some", async () => {
            const option = some(1);
            expect(await option.valueOrAsync(0)).toBe(1);
        });

        it("returns the fallback for None", async () => {
            const option = none();
            expect(await option.valueOrAsync(0)).toBe(0);
        });

        it("returns the result of the fallback function for None", async () => {
            const option = none();
            expect(await option.valueOrAsync(async () => 0)).toBe(0);
        });
    });

    describe("map()", () => {
        it("maps the value for Some", () => {
            const option = some(1);
            expect(option.map(n => n + 1).getLeftOrThrow()).toBe(2);
        });

        it("returns None for None", () => {
            const option = none<number>();
            expect(option.map(n => n + 1).isNone()).toBe(true);
        });
    });

    describe("mapAsync()", () => {
        it("maps the value for Some", async () => {
            const option = some(1);
            expect((await option.mapAsync(async n => n + 1)).getLeftOrThrow()).toBe(2);
        });

        it("returns None for None", async () => {
            const option = none<number>();
            expect((await option.mapAsync(async n => n + 1)).isNone()).toBe(true);
        });
    });

    describe("andThen()", () => {
        it("maps the value for Some", () => {
            const option = some(1);
            expect(option.andThen(n => some(n + 1)).getLeftOrThrow()).toBe(2);
        });

        it("returns None for None", () => {
            const option = none<number>();
            expect(option.andThen(n => some(n + 1)).isNone()).toBe(true);
        });
    });

    describe("andThenAsync()", () => {
        it("maps the value for Some", async () => {
            const option = some(1);
            const newOption = await option.andThenAsync(async n => some(n + 1));
            expect(newOption.getLeftOrThrow()).toBe(2);
        });

        it("returns None for None", async () => {
            const option = none<number>();
            const newOption = await option.andThenAsync(async n => some(n + 1));
            expect(newOption.isNone()).toBe(true);
        });
    });

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

    describe("transpose()", () => {
        it("transposes a Some of an Ok into an Ok of a Some", () => {
            const option = some(ok(1));
            const transposed = Option.transpose(option);

            expect(transposed.isOk()).toBe(true);
            const innerOption = transposed.getLeftOrThrow();
            expect(innerOption.isSome()).toBe(true);
            expect(innerOption.getLeftOrThrow()).toBe(1);
        });

        it("transposes a Some of an Err into an Err", () => {
            const option = some(err(new Error("oops")));
            const transposed = Option.transpose(option);

            expect(transposed.isErr()).toBe(true);
            expect(transposed.getRightOrThrow()).toBeInstanceOf(Error);
        });
        
        it("transposes a None into an Ok of a None", () => {
            const option = none<Result<number, Error>>();
            const transposed = Option.transpose(option);

            expect(transposed.isOk()).toBe(true);
            expect(transposed.getLeftOrThrow().isNone()).toBe(true);
        });
    });
});


