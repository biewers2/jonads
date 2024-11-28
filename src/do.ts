import { JonadsError } from "./errors";
import { Result } from "./result/result";
import { tryCatching, tryCatchingAsync } from "./try";

/**
 * An error that is thrown when a failure is propagated from a result in a do block.
 * 
 * @private This error is defined here and not in './errors.ts' as it should be private to this module.
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
 * Bind a value to a variable.
 * 
 * If the value is a result, it will be bound if it is an `Ok`, otherwise the error will be propagated to the caller
 * of the `doing`/`doingAsync` function and returned as a `Result` containing an error.
 * If the value is not a result, it is returned as is.
 * 
 * @param result The result to bind.
 * @returns The value of the Ok result.
 * @throws {DoPropagateError} If the result is an Err.
 * 
 * @see doing
 */
function bindResult<T, E extends Error>(result: T | Result<T, E>): T {
    if (Result.isInstance(result)) {
        return result.match(
            v => v,
            e => { 
                throw new DoPropagateError(e);
            }
        );
    }
    
    return result;
}

/**
 * Bind a potentially promised value to a variable.
 * 
 * If the provided value is a promised value, it will first be resolved.
 * If the resolved value is a result, it will be bound if it is an `Ok`, otherwise the error will be propagated to
 * the caller of the `doing`/`doingAsync` function and returned as a `Result` containing an error.
 * If the value is not a result, it is returned as is.
 * 
 * @param result The promised result to bind.
 * @returns The value of the `Ok` result.
 * 
 * @see doingAsync
 * @see bindResult
 */
async function bindPromisedResult<T, E extends Error>(result: T | Result<T, E> | Promise<T | Result<T, E>>): Promise<T> {
    const resolvedValue = await Promise.resolve(result);

    if (Result.isInstance(resolvedValue)) {
        return bindResult(resolvedValue);
    } else {
        return bindResult(Result.ok(resolvedValue));
    }
}

/**
 * Execute a block of code binding results to local variables using the `bind` function, propagating side effects
 * to the caller.
 * 
 * This function is a core feature to using the `Result` jonad. It should be used to wrap any function implementation,
 * allowing results returned from other functions to have the value returned to continue execution, while capturing
 * any errors that are returned or thrown and propagating them to the caller as a new `Result`.
 * 
 * This provides additional safety when implementing core business logic, as it ensures that any errors that occur
 * are intentionally handled up the call chain, intead of exceptions propagating up and causing the program to exit
 * unexpectedly. It also allows you, the developer, to focus solely on the happy path of your code without worries
 * of handling potential exceptions.
 * 
 * @param block The block of code to execute. The block accepts a function `bind` as an argument that can be used to
 *              unwrap a `Result` by returning the value if it's an `Ok`, or propagating the error if it's an `Err`.
 * @returns The result of the block. If the block reaches the end, the returned value will be an `Ok` containing the
 *          value returned by the block. If the block fails, the result will be an `Err` containing the error that
 *          caused the failure.
 * 
 * @example Safely parsing a JSON string, returning an error if the string is invalid.
 *   ```typescript
 *     const result = doing(() => {
 *       const jsonStr = '{"name": "Alice"}';
 *       const obj = JSON.parse(jsonStr);
 *       return obj;
 *     });
 * 
 *     console.log(result);
 *     // => Ok({ name: "Alice" })
 * 
 *     // ...
 * 
 *     const invalidResult = doing(() => {
 *       const jsonStr = '{"name": "Alice"';
 *       const obj = JSON.parse(jsonStr); // throws SyntaxError
 *       return obj;
 *     });
 * 
 *     console.log(invalidResult);
 *     // => Err(SyntaxError: Unexpected end of JSON input)
 *   ```
 * 
 * @example Defining a function to safely parse a JSON string.
 *   ```typescript
 *     function safeParseJson<T>(jsonStr: string): Result<T, Error> {
 *       return doing(() => JSON.parse(jsonStr));
 *     }
 * 
 *     const result = _do(bind => {
 *       const jsonStr = '{"name": "Alice"}';
 *       const obj = bind(safeParseJson<{ name: string }>(jsonStr));
 *       return obj["name"];
 *     });
 * 
 *     console.log(result);
 *     // => Ok("Alice")
 *   ```
 */
export function doing<T, E extends Error>(block: (bind: typeof bindResult) => T, catchall = true): Result<T, E> {
    const catchingErrors = [];
    if (!catchall) {
        catchingErrors.push(DoPropagateError);
    }

    const result = tryCatching(catchingErrors, () => block(bindResult));
    return handleDoingResult(result);
}

/**
 * Alias for `doing` function.
 * 
 * This alias exists to provide a shorter, more concise name for the `doing` function.
 * It starts with an underscore to avoid conflicts with the `do` keyword in JavaScript.
 * 
 * @see doing
 */
export const _do = doing;

/**
 * Execute an async block of code binding results to local variables using the `bind` function, propagating side
 * effects to the caller.
 * 
 * This function is a core feature to using the `Result` jonad. It should be used to wrap any function implementation,
 * allowing results returned from other functions to have the value returned to continue execution, while capturing
 * any errors that are returned or thrown and propagating them to the caller as a new `Result`.
 * 
 * This provides additional safety when implementing core business logic, as it ensures that any errors that occur
 * are intentionally handled up the call chain, intead of exceptions propagating up and causing the program to exit
 * unexpectedly. It also allows you, the developer, to focus solely on the happy path of your code without worries
 * of handling potential exceptions.
 * 
 * @param block The asynchronous block of code to execute. The block accepts a function `bind` as an argument that
 *              can be used to unwrap a `Result` by returning the value if it's an `Ok`, or propagating the error
 *              if it's an `Err`.
 * @returns The promised result of the block. If the block reaches the end, the returned value will be an `Ok`
 *          containing the value returned by the block. If the block fails, the result will be an `Err` containing
 *          the error that caused the failure.
 * 
 * @example Safely fetching content, returning an error if there's a connection error.
 *   ```typescript
 *     const result = doingAsync(async () => {
 *       const response = await fetch("https://example.com/data");
 *       const json = await response.json();
 *       return obj;
 *     });
 * 
 *     console.log(result);
 *     // => Ok({ name: "Alice" })
 * 
 *     // ...
 * 
 *     const invalidResult = doingAsync(async () => {
 *       const response = await fetch("https://example.com/data"); // throws connection error
 *       const json = await response.json();
 *       return obj;
 *     });
 * 
 *     console.log(invalidResult);
 *     // => Err(TypeError: Failed to fetch)
 *   ```
 * 
 * @example Defining a function to safely fetch content.
 *   ```typescript
 *     async function safeFetch<T>(url: string): Result<Response, Error> {
 *       return doing(() => fetch(url));
 *     }
 * 
 *     const result = ado(async bind => {
 *       const url = "https://example.com/data";
 *       const res = await bind(safeFetch(url));
 *       const data = await res.json();
 *       return data["name"];
 *     });
 * 
 *     console.log(result);
 *     // => Ok("Alice")
 *   ```
 */
export async function doingAsync<T, E extends Error>(block: (bind: typeof bindPromisedResult) => Promise<T>, catchall = true): Promise<Result<T, E>> {
    const catchingErrors = [];
    if (!catchall) {
        catchingErrors.push(DoPropagateError);
    }

    const result = await tryCatchingAsync(catchingErrors, async () => await block(bindPromisedResult));
    return handleDoingResult(result);
}

function handleDoingResult<T, E extends Error, F extends Error>(result: Result<T, E>): Result<T, F> {
    return result.match(
        value => Result.ok(value),
        error => {
            if (error instanceof DoPropagateError) {
                // Extract the cause from the propagation error.
                return Result.err(error.getError());
            } else {
                return Result.err(error);
            }
        }
    );
}

/**
 * "Async-do" -- an alias for the `doingAsync` function.
 * 
 * This alias exists to provide a shorter, more concise name for the `doingAsync` function.
 * 
 * @see doingAsync
 */
export const ado = doingAsync;
