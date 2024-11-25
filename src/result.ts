import { Either, Left, Right } from "./either";

/**
 * A Result jonad, a subtype of Either.
 * 
 * Represents a value ("Ok") or an error ("Err"). Associates a set of utility functions to work
 * with the jonad.
 */
export interface Result<V, E extends Error> extends Either<V, E> {
    /**
     * Checks if the value is an Ok.
     * 
     * @returns true if the value is an Ok, false otherwise.
     */
    isOk: () => boolean;

    /**
     * Checks if the value is an Err.
     * 
     * @returns true if the value is an Err, false otherwise.
     */
    isErr: () => boolean;

    /**
     * Returns the value if it is an Ok, otherwise returns a default value.
     * 
     * @param fallback The default value (as-is or produced from a callback) to return if the value is an Err.
     * @returns The value if it is an Ok, otherwise the default value.
     */
    valueOr: (fallback: V | ((error: E) => V)) => V;

    /**
     * Maps the value if it is an Ok, otherwise returns the value as-is.
     * 
     * @param mapper The mapper function to apply to the value if it is an Ok.
     * @returns A new Result with the mapped value if it is an Ok, otherwise the value as-is.
     */
    map: <T>(mapper: (value: V) => T) => Result<T, E>;

    /**
     * Maps the error if it is an Err, otherwise returns the error as-is.
     * 
     * @param mapper The mapper function to apply to the error if it is an Err.
     * @returns A new Result with the mapped error if it is an Err, otherwise the error as-is.
     */
    mapErr: <T extends Error>(mapper: (error: E) => T) => Result<V, T>;
}

/**
 * A Result jonad that represents a successful value.
 */
export class Ok<V, E extends Error> extends Left<V, E> implements Result<V, E> {
    /**
     * Creates a new Ok instance.
     * 
     * @param value The value to wrap.
     */
    constructor(value: V) {
        super(value);
    }

    isOk(): boolean {
        return this.isLeft();
    }

    isErr(): boolean {
        return this.isRight();
    }

    valueOr(fallback: V | ((error: E) => V)): V {
        return this.leftOr(fallback);
    }

    map<T>(mapper: (value: V) => T): Result<T, E> {
        return new Ok(mapper(this.value));
    }

    mapErr<T extends Error>(mapper: (error: E) => T): Result<V, T> {
        return new Ok(this.value);
    }
}

/**
 * A Result jonad that represents an error.
 */
export class Err<V, E extends Error> extends Right<V, E> implements Result<V, E> {
    /**
     * Creates a new Err instance.
     * 
     * @param value The error to wrap.
     */
    constructor(value: E) {
        super(value);
    }

    isOk(): boolean {
        return this.isLeft();
    }

    isErr(): boolean {
        return this.isRight();
    }

    valueOr(fallback: V | ((error: E) => V)): V {
        return this.leftOr(fallback);
    }

    map<T>(mapper: (value: V) => T): Result<T, E> {
        return new Err(this.value);
    }

    mapErr<T extends Error>(mapper: (error: E) => T): Result<V, T> {
        return new Err(mapper(this.value));
    }
}
