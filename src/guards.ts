export function isFunction<F extends (...args: any[]) => any>(f: unknown): f is F {
    return typeof f === "function";
}

export function isNullish(value: unknown): value is (null | undefined) {
    return value === null || value === undefined;
}
