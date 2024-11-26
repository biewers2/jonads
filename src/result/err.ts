import { Result } from './result';
import { Right } from '../either/right';

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

    valueOr(fallback: V | ((error: E) => V)): V {
        return this.leftOr(fallback);
    }

    async valueOrAsync(fallback: V | ((error: E) => Promise<V>)): Promise<V> {
        return this.leftOrAsync(fallback);
    }

    map<T>(mapper: (value: V) => T): Result<T, E> {
        return new Err(this.value);
    }

    async mapAsync<T>(mapper: (value: V) => Promise<T>): Promise<Result<T, E>> {
        return new Err(this.value);
    }

    mapErr<T extends Error>(mapper: (error: E) => T): Result<V, T> {
        return new Err(mapper(this.value));
    }

    async mapErrAsync<T extends Error>(mapper: (error: E) => Promise<T>): Promise<Result<V, T>> {
        return new Err(await mapper(this.value));
    }

    andThen<T>(mapper: (value: V) => Result<T, E>): Result<T, E> {
        return new Err(this.value);
    }

    async andThenAsync<T>(mapper: (value: V) => Promise<Result<T, E>>): Promise<Result<T, E>> {
        return new Err(this.value);
    }

    toString(): string {
        return `Err(${this.value})`;
    }
}
