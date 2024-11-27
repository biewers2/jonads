import { doing, doingAsync } from "../../src/do";
import { Result } from "../../src/result/result";

describe("doing", () => {
    it("returns the value produced through the chain of functions", () => {
        const result = doing(bind => {
            const a = bind(Result.ok(1));
            const b = bind(Result.ok(a + 1));
            const c = bind(Result.ok(b + 1));
            return c + 1;
        });

        expect(result.getLeftOrThrow()).toBe(4);
    });
    
    it("propagates the error from the first failure", () => {
        class FirstError extends Error {}
        class SecondError extends Error {}

        const result = doing(bind => {
            const a = bind(Result.ok(1));
            const b = bind<number, FirstError>(Result.err(new FirstError()));
            const c = bind<number, SecondError>(Result.err(new SecondError()));
            return c;
        });

        expect(result.isErr()).toBe(true);
        expect(result.getRightOrThrow()).toBeInstanceOf(FirstError);
    });

    describe("when catchall is true", () => {
        it("captures an error if the error is not part of a result propagation", () => {
            class CustomError extends Error {}

            const result = doing(() => {
                throw new CustomError();
            });

            expect(result.isErr()).toBe(true);
            expect(result.getRightOrThrow()).toBeInstanceOf(CustomError);
        });
    });

    describe("when catchall is false", () => {
        it("throws an error if the error is not part of a result propagation", () => {
            class CustomError extends Error {}

            expect(() => {
                doing(() => {
                    throw new CustomError();
                }, false);
            }).toThrow(CustomError);
        });
    });
});

describe("doingAsync", () => {
    it("returns the value produced through the chain of functions", async () => {
        const result = await doingAsync(async bind => {
            const a = await bind(Result.ok(1));
            const b = await bind(Result.ok(a + 1));
            const c = await bind(Result.ok(b + 1));
            return c + 1;
        });

        expect(result.getLeftOrThrow()).toBe(4);
    });

    it("propagates the error from the first failure", async () => {
        class FirstError extends Error {}
        class SecondError extends Error {}

        const result = await doingAsync(async bind => {
            const a = await bind(Result.ok(1));
            const b = await bind<number, FirstError>(Result.err(new FirstError()));
            const c = await bind<number, SecondError>(Result.err(new SecondError()));
            return c;
        });

        expect(result.isErr()).toBe(true);
        expect(result.getRightOrThrow()).toBeInstanceOf(FirstError);
    });

    it("returns the value produced through the chain of functions when bind is given a promise", async () => {
        async function promisedValue(value: number): Promise<number> {
            return value;
        }

        async function promisedResult(value: number): Promise<Result<number, Error>> {
            return Result.ok(value);
        }

        const result = await doingAsync(async bind => {
            const a = await bind(promisedValue(1));
            const b = await bind(promisedResult(a + 1));
            return b + 1;
        });

        expect(result.getLeftOrThrow()).toBe(3);

    });

    describe("when catchall is true", () => {
        it("captures an error if the error is not part of a result propagation", async () => {
            class CustomError extends Error {}

            const result = await doingAsync(async () => {
                throw new CustomError();
            });

            expect(result.isErr()).toBe(true);
            expect(result.getRightOrThrow()).toBeInstanceOf(CustomError);
        });

        it("captures an error from a resolved promise passed to bind", async () => {
            class CustomError extends Error {}

            const result = await doingAsync(async bind => {
                const a = await bind(Promise.reject(new CustomError()));
                return a;
            });

            expect(result.isErr()).toBe(true);
            expect(result.getRightOrThrow()).toBeInstanceOf(CustomError);
        });
    });

    describe("when catchall is false", () => {
        it("throws an error if the error is not part of a result propagation", async () => {
            class CustomError extends Error {}

            await expect(doingAsync(async () => {
                throw new CustomError();
            }, false)).rejects.toBeInstanceOf(CustomError);
        });

        it("throws an error from a rejected promise passed to bind", async () => {
            class CustomError extends Error {}

            await expect(doingAsync(async bind => {
                const a = await bind(Promise.reject(new CustomError()));
                return a;
            }, false)).rejects.toBeInstanceOf(CustomError);
        });
    });
});
