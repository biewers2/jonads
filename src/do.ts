import { JonadsError } from "./errors";
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
 * Execute a block of code, using the `bind` function to bind `Ok` values to variables.
 * 
 * If any results passed to `bind` are `Err`, the block will return early with the returned result being the `Err`.
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
export function jDo<T, E extends Error>(block: (bind: typeof bindResult) => T, catchall = true): Result<T, E> {
    try {
        const output = block(bindResult);
        return new Ok(output);
    } catch (e) {
        if (e instanceof DoPropagateError) {
            return new Err(e.getError());
        } else if (catchall) {
            return new Err(e);
        } else {
            throw e;
        }
    }
}
