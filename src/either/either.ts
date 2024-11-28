import { AsyncConsumer, AsyncMapper, Consumer, Mapper } from "../types";
import { Left } from "./left";
import { Right } from "./right";

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
     * 
     * @example
     * ```typescript
     * const value = Either.left(42);
     * value.isLeft(); // => true
     * ```
     */
    isLeft(): boolean;

    /**
     * Checks if the value is a Right.
     * 
     * @returns true if the value is a Right, false otherwise.
     * 
     * @example
     * ```typescript
     * const value = Either.right(42);
     * value.isRight(); // => true
     * ```
     */
    isRight(): boolean;

    /**
     * Returns the value if it is a Left, otherwise returns a default value.
     * 
     * @param fallback The default value (as-is or produced from a callback) to return if the value is a Right.
     * @returns The value if it is a Left, otherwise the default value.
     * 
     * @example
     * ```typescript
     * const value = Either.left(42);
     * value.leftOr(0); // => 42
     * ```
     * 
     * @example
     * ```typescript
     * const value = Either.right(42);
     * value.leftOr(0); // => 0
     * ```
     */
    leftOr(fallback: L | Mapper<R, L>): L;

    /**
     * Returns the value if it is a Left, otherwise returns a default value asynchronously.
     * 
     * @param fallback The default value (as-is or produced from a callback) to return if the value is a Right.
     * @returns The value if it is a Left, otherwise the default value.
     * 
     * @example
     * ```typescript
     * const value = Either.left(42);
     * await value.leftOrAsync(async () => Promise.resolve(0)); // => 42
     * ```
     * 
     * @example
     * ```typescript
     * const value = Either.right(42);
     * await value.leftOrAsync(async () => Promise.resolve(0)); // => 0
     * ```
     */
    leftOrAsync(fallback: L | Promise<L> | AsyncMapper<R, L>): Promise<L>;

    /**
     * Returns the value if it is a Right, otherwise returns a default value.
     * 
     * @param fallback The default value (as-is or produced from a callback) to return if the value is a Left.
     * @returns The value if it is a Right, otherwise the default value.
     * 
     * @example
     * ```typescript
     * const value = Either.right(42);
     * value.rightOr(0); // => 42
     * ```
     * 
     * @example
     * ```typescript
     * const value = Either.left(42);
     * value.rightOr(0); // => 0
     * ```
     */
    rightOr(fallback: R | Mapper<L, R>): R;

    /**
     * Returns the value if it is a Right, otherwise returns a default value asynchronously.
     * 
     * @param fallback The default value (as-is or produced from a callback) to return if the value is a Left.
     * @returns The value if it is a Right, otherwise the default value.
     * 
     * @example
     * ```typescript
     * const value = Either.right(42);
     * await value.rightOrAsync(async () => Promise.resolve(0)); // => 42
     * ```
     * 
     * @example
     * ```typescript
     * const value = Either.left(42);
     * await value.rightOrAsync(async () => Promise.resolve(0)); // => 0
     * ```
     */
    rightOrAsync(fallback: R | Promise<R> | AsyncMapper<L, R>): Promise<R>;

    /**
     * Maps the value if it is a Left, otherwise returns the value as-is.
     * 
     * @param mapper The function to apply to the value if it is a Left.
     * @returns A new Either with the mapped value if it is a Left, otherwise the value as-is.
     * 
     * @example
     * ```typescript
     * const value = Either.left(1);
     * value.mapLeft((value) => value + 1); // => Left(2)
     * ```
     * 
     * @example
     * ```typescript
     * const value = Either.right(1);
     * value.mapLeft((value) => value + 1); // => Right(1)
     * ```
     */
    mapLeft<V>(mapper: Mapper<L, V>): Either<V, R>;

    /**
     * Maps the value if it is a Left asynchronously, otherwise returns the value as-is.
     * 
     * @param mapper The async function to apply to the value if it is a Left.
     * @returns A new Either with the mapped value if it is a Left, otherwise the value as-is.
     * 
     * @example
     * ```typescript
     * const value = Either.left(1);
     * await value.mapLeftAsync(async (value) => Promise.resolve(value + 1)); // => Left(2)
     * ```
     * 
     * @example
     * ```typescript
     * const value = Either.right(1);
     * await value.mapLeftAsync(async (value) => Promise.resolve(value + 1)); // => Right(1)
     * ```
     */
    mapLeftAsync<V>(mapper: AsyncMapper<L, V>): Promise<Either<V, R>>;

    /**
     * Maps the value if it is a Right, otherwise returns the value as-is.
     * 
     * @param mapper The function to apply to the value if it is a Right.
     * @returns A new Either with the mapped value if it is a Right, otherwise the value as-is.
     * 
     * @example
     * ```typescript
     * const value = Either.right(1);
     * value.mapRight((value) => value + 1); // => Right(2)
     * ```
     * 
     * @example
     * ```typescript
     * const value = Either.left(1);
     * value.mapRight((value) => value + 1); // => Left(1)
     * ```
     */
    mapRight<V>(mapper: Mapper<R, V>): Either<L, V>;

    /**
     * Maps the value if it is a Right asynchronously, otherwise returns the value as-is.
     * 
     * @param mapper The async function to apply to the value if it is a Right.
     * @returns A new Either with the mapped value if it is a Right, otherwise the value as-is.
     * 
     * @example
     * ```typescript
     * const value = Either.right(1);
     * await value.mapRightAsync(async (value) => Promise.resolve(value + 1)); // => Right(2)
     * ```
     * 
     * @example
     * ```typescript
     * const value = Either.left(1);
     * await value.mapRightAsync(async (value) => Promise.resolve(value + 1)); // => Left(1)
     * ```
     */
    mapRightAsync<V>(mapper: AsyncMapper<R, V>): Promise<Either<L, V>>;

    /**
     * Applies a function to the value if it is a Left, returning itself.
     * 
     * @param callback The function to apply to the value if it is a Left.
     * @returns The Either as-is.
     * 
     * @example 
     * ```typescript
     * const value = Either.left([1, 2]);
     * value.tapLeft((value) => value.push(3)); // => Left([1, 2, 3])
     * ```
     * 
     * @example
     * ```typescript
     * const value = Either.right([1, 2]);
     * value.tapLeft((value) => value.push(3)); // => Right([1, 2])
     * ```
     */
    tapLeft(callback: Consumer<L>): Either<L, R>;

    /**
     * Asynchronously applies a function to the value if it is a Left, returning itself.
     * 
     * @param callback The async function to apply to the value if it is a Left.
     * @returns The Either as-is.
     * 
     * @example
     * ```typescript
     * const value = Either.left([1, 2]);
     * await value.tapLeftAsync(async (value) => value.push(3)); // => Left([1, 2, 3])
     * ```
     * 
     * @example
     * ```typescript
     * const value = Either.right([1, 2]);
     * await value.tapLeftAsync(async (value) => value.push(3)); // => Right([1, 2])
     * ```
     */
    tapLeftAsync(callback: AsyncConsumer<L>): Promise<Either<L, R>>;

    /**
     * Applies a function to the value if it is a Right, returning itself.
     * 
     * @param callback The function to apply to the value if it is a Right.
     * @returns The Either as-is.
     * 
     * @example
     * ```typescript
     * const value = Either.right([1, 2]);
     * value.tapRight((value) => value.push(3)); // => Right([1, 2, 3])
     * ```
     * 
     * @example
     * ```typescript
     * const value = Either.left([1, 2]);
     * value.tapRight((value) => value.push(3)); // => Left([1, 2])
     * ```
     */
    tapRight(callback: Consumer<R>): Either<L, R>;

    /**
     * Asynchronously applies a function to the value if it is a Right, returning itself.
     * 
     * @param callback The async function to apply to the value if it is a Right.
     * @returns The Either as-is.
     * 
     * @example
     * ```typescript
     * const value = Either.right([1, 2]);
     * await value.tapRightAsync(async (value) => value.push(3)); // => Right([1, 2, 3])
     * ```
     * 
     * @example
     * ```typescript
     * const value = Either.left([1, 2]);
     * await value.tapRightAsync(async (value) => value.push(3)); // => Left([1, 2])
     * ```
     */
    tapRightAsync(callback: AsyncConsumer<R>): Promise<Either<L, R>>;

    /**
     * Matches the jonad by calling the appropriate callback based on the value type.
     * 
     * @param onLeft If the value is a Left, this callback is called with the value.
     * @param onRight If the value is a Right, this callback is called with the value.
     * @returns The result of the callback that was called.
     * 
     * @example
     * ```typescript
     * const value = Either.left(42);
     * value.match(
     *   (lvalue) => console.log(`Answer to life: ${lvalue}`),
     *   (rvalue) => console.log(`Hello, ${rvalue}`)
     * ); // => "Answer to life: 42"
     * ```
     * 
     * @example
     * ```typescript
     * const value = Either.right("world!");
     * value.match(
     *   (value) => console.log(`Answer to life: ${lvalue}`),
     *   (value) => console.log(`Hello, ${rvalue}`)
     * ); // => "Hello, world!"
     * ```
     */
    match<V>(onLeft: Mapper<L, V>, onRight: Mapper<R, V>): V;

    /**
     * Matches the jonad by calling the appropriate callback based on the value type asynchronously.
     * 
     * @param onLeft If the value is a Left, this callback is called with the value.
     * @param onRight If the value is a Right, this callback is called with the value.
     * @returns The result of the callback that was called.
     * 
     * @example
     * ```typescript
     * const value = Either.left(1);
     * await value.matchAsync(
     *   async (lvalue) => `${lvalue} + 2 = ${lvalue + 2}`,
     *   async (rvalue) => `1 + ${rvalue} = ${1 + rvalue}`
     * ); // => "1 + 2 = 3"
     * ```
     * 
     * @example
     * ```typescript
     * const value = Either.right(2);
     * await value.matchAsync(
     *   async (lvalue) => `${lvalue} + 2 = ${lvalue + 2}`,
     *   async (rvalue) => `1 + ${rvalue} = ${1 + rvalue}`
     * ); // => "1 + 2 = 3"
     * ```
     */
    matchAsync<V>(onLeft: AsyncMapper<L, V>, onRight: AsyncMapper<R, V>): Promise<V>;

    /**
     * Returns the value if it is a Left, otherwise throws an error.
     * 
     * _NOTE: This function is unsafe and should only be used for testing._
     * 
     * @returns The value if it is a Left.
     * @throws GetValueError if the value is a Right.
     */
    getLeftOrThrow(): L;

    /**
     * Returns the value if it is a Right, otherwise throws an error.
     * 
     * _NOTE: This function is unsafe and should only be used for testing._
     * 
     * @returns The value if it is a Right.
     * @throws GetValueError if the value is a Left.
     */
    getRightOrThrow(): R;
}

/**
 * Either-related utilities.
 */
export const Either: object = {
    /**
     * Creates a new Left instance.
     * 
     * @param value The value to wrap.
     * @returns A new Left instance.
     * 
     * @example
     * ```typescript
     * const value = Either.left(42);
     * value.isLeft(); // => true
     * ```
     */
    left<L, R>(value: L): Either<L, R> {
        return new Left(value);
    },

    /**
     * Creates a new Right instance.
     * 
     * @param value The error to wrap.
     * @returns A new Right instance.
     * 
     * @example
     * ```typescript
     * const value = Either.right(42);
     * value.isRight(); // => true
     * ```
     */
    right<L, R>(value: R): Either<L, R> {
        return new Right(value);
    },

    /**
     * Checks if the provided value is an instance of the Either jonad.
     * 
     * @param value The value to check. 
     * @returns true if the value is an instance of Either, false otherwise.
     * 
     * @example
     * ```typescript
     * const value = Either.left(42);
     * Either.isInstance(value); // => true
     * ```
     * 
     * @example
     * ```typescript
     * const value = Either.right(42);
     * Either.isInstance(value); // => true
     * ```
     * 
     * @example
     * ```typescript
     * const value = 42;
     * Either.isInstance(value); // => false
     * ```
     */
    isInstance<L, R>(value: unknown): value is Either<L, R> {
        return value instanceof Left || value instanceof Right;
    },
};
