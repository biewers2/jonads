import { jDo } from "./do";
import { Ok, Err } from "./result";

describe("jDo", () => {
    it("returns the value produced through the chain of functions", () => {
        const result = jDo(bind => {
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

        const result = jDo(bind => {
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

            const result = jDo(() => {
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
                jDo(() => {
                    throw new CustomError();
                }, false);
            }).toThrow(CustomError);
        });
    });
});
