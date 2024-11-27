import { Option } from '../../../src/option/option';
import { Result } from '../../../src/result/result';

describe("Result", () => {
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
            const result = Result.ok(Option.from(1));
            const transposed = Result.transpose(result);

            expect(transposed.isSome()).toBe(true);
            const innerResult = transposed.getLeftOrThrow();
            expect(innerResult.isOk()).toBe(true);
            expect(innerResult.getLeftOrThrow()).toBe(1);
        });

        it("transposes an Ok of a None into a None", () => {
            const result = Result.ok(Option.none());
            const transposed = Result.transpose(result);

            expect(transposed.isNone()).toBe(true);
        });
        
        it("transposes an Err into a Some of an Err", () => {
            const result = Result.err<Option<number>, Error>(new Error("oops"));
            const transposed = Result.transpose(result);

            expect(transposed.isSome()).toBe(true);
            const innerResult = transposed.getLeftOrThrow();
            expect(innerResult.isErr()).toBe(true);
            expect(innerResult.getRightOrThrow()).toBeInstanceOf(Error);
        });
    });

    describe("isInstance()", () => {
        it("returns true for an Ok instance", () => {
            const result = Result.ok(1);
            expect(Result.isInstance(result)).toBe(true);
        });

        it("returns true for an Err instance", () => {
            const result = Result.err(new Error("oops"));
            expect(Result.isInstance(result)).toBe(true);
        });

        it("returns false for a non-Result instance", () => {
            expect(Result.isInstance("foo")).toBe(false);
        });
    });
});
