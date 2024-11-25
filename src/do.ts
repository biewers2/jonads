import { JonadsError } from "./errors";
import { isPromise } from "./guards";
import { Result, Ok, Err } from "./result";

/**
 * An error that is thrown when a failure is propagated from a result in a do block.
 * 
 * @note This error is defined here and not in './errors.ts' as it should be private to this module.
 */
class DoPropagateError<E extends Error> extends JonadsError {
    private err: E;

    constructor(error: E) {
        super("propagating failure from result in do block");
        this.err = error;
    }

    getError(): E {
        return this.err;
    }
}

/**
 * Bind a result's Ok value to a variable, or throw a propagation error if the result is an Err.
 * 
 * The propagation error `DoPropagateError` is used to propagate an error from a result in a do block to the caller by
 * catching it in the `jsDo` function and returning it as an Err.
 * 
 * @param result The result to bind.
 * @returns The value of the Ok result.
 * @throws {DoPropagateError} If the result is an Err.
 */
function bindResult<T, E extends Error>(result: Result<T, E>): T {
    return result.match(
        v => v,
        e => { 
            throw new DoPropagateError(e);
        }
    );
}

/**
 * Bind a (promised) result value to a variable if it's `Ok`, or throw a propagation error if the result is an `Err`.
 * 
 * @param result The promised result to bind.
 * @returns The value of the `Ok` result.
 * 
 * @see bindResult
 */
async function bindPromisedResult<T, E extends Error>(result: Result<T, E> | Promise<Result<T, E>>): Promise<T> {
    if (isPromise(result)) {
        return bindResult(await result);
    } else {
        return bindResult(result);
    }
}

/**
 * Execute a block of code, using the `bind` function to bind `Ok` values to variables.
 * 
 * If any results passed to `bind` are `Err`, the block will return early with the returned result being the `Err`.
 * 
 * @param block The block of code to execute. The block accepts a function `bind` as an argument that can be used to
 *              extract the value of an `Ok` result while propagating any `Err` results to the caller.
 * @returns The result of the block. If the block completes successfully, the result will be an `Ok` containing the
 *          value returned by the block. If the block fails, the result will be an `Err` containing the error that
 *          caused the failure.
 * 
 * @example
 * // function getUserFromSession(): Result<User, Error>;
 * // function getProfile(userId: number): Result<Profile, Error>;
 * 
 * const getUserName = () => jsDo(bind => {
 *    const user = bind(getUserFromSession());
 *    const profile = bind(getProfile(user.id));
 *    return profile.name;
 * });
 * 
 * console.log(getUserName());
 * // => Ok("Alice")
 */
export function doing<T, E extends Error>(block: (bind: typeof bindResult) => T, catchall = true): Result<T, E> {
    try {
        const output = block(bindResult);
        return new Ok(output);
    } catch (e) {
        return handleDoError(e, catchall);
    }
}

/**
 * Execute a block of code asynchronously, using the `bind` function to bind `Ok` values to variables.
 * 
 * This variant of `jsDo` is built for asynchronous code, allowing for promises of `Result`s to be passed to the `bind` function directly.
 * If any promises that were passed to `bind` resolve to `Err`, the block will return early with the returned result being the `Err`.
 * 
 * @param block The block of code to execute. The block accepts a function `bind` as an argument that can be used to
 * @param catchall If `true`, any errors thrown in the block will be caught and returned as an `Err`. If `false`, errors will be thrown.
 * @returns The result of the block. If the block completes successfully, the result will be an `Ok` containing the
 *          value returned by the block. If the block fails, the result will be an `Err` containing the error that
 *          caused the failure.
 * 
 * @example
 * // async function getUserFromSession(): Promise<Result<User, Error>>;
 * // async function getProfile(userId: number): Promise<Result<Profile, Error>>;
 * 
 * const getUserName = async () => jsDoAsync(async (bind) => {
 *    const user = await bind(getUserFromSession());
 *    const profile = await bind(getProfile(user.id));
 *    return profile.name;
 * });
 * 
 * getUserName().then(console.log);
 * // => Ok("Alice")* 
 */
export async function doingAsync<T, E extends Error>(block: (bind: typeof bindPromisedResult) => Promise<T>, catchall = true): Promise<Result<T, E>> {
    try {
        const output = await block(bindPromisedResult);
        return new Ok(output);
    } catch (e) {
        return handleDoError(e, catchall);
    }
}

function handleDoError<E extends Error>(e: E, catchall: boolean): Result<never, E> {
    if (e instanceof DoPropagateError) {
        return new Err(e.getError());
    } else if (catchall) {
        return new Err(e);
    } else {
        throw e;
    }
}
