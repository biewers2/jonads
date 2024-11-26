import { Option } from "./option";

describe("None", () => {
    describe("isSome()", () => {
        it("returns false", () => {
            const option = Option.none();
            expect(option.isSome()).toBe(false);
        });
    });

    describe("isNone()", () => {
        it("returns true", () => {
            const option = Option.none();
            expect(option.isNone()).toBe(true);
        });
    });

    describe("valueOr()", () => {
        it("returns the fallback", () => {
            const option = Option.none();
            expect(option.valueOr(0)).toBe(0);
        });

        it("returns the result of the fallback function", () => {
            const option = Option.none();
            expect(option.valueOr(() => 0)).toBe(0);
        });
    });

    describe("valueOrAsync()", () => {
        it("returns the fallback", async () => {
            const option = Option.none();
            expect(await option.valueOrAsync(0)).toBe(0);
        });

        it("returns the result of the fallback function", async () => {
            const option = Option.none();
            expect(await option.valueOrAsync(async () => 0)).toBe(0);
        });
    });

    describe("map()", () => {
        it("returns None", () => {
            const option = Option.none<number>();
            expect(option.map(n => n + 1).isNone()).toBe(true);
        });
    });

    describe("mapAsync()", () => {
        it("returns None", async () => {
            const option = Option.none<number>();
            expect((await option.mapAsync(async n => n + 1)).isNone()).toBe(true);
        });
    });

    describe("andThen()", () => {
        it("returns None", () => {
            const option = Option.none<number>();
            expect(option.andThen(n => Option.from(n + 1)).isNone()).toBe(true);
        });
    });

    describe("andThenAsync()", () => {
        it("returns None", async () => {
            const option = Option.none<number>();
            const newOption = await option.andThenAsync(async n => Option.from(n + 1));
            expect(newOption.isNone()).toBe(true);
        });
    });

    describe("toString()", () => {
        it("returns 'None' for None", () => {
            const option = Option.none();
            expect(option.toString()).toBe("None");
        });
    });
});


