import { Result } from './result';
import { Option } from './option';
import { JonadsError } from './errors';
import { ok, err, some, none } from './testing';

describe("Result", () => {
    describe("isOk()", () => {
        it("returns true for Ok", () => {
            const result = ok("a");
            expect(result.isOk()).toBe(true);
        });

        it("returns false for Err", () => {
            const result = err(new Error());
            expect(result.isOk()).toBe(false);
        });
    });

    describe("isErr()", () => {
        it("returns false for Ok", () => {
            const result = ok("a");
            expect(result.isErr()).toBe(false);
        });

        it("returns true for Err", () => {
            const result = err(new Error());
            expect(result.isErr()).toBe(true);
        });
    });

    describe("valueOr()", () => {
        it("returns the value for Ok", () => {
            const result = ok("a");
            expect(result.valueOr("b")).toBe("a");
        });

        it("returns the fallback value for Err", () => {
            const result = err(new Error());
            expect(result.valueOr("b")).toBe("b");
        });

        it("returns the result of the fallback function for Err", () => {
            const result = err<string, Error>(new Error("5"));
            expect(result.valueOr(e => e.message)).toBe("5");
        });
    });

    describe("valueOrAsync()", () => {
        it("returns the value for Ok", async () => {
            const result = ok("a");
            expect(await result.valueOrAsync("b")).toBe("a");
        });

        it("returns the fallback value for Err", async () => {
            const result = err(new Error());
            expect(await result.valueOrAsync("b")).toBe("b");
        });

        it("returns the result of the fallback function for Err", async () => {
            const result = err<string, Error>(new Error("5"));
            expect(await result.valueOrAsync(async e => e.message)).toBe("5");
        });
    });

    describe("map()", () => {
        it("maps the value for Ok", () => {
            const result = ok("a");
            const mapped = result.map(v => v.toUpperCase());
            expect(mapped.valueOr("b")).toBe("A");
        });

        it("does not map the value for Err", () => {
            const error = new Error();
            const result = err<string, Error>(error);
            const mapped = result.map(v => v.toUpperCase());
            expect(mapped.getRightOrThrow()).toBe(error);
        });
    });

    describe("mapAsync()", () => {
        it("maps the value for Ok", async () => {
            const result = ok("a");
            const mapped = await result.mapAsync(async v => v.toUpperCase());
            expect(mapped.valueOr("b")).toBe("A");
        });

        it("does not map the value for Err", async () => {
            const error = new Error();
            const result = err<string, Error>(error);
            const mapped = await result.mapAsync(async v => v.toUpperCase());
            expect(mapped.getRightOrThrow()).toBe(error);
        });
    });

    describe("mapErr()", () => {
        it("does not map the error for Ok", () => {
            const result = ok("a");
            const mapped = result.mapErr(e => new JonadsError(e.message));
            expect(mapped.getLeftOrThrow()).toBe("a");
        });

        it("maps the error for Err", () => {
            class NewError extends Error {}

            const error = new Error();
            const result = err(error);
            const mapped = result.mapErr(e => new NewError(e.message));

            const newError = mapped.getRightOrThrow();
            expect(newError).toBeInstanceOf(NewError);
            expect(newError.message).toBe(error.message);
        });
    });

    describe("mapErrAsync()", () => {
        it("does not map the error for Ok", async () => {
            const result = ok("a");
            const mapped = await result.mapErrAsync(async e => new JonadsError(e.message));
            expect(mapped.getLeftOrThrow()).toBe("a");
        });

        it("maps the error for Err", async () => {
            class NewError extends Error {}

            const error = new Error();
            const result = err(error);
            const mapped = await result.mapErrAsync(async e => new NewError(e.message));

            const newError = mapped.getRightOrThrow();
            expect(newError).toBeInstanceOf(NewError);
            expect(newError.message).toBe(error.message);
        });
    });

    describe("andThen()", () => {
        it("returns the mapped value for Ok", () => {
            const result = ok("a");
            const mapped = result.andThen(v => ok(v.toUpperCase()));
            expect(mapped.valueOr("b")).toBe("A");
        });

        it("returns the error for Err", () => {
            const error = new Error();
            const result = err<string, Error>(error);
            const mapped = result.andThen(v => ok(v.toUpperCase()));
            expect(mapped.getRightOrThrow()).toBe(error);
        });
    });

    describe("andThenAsync()", () => {
        it("returns the mapped value for Ok", async () => {
            const result = ok("a");
            const mapped = await result.andThenAsync(async v => ok(v.toUpperCase()));
            expect(mapped.valueOr("b")).toBe("A");
        });

        it("returns the error for Err", async () => {
            const error = new Error();
            const result = err<string, Error>(error);
            const mapped = await result.andThenAsync(async v => ok(v.toUpperCase()));
            expect(mapped.getRightOrThrow()).toBe(error);
        });
    });

    describe("toString()", () => {
        it("converts to a string", () => {
            const l = ok("yes");
            expect(l.toString()).toBe("Ok(yes)");

            const r = err(new Error());
            expect(r.toString()).toBe("Err(Error)");
        });

    });

    describe("ok()", () => {
        it("creates an Ok instance", () => {
            const result = Result.ok("a");
            expect(result.isOk()).toBe(true);
            expect(result.getLeftOrThrow()).toBe("a");
        });
    });

    describe("err()", () => {
        it("creates an Err instance", () => {
            const error = new Error();
            const result = Result.err(error);
            expect(result.isErr()).toBe(true);
            expect(result.getRightOrThrow()).toBe(error);
        });
    });

    describe("transpose()", () => {
        it("transposes an Ok of a Some into a Some of an Ok", () => {
            const result = ok(some(1));
            const transposed = Result.transpose(result);

            expect(transposed.isSome()).toBe(true);
            const innerResult = transposed.getLeftOrThrow();
            expect(innerResult.isOk()).toBe(true);
            expect(innerResult.getLeftOrThrow()).toBe(1);
        });

        it("transposes an Ok of a None into a None", () => {
            const result = ok(none());
            const transposed = Result.transpose(result);

            expect(transposed.isNone()).toBe(true);
        });
        
        it("transposes an Err into a Some of an Err", () => {
            const result = err<Option<number>, Error>(new Error("oops"));
            const transposed = Result.transpose(result);

            expect(transposed.isSome()).toBe(true);
            const innerResult = transposed.getLeftOrThrow();
            expect(innerResult.isErr()).toBe(true);
            expect(innerResult.getRightOrThrow()).toBeInstanceOf(Error);
        });
    });
});
