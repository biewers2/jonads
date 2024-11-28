import { Either } from "../either/either";
import { Some } from "./some";
import { None } from "./none";
import { Result } from "../result/result";
import { AsyncMapper, AsyncProducer, Mapper, Producer } from "../types";
import { isNullish } from "../guards";

/**
 * An Option jonad.
 * 
 * Represents a value that may or may not be present. The left-side value is `Some`, while the right-side value is
 * `None` (represented by the value `null`).
 */
export interface Option<T> extends Either<T, null | undefined> {
    /**
     * Checks if the value is Some.
     * 
     * @returns true if the value is Some, false otherwise.
     */
    isSome(): boolean;

    /**
     * Checks if the value is None.
     * 
     * @returns true if the value is None, false otherwise.
     */
    isNone(): boolean;

    /**
     * Returns the value if it is Some, otherwise returns a default value.
     * 
     * @param fallback The default value (as-is or produced from a callback) to return if the value is None.
     * @returns The value if it is Some, otherwise the default value.
     */
    valueOr(fallback: T | Producer<T>): T;

    /**
     * Returns the value if it is Some, otherwise returns a default value asynchronously.
     * 
     * @param fallback The default value (as-is or produced from a callback) to return if the value is None.
     * @returns The value if it is an Ok, otherwise the default value.
     */
    valueOrAsync(fallback: T | Promise<T> | AsyncProducer<T>): Promise<T>;

    /**
     * Maps the value if it is Some.
     * 
     * @param mapper The mapper function to apply to the value if it is Some.
     * @returns A new Option with the mapped value if it is Some, otherwise the Option as-is.
     */
    map<U>(mapper: Mapper<T, U>): Option<U>;

    /**
     * Maps the value if it is Some, but asynchronously.
     * 
     * @param mapper The async mapper function to apply to the value if it is Some.
     * @returns A new Option with the mapped value if it is Some, otherwise the Option as-is.
     */
    mapAsync<U>(mapper: AsyncMapper<T, U>): Promise<Option<U>>;

    /**
     * Chains a new Option to the current one if it is Some.
     * 
     * @param mapper The mapper function to apply to the value if it is Some.
     * @returns A new Option with the mapped value if it is Some, otherwise the value as-is.
     */
    andThen<U>(mapper: Mapper<T, Option<U>>): Option<U>;

    /**
     * Chains a new Option to the current one if it is Some, but asynchronously.
     * 
     * @param mapper The async mapper function to apply to the value if it is Some.
     * @returns A new Option with the mapped value if it is Some, otherwise the value as-is.
     */
    andThenAsync<U>(mapper: AsyncMapper<T, Option<U>>): Promise<Option<U>>;

    /**
     * Maps the Option to a Result.
     * 
     * If the Option is Some, the value will be wrapped in an Ok. If the Option is None, the provided error will be returned.
     * 
     * @param error The error to return if the Option is None.
     * @returns A Result of the Option.
     */
    okOr<E extends Error>(error: E | Producer<E>): Result<T, E>;

    /**
     * Maps the Option to a Result, but asynchronously.
     * 
     * If the Option is Some, the value will be wrapped in an Ok. If the Option is None, the provided error will be returned.
     * 
     * @param error The error to return if the Option is None.
     * @returns A Result of the Option.
     */
    okOrAsync<E extends Error>(error: E | Promise<E> | AsyncProducer<E>): Promise<Result<T, E>>;
}

/**
 * Option-related utilities.
 */
export const Option: object = {
    /**
     * Creates a new Option from a nullable, potentially-undefined value.
     * 
     * @param value The value to wrap in an Option.
     * @returns A new Option with the left-value `Some` if the value is not `null` or `undefined`, otherwise `None`.
     */
    from<T>(value: T | null | undefined): Option<T> {
        if (isNullish(value)) {
            return new None(value);
        } else {
            return new Some(value);
        }
    },

    /**
     * Creates a new Option with the right-value `None`. 
     * 
     * @returns A new Option with the right-value `None`.
     */
    none<T>(): Option<T> {
        return new None();
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
    transpose<T, E extends Error>(option: Option<Result<T, E>>): Result<Option<T>, E> {
        return option.match<Result<Option<T>, E>>(
            some_result => some_result.map(value => new Some(value)),
            () => Result.ok(Option.none())
        )
    },

    /**
     * Checks if a value is an Option jonad.
     * 
     * @param value The value to check.
     * @returns true if the value is an Option, false otherwise
     */
    isInstance<T>(value: unknown): value is Option<T> {
        return value instanceof Some || value instanceof None;
    },
}
