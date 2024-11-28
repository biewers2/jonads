import { Result } from "./result";
import { Left } from "../either/left";
import { AsyncMapper, Mapper, Option } from "../jonads";

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

    valueOr(fallback: V | Mapper<E, V>): V {
        return this.leftOr(fallback);
    }

    async valueOrAsync(fallback: V | Promise<V> | AsyncMapper<E, V>): Promise<V> {
        return this.leftOrAsync(fallback);
    }

    map<T>(mapper: Mapper<V, T>): Result<T, E> {
        return new Ok(mapper(this.value));
    }

    async mapAsync<T>(mapper: AsyncMapper<V, T>): Promise<Result<T, E>> {
        return new Ok(await mapper(this.value));
    }

    mapErr<T extends Error>(mapper: Mapper<E, T>): Result<V, T> {
        return new Ok(this.value);
    }

    async mapErrAsync<T extends Error>(mapper: AsyncMapper<E, T>): Promise<Result<V, T>> {
        return new Ok(this.value);
    }

    andThen<T>(mapper: Mapper<V, Result<T, E>>): Result<T, E> {
        return mapper(this.value);
    }

    async andThenAsync<T>(mapper: AsyncMapper<V, Result<T, E>>): Promise<Result<T, E>> {
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
