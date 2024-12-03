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

    describe("error()", () => {
        it("creates an Err instance with an Error", () => {
            const result = Result.error("oops");
            expect(result.isErr()).toBe(true);
            const error = result.getRightOrThrow();
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("oops");
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

    describe("isOk()", () => {
        it("calls the isOk method of the provided Result", () => {
            const mapper = Result.isOk<number, Error>();

            expect(mapper(Result.ok(1))).toBe(true);
            expect(mapper(Result.err(new Error("oops")))).toBe(false);
        });
    });

    describe("isErr()", () => {
        it("calls the isErr method of the provided Result", () => {
            const mapper = Result.isErr<number, Error>();

            expect(mapper(Result.ok(1))).toBe(false);
            expect(mapper(Result.err(new Error("oops")))).toBe(true);
        });
    });

    describe("valueOr()", () => {
        it("calls the valueOr method of the provided Result", () => {
            const mapper = Result.valueOr<number, Error>(2);

            expect(mapper(Result.ok(1))).toBe(1);
            expect(mapper(Result.err(new Error("oops")))).toBe(2);
        });
    });

    describe("map()", () => {
        it("calls the map method of the provided Result", () => {
            const mapper = Result.map<number, Error, string>(v => v.toString());

            const ok = Result.ok(1);
            const mappedOk = mapper(ok);
            expect(mappedOk.isOk()).toBe(true);
            expect(mappedOk.getLeftOrThrow()).toBe("1");

            const err = Result.err<number, Error>(new Error("oops"));
            const mappedErr = mapper(err);
            expect(mappedErr.isErr()).toBe(true);
            expect(mappedErr.getRightOrThrow()).toBeInstanceOf(Error);
        });
    });

    describe("mapErr()", () => {
        it("calls the mapErr method of the provided Result", () => {
            const mapper = Result.mapErr<number, Error, TypeError>(e => new TypeError(e.message));

            const ok = Result.ok(1);
            const mappedOk = mapper(ok);
            expect(mappedOk.isOk()).toBe(true);
            expect(mappedOk.getLeftOrThrow()).toBe(1);

            const err = Result.err<number, Error>(new Error("oops"));
            const mappedErr = mapper(err);
            expect(mappedErr.isErr()).toBe(true);
            expect(mappedErr.getRightOrThrow()).toBeInstanceOf(TypeError);
        });
    });

    describe("andThen()", () => {
        it("calls the andThen method of the provided Result", () => {
            const andThen = Result.andThen<number, Error, string>(v => Result.ok(v.toString()));

            const ok = Result.ok(1);
            const mappedOk = andThen(ok);
            expect(mappedOk.isOk()).toBe(true);
            expect(mappedOk.getLeftOrThrow()).toBe("1");

            const err = Result.err<number, Error>(new Error("oops"));
            const mappedErr = andThen(err);
            expect(mappedErr.isErr()).toBe(true);
            expect(mappedErr.getRightOrThrow()).toBeInstanceOf(Error);
        });
    });

    describe("someOrNone()", () => {
        it("maps an Ok to a Some", () => {
            const mapper = Result.someOrNone<number, Error>();

            const ok = Result.ok(1);
            const something = mapper(ok);
            expect(something.isSome()).toBe(true);
            expect(something.getLeftOrThrow()).toBe(1);

            const err = Result.err<number, Error>(new Error("oops"));
            const nothing = mapper(err);
            expect(nothing.isNone()).toBe(true);
        });
    });

    describe("asNullable()", () => {
        it("maps an Ok to a Some", () => {
            const mapper = Result.asNullable<number | null, Error>();

            const ok = Result.ok(1);
            const something = mapper(ok);
            expect(something.isOk()).toBe(true);
            expect(something.getLeftOrThrow()).toEqual(Option.from(1));

            const nullish = Result.ok(null);
            const nothing = mapper(nullish);
            expect(nothing.isOk()).toBe(true);
            expect(nothing.getLeftOrThrow()).toEqual(Option.from(null));
        });
    });
});
