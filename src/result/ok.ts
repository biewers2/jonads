import { Result } from "./result";
import { Left } from "../either/left";
import { Option } from "../jonads";

/**
 * A Result jonad that represents a successful value.
 */
export class Ok<V, E extends Error> extends Left<V, E> implements Result<V, E> {
    /**
     * Creates a new Ok instance.
     * 
     * @param value The value to wrap.
     */
    constructor(value: V) {
        super(value);
    }

    isOk(): boolean {
        return this.isLeft();
    }

    isErr(): boolean {
        return this.isRight();
    }

    valueOr(fallback: V | ((error: E) => V)): V {
        return this.leftOr(fallback);
    }

    async valueOrAsync(fallback: V | ((error: E) => Promise<V>)): Promise<V> {
        return this.leftOrAsync(fallback);
    }

    map<T>(mapper: (value: V) => T): Result<T, E> {
        return new Ok(mapper(this.value));
    }

    async mapAsync<T>(mapper: (value: V) => Promise<T>): Promise<Result<T, E>> {
        return new Ok(await mapper(this.value));
    }

    mapErr<T extends Error>(mapper: (error: E) => T): Result<V, T> {
        return new Ok(this.value);
    }

    async mapErrAsync<T extends Error>(mapper: (error: E) => Promise<T>): Promise<Result<V, T>> {
        return new Ok(this.value);
    }

    andThen<T>(mapper: (value: V) => Result<T, E>): Result<T, E> {
        return mapper(this.value);
    }

    async andThenAsync<T>(mapper: (value: V) => Promise<Result<T, E>>): Promise<Result<T, E>> {
        return mapper(this.value);
    }

    someOrNone(): Option<V> {
        return Option.from(this.value);
    }

    asNullable(): Result<Option<V>, E> {
        return new Ok(Option.from(this.value));
    }

    toString(): string {
        return `Ok(${this.value})`;
    }
}
