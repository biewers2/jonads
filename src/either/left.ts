import { Either } from "./either";
import { isFunction } from "../guards";
import { GetValueError } from "../errors";

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

    leftOr(fallback: L | ((right: R) => L)): L {
        return this.value;
    }

    async leftOrAsync(fallback: L | ((right: R) => Promise<L>)): Promise<L> {
        return this.value;
    }

    rightOr(fallback: R | ((left: L) => R)): R {
        if (isFunction(fallback)) {
            return fallback(this.value);
        } else {
            return fallback;
        }
    }

    async rightOrAsync(fallback: R | ((left: L) => Promise<R>)): Promise<R> {
        if (isFunction(fallback)) {
            return await fallback(this.value);
        } else {
            return fallback;
        }
    }

    mapLeft<T>(mapper: (value: L) => T): Either<T, R> {
        return new Left(mapper(this.value));
    }

    async mapLeftAsync<V>(mapper: (value: L) => Promise<V>): Promise<Either<V, R>> {
        return mapper(this.value).then(v => new Left(v));
    }

    mapRight<T>(mapper: (value: R) => T): Either<L, T> {
        return new Left(this.value);
    }

    async mapRightAsync<V>(mapper: (value: R) => Promise<V>): Promise<Either<L, V>> {
        return Promise.resolve(new Left(this.value));
    }

    tapLeft(callback: (value: L) => void): Either<L, R> {
        callback(this.value);
        return this;
    }

    async tapLeftAsync(callback: (value: L) => Promise<void>): Promise<Either<L, R>> {
        await callback(this.value);
        return this;
    }

    tapRight(callback: (value: R) => void): Either<L, R> {
        return this;
    }

    async tapRightAsync(callback: (value: R) => Promise<void>): Promise<Either<L, R>> {
        return this;
    }

    match<T>(onLeft: (value: L) => T, onRight: (value: R) => T): T {
        return onLeft(this.value);
    }

    async matchAsync<T>(onLeft: (value: L) => Promise<T>, onRight: (value: R) => Promise<T>): Promise<T> {
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
