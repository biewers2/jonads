import { GetValueError } from "./errors";

export interface Either<L, R> {
    isLeft: () => boolean;

    isRight: () => boolean;

    leftOr: (fallback: L | ((right: R) => L)) => L;

    rightOr: (fallback: R | ((left: L) => R)) => R;

    mapLeft: <V>(mapper: (value: L) => V) => Either<V, R>;

    mapRight: <V>(mapper: (value: R) => V) => Either<L, V>;

    match: <V>(on_left: (value: L) => V, on_right: (value: R) => V) => V;

    getLeftOrThrow: () => L;

    getRightOrThrow: () => R;
}

export class Left<L, R> implements Either<L, R> {
    protected value: L;

    constructor(value: L) {
        this.value = value;
    }

    isLeft(): boolean {
        return true;
    }

    isRight(): boolean {
        return false;
    }

    leftOr(fallback: L | ((right: R) => L)): L {
        return this.value;
    }

    rightOr(fallback: R | ((left: L) => R)): R {
        if (isFunction(fallback)) {
            return fallback(this.value);
        } else {
            return fallback;
        }
    }

    mapLeft<T>(mapper: (value: L) => T): Either<T, R> {
        return new Left(mapper(this.value));
    }

    mapRight<T>(mapper: (value: R) => T): Either<L, T> {
        return new Left(this.value);
    }

    match<T>(on_left: (value: L) => T, on_right: (value: R) => T): T {
        return on_left(this.value);
    }

    getLeftOrThrow(): L {
        return this.value;
    }

    getRightOrThrow(): R {
        throw new GetValueError("right");
    }
}

export class Right<L, R> implements Either<L, R> {
    protected value: R;

    constructor(value: R) {
        this.value = value;
    }

    isLeft(): boolean {
        return false;
    }

    isRight(): boolean {
        return true;
    }

    leftOr(fallback: L | ((right: R) => L)): L {
        if (isFunction(fallback)) {
            return fallback(this.value);
        } else {
            return fallback;
        }
    }

    rightOr(fallback: R | ((left: L) => R)): R {
        return this.value;
    }

    mapLeft<T>(mapper: (value: L) => T): Either<T, R> {
        return new Right(this.value);
    }

    mapRight<T>(mapper: (value: R) => T): Either<L, T> {
        return new Right(mapper(this.value));
    }

    match<T>(on_left: (value: L) => T, on_right: (value: R) => T): T {
        return on_right(this.value);
    }

    getLeftOrThrow(): L {
        throw new GetValueError("left");
    }

    getRightOrThrow(): R {
        return this.value;
    }
}

function isFunction<F extends (...args: any[]) => any>(f: unknown): f is F {
    return typeof f === "function";
}
