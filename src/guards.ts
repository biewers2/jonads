export function isFunction<F extends (...args: any[]) => any>(f: unknown): f is F {
    return typeof f === "function";
}

export function isAsyncFunction<F extends (...args: any[]) => any>(f: unknown): f is F {
    return isFunction(f) && f.constructor.name === "AsyncFunction";
}

export function isPromise<T>(p: unknown): p is Promise<T> {
    return p instanceof Promise;
}
