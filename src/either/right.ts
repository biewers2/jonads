import { Either } from "./either";
import { isFunction } from "../guards";
import { GetValueError } from "../errors";
import { AsyncConsumer, AsyncMapper, Consumer, Mapper } from "../types";

/**
 * An Either jonad with a Right value.
 */
export class Right<L, R> implements Either<L, R> {
    protected value: R;

    /**
     * Creates a new Right instance with the given value.
     * 
     * @param value The value to store in the Right instance.
     */
    constructor(value: R) {
        this.value = value;
    }

    isLeft(): boolean {
        return false;
    }

    isRight(): boolean {
        return true;
    }

    leftOr(fallback: L | Mapper<R, L>): L {
        if (isFunction(fallback)) {
            return fallback(this.value);
        } else {
            return fallback;
        }
    }

    async leftOrAsync(fallback: L | Promise<L> | AsyncMapper<R, L>): Promise<L> {
        if (isFunction(fallback)) {
            return await fallback(this.value);
        } else {
            return await Promise.resolve(fallback);
        }
    }

    rightOr(fallback: R | Mapper<L, R>): R {
        return this.value;
    }

    async rightOrAsync(fallback: R | Promise<R> | AsyncMapper<L, R>): Promise<R> {
        return this.value;
    }

    mapLeft<T>(mapper: Mapper<L, T>): Either<T, R> {
        return new Right(this.value);
    }

    async mapLeftAsync<V>(mapper: AsyncMapper<L, V>): Promise<Either<V, R>> {
        return Promise.resolve(new Right(this.value));
    }

    mapRight<T>(mapper: Mapper<R, T>): Either<L, T> {
        return new Right(mapper(this.value));
    }

    async mapRightAsync<V>(mapper: AsyncMapper<R, V>): Promise<Either<L, V>> {
        return mapper(this.value).then(v => new Right(v));
    }

    tapLeft(callback: Consumer<L>): Either<L, R> {
        return this;
    }

    async tapLeftAsync(callback: AsyncConsumer<L>): Promise<Either<L, R>> {
        return this;
    }

    tapRight(callback: Consumer<R>): Either<L, R> {
        callback(this.value);
        return this;
    }

    async tapRightAsync(callback: AsyncConsumer<R>): Promise<Either<L, R>> {
        await callback(this.value);
        return this;
    }

    match<T>(onLeft: Mapper<L, T>, onRight: Mapper<R, T>): T {
        return onRight(this.value);
    }

    async matchAsync<T>(onLeft: AsyncMapper<L, T>, onRight: AsyncMapper<R, T>): Promise<T> {
        return onRight(this.value);
    }

    getLeftOrThrow(): L {
        throw new GetValueError("left");
    }

    getRightOrThrow(): R {
        return this.value;
    }

    toString(): string {
        return `Right(${this.value})`;
    }
}
