import { Result } from './result';
import { Right } from '../either/right';
import { AsyncMapper, Mapper, Option } from '../jonads';

/**
 * A Result jonad that represents an error.
 */
export class Err<V, E extends Error> extends Right<V, E> implements Result<V, E> {
    /**
     * Creates a new Err instance.
     * 
     * @param value The error to wrap.
     */
    constructor(value: E) {
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
        return new Err(this.value);
    }

    async mapAsync<T>(mapper: AsyncMapper<V, T>): Promise<Result<T, E>> {
        return new Err(this.value);
    }

    mapErr<T extends Error>(mapper: Mapper<E, T>): Result<V, T> {
        return new Err(mapper(this.value));
    }

    async mapErrAsync<T extends Error>(mapper: AsyncMapper<E, T>): Promise<Result<V, T>> {
        return new Err(await mapper(this.value));
    }

    andThen<T>(mapper: Mapper<V, Result<T, E>>): Result<T, E> {
        return new Err(this.value);
    }

    async andThenAsync<T>(mapper: AsyncMapper<V, Result<T, E>>): Promise<Result<T, E>> {
        return new Err(this.value);
    }

    someOrNone(): Option<V> {
        return Option.none();
    }

    asNullable(): Result<Option<V>, E> {
        return new Err(this.value);
    }

    toString(): string {
        return `Err(${this.value})`;
    }
}
