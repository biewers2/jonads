import { GetValueError } from "./errors";

/**
 * An Either jonad.
 * 
 * Represents a value that can be one of two types, "Left" or "Right". Associates a set of utility functions to work
 * with the jonad.
 */
export interface Either<L, R> {
    /**
     * Checks if the value is a Left.
     * 
     * @returns true if the value is a Left, false otherwise.
     */
    isLeft: () => boolean;

    /**
     * Checks if the value is a Right.
     * 
     * @returns true if the value is a Right, false otherwise.
     */
    isRight: () => boolean;

    /**
     * Returns the value if it is a Left, otherwise returns a default value.
     * 
     * @param fallback The default value (as-is or produced from a callback) to return if the value is a Right.
     * @returns The value if it is a Left, otherwise the default value.
     */
    leftOr: (fallback: L | ((right: R) => L)) => L;

    /**
     * Returns the value if it is a Left, otherwise returns a default value asynchronously.
     * 
     * @param fallback The default value (as-is or produced from a callback) to return if the value is a Right.
     * @returns The value if it is a Left, otherwise the default value.
     */
    leftOrAsync: (fallback: L | ((right: R) => Promise<L>)) => Promise<L>;

    /**
     * Returns the value if it is a Right, otherwise returns a default value.
     * 
     * @param fallback The default value (as-is or produced from a callback) to return if the value is a Left.
     * @returns The value if it is a Right, otherwise the default value.
     */
    rightOr: (fallback: R | ((left: L) => R)) => R;

    /**
     * Returns the value if it is a Right, otherwise returns a default value asynchronously.
     * 
     * @param fallback The default value (as-is or produced from a callback) to return if the value is a Left.
     * @returns The value if it is a Right, otherwise the default value.
     */
    rightOrAsync: (fallback: R | ((left: L) => Promise<R>)) => Promise<R>;

    /**
     * Maps the value if it is a Left, otherwise returns the value as-is.
     * 
     * @param mapper The function to apply to the value if it is a Left.
     * @returns A new Either with the mapped value if it is a Left, otherwise the value as-is.
     */
    mapLeft: <V>(mapper: (value: L) => V) => Either<V, R>;

    /**
     * Maps the value if it is a Left asynchronously, otherwise returns the value as-is.
     * 
     * @param mapper The async function to apply to the value if it is a Left.
     * @returns A new Either with the mapped value if it is a Left, otherwise the value as-is.
     */
    mapLeftAsync: <V>(mapper: (value: L) => Promise<V>) => Promise<Either<V, R>>;

    /**
     * Maps the value if it is a Right, otherwise returns the value as-is.
     * 
     * @param mapper The function to apply to the value if it is a Right.
     * @returns A new Either with the mapped value if it is a Right, otherwise the value as-is.
     */
    mapRight: <V>(mapper: (value: R) => V) => Either<L, V>;

    /**
     * Maps the value if it is a Right asynchronously, otherwise returns the value as-is.
     * 
     * @param mapper The async function to apply to the value if it is a Right.
     * @returns A new Either with the mapped value if it is a Right, otherwise the value as-is.
     */
    mapRightAsync: <V>(mapper: (value: R) => Promise<V>) => Promise<Either<L, V>>;

    /**
     * Matches the jonad by calling the appropriate callback based on the value type.
     * 
     * @param on_left If the value is a Left, this callback is called with the value.
     * @param on_right If the value is a Right, this callback is called with the value.
     * @returns The result of the callback that was called.
     */
    match: <V>(on_left: (value: L) => V, on_right: (value: R) => V) => V;

    /**
     * Matches the jonad by calling the appropriate callback based on the value type asynchronously.
     * 
     * @param on_left If the value is a Left, this callback is called with the value.
     * @param on_right If the value is a Right, this callback is called with the value.
     * @returns The result of the callback that was called.
     */
    matchAsync: <V>(on_left: (value: L) => Promise<V>, on_right: (value: R) => Promise<V>) => Promise<V>;

    /**
     * Returns the value if it is a Left, otherwise throws an error.
     * 
     * @returns The value if it is a Left.
     * @throws GetValueError if the value is a Right.
     * @note This function is unsafe and should only be used for testing.
     */
    getLeftOrThrow: () => L;

    /**
     * Returns the value if it is a Right, otherwise throws an error.
     * @returns The value if it is a Right.
     * @throws GetValueError if the value is a Left.
     * @note This function is unsafe and should only be used for testing.
     */
    getRightOrThrow: () => R;
}

/**
 * An Either jonad with a Left value.
 */
export class Left<L, R> implements Either<L, R> {
    protected value: L;

    /**
     * Creates a new Left instance with the given value.
     * 
     * @param value The value to store in the Left instance.
     */
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

    async leftOrAsync(fallback: L | ((right: R) => Promise<L>)): Promise<L> {
        return this.value;
    }

    rightOr(fallback: R | ((left: L) => R)): R {
        if (isFunction(fallback)) {
            return fallback(this.value);
        } else {
            return fallback;
        }
    }

    async rightOrAsync(fallback: R | ((left: L) => Promise<R>)): Promise<R> {
        if (isFunction(fallback)) {
            return await fallback(this.value);
        } else {
            return fallback;
        }
    }

    mapLeft<T>(mapper: (value: L) => T): Either<T, R> {
        return new Left(mapper(this.value));
    }

    async mapLeftAsync<V>(mapper: (value: L) => Promise<V>): Promise<Either<V, R>> {
        return mapper(this.value).then(v => new Left(v));
    }

    mapRight<T>(mapper: (value: R) => T): Either<L, T> {
        return new Left(this.value);
    }

    async mapRightAsync<V>(mapper: (value: R) => Promise<V>): Promise<Either<L, V>> {
        return Promise.resolve(new Left(this.value));
    }

    match<T>(on_left: (value: L) => T, on_right: (value: R) => T): T {
        return on_left(this.value);
    }

    async matchAsync<T>(on_left: (value: L) => Promise<T>, on_right: (value: R) => Promise<T>): Promise<T> {
        return on_left(this.value);
    }

    getLeftOrThrow(): L {
        return this.value;
    }

    getRightOrThrow(): R {
        throw new GetValueError("right");
    }
}

/**
 * An Either jonad with a Right value.
 */
export class Right<L, R> implements Either<L, R> {
    protected value: R;

    /**
     * Creates a new Right instance with the given value.
     * 
     * @param value The value to store in the Right instance.
     */
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

    async leftOrAsync(fallback: L | ((right: R) => Promise<L>)): Promise<L> {
        if (isFunction(fallback)) {
            return await fallback(this.value);
        } else {
            return fallback;
        }
    }

    rightOr(fallback: R | ((left: L) => R)): R {
        return this.value;
    }

    async rightOrAsync(fallback: R | ((left: L) => Promise<R>)): Promise<R> {
        return this.value;
    }

    mapLeft<T>(mapper: (value: L) => T): Either<T, R> {
        return new Right(this.value);
    }

    async mapLeftAsync<V>(mapper: (value: L) => Promise<V>): Promise<Either<V, R>> {
        return Promise.resolve(new Right(this.value));
    }

    mapRight<T>(mapper: (value: R) => T): Either<L, T> {
        return new Right(mapper(this.value));
    }

    async mapRightAsync<V>(mapper: (value: R) => Promise<V>): Promise<Either<L, V>> {
        return mapper(this.value).then(v => new Right(v));
    }

    match<T>(on_left: (value: L) => T, on_right: (value: R) => T): T {
        return on_right(this.value);
    }

    async matchAsync<T>(on_left: (value: L) => Promise<T>, on_right: (value: R) => Promise<T>): Promise<T> {
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
