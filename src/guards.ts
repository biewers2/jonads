export function isFunction<F extends (...args: any[]) => any>(f: unknown): f is F {
    return typeof f === "function";
}
