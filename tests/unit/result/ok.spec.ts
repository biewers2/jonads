import { Result } from "../../../src/result/result";
import { JonadsError } from "../../../src/errors";
import { Option } from "../../../src/option/option";

describe("Result", () => {
    describe("isOk()", () => {
        it("returns true", () => {
            const result = Result.ok("a");
            expect(result.isOk()).toBe(true);
        });
    });

    describe("isErr()", () => {
        it("returns false", () => {
            const result = Result.ok("a");
            expect(result.isErr()).toBe(false);
        });
    });

    describe("valueOr()", () => {
        it("returns the value", () => {
            const result = Result.ok("a");
            expect(result.valueOr("b")).toBe("a");
        });
    });

    describe("valueOrAsync()", () => {
        it("returns the value", async () => {
            const result = Result.ok("a");
            expect(await result.valueOrAsync("b")).toBe("a");
        });
    });

    describe("map()", () => {
        it("maps the value", () => {
            const result = Result.ok("a");
            const mapped = result.map(v => v.toUpperCase());
            expect(mapped.valueOr("b")).toBe("A");
        });
    });

    describe("mapAsync()", () => {
        it("maps the value", async () => {
            const result = Result.ok("a");
            const mapped = await result.mapAsync(async v => v.toUpperCase());
            expect(mapped.valueOr("b")).toBe("A");
        });
    });

    describe("mapErr()", () => {
        it("does not map the error", () => {
            const result = Result.ok("a");
            const mapped = result.mapErr(e => new JonadsError(e.message));
            expect(mapped.getLeftOrThrow()).toBe("a");
        });
    });

    describe("mapErrAsync()", () => {
        it("does not map the error", async () => {
            const result = Result.ok("a");
            const mapped = await result.mapErrAsync(async e => new JonadsError(e.message));
            expect(mapped.getLeftOrThrow()).toBe("a");
        });
    });

    describe("andThen()", () => {
        it("returns the mapped value", () => {
            const result = Result.ok("a");
            const mapped = result.andThen(v => Result.ok(v.toUpperCase()));
            expect(mapped.valueOr("b")).toBe("A");
        });
    });

    describe("andThenAsync()", () => {
        it("returns the mapped value", async () => {
            const result = Result.ok("a");
            const mapped = await result.andThenAsync(async v => Result.ok(v.toUpperCase()));
            expect(mapped.valueOr("b")).toBe("A");
        });
    });

    describe("someOrNone()", () => {
        it("returns Some(value) if the value is present", () => {
            const result = Result.ok("a");
            const option = result.someOrNone();

            expect(option.isSome()).toBe(true);
        });

        it("returns None if the value is not present", () => {
            const result = Result.ok(null);
            const option = result.someOrNone();
            expect(option.isNone()).toBe(true);
        });
    });

    describe("asNullable()", () => {
        it("maps the value to Some(value) if it's present", () => {
            const result = Result.ok("a");
            const newResult = result.asNullable();
            expect(newResult.isOk()).toBe(true);
            expect(newResult.getLeftOrThrow()).toEqual(Option.from("a"));
        });

        it("maps the value to None if it's not present", () => {
            const result = Result.ok(null);
            const newResult = result.asNullable();
            expect(newResult.isOk()).toBe(true);
            expect(newResult.getLeftOrThrow()).toEqual(Option.none());
        });
    });

    describe("toString()", () => {
        it("converts to a string", () => {
            const l = Result.ok("yes");
            expect(l.toString()).toBe("Ok(yes)");
        });

    });
});
