import { jTry, jTryCatching } from "./try";

describe("jTry", () => {
    it("returns an Ok from the block when nothing is thrown", () => {
        const result = jTry(() => {
            const a = 1;
            const b = 2;
            const c = 3;
            return a + b + c;
        });

        expect(result.getLeftOrThrow()).toBe(6);
    });

    it("returns an Err from the block when an error is thrown", () => {
        class CustomError extends Error {}

        const result = jTry(() => {
            throw new CustomError();
        });

        expect(result.isErr()).toBe(true);
        expect(result.getRightOrThrow()).toBeInstanceOf(CustomError);
    });
});

describe("jTryCatching", () => {
    it("returns an Ok from the block when nothing is thrown", () => {
        class CustomError extends Error {}

        const result = jTryCatching([CustomError], () => {
            const a = 1;
            const b = 2;
            const c = 3;
            return a + b + c;
        });

        expect(result.getLeftOrThrow()).toBe(6);
    });

    it("returns an Err from the block when the specified error is thrown", () => {
        class OneError extends Error {}
        class TwoError extends Error {}

        const result = jTryCatching([OneError, TwoError], () => {
            throw new TwoError();
        });

        expect(result.isErr()).toBe(true);
        expect(result.getRightOrThrow()).toBeInstanceOf(TwoError);
    });

    it("propagates the thrown exception when it is not part of the specified errors", () => {
        class ExpectedError extends Error {}
        class UnexpectedError extends Error {}

        expect(() => {
            jTryCatching([ExpectedError], () => {
                throw new UnexpectedError();
            });
        }).toThrow(UnexpectedError);
    });
});
