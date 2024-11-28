import { Result } from "../../../src/result/result";

describe("Result", () => {
    describe("isOk()", () => {
        it("returns false", () => {
            const result = Result.err(new Error());
            expect(result.isOk()).toBe(false);
        });
    });

    describe("isErr()", () => {
        it("returns true", () => {
            const result = Result.err(new Error());
            expect(result.isErr()).toBe(true);
        });
    });

    describe("valueOr()", () => {
        it("returns the fallback value", () => {
            const result = Result.err(new Error());
            expect(result.valueOr("b")).toBe("b");
        });

        it("returns the result of the fallback function", () => {
            const result = Result.err<string, Error>(new Error("5"));
            expect(result.valueOr(e => e.message)).toBe("5");
        });
    });

    describe("valueOrAsync()", () => {
        it("returns the fallback value", async () => {
            const result = Result.err(new Error());
            expect(await result.valueOrAsync("b")).toBe("b");
        });

        it("returns the promised fallback value", async () => {
            const result = Result.err(new Error());
            expect(await result.valueOrAsync(Promise.resolve("b"))).toBe("b");
        });

        it("returns the result of the fallback function", async () => {
            const result = Result.err<string, Error>(new Error("5"));
            expect(await result.valueOrAsync(async e => e.message)).toBe("5");
        });
    });

    describe("map()", () => {
        it("does not map the value", () => {
            const error = new Error();
            const result = Result.err<string, Error>(error);
            const mapped = result.map(v => v.toUpperCase());
            expect(mapped.getRightOrThrow()).toBe(error);
        });
    });

    describe("mapAsync()", () => {
        it("does not map the value", async () => {
            const error = new Error();
            const result = Result.err<string, Error>(error);
            const mapped = await result.mapAsync(async v => v.toUpperCase());
            expect(mapped.getRightOrThrow()).toBe(error);
        });
    });

    describe("mapErr()", () => {
        it("maps the error", () => {
            class NewError extends Error {}

            const error = new Error();
            const result = Result.err(error);
            const mapped = result.mapErr(e => new NewError(e.message));

            const newError = mapped.getRightOrThrow();
            expect(newError).toBeInstanceOf(NewError);
            expect(newError.message).toBe(error.message);
        });
    });

    describe("mapErrAsync()", () => {
        it("maps the error", async () => {
            class NewError extends Error {}

            const error = new Error();
            const result = Result.err(error);
            const mapped = await result.mapErrAsync(async e => new NewError(e.message));

            const newError = mapped.getRightOrThrow();
            expect(newError).toBeInstanceOf(NewError);
            expect(newError.message).toBe(error.message);
        });
    });

    describe("andThen()", () => {
        it("returns the error", () => {
            const error = new Error();
            const result = Result.err<string, Error>(error);
            const mapped = result.andThen(v => Result.ok(v.toUpperCase()));
            expect(mapped.getRightOrThrow()).toBe(error);
        });
    });

    describe("andThenAsync()", () => {
        it("returns the error", async () => {
            const error = new Error();
            const result = Result.err<string, Error>(error);
            const mapped = await result.andThenAsync(async v => Result.ok(v.toUpperCase()));
            expect(mapped.getRightOrThrow()).toBe(error);
        });
    });

    describe("someOrNone()", () => {
        it("returns None", () => {
            const result = Result.err(new Error());
            const option = result.someOrNone();
            expect(option.isNone()).toBe(true);
        });
    });

    describe("asNullable()", () => {
        it("returns unchanged", () => {
            const result = Result.err(new Error());
            const newResult = result.asNullable();
            expect(newResult.isErr()).toBe(true);
        });
    });

    describe("toString()", () => {
        it("converts to a string", () => {
            const r = Result.err(new Error());
            expect(r.toString()).toBe("Err(Error)");
        });

    });
});
