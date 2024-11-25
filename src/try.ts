import { Result, Ok, Err } from "./result";

/**
 * A type representing a class that extends `Error`.
 */
export type ErrorClass = { new(...args: any[]): Error };

/**
 * Execute a block of code, catching any errors and returning them as `Err`.
 * 
 * @param block The block of code to execute.
 * @returns The result of the block wrapped in an `Ok`, or an `Err` containing any error thrown by the block.
 */
export function jTry<T, E extends Error>(block: () => T): Result<T, E> {
    try {
        return new Ok(block());
    } catch (e) {
        return new Err(e as E);
    }
}

/**
 * Execute a block of code, catching any errors of the specified types and returning them as `Err`.
 * 
 * If no errors are specified, the block will be executed as if it were passed to `jTry`.
 * 
 * @param errors The expected error types to catch from the block.
 * @param block The block of code to execute.
 * @returns The result of the block wrapped in an `Ok`, or an `Err` containing any error thrown by the block.
 */
export function jTryCatching<T, E extends Error>(errors: ErrorClass[], block: () => T): Result<T, E> {
    if (errors.length === 0) {
        return jTry(block);
    }

    try {
        return new Ok(block());
    } catch (e) {
        if (errors.some(err => e instanceof err)) {
            return new Err(e as E);
        }
        throw e;
    }
}
