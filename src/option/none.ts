import { Option } from "./option";
import { Right } from "../either/right";
import { isFunction } from "../guards";

export class None<T> extends Right<T, null> implements Option<T> {
    constructor() {
        super(null);
    }

    isSome(): boolean {
        return false;
    }

    isNone(): boolean {
        return true;
    }

    valueOr(fallback: T | (() => T)): T {
        if (isFunction(fallback)) {
            return fallback();
        } else {
            return fallback;
        }
    }

    async valueOrAsync(fallback: T | (() => Promise<T>)): Promise<T> {
        if (isFunction(fallback)) {
            return await fallback();
        } else {
            return fallback;
        }
    }

    map<U>(mapper: (value: T) => U): Option<U> {
        return new None();
    }

    async mapAsync<U>(mapper: (value: T) => Promise<U>): Promise<Option<U>> {
        return new None();
    }

    andThen<U>(mapper: (value: T) => Option<U>): Option<U> {
        return new None();
    }

    async andThenAsync<U>(mapper: (value: T) => Promise<Option<U>>): Promise<Option<U>> {
        return new None();
    }

    toString(): string {
        return `None`;
    }
}
