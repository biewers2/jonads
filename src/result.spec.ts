import { JonadsError } from './errors';
import { Result, Ok, Err } from './result';

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
            const result = err(new Error("5"));
            expect(result.valueOr(e => e.message)).toBe("5");
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
            const result = err(error);
            const mapped = result.map(v => v.toUpperCase());
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

    describe("then()", () => {
        it("returns the mapped value for Ok", () => {
            const result = ok("a");
            const mapped = result.then(v => ok(v.toUpperCase()));
            expect(mapped.valueOr("b")).toBe("A");
        });

        it("returns the error for Err", () => {
            const error = new Error();
            const result = err(error);
            const mapped = result.then(v => ok(v.toUpperCase()));
            expect(mapped.getRightOrThrow()).toBe(error);
        });
    });
});

function ok(value: string): Result<string, Error> {
    return new Ok(value);
}

function err(e: Error): Result<string, Error> {
    return new Err(e);
}
