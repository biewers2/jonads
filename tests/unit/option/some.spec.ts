import { Option } from "../../../src/option/option";

describe("Some", () => {
    describe("isSome()", () => {
        it("returns true", () => {
            const option = Option.from(1);
            expect(option.isSome()).toBe(true);
        });
    });

    describe("isNone()", () => {
        it("returns false", () => {
            const option = Option.from(1);
            expect(option.isNone()).toBe(false);
        });
    });

    describe("valueOr()", () => {
        it("returns the value", () => {
            const option = Option.from(1);
            expect(option.valueOr(0)).toBe(1);
        });
    });

    describe("valueOrAsync()", () => {
        it("returns the value", async () => {
            const option = Option.from(1);
            expect(await option.valueOrAsync(0)).toBe(1);
        });
    });

    describe("map()", () => {
        it("maps the value", () => {
            const option = Option.from(1);
            expect(option.map(n => n + 1).getLeftOrThrow()).toBe(2);
        });
    });

    describe("mapAsync()", () => {
        it("maps the value", async () => {
            const option = Option.from(1);
            expect((await option.mapAsync(async n => n + 1)).getLeftOrThrow()).toBe(2);
        });
    });

    describe("andThen()", () => {
        it("maps the value", () => {
            const option = Option.from(1);
            expect(option.andThen(n => Option.from(n + 1)).getLeftOrThrow()).toBe(2);
        });
    });

    describe("andThenAsync()", () => {
        it("maps the value", async () => {
            const option = Option.from(1);
            const newOption = await option.andThenAsync(async n => Option.from(n + 1));
            expect(newOption.getLeftOrThrow()).toBe(2);
        });
    });

    describe("toString()", () => {
        it("returns 'Some(value)'", () => {
            const option = Option.from(1);
            expect(option.toString()).toBe("Some(1)");
        });
    });
});


