import { Result } from "./result/result";

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
export function trying<T, E extends Error>(block: () => T): Result<T, E> {
    try {
        return Result.ok(block());
    } catch (e) {
        return Result.err(e);
    }
}

/**
 * Execute an async block of code, catching any errors and returning them as `Err`.
 * 
 * @param block The block of code to execute.
 * @returns The result of the block wrapped in an `Ok`, or an `Err` containing any error thrown by the block.
 */
export async function tryingAsync<T, E extends Error>(block: () => Promise<T>): Promise<Result<T, E>> {
    try {
        return Result.ok(await block());
    } catch (e) {
        return Result.err(e);
    }
}

/**
 * Execute a block of code, catching any errors of the specified types and returning them as `Err`.
 * 
 * If no errors are specified, the block will be executed as if it were passed to `trying`.
 * 
 * @param errors The expected error types to catch from the block.
 * @param block The block of code to execute.
 * @returns The result of the block wrapped in an `Ok`, or an `Err` containing any error thrown by the block.
 */
export function tryCatching<T, E extends Error>(errors: ErrorClass[], block: () => T): Result<T, E> {
    if (errors.length === 0) {
        return trying(block);
    }

    try {
        return Result.ok(block());
    } catch (e) {
        return handleTryError(e, errors);
    }
}

/**
 * Execute an async block of code, catching any errors of the specified types and returning them as `Err`.
 * 
 * If no errors are specified, the block will be executed as if it were passed to `tryingAsync`.
 * 
 * @param errors The expected error types to catch from the block.
 * @param block The block of code to execute.
 * @returns The result of the block wrapped in an `Ok`, or an `Err` containing any error thrown by the block.
 */
export async function tryCatchingAsync<T, E extends Error>(errors: ErrorClass[], block: () => Promise<T>): Promise<Result<T, E>> {
    if (errors.length === 0) {
        return tryingAsync(block);
    }

    try {
        return Result.ok(await block());
    } catch (e) {
        return handleTryError(e, errors);
    }
}

function handleTryError<E extends Error>(e: E, errors: ErrorClass[]): Result<never, E> {
    if (errors.some(err => e instanceof err)) {
        return Result.err(e);
    }
    throw e;
}
