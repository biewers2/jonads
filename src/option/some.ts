import { Option } from "./option";
import { Left } from "../either/left";
import { Result } from "../jonads";

export class Some<T> extends Left<T, null> implements Option<T> {
    constructor(value: T) {
        super(value);
    }

    isSome(): boolean {
        return true;
    }

    isNone(): boolean {
        return false;
    }

    valueOr(fallback: T | (() => T)): T {
        return this.value;
    }

    async valueOrAsync(fallback: T | (() => Promise<T>)): Promise<T> {
        return this.value;
    }

    map<U>(mapper: (value: T) => U): Option<U> {
        return new Some(mapper(this.value));
    }

    async mapAsync<U>(mapper: (value: T) => Promise<U>): Promise<Option<U>> {
        return new Some(await mapper(this.value));
    }

    andThen<U>(mapper: (value: T) => Option<U>): Option<U> {
        return mapper(this.value);
    }

    async andThenAsync<U>(mapper: (value: T) => Promise<Option<U>>): Promise<Option<U>> {
        return mapper(this.value);
    }

    okOr(error: Error | (() => Error)): Result<T, Error> {
        return Result.ok(this.value);
    }

    async okOrAsync(error: Error | (() => Promise<Error>)): Promise<Result<T, Error>> {
        return Result.ok(this.value);
    }   

    toString(): string {
        return `Some(${this.value})`;
    }
}
