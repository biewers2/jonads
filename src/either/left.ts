import { Either } from "./either";
import { isFunction } from "../guards";
import { GetValueError } from "../errors";
import { AsyncConsumer, AsyncMapper, Consumer, Mapper } from "../types";

/**
 * An Either jonad with a Left value.
 */
export class Left<L, R> implements Either<L, R> {
    protected value: L;

    /**
     * Creates a new Left instance with the given value.
     * 
     * @param value The value to store in the Left instance.
     */
    constructor(value: L) {
        this.value = value;
    }

    isLeft(): boolean {
        return true;
    }

    isRight(): boolean {
        return false;
    }

    leftOr(fallback: L | Mapper<R, L>): L {
        return this.value;
    }

    async leftOrAsync(fallback: L | Promise<L> | AsyncMapper<R, L>): Promise<L> {
        return this.value;
    }

    rightOr(fallback: R | Mapper<L, R>): R {
        if (isFunction(fallback)) {
            return fallback(this.value);
        } else {
            return fallback;
        }
    }

    async rightOrAsync(fallback: R | Promise<R> | AsyncMapper<L, R>): Promise<R> {
        if (isFunction(fallback)) {
            return await fallback(this.value);
        } else {
            return await Promise.resolve(fallback);
        }
    }

    mapLeft<T>(mapper: Mapper<L, T>): Either<T, R> {
        return new Left(mapper(this.value));
    }

    async mapLeftAsync<V>(mapper: AsyncMapper<L, V>): Promise<Either<V, R>> {
        return mapper(this.value).then(v => new Left(v));
    }

    mapRight<T>(mapper: Mapper<R, T>): Either<L, T> {
        return new Left(this.value);
    }

    async mapRightAsync<V>(mapper: AsyncMapper<R, V>): Promise<Either<L, V>> {
        return Promise.resolve(new Left(this.value));
    }

    tapLeft(callback: Consumer<L>): Either<L, R> {
        callback(this.value);
        return this;
    }

    async tapLeftAsync(callback: AsyncConsumer<L>): Promise<Either<L, R>> {
        await callback(this.value);
        return this;
    }

    tapRight(callback: Consumer<R>): Either<L, R> {
        return this;
    }

    async tapRightAsync(callback: AsyncConsumer<R>): Promise<Either<L, R>> {
        return this;
    }

    match<T>(onLeft: Mapper<L, T>, onRight: Mapper<R, T>): T {
        return onLeft(this.value);
    }

    async matchAsync<T>(onLeft: AsyncMapper<L, T>, onRight: AsyncMapper<R, T>): Promise<T> {
        return onLeft(this.value);
    }

    getLeftOrThrow(): L {
        return this.value;
    }

    getRightOrThrow(): R {
        throw new GetValueError("right");
    }

    toString(): string {
        return `Left(${this.value})`;
    }
}
