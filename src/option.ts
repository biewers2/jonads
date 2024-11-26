import { Either, Left, Right } from "./either";
import { isFunction } from "./guards";
import { Ok, Result } from "./result";

/**
 * An Option jonad.
 * 
 * Represents a value that may or may not be present. The left-side value is `Some`, while the right-side value is
 * `None` (represented by the value `null`).
 */
export interface Option<T> extends Either<T, null> {
    /**
     * Checks if the value is Some.
     * 
     * @returns true if the value is Some, false otherwise.
     */
    isSome: () => boolean;

    /**
     * Checks if the value is None.
     * 
     * @returns true if the value is None, false otherwise.
     */
    isNone: () => boolean;

    /**
     * Returns the value if it is Some, otherwise returns a default value.
     * 
     * @param fallback The default value (as-is or produced from a callback) to return if the value is None.
     * @returns The value if it is Some, otherwise the default value.
     */
    valueOr: (fallback: T | (() => T)) => T;

    /**
     * Returns the value if it is Some, otherwise returns a default value asynchronously.
     * 
     * @param fallback The default value (as-is or produced from a callback) to return if the value is None.
     * @returns The value if it is an Ok, otherwise the default value.
     */
    valueOrAsync: (fallback: T | (() => Promise<T>)) => Promise<T>;

    /**
     * Maps the value if it is Some.
     * 
     * @param mapper The mapper function to apply to the value if it is Some.
     * @returns A new Option with the mapped value if it is Some, otherwise the Option as-is.
     */
    map: <U>(mapper: (value: T) => U) => Option<U>;

    /**
     * Maps the value if it is Some, but asynchronously.
     * 
     * @param mapper The async mapper function to apply to the value if it is Some.
     * @returns A new Option with the mapped value if it is Some, otherwise the Option as-is.
     */
    mapAsync: <U>(mapper: (value: T) => Promise<U>) => Promise<Option<U>>;

    /**
     * Chains a new Option to the current one if it is Some.
     * 
     * @param mapper The mapper function to apply to the value if it is Some.
     * @returns A new Option with the mapped value if it is Some, otherwise the value as-is.
     */
    andThen: <U>(mapper: (value: T) => Option<U>) => Option<U>;

    /**
     * Chains a new Option to the current one if it is Some, but asynchronously.
     * 
     * @param mapper The async mapper function to apply to the value if it is Some.
     * @returns A new Option with the mapped value if it is Some, otherwise the value as-is.
     */
    andThenAsync: <U>(mapper: (value: T) => Promise<Option<U>>) => Promise<Option<U>>;
}

export class Some<T> extends Left<T, null> implements Option<T> {
    constructor(value: T) {
        super(value);
    }

    isSome(): boolean {
        return true;
    }

    isNone(): boolean {
        return false;
    }

    valueOr(fallback: T | (() => T)): T {
        return this.value;
    }

    async valueOrAsync(fallback: T | (() => Promise<T>)): Promise<T> {
        return this.value;
    }

    map<U>(mapper: (value: T) => U): Option<U> {
        return new Some(mapper(this.value));
    }

    async mapAsync<U>(mapper: (value: T) => Promise<U>): Promise<Option<U>> {
        return new Some(await mapper(this.value));
    }

    andThen<U>(mapper: (value: T) => Option<U>): Option<U> {
        return mapper(this.value);
    }

    async andThenAsync<U>(mapper: (value: T) => Promise<Option<U>>): Promise<Option<U>> {
        return mapper(this.value);
    }
}

export class None<T> extends Right<T, null> implements Option<T> {
    constructor() {
        super(null);
    }

    isSome(): boolean {
        return false;
    }

    isNone(): boolean {
        return true;
    }

    valueOr(fallback: T | (() => T)): T {
        if (isFunction(fallback)) {
            return fallback();
        } else {
            return fallback;
        }
    }

    async valueOrAsync(fallback: T | (() => Promise<T>)): Promise<T> {
        if (isFunction(fallback)) {
            return await fallback();
        } else {
            return fallback;
        }
    }

    map<U>(mapper: (value: T) => U): Option<U> {
        return new None();
    }

    async mapAsync<U>(mapper: (value: T) => Promise<U>): Promise<Option<U>> {
        return new None();
    }

    andThen<U>(mapper: (value: T) => Option<U>): Option<U> {
        return new None();
    }

    async andThenAsync<U>(mapper: (value: T) => Promise<Option<U>>): Promise<Option<U>> {
        return new None();
    }
}

/**
 * Option-related utilities.
 */
export const Option = {
    /**
     * Creates a new Option from a nullable, potentially-undefined value.
     * 
     * @param value The value to wrap in an Option.
     * @returns A new Option with the left-value `Some` if the value is not `null` or `undefined`, otherwise `None`.
     */
    from: <T>(value: T | null | undefined): Option<T> => {
        if (value === null || value === undefined) {
            return new None();
        } else {
            return new Some(value);
        }
    },

    /**
     * Transposes an Option of a Result into a Result of an Option.
     * 
     * @param option The Option to transpose.
     * @returns A Result of an Option.
     * 
     * @example Extracting the side-effect of an operation within an Option's mapping function:
     * ```typescript
     * const option = Option.some("123");                               // Some("123")
     * const option_result = option.map(n => parseIntThrowingError(n)); // Some(Ok(123))
     * const result_option = Option.transpose(option_result);           // Ok(Some(123))
     * 
     * // ...or when there's an error...
     * 
     * const option = Option.some("a");                                 // Some("a")
     * const option_result = option.map(n => parseIntThrowingError(n)); // Some(Err(ParseIntError))
     * const result_option = Option.transpose(option_result);           // Err(ParseIntError)
     * ```
     */
    transpose: <T, E extends Error>(option: Option<Result<T, E>>): Result<Option<T>, E> => {
        return option.match<Result<Option<T>, E>>(
            some_result => some_result.map(value => new Some(value)),
            () => new Ok(new None())
        )
    },
}
