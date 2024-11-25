import { trying, tryingAsync, tryCatching, tryCatchingAsync } from "./try";

describe("trying", () => {
    it("returns an Ok from the block when nothing is thrown", () => {
        const result = trying(() => {
            const a = 1;
            const b = 2;
            const c = 3;
            return a + b + c;
        });

        expect(result.getLeftOrThrow()).toBe(6);
    });

    it("returns an Err from the block when an error is thrown", () => {
        class CustomError extends Error {}

        const result = trying(() => {
            throw new CustomError();
        });

        expect(result.isErr()).toBe(true);
        expect(result.getRightOrThrow()).toBeInstanceOf(CustomError);
    });
});

describe("tryingAsync", () => {
    it("returns an Ok from the block when nothing is thrown", async () => {
        const result = await tryingAsync(async () => {
            const a = 1;
            const b = 2;
            const c = 3;
            return a + b + c;
        });

        expect(result.getLeftOrThrow()).toBe(6);
    });

    it("returns an Err from the block when an error is thrown", async () => {
        class CustomError extends Error {}

        const result = await tryingAsync(async () => {
            throw new CustomError();
        });

        expect(result.isErr()).toBe(true);
        expect(result.getRightOrThrow()).toBeInstanceOf(CustomError);
    });
});

describe("tryCatching", () => {
    it("returns an Ok from the block when nothing is thrown", () => {
        class CustomError extends Error {}

        const result = tryCatching([CustomError], () => {
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

        const result = tryCatching([OneError, TwoError], () => {
            throw new TwoError();
        });

        expect(result.isErr()).toBe(true);
        expect(result.getRightOrThrow()).toBeInstanceOf(TwoError);
    });

    it("propagates the thrown exception when it is not part of the specified errors", () => {
        class ExpectedError extends Error {}
        class UnexpectedError extends Error {}

        expect(() => {
            tryCatching([ExpectedError], () => {
                throw new UnexpectedError();
            });
        }).toThrow(UnexpectedError);
    });
});

describe("tryCatchingAsync", () => {
    it("returns an Ok from the block when nothing is thrown", async () => {
        class CustomError extends Error {}

        const result = await tryCatchingAsync([CustomError], async () => {
            const a = 1;
            const b = 2;
            const c = 3;
            return a + b + c;
        });

        expect(result.getLeftOrThrow()).toBe(6);
    });

    it("returns an Err from the block when the specified error is thrown", async () => {
        class OneError extends Error {}
        class TwoError extends Error {}

        const result = await tryCatchingAsync([OneError, TwoError], async () => {
            throw new TwoError();
        });

        expect(result.isErr()).toBe(true);
        expect(result.getRightOrThrow()).toBeInstanceOf(TwoError);
    });

    it("propagates the thrown exception when it is not part of the specified errors", async () => {
        class ExpectedError extends Error {}
        class UnexpectedError extends Error {}

        try {
            await tryCatchingAsync([ExpectedError], async () => {
                throw new UnexpectedError();
            });
        } catch (e) {
            expect(e).toBeInstanceOf(UnexpectedError);
        }
    });
});
