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
    isLeft: () => boolean;

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
    isRight: () => boolean;

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
     * @param onLeft If the value is a Left, this callback is called with the value.
     * @param onRight If the value is a Right, this callback is called with the value.
     * @returns The result of the callback that was called.
     */
    match: <V>(onLeft: (value: L) => V, onRight: (value: R) => V) => V;

    /**
     * Matches the jonad by calling the appropriate callback based on the value type asynchronously.
     * 
     * @param onLeft If the value is a Left, this callback is called with the value.
     * @param onRight If the value is a Right, this callback is called with the value.
     * @returns The result of the callback that was called.
     */
    matchAsync: <V>(onLeft: (value: L) => Promise<V>, onRight: (value: R) => Promise<V>) => Promise<V>;

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
 * Either-related utilities.
 */
export const Either = {
    /**
     * Creates a new Left instance.
     * 
     * @param value The value to wrap.
     * @returns A new Left instance.
     */
    left: <L, R>(value: L): Either<L, R> => new Left(value),

    /**
     * Creates a new Right instance.
     * 
     * @param value The error to wrap.
     * @returns A new Right instance.
     */
    right: <L, R>(value: R): Either<L, R> => new Right(value),
};
