import { Either } from "../either/either";
import { Option } from "../option/option";
import { AsyncMapper, Mapper } from "../types";
import { Err } from "./err";
import { Ok } from "./ok";

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
     * 
     * @example
     * ```typescript
     * const okish = Result.ok(123);
     * result.isOk(); // true
     * 
     * const errish = Resulr.error("An error");
     * result.isOk(); // false
     * ```
     */
    isOk(): boolean;

    /**
     * Checks if the value is an Err.
     * 
     * @returns true if the value is an Err, false otherwise.
     * 
     * @example
     * ```typescript
     * const okish = Result.ok(123);
     * okish.isErr(); // false
     * 
     * const errish = Resulr.error("An error");
     * errish.isErr(); // true
     * ```
     */
    isErr(): boolean;

    /**
     * Returns the value if it is an Ok, otherwise returns a default value.
     * 
     * @param fallback The default value (as-is or produced from a callback) to return if the value is an Err.
     * @returns The value if it is an Ok, otherwise the default value.
     * 
     * @example
     * ```typescript
     * const okish = Result.ok(123);
     * okish.valueOr(0); // 123
     * 
     * const errish = Resulr.error("An error");
     * errish.valueOr(0); // 0
     */
    valueOr(fallback: V | Mapper<E, V>): V;

    /**
     * Returns the value if it is an Ok, otherwise returns a default value asynchronously.
     * 
     * @param fallback The default value (as-is or produced from a callback) to return if the value is an Err.
     * @returns The value if it is an Ok, otherwise the default value.
     * 
     * @example
     * ```typescript
     * const okish = Result.ok(123);
     * okish.valueOrAsync(async () => 0); // Promise(123)
     * 
     * const errish = Resulr.error("An error");
     * errish.valueOrAsync(Promise.resolve(0)); // Promise(0)
     * ```
     */
    valueOrAsync(fallback: V | Promise<V> | AsyncMapper<E, V>): Promise<V>;

    /**
     * Maps the value if it is an Ok.
     * 
     * @param mapper The mapper function to apply to the value if it is an Ok.
     * @returns A new Result with the mapped value if it is an Ok, otherwise the result as-is.
     * 
     * @example
     * ```typescript
     * const okish = Result.ok(123);
     * okish.map(value => value * 2); // Ok(246)
     * 
     * const errish = Resulr.error("An error");
     * errish.map(value => value * 2); // Err("An error")
     * ```
     */
    map<T>(mapper: Mapper<V, T>): Result<T, E>;

    /**
     * Maps the value if it is an Ok, but asynchronously.
     * 
     * @param mapper The async mapper function to apply to the value if it is an Ok.
     * @returns A new Result with the mapped value if it is an Ok, otherwise the result as-is.
     * 
     * @example
     * ```typescript
     * const okish = Result.ok(123);
     * okish.mapAsync(async value => value * 2); // Promise(246)
     * 
     * const errish = Resulr.error("An error");
     * errish.mapAsync(async value => value * 2); // Promise("An error")
     */
    mapAsync<T>(mapper: AsyncMapper<V, T>): Promise<Result<T, E>>;

    /**
     * Maps the error if it is an Err, otherwise returns the error as-is.
     * 
     * @param mapper The mapper function to apply to the error if it is an Err.
     * @returns A new Result with the mapped error if it is an Err, otherwise the result as-is.
     * 
     * @example
     * ```typescript
     * const okish = Result.ok(123);
     * okish.mapErr(error => new Error("An error")); // Ok(123)
     * 
     * const errish = Resulr.error("An error");
     * errish.mapErr(error => new Error("Another error")); // Err("Another error")
     */
    mapErr<T extends Error>(mapper: Mapper<E, T>): Result<V, T>;

    /**
     * Maps the error if it is an Err, but asynchronously.
     * 
     * @param mapper The async mapper function to apply to the error if it is an Err.
     * @returns A new Result with the mapped error if it is an Err, otherwise the result as-is.
     * 
     * @example
     * ```typescript
     * const okish = Result.ok(123);
     * okish.mapErrAsync(async error => new Error("An error")); // Ok(123)
     * 
     * const errish = Resulr.error("An error");
     * errish.mapErrAsync(async error => new Error("Another error")); // Promise(Err("Another error"))
     * ```
     */
    mapErrAsync<T extends Error>(mapper: AsyncMapper<E, T>): Promise<Result<V, T>>;

    /**
     * Chains a new Result to the current one if it is Ok.
     * 
     * @param mapper The mapper function to apply to the value if it is an Ok.
     * @returns A new Result with the mapped value if it is an Ok, otherwise the value as-is.
     */
    andThen<T>(mapper: Mapper<V, Result<T, E>>): Result<T, E>;

    /**
     * Chains a new Result to the current one if it is Ok, but asynchronously.
     * @param mapper The async mapper function to apply to the value if it is an Ok.
     * @returns A new Result with the mapped value if it is an Ok, otherwise the value as-is.
     */
    andThenAsync<T>(mapper: AsyncMapper<V, Result<T, E>>): Promise<Result<T, E>>;

    /**
     * Maps the Result into an Option.
     * 
     * If the Result is an `Ok` and the value _is not_ null or undefined, then it will be `Some` with that value.
     * If the Result is an `Ok` and the value _is_ null or undefined, then it will be `None`.
     * If the Result is an `Err`, then it will be `None` with the error discarded.
     * 
     * @returns `Some` if the value is `Ok` and present, otherwise `None`.
     */
    someOrNone(): Option<V>;

    /**
     * Maps the Result so the `Ok` value is wrapped in an Option based on its presence.
     * 
     * If the Result is an `Ok` and the value _is not_ null or undefined, then the inner value will become `Some`.
     * If the Result is an `Ok` and the value _is_ null or undefined, then the inner value will become `None`.
     * If the Result is an `Err`, then nothing will happen.
     * 
     * @returns A new Result with the `Ok` value wrapped in an Option based on its presence.
     */
    asNullable(): Result<Option<V>, E>;
}

/**
 * Result-related utilities.
 */
export const Result = {
    /**
     * Creates a new Ok instance.
     * 
     * @param value The value to wrap.
     * @returns A new Ok instance.
     */
    ok: <V, E extends Error>(value: V): Result<V, E> => {
        return new Ok(value);
    },

    /**
     * Creates a new Err instance.
     * 
     * @param value The error to wrap.
     * @returns A new Err instance.
     */
    err: <V, E extends Error>(value: E): Result<V, E> => {
        return new Err(value);
    },

    /**
     * Creates a new `Error` with the provided message and wraps it in an `Err`.
     * 
     * @param message The error message.
     * @returns A new `Err` instance with the error.
     */
    error: <V>(message: string): Result<V, Error> => {
        return new Err(new Error(message));
    },

    /**
     * Transposes a Result of an Option into an Option of a Result.
     * 
     * @param result The Result to transpose.
     * @returns An Option with the value if the Result is an Ok, otherwise None.
     */
    transpose: <V, E extends Error>(result: Result<Option<V>, E>): Option<Result<V, E>> => {
        return result.match<Option<Result<V, E>>>(
            option => option.map(value => Result.ok(value)),
            error => Option.from(Result.err(error))
        );
    },

    /**
     * Checks if the value is an instance of the Result jonad.
     * 
     * @param value The value to check.
     * @returns true if the value is an instance of Result, false otherwise.
     */
    isInstance: <V, E extends Error>(value: unknown): value is Result<V, E> => {
        return value instanceof Ok || value instanceof Err;
    },

    /**
     * Higher order function returning a function that performs the `isOk` method on the provided Result.
     * 
     * The returned function checks if the value is Ok.
     * 
     * @returns A function that checks if the value is Ok.
     */
    isOk: <V, E extends Error>(): Mapper<Result<V, E>, boolean> => {
        return result => result.isOk();
    },

    /**
     * Higher order function returning a function that performs the `isErr` method on the provided Result.
     * 
     * The returned function checks if the value is Err.
     * 
     * @returns A function that checks if the value is Err.
     */
    isErr: <V, E extends Error>(): Mapper<Result<V, E>, boolean> => {
        return result => result.isErr();
    },

    /**
     * Higher order function returning a function that performs the `valueOr` method on the provided Result.
     * 
     * The returned function returns the value if it is an Ok, otherwise a default value.
     * 
     * @param fallback The default value (as-is or produced from a callback) to return if the value is an Err.
     * @returns A function that returns the value if it is an Ok, otherwise the default value.
     */
    valueOr: <V, E extends Error>(fallback: V | Mapper<E, V>): Mapper<Result<V, E>, V> => {
        return result => result.valueOr(fallback);
    },

    /**
     * Higher order function returning a function that performs the `map` method on the provided Result.
     * 
     * The returned function maps the value if it is an Ok.
     * 
     * @param mapper The mapper function to apply to the value if it is an Ok.
     * @returns A function that maps the value if it is an Ok.
     */
    map: <V, E extends Error, T>(mapper: Mapper<V, T>): Mapper<Result<V, E>, Result<T, E>> => {
        return result => result.map(mapper);
    },

    /**
     * Higher order function returning a function that performs the `mapErr` method on the provided Result.
     * 
     * The returned function maps the error if it is an Err.
     * 
     * @param mapper The mapper function to apply to the error if it is an Err.
     * @returns A function that maps the error if it is an Err.
     */
    mapErr: <V, E extends Error, T extends Error>(mapper: Mapper<E, T>): Mapper<Result<V, E>, Result<V, T>> => {
        return result => result.mapErr(mapper);
    },

    /**
     * Higher order function returning a function that performs the `andThen` method on the provided Result.
     * 
     * The returned function maps the current Result to a new one if it is Ok.
     * 
     * @param mapper The mapper function to apply to the value if it is an Ok.
     * @returns A function that maps the current Result to a new one if it is Ok.
     */
    andThen: <V, E extends Error, T>(mapper: Mapper<V, Result<T, E>>): Mapper<Result<V, E>, Result<T, E>> => {
        return result => result.andThen(mapper);
    },

    /**
     * Higher order function returning a function that performs the `someOrNone` method on the provided Result.
     * 
     * The returned function maps the Result into an Option.
     * 
     * @returns A function that maps the Result into an Option.
     */
    someOrNone: <V, E extends Error>(): Mapper<Result<V, E>, Option<V>> => {
        return result => result.someOrNone();
    },

    /**
     * Higher order function returning a function that performs the `asNullable` method on the provided Result.
     * 
     * The returned function maps the Result so the `Ok` value is wrapped in an Option based on its presence.
     * 
     * @returns A function that maps the Result so the `Ok` value is wrapped in an Option based on its presence.
     */
    asNullable: <V, E extends Error>(): Mapper<Result<V, E>, Result<Option<V>, E>> => {
        return result => result.asNullable();
    },
};
