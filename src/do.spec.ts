import { doing, doingAsync } from "./do";
import { Result, Ok, Err } from "./result";
import { ok } from "./testing";

describe("doing", () => {
    it("returns the value produced through the chain of functions", () => {
        const result = doing(bind => {
            const a = bind(new Ok(1));
            const b = bind(new Ok(a + 1));
            const c = bind(new Ok(b + 1));
            return c + 1;
        });

        expect(result.getLeftOrThrow()).toBe(4);
    });
    
    it("propagates the error from the first failure", () => {
        class FirstError extends Error {}
        class SecondError extends Error {}

        const result = doing(bind => {
            const a = bind(new Ok(1));
            const b = bind<number, FirstError>(new Err(new FirstError()));
            const c = bind<number, SecondError>(new Err(new SecondError()));
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
            const a = await bind(new Ok(1));
            const b = await bind(new Ok(a + 1));
            const c = await bind(new Ok(b + 1));
            return c + 1;
        });

        expect(result.getLeftOrThrow()).toBe(4);
    });

    it("propagates the error from the first failure", async () => {
        class FirstError extends Error {}
        class SecondError extends Error {}

        const result = await doingAsync(async bind => {
            const a = await bind(new Ok(1));
            const b = await bind<number, FirstError>(new Err(new FirstError()));
            const c = await bind<number, SecondError>(new Err(new SecondError()));
            return c;
        });

        expect(result.isErr()).toBe(true);
        expect(result.getRightOrThrow()).toBeInstanceOf(FirstError);
    });

    it("returns the value produced through the chain of functions when bind is given a promise", async () => {
        async function promised(value: number): Promise<Result<number, Error>> {
            return ok(value);
        }

        const result = await doingAsync(async bind => {
            return 1 + await bind(promised(1));
        });

        expect(result.getLeftOrThrow()).toBe(2);

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
    });

    describe("when catchall is false", () => {
        it("throws an error if the error is not part of a result propagation", async () => {
            class CustomError extends Error {}

            await expect(doingAsync(async () => {
                throw new CustomError();
            }, false)).rejects.toBeInstanceOf(CustomError);
        });
    });
});
